import { pipeline } from '@huggingface/transformers'

interface ConversationTurn {
  speaker: 'user' | 'ai'
  content: string
  timestamp: number
}

interface Criterion {
  key: string
  label: string
  weight: number
}

export interface MetricsResult {
  speechMetrics: {
    speechRate: number
    talkRatio: number
    silenceRatio: number
    fillerDensity: number
    clarity: number
  }
  conversationMetrics: {
    openQuestionRate: number
    followUpRate: number
    turnBalance: number
    empathyScore: number
  }
  contentMetrics: {
    criteriaScores: Array<{
      key: string
      label: string
      weight: number
      score: number
    }>
    topicCoverage: number
    evidenceDensity: number
  }
  outcomeMetrics: {
    nextStepQuality: number
    resolutionRate: number
    decisionsRate: number
    actionItemsCount: number
  }
  climateMetrics: {
    sentimentDelta: number
    empathyMarkers: number
    complianceFlags: number
    politenessScore: number
  }
  overallScore: number
}

export class MetricsCalculator {
  private static sentimentAnalyzer: any = null

  private static async initializeSentiment() {
    if (!this.sentimentAnalyzer) {
      try {
        this.sentimentAnalyzer = await pipeline(
          'sentiment-analysis',
          'cardiffnlp/twitter-roberta-base-sentiment-latest',
          { device: 'webgpu' }
        )
      } catch (error) {
        console.warn('WebGPU não disponível, usando CPU para sentiment analysis')
        this.sentimentAnalyzer = await pipeline(
          'sentiment-analysis',
          'cardiffnlp/twitter-roberta-base-sentiment-latest'
        )
      }
    }
  }

  static async calculate(
    conversationHistory: ConversationTurn[],
    area: string,
    criteria: Criterion[]
  ): Promise<MetricsResult> {
    await this.initializeSentiment()

    const userTurns = conversationHistory.filter(turn => turn.speaker === 'user')
    const aiTurns = conversationHistory.filter(turn => turn.speaker === 'ai')

    // 1. Métricas de Fala
    const speechMetrics = this.calculateSpeechMetrics(userTurns, conversationHistory)

    // 2. Métricas de Dinâmica de Conversa
    const conversationMetrics = this.calculateConversationMetrics(userTurns, aiTurns)

    // 3. Métricas de Conteúdo
    const contentMetrics = await this.calculateContentMetrics(userTurns, criteria, area)

    // 4. Métricas de Resultado
    const outcomeMetrics = this.calculateOutcomeMetrics(userTurns, area)

    // 5. Métricas de Clima
    const climateMetrics = await this.calculateClimateMetrics(conversationHistory)

    // Score geral ponderado
    const overallScore = this.calculateOverallScore({
      speechMetrics,
      conversationMetrics,
      contentMetrics,
      outcomeMetrics,
      climateMetrics
    })

    return {
      speechMetrics,
      conversationMetrics,
      contentMetrics,
      outcomeMetrics,
      climateMetrics,
      overallScore
    }
  }

  private static calculateSpeechMetrics(
    userTurns: ConversationTurn[],
    allTurns: ConversationTurn[]
  ) {
    const totalWords = userTurns.reduce((sum, turn) => 
      sum + turn.content.split(' ').length, 0
    )
    
    const totalUserTime = userTurns.length * 30 // Estimativa: 30s por turno
    const totalConversationTime = allTurns.length * 30
    
    // Speech Rate (palavras por minuto)
    const speechRate = totalWords / (totalUserTime / 60)
    
    // Talk Ratio (% tempo falando)
    const talkRatio = (totalUserTime / totalConversationTime) * 100
    
    // Silence Ratio baseado em comprimento dos turnos e pausas estimadas
    const avgTurnLength = userTurns.reduce((sum, turn) => sum + turn.content.length, 0) / userTurns.length
    const silenceRatio = Math.max(5, Math.min(40, 35 - (avgTurnLength / 10)))
    
    // Filler Density (fillers por 100 palavras)
    const fillers = ['ééé', 'tipo', 'aham', 'né', 'então', 'uh', 'hmm']
    const fillerCount = userTurns.reduce((sum, turn) => {
      const content = turn.content.toLowerCase()
      return sum + fillers.filter(filler => content.includes(filler)).length
    }, 0)
    const fillerDensity = (fillerCount / totalWords) * 100
    
    // Clarity (índice baseado em estrutura de frases)
    const avgSentenceLength = totalWords / userTurns.length
    const clarity = Math.min(10, Math.max(0, 10 - (avgSentenceLength - 15) / 5))
    
    return {
      speechRate: Math.round(speechRate),
      talkRatio: Math.round(talkRatio * 10) / 10,
      silenceRatio: Math.round(silenceRatio * 10) / 10,
      fillerDensity: Math.round(fillerDensity * 10) / 10,
      clarity: Math.round(clarity * 10) / 10
    }
  }

  private static calculateConversationMetrics(
    userTurns: ConversationTurn[],
    aiTurns: ConversationTurn[]
  ) {
    // Open Question Rate
    const questions = userTurns.filter(turn => turn.content.includes('?')).length
    const openQuestions = userTurns.filter(turn => {
      const content = turn.content.toLowerCase()
      return content.includes('?') && (
        content.includes('como') ||
        content.includes('por que') ||
        content.includes('o que') ||
        content.includes('quando') ||
        content.includes('onde')
      )
    }).length
    const openQuestionRate = questions > 0 ? (openQuestions / questions) * 100 : 0

    // Follow-up Rate (baseado em referências ao turno anterior)
    const followUps = userTurns.filter((turn, index) => {
      if (index === 0) return false
      const prevAiTurn = aiTurns[index - 1]
      if (!prevAiTurn) return false
      
      const keywords = prevAiTurn.content.toLowerCase().split(' ').slice(0, 5)
      return keywords.some(keyword => 
        turn.content.toLowerCase().includes(keyword) && keyword.length > 3
      )
    }).length
    const followUpRate = userTurns.length > 1 ? (followUps / (userTurns.length - 1)) * 100 : 0

    // Turn Balance (desvio-padrão de duração dos turnos)
    const turnLengths = userTurns.map(turn => turn.content.length)
    const avgLength = turnLengths.reduce((a, b) => a + b, 0) / turnLengths.length
    const variance = turnLengths.reduce((sum, length) => 
      sum + Math.pow(length - avgLength, 2), 0
    ) / turnLengths.length
    const turnBalance = 10 - Math.min(10, Math.sqrt(variance) / 50) // Inverso do desvio

    // Empathy Score (marcadores de empatia)
    const empathyMarkers = ['entendo', 'compreendo', 'vejo que', 'percebo', 'imagino', 'concordo']
    const empathyCount = userTurns.reduce((sum, turn) => {
      const content = turn.content.toLowerCase()
      return sum + empathyMarkers.filter(marker => content.includes(marker)).length
    }, 0)
    const empathyScore = Math.min(10, empathyCount * 2)

    return {
      openQuestionRate: Math.round(openQuestionRate * 10) / 10,
      followUpRate: Math.round(followUpRate * 10) / 10,
      turnBalance: Math.round(turnBalance * 10) / 10,
      empathyScore: Math.round(empathyScore * 10) / 10
    }
  }

  private static async calculateContentMetrics(
    userTurns: ConversationTurn[],
    criteria: Criterion[],
    area: string
  ) {
    // Analisar conteúdo real para scores dos critérios
    const criteriaScores = await Promise.all(criteria.map(async (criterion) => {
      const score = await this.analyzeCriterionScore(userTurns, criterion, area)
      return {
        ...criterion,
        score: Math.round(score * 10) / 10
      }
    }))

    // Topic Coverage (% de tópicos esperados cobertos)
    const expectedTopics = this.getExpectedTopics(area)
    const mentionedTopics = expectedTopics.filter(topic =>
      userTurns.some(turn => 
        turn.content.toLowerCase().includes(topic.toLowerCase())
      )
    )
    const topicCoverage = (mentionedTopics.length / expectedTopics.length) * 100

    // Evidence Density (números, exemplos, datas por turno)
    const evidencePatterns = [
      /\d+%/g, // Percentuais
      /\$\d+/g, // Valores
      /\d{1,2}\/\d{1,2}/g, // Datas
      /por exemplo/g, // Exemplos
      /dados mostram/g // Evidências
    ]
    const evidenceCount = userTurns.reduce((sum, turn) => {
      return sum + evidencePatterns.reduce((count, pattern) => 
        count + (turn.content.match(pattern) || []).length, 0
      )
    }, 0)
    const evidenceDensity = evidenceCount / userTurns.length

    return {
      criteriaScores,
      topicCoverage: Math.round(topicCoverage * 10) / 10,
      evidenceDensity: Math.round(evidenceDensity * 10) / 10
    }
  }

  private static calculateOutcomeMetrics(userTurns: ConversationTurn[], area: string) {
    const lastTurn = userTurns[userTurns.length - 1]?.content || ''

    // Next Step Quality (0-3)
    let nextStepQuality = 0
    if (lastTurn.includes('próximo') || lastTurn.includes('seguir')) {
      nextStepQuality = 1 // Vago
      if (lastTurn.includes('quando') || lastTurn.includes('prazo')) {
        nextStepQuality = 2 // Específico sem data
        if (lastTurn.match(/\d{1,2}\/\d{1,2}/)) {
          nextStepQuality = 3 // SMART com data
        }
      }
    }

    // Resolution Rate (específico por área)
    const resolutionKeywords = {
      comercial: ['acordo', 'proposta', 'contrato', 'fechamos'],
      rh: ['plano', 'desenvolvimento', '30-60-90', 'meta'],
      educacional: ['tarefa', 'atividade', 'exercício', 'próxima aula'],
      gestao: ['decisão', 'responsável', 'prazo', 'orçamento']
    }
    
    const areaKeywords = resolutionKeywords[area as keyof typeof resolutionKeywords] || []
    const resolutions = userTurns.filter(turn =>
      areaKeywords.some(keyword => turn.content.toLowerCase().includes(keyword))
    ).length
    const resolutionRate = (resolutions / userTurns.length) * 100

    // Decisions Rate baseado em palavras de decisão encontradas
    const decisionWords = ['vamos', 'decidimos', 'escolho', 'optamos', 'definir']
    const decisionsFound = userTurns.filter(turn =>
      decisionWords.some(word => turn.content.toLowerCase().includes(word))
    ).length
    const decisionsRate = Math.min(100, (decisionsFound / userTurns.length) * 150)
    
    // Action Items baseado em verbos de ação
    const actionWords = ['fazer', 'implementar', 'executar', 'realizar', 'entregar']
    const actionItemsCount = userTurns.reduce((count, turn) => {
      return count + actionWords.filter(word => 
        turn.content.toLowerCase().includes(word)
      ).length
    }, 0)

    return {
      nextStepQuality,
      resolutionRate: Math.round(resolutionRate * 10) / 10,
      decisionsRate: Math.round(decisionsRate * 10) / 10,
      actionItemsCount
    }
  }

  private static async calculateClimateMetrics(conversationHistory: ConversationTurn[]) {
    const userTurns = conversationHistory.filter(turn => turn.speaker === 'user')
    
    // Sentiment Delta (início vs fim)
    let sentimentDelta = 0
    if (userTurns.length >= 2) {
      try {
        const firstSentiment = await this.sentimentAnalyzer(userTurns[0].content)
        const lastSentiment = await this.sentimentAnalyzer(userTurns[userTurns.length - 1].content)
        
        const firstScore = this.getSentimentScore(firstSentiment[0])
        const lastScore = this.getSentimentScore(lastSentiment[0])
        sentimentDelta = lastScore - firstScore
      } catch (error) {
        console.warn('Erro na análise de sentiment:', error)
        // Fallback: analisar palavras positivas/negativas
        const positiveWords = ['bom', 'ótimo', 'excelente', 'gosto', 'satisfeito', 'feliz']
        const negativeWords = ['ruim', 'péssimo', 'problema', 'dificuldade', 'insatisfeito', 'triste']
        
        const firstContent = userTurns[0].content.toLowerCase()
        const lastContent = userTurns[userTurns.length - 1].content.toLowerCase()
        
        const firstPositive = positiveWords.filter(word => firstContent.includes(word)).length
        const firstNegative = negativeWords.filter(word => firstContent.includes(word)).length
        const lastPositive = positiveWords.filter(word => lastContent.includes(word)).length
        const lastNegative = negativeWords.filter(word => lastContent.includes(word)).length
        
        const firstScore = (firstPositive - firstNegative) / 10
        const lastScore = (lastPositive - lastNegative) / 10
        sentimentDelta = lastScore - firstScore
      }
    }

    // Empathy Markers
    const empathyMarkers = ['obrigado', 'por favor', 'entendo', 'desculpe', 'parabéns']
    const empathyCount = userTurns.reduce((sum, turn) => {
      const content = turn.content.toLowerCase()
      return sum + empathyMarkers.filter(marker => content.includes(marker)).length
    }, 0)

    // Compliance Flags
    const riskTerms = ['problema', 'impossível', 'nunca', 'não posso', 'recuso']
    const complianceFlags = userTurns.reduce((sum, turn) => {
      const content = turn.content.toLowerCase()
      return sum + riskTerms.filter(term => content.includes(term)).length
    }, 0)

    // Politeness Score
    const politenessMarkers = ['por favor', 'obrigado', 'desculpe', 'com licença']
    const politenessCount = userTurns.reduce((sum, turn) => {
      const content = turn.content.toLowerCase()
      return sum + politenessMarkers.filter(marker => content.includes(marker)).length
    }, 0)
    const politenessScore = Math.min(10, politenessCount * 2.5)

    return {
      sentimentDelta: Math.round(sentimentDelta * 100) / 100,
      empathyMarkers: empathyCount,
      complianceFlags,
      politenessScore: Math.round(politenessScore * 10) / 10
    }
  }

  private static getSentimentScore(sentiment: any): number {
    // Converte sentiment para score numérico
    if (sentiment.label === 'POSITIVE') return sentiment.score
    if (sentiment.label === 'NEGATIVE') return -sentiment.score
    return 0 // NEUTRAL
  }

  private static getExpectedTopics(area: string): string[] {
    const topics = {
      comercial: ['necessidade', 'orçamento', 'decisão', 'prazo', 'benefício', 'ROI'],
      rh: ['experiência', 'habilidades', 'metas', 'desenvolvimento', 'feedback'],
      educacional: ['objetivos', 'conceitos', 'prática', 'avaliação', 'dúvidas'],
      gestao: ['estratégia', 'recursos', 'riscos', 'resultados', 'equipe', 'prazo']
    }
    return topics[area as keyof typeof topics] || []
  }

  private static calculateOverallScore(metrics: {
    speechMetrics: any
    conversationMetrics: any
    contentMetrics: any
    outcomeMetrics: any
    climateMetrics: any
  }): number {
    // Pesos por categoria (total = 100%)
    const weights = {
      speech: 0.20,      // 20%
      conversation: 0.25, // 25%
      content: 0.30,     // 30%
      outcome: 0.15,     // 15%
      climate: 0.10      // 10%
    }

    // Normalizar métricas para 0-10
    const speechScore = this.normalizeSpeechScore(metrics.speechMetrics)
    const conversationScore = (
      metrics.conversationMetrics.openQuestionRate / 10 +
      metrics.conversationMetrics.followUpRate / 10 +
      metrics.conversationMetrics.turnBalance +
      metrics.conversationMetrics.empathyScore
    ) / 4

    const contentScore = metrics.contentMetrics.criteriaScores.reduce((sum, criterion) => 
      sum + criterion.score * criterion.weight, 0
    ) / metrics.contentMetrics.criteriaScores.reduce((sum, criterion) => 
      sum + criterion.weight, 0
    )

    const outcomeScore = (
      (metrics.outcomeMetrics.nextStepQuality / 3) * 10 +
      (metrics.outcomeMetrics.resolutionRate / 10) +
      (metrics.outcomeMetrics.decisionsRate / 10)
    ) / 3

    const climateScore = (
      Math.max(0, 5 + metrics.climateMetrics.sentimentDelta * 5) +
      Math.min(10, metrics.climateMetrics.empathyMarkers * 2) +
      Math.max(0, 10 - metrics.climateMetrics.complianceFlags * 2) +
      metrics.climateMetrics.politenessScore
    ) / 4

    const overallScore = 
      speechScore * weights.speech +
      conversationScore * weights.conversation +
      contentScore * weights.content +
      outcomeScore * weights.outcome +
      climateScore * weights.climate

    return Math.round(overallScore * 10) / 10
  }

  private static normalizeSpeechScore(speechMetrics: any): number {
    // Normalizar speech rate (110-160 WPM ideal)
    const speechRateScore = speechMetrics.speechRate >= 110 && speechMetrics.speechRate <= 160 ? 10 :
      Math.max(0, 10 - Math.abs(speechMetrics.speechRate - 135) / 10)

    // Normalizar talk ratio (30-60% ideal)
    const talkRatioScore = speechMetrics.talkRatio >= 30 && speechMetrics.talkRatio <= 60 ? 10 :
      Math.max(0, 10 - Math.abs(speechMetrics.talkRatio - 45) / 5)

    // Outras métricas já estão em 0-10
    return (
      speechRateScore +
      talkRatioScore +
      (speechMetrics.silenceRatio >= 10 && speechMetrics.silenceRatio <= 35 ? 10 : 5) +
      Math.max(0, 10 - speechMetrics.fillerDensity * 2) +
      speechMetrics.clarity
    ) / 5
  }

  private static async analyzeCriterionScore(
    userTurns: ConversationTurn[],
    criterion: Criterion,
    area: string
  ): Promise<number> {
    // Mapear critérios para palavras-chave específicas por área
    const criterionKeywords = this.getCriterionKeywords(criterion.key, area)
    
    if (criterionKeywords.length === 0) {
      // Fallback para critérios sem mapeamento específico - score neutro
      return 6.0 // Score neutro para critérios não mapeados
    }

    // Calcular score baseado na presença e contexto das palavras-chave
    let totalScore = 0
    let scoreCount = 0

    userTurns.forEach(turn => {
      const content = turn.content.toLowerCase()
      const keywordMatches = criterionKeywords.filter(keyword => 
        content.includes(keyword.toLowerCase())
      )
      
      if (keywordMatches.length > 0) {
        // Score base pela presença de palavras-chave
        let turnScore = 6 + (keywordMatches.length * 0.5)
        
        // Bonificação por contexto positivo
        const positiveContext = ['bem', 'ótimo', 'excelente', 'sucesso', 'consegui']
        if (positiveContext.some(word => content.includes(word))) {
          turnScore += 1
        }
        
        // Penalização por contexto negativo
        const negativeContext = ['problema', 'dificuldade', 'não consegui', 'ruim']
        if (negativeContext.some(word => content.includes(word))) {
          turnScore -= 1
        }

        totalScore += Math.min(10, Math.max(0, turnScore))
        scoreCount++
      }
    })

    // Se não houve matches, dar score baixo
    if (scoreCount === 0) {
      return 3
    }

    return totalScore / scoreCount
  }

  private static getCriterionKeywords(criterionKey: string, area: string): string[] {
    const keywordMaps = {
      comercial: {
        'tecnicas_venda': ['venda', 'proposta', 'oferta', 'apresentar', 'demonstrar'],
        'relacionamento_cliente': ['cliente', 'relacionamento', 'confiança', 'parceria', 'atendimento'],
        'negociacao': ['negociar', 'acordo', 'preço', 'condições', 'flexível'],
        'prospeccao': ['prospectar', 'lead', 'oportunidade', 'mercado', 'cliente novo'],
        'fechamento': ['fechar', 'contrato', 'decisão', 'assinar', 'confirmar'],
        'valor': ['valor', 'benefício', 'ROI', 'retorno', 'economia'],
        'flexibilidade': ['flexível', 'adaptar', 'alternativa', 'opção', 'personalizar'],
        'alternativas': ['alternativa', 'opção', 'solução', 'caminho', 'possibilidade'],
        'acordo': ['acordo', 'consenso', 'alinhamento', 'combinado', 'fechado'],
        'oportunidade': ['oportunidade', 'chance', 'momento', 'timing', 'potencial'],
        'timing': ['tempo', 'momento', 'prazo', 'urgente', 'quando'],
        'beneficios': ['benefício', 'vantagem', 'ganho', 'resultado', 'melhoria'],
        'implementacao': ['implementar', 'executar', 'plano', 'ação', 'fazer'],
        'empatia': ['entendo', 'compreendo', 'percebo', 'vejo', 'sinto'],
        'problemas': ['problema', 'dificuldade', 'desafio', 'questão', 'ponto'],
        'solucoes': ['solução', 'resolver', 'corrigir', 'melhorar', 'otimizar'],
        'compromisso': ['compromisso', 'garantia', 'promessa', 'acordo', 'responsabilidade']
      },
      rh: {
        'comunicacao_clara': ['claro', 'objetivo', 'direto', 'explicar', 'comunicar'],
        'escuta_ativa': ['ouvir', 'escutar', 'entender', 'compreender', 'perceber'],
        'empatia': ['empatia', 'entendo', 'sinto', 'compreendo', 'apoio'],
        'gestao_conflitos': ['conflito', 'resolver', 'mediar', 'acordo', 'solução'],
        'plano_acao': ['plano', 'ação', 'meta', 'objetivo', 'estratégia']
      },
      educacional: {
        'clareza_didatica': ['claro', 'explicar', 'ensinar', 'demonstrar', 'mostrar'],
        'engajamento': ['participar', 'envolver', 'interagir', 'motivar', 'interesse'],
        'adaptabilidade': ['adaptar', 'ajustar', 'flexível', 'personalizar', 'modificar'],
        'feedback_construtivo': ['feedback', 'observação', 'sugestão', 'melhoria', 'crescimento'],
        'motivacao': ['motivar', 'inspirar', 'encorajar', 'estimular', 'apoiar']
      },
      gestao: {
        'lideranca_estrategica': ['liderar', 'estratégia', 'visão', 'direção', 'comando'],
        'comunicacao_executiva': ['comunicar', 'apresentar', 'reportar', 'informar', 'compartilhar'],
        'tomada_decisao': ['decidir', 'escolher', 'definir', 'determinar', 'resolver'],
        'influencia_persuasao': ['influenciar', 'persuadir', 'convencer', 'motivar', 'inspirar'],
        'gestao_conflitos': ['conflito', 'mediar', 'resolver', 'negociar', 'acordo']
      }
    }

    const areaKeywords = keywordMaps[area as keyof typeof keywordMaps]
    return areaKeywords?.[criterionKey] || []
  }
}