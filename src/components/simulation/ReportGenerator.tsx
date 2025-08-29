import { MetricsResult } from './MetricsCalculator'

interface Scenario {
  id: string
  area: string
  title: string
  description: string
  criteria: Array<{
    key: string
    label: string
    weight: number
  }>
}

interface ConversationTurn {
  speaker: 'user' | 'ai'
  content: string
  timestamp: number
}

interface SimulationReport {
  overallScore: number
  scoreLevel: 'excellent' | 'good' | 'satisfactory' | 'needs_improvement'
  summary: string
  highlights: string[]
  improvements: string[]
  nextSteps: string[]
  detailedMetrics: {
    speech: DetailedMetric[]
    conversation: DetailedMetric[]
    content: DetailedMetric[]
    outcome: DetailedMetric[]
    climate: DetailedMetric[]
  }
  benchmarkComparison: {
    yourScore: number
    averageScore: number
    topPerformers: number
    percentile: number
  }
  recommendations: Recommendation[]
}

interface DetailedMetric {
  name: string
  value: number | string
  target: string
  status: 'excellent' | 'good' | 'warning' | 'poor'
  description: string
}

interface Recommendation {
  category: string
  priority: 'high' | 'medium' | 'low'
  title: string
  description: string
  actionItems: string[]
}

export class ReportGenerator {
  static async generate(
    metrics: MetricsResult,
    scenario: Scenario,
    userRole: string,
    conversationHistory: ConversationTurn[]
  ): Promise<SimulationReport> {
    
    const scoreLevel = this.getScoreLevel(metrics.overallScore)
    const benchmarkComparison = this.generateBenchmarkComparison(metrics.overallScore, scenario.area)
    
    return {
      overallScore: metrics.overallScore,
      scoreLevel,
      summary: this.generateSummary(metrics, scenario, userRole),
      highlights: this.generateHighlights(metrics, scenario.area),
      improvements: this.generateImprovements(metrics, scenario.area),
      nextSteps: this.generateNextSteps(metrics, scenario.area, userRole),
      detailedMetrics: this.generateDetailedMetrics(metrics, scenario.area),
      benchmarkComparison,
      recommendations: this.generateRecommendations(metrics, scenario.area, userRole)
    }
  }

  private static getScoreLevel(score: number): 'excellent' | 'good' | 'satisfactory' | 'needs_improvement' {
    if (score >= 9) return 'excellent'
    if (score >= 7.5) return 'good'
    if (score >= 6) return 'satisfactory'
    return 'needs_improvement'
  }

  private static generateSummary(metrics: MetricsResult, scenario: Scenario, userRole: string): string {
    const scoreLevel = this.getScoreLevel(metrics.overallScore)
    const areaName = this.getAreaName(scenario.area)
    
    const summaries = {
      excellent: `Excelente performance! Você demonstrou domínio completo das técnicas de ${areaName.toLowerCase()} como ${userRole}. Sua comunicação foi clara, empática e objetiva, atingindo todos os critérios principais do cenário "${scenario.title}".`,
      
      good: `Boa performance geral! Você mostrou competência sólida em ${areaName.toLowerCase()} como ${userRole}. Alguns pontos podem ser refinados para elevar ainda mais sua efetividade no cenário "${scenario.title}".`,
      
      satisfactory: `Performance satisfatória. Você demonstrou conhecimento básico das técnicas de ${areaName.toLowerCase()}, mas há oportunidades claras de melhoria para maximizar seus resultados como ${userRole} no cenário "${scenario.title}".`,
      
      needs_improvement: `Há espaço significativo para desenvolvimento. Focar nos fundamentos de ${areaName.toLowerCase()} e praticar as técnicas específicas do papel de ${userRole} trará resultados substanciais no cenário "${scenario.title}".`
    }

    return summaries[scoreLevel]
  }

  private static generateHighlights(metrics: MetricsResult, area: string): string[] {
    const highlights: string[] = []

    // Speech highlights
    if (metrics.speechMetrics.speechRate >= 110 && metrics.speechMetrics.speechRate <= 160) {
      highlights.push(`Ritmo de fala ideal (${metrics.speechMetrics.speechRate} WPM) - excelente para clareza e compreensão`)
    }

    if (metrics.speechMetrics.fillerDensity <= 3) {
      highlights.push(`Comunicação fluida com poucos fillers (${metrics.speechMetrics.fillerDensity}/100 palavras)`)
    }

    // Conversation highlights
    if (metrics.conversationMetrics.openQuestionRate >= 60) {
      highlights.push(`Excelente uso de perguntas abertas (${metrics.conversationMetrics.openQuestionRate}%) para descoberta`)
    }

    if (metrics.conversationMetrics.empathyScore >= 8) {
      highlights.push(`Alta demonstração de empatia e escuta ativa (${metrics.conversationMetrics.empathyScore}/10)`)
    }

    // Content highlights
    const topCriteria = metrics.contentMetrics.criteriaScores
      .filter(c => c.score >= 8.5)
      .map(c => c.label)
    
    if (topCriteria.length > 0) {
      highlights.push(`Domínio excelente em: ${topCriteria.join(', ')}`)
    }

    // Outcome highlights
    if (metrics.outcomeMetrics.nextStepQuality >= 2) {
      highlights.push(`Próximos passos bem definidos e específicos`)
    }

    // Climate highlights
    if (metrics.climateMetrics.sentimentDelta > 0.2) {
      highlights.push(`Melhoria significativa no clima da conversa (+${(metrics.climateMetrics.sentimentDelta * 100).toFixed(0)}%)`)
    }

    if (highlights.length === 0) {
      highlights.push('Demonstrou conhecimento básico dos conceitos fundamentais')
    }

    return highlights
  }

  private static generateImprovements(metrics: MetricsResult, area: string): string[] {
    const improvements: string[] = []

    // Speech improvements
    if (metrics.speechMetrics.speechRate < 110) {
      improvements.push(`Acelere ligeiramente o ritmo de fala (atual: ${metrics.speechMetrics.speechRate} WPM, ideal: 110-160 WPM)`)
    } else if (metrics.speechMetrics.speechRate > 160) {
      improvements.push(`Diminua o ritmo de fala para melhor compreensão (atual: ${metrics.speechMetrics.speechRate} WPM, ideal: 110-160 WPM)`)
    }

    if (metrics.speechMetrics.fillerDensity > 5) {
      improvements.push(`Reduza fillers como "ééé", "tipo", "né" (atual: ${metrics.speechMetrics.fillerDensity}/100 palavras)`)
    }

    // Talk ratio por área
    const idealTalkRatio = this.getIdealTalkRatio(area)
    if (metrics.speechMetrics.talkRatio < idealTalkRatio.min) {
      improvements.push(`Participe mais ativamente da conversa (fale ${idealTalkRatio.min}-${idealTalkRatio.max}% do tempo)`)
    } else if (metrics.speechMetrics.talkRatio > idealTalkRatio.max) {
      improvements.push(`Deixe mais espaço para o interlocutor falar (ideal: ${idealTalkRatio.min}-${idealTalkRatio.max}% do tempo)`)
    }

    // Conversation improvements
    if (metrics.conversationMetrics.openQuestionRate < 50) {
      improvements.push(`Use mais perguntas abertas para descoberta (atual: ${metrics.conversationMetrics.openQuestionRate}%, meta: ≥50%)`)
    }

    if (metrics.conversationMetrics.followUpRate < 40) {
      improvements.push(`Demonstre mais conexão com as respostas do interlocutor (follow-up: ${metrics.conversationMetrics.followUpRate}%)`)
    }

    // Content improvements
    const weakCriteria = metrics.contentMetrics.criteriaScores
      .filter(c => c.score < 7)
      .map(c => c.label)
    
    if (weakCriteria.length > 0) {
      improvements.push(`Foque especialmente em: ${weakCriteria.join(', ')}`)
    }

    // Outcome improvements
    if (metrics.outcomeMetrics.nextStepQuality < 2) {
      improvements.push(`Defina próximos passos mais específicos com prazos e responsáveis`)
    }

    // Climate improvements
    if (metrics.climateMetrics.empathyMarkers < 2) {
      improvements.push(`Use mais marcadores de empatia ("entendo", "vejo que", "percebo")`)
    }

    if (improvements.length === 0) {
      improvements.push('Continue praticando para refinamento contínuo das técnicas')
    }

    return improvements
  }

  private static generateNextSteps(metrics: MetricsResult, area: string, userRole: string): string[] {
    const nextSteps: string[] = []

    // Baseado no score geral
    if (metrics.overallScore < 6) {
      nextSteps.push(`Pratique os fundamentos de ${this.getAreaName(area).toLowerCase()} com cenários similares`)
      nextSteps.push(`Estude as melhores práticas para o papel de ${userRole}`)
    } else if (metrics.overallScore < 8) {
      nextSteps.push(`Refine técnicas específicas identificadas nas melhorias`)
      nextSteps.push(`Pratique cenários mais desafiadores da mesma área`)
    } else {
      nextSteps.push(`Experimente cenários avançados e situações adversas`)
      nextSteps.push(`Considere mentorar outros profissionais da área`)
    }

    // Específico por área
    const areaSpecificSteps = {
      comercial: [
        'Pratique técnicas SPIN para descoberta de necessidades',
        'Treine objeções mais complexas e contorno avançado'
      ],
      rh: [
        'Aprofunde-se em técnicas de entrevista comportamental (STAR)',
        'Pratique feedbacks difíceis com CNV (Comunicação Não-Violenta)'
      ],
      educacional: [
        'Desenvolva estratégias de engajamento para diferentes perfis',
        'Pratique metodologias ativas de aprendizagem'
      ],
      gestao: [
        'Refine habilidades de comunicação executiva',
        'Pratique gestão de conflitos e tomada de decisão complexa'
      ]
    }

    const specificSteps = areaSpecificSteps[area as keyof typeof areaSpecificSteps] || []
    nextSteps.push(...specificSteps.slice(0, 2))

    return nextSteps
  }

  private static generateDetailedMetrics(metrics: MetricsResult, area: string): {
    speech: DetailedMetric[]
    conversation: DetailedMetric[]
    content: DetailedMetric[]
    outcome: DetailedMetric[]
    climate: DetailedMetric[]
  } {
    
    const idealTalkRatio = this.getIdealTalkRatio(area)
    
    return {
      speech: [
        {
          name: 'Ritmo de Fala',
          value: `${metrics.speechMetrics.speechRate} WPM`,
          target: '110-160 WPM',
          status: this.getMetricStatus(metrics.speechMetrics.speechRate, 110, 160),
          description: 'Velocidade da fala medida em palavras por minuto'
        },
        {
          name: 'Proporção de Fala',
          value: `${metrics.speechMetrics.talkRatio}%`,
          target: `${idealTalkRatio.min}-${idealTalkRatio.max}%`,
          status: this.getMetricStatus(metrics.speechMetrics.talkRatio, idealTalkRatio.min, idealTalkRatio.max),
          description: 'Percentual do tempo que você falou na conversa'
        },
        {
          name: 'Densidade de Fillers',
          value: `${metrics.speechMetrics.fillerDensity}/100`,
          target: '≤5/100',
          status: metrics.speechMetrics.fillerDensity <= 5 ? 'excellent' : 'warning',
          description: 'Quantidade de fillers ("ééé", "tipo") por 100 palavras'
        },
        {
          name: 'Clareza',
          value: `${metrics.speechMetrics.clarity}/10`,
          target: '8-10/10',
          status: this.getScoreStatus(metrics.speechMetrics.clarity),
          description: 'Clareza e estrutura das suas colocações'
        }
      ],
      
      conversation: [
        {
          name: 'Perguntas Abertas',
          value: `${metrics.conversationMetrics.openQuestionRate}%`,
          target: '≥50%',
          status: metrics.conversationMetrics.openQuestionRate >= 50 ? 'excellent' : 'warning',
          description: 'Percentual de perguntas abertas para descoberta'
        },
        {
          name: 'Follow-up',
          value: `${metrics.conversationMetrics.followUpRate}%`,
          target: '≥40%',
          status: metrics.conversationMetrics.followUpRate >= 40 ? 'good' : 'warning',
          description: 'Conexão com respostas do interlocutor'
        },
        {
          name: 'Equilíbrio de Turnos',
          value: `${metrics.conversationMetrics.turnBalance}/10`,
          target: '7-10/10',
          status: this.getScoreStatus(metrics.conversationMetrics.turnBalance),
          description: 'Consistência na duração dos turnos de fala'
        },
        {
          name: 'Empatia',
          value: `${metrics.conversationMetrics.empathyScore}/10`,
          target: '8-10/10',
          status: this.getScoreStatus(metrics.conversationMetrics.empathyScore),
          description: 'Demonstração de empatia e escuta ativa'
        }
      ],

      content: metrics.contentMetrics.criteriaScores.map(criterion => ({
        name: criterion.label,
        value: `${criterion.score}/10`,
        target: '8-10/10',
        status: this.getScoreStatus(criterion.score),
        description: `Critério específico do cenário (peso: ${criterion.weight})`
      })),

      outcome: [
        {
          name: 'Próximos Passos',
          value: this.getNextStepLabel(metrics.outcomeMetrics.nextStepQuality),
          target: 'SMART (específico + prazo)',
          status: this.getNextStepStatus(metrics.outcomeMetrics.nextStepQuality),
          description: 'Qualidade dos próximos passos definidos'
        },
        {
          name: 'Taxa de Resolução',
          value: `${metrics.outcomeMetrics.resolutionRate}%`,
          target: '≥70%',
          status: metrics.outcomeMetrics.resolutionRate >= 70 ? 'excellent' : 'good',
          description: 'Resolução de pontos levantados na conversa'
        },
        {
          name: 'Itens de Ação',
          value: metrics.outcomeMetrics.actionItemsCount.toString(),
          target: '2-4 itens',
          status: metrics.outcomeMetrics.actionItemsCount >= 2 ? 'good' : 'warning',
          description: 'Quantidade de ações definidas'
        }
      ],

      climate: [
        {
          name: 'Evolução do Clima',
          value: `${(metrics.climateMetrics.sentimentDelta * 100).toFixed(0)}%`,
          target: '≥0%',
          status: metrics.climateMetrics.sentimentDelta >= 0 ? 'excellent' : 'warning',
          description: 'Melhoria do sentimento ao longo da conversa'
        },
        {
          name: 'Marcadores de Empatia',
          value: metrics.climateMetrics.empathyMarkers.toString(),
          target: '≥3',
          status: metrics.climateMetrics.empathyMarkers >= 3 ? 'excellent' : 'good',
          description: 'Uso de expressões empáticas'
        },
        {
          name: 'Cordialidade',
          value: `${metrics.climateMetrics.politenessScore}/10`,
          target: '8-10/10',
          status: this.getScoreStatus(metrics.climateMetrics.politenessScore),
          description: 'Nível de polidez e cordialidade'
        }
      ]
    }
  }

  private static generateBenchmarkComparison(score: number, area: string) {
    // Usar dados baseados em faixas realistas por área
    const averageScore = 7.2
    const topPerformers = 8.8
    
    // Calcular percentil baseado no score
    let percentile: number
    if (score >= topPerformers) percentile = 95
    else if (score >= averageScore + 1) percentile = 80
    else if (score >= averageScore) percentile = 60
    else if (score >= averageScore - 1) percentile = 40
    else percentile = 20

    return {
      yourScore: score,
      averageScore: Math.round(averageScore * 10) / 10,
      topPerformers: Math.round(topPerformers * 10) / 10,
      percentile
    }
  }

  private static generateRecommendations(metrics: MetricsResult, area: string, userRole: string): Recommendation[] {
    const recommendations: Recommendation[] = []

    // Recomendações baseadas em speech metrics
    if (metrics.speechMetrics.speechRate < 110 || metrics.speechMetrics.speechRate > 160) {
      recommendations.push({
        category: 'Comunicação',
        priority: 'high',
        title: 'Otimize seu ritmo de fala',
        description: 'Ajuste a velocidade da fala para melhorar clareza e compreensão',
        actionItems: [
          'Pratique leitura em voz alta com cronômetro',
          'Grave-se falando e analise o ritmo',
          'Use pausas estratégicas para dar tempo de processamento'
        ]
      })
    }

    // Recomendações baseadas em conversation metrics
    if (metrics.conversationMetrics.openQuestionRate < 50) {
      recommendations.push({
        category: 'Descoberta',
        priority: 'high',
        title: 'Desenvolva técnicas de questionamento',
        description: 'Aumente o uso de perguntas abertas para melhor descoberta',
        actionItems: [
          'Estude a técnica SPIN (Situação, Problema, Implicação, Necessidade)',
          'Prepare banco de perguntas abertas por cenário',
          'Pratique reformular perguntas fechadas em abertas'
        ]
      })
    }

    // Recomendações específicas por área
    const areaRecommendations = this.getAreaSpecificRecommendations(area, metrics, userRole)
    recommendations.push(...areaRecommendations)

    // Recomendação de próximos treinos
    recommendations.push({
      category: 'Desenvolvimento',
      priority: 'medium',
      title: 'Planeje seus próximos treinos',
      description: 'Continue evoluindo com prática estruturada',
      actionItems: [
        `Pratique ${area} 2-3 vezes por semana`,
        'Varie os cenários para ampliar repertório',
        'Analise gravações de sessões passadas'
      ]
    })

    return recommendations
  }

  private static getAreaSpecificRecommendations(area: string, metrics: MetricsResult, userRole: string): Recommendation[] {
    const areaRecs = {
      comercial: [
        {
          category: 'Vendas',
          priority: 'high' as const,
          title: 'Melhore o processo de descoberta',
          description: 'Aprofunde-se nas necessidades e dores do cliente',
          actionItems: [
            'Use mais perguntas sobre impacto do problema atual',
            'Explore consequências de não resolver o problema',
            'Quantifique benefícios da solução proposta'
          ]
        }
      ],
      rh: [
        {
          category: 'Entrevistas',
          priority: 'high' as const,
          title: 'Refine técnicas de entrevista comportamental',
          description: 'Extraia evidências concretas de competências',
          actionItems: [
            'Pratique método STAR (Situação, Tarefa, Ação, Resultado)',
            'Prepare follow-ups para aprofundar respostas',
            'Desenvolva escala de avaliação comportamental'
          ]
        }
      ],
      educacional: [
        {
          category: 'Ensino',
          priority: 'medium' as const,
          title: 'Aumente engajamento da turma',
          description: 'Desenvolva estratégias para manter atenção e participação',
          actionItems: [
            'Use mais exemplos práticos e casos reais',
            'Implemente técnicas de aprendizagem ativa',
            'Faça verificações frequentes de compreensão'
          ]
        }
      ],
      gestao: [
        {
          category: 'Liderança',
          priority: 'high' as const,
          title: 'Desenvolva comunicação executiva',
          description: 'Comunique-se com clareza e impacto para tomada de decisão',
          actionItems: [
            'Estruture apresentações com dados e recomendações',
            'Pratique comunicação de riscos e mitigações',
            'Desenvolva storytelling com dados'
          ]
        }
      ]
    }

    return areaRecs[area as keyof typeof areaRecs] || []
  }

  // Helper methods
  private static getAreaName(area: string): string {
    const names = {
      comercial: 'Comercial',
      rh: 'Recursos Humanos',
      educacional: 'Educacional', 
      gestao: 'Gestão'
    }
    return names[area as keyof typeof names] || area
  }

  private static getIdealTalkRatio(area: string) {
    const ratios = {
      comercial: { min: 35, max: 55 },
      rh: { min: 30, max: 45 },
      educacional: { min: 40, max: 60 },
      gestao: { min: 40, max: 60 }
    }
    return ratios[area as keyof typeof ratios] || { min: 35, max: 55 }
  }

  private static getMetricStatus(value: number, min: number, max: number): 'excellent' | 'good' | 'warning' | 'poor' {
    if (value >= min && value <= max) return 'excellent'
    if (value >= min - 10 && value <= max + 10) return 'good'
    if (value >= min - 20 && value <= max + 20) return 'warning'
    return 'poor'
  }

  private static getScoreStatus(score: number): 'excellent' | 'good' | 'warning' | 'poor' {
    if (score >= 8.5) return 'excellent'
    if (score >= 7) return 'good'
    if (score >= 5.5) return 'warning'
    return 'poor'
  }

  private static getNextStepLabel(quality: number): string {
    const labels = ['Nenhum', 'Vago', 'Específico', 'SMART']
    return labels[quality] || 'Nenhum'
  }

  private static getNextStepStatus(quality: number): 'excellent' | 'good' | 'warning' | 'poor' {
    if (quality === 3) return 'excellent'
    if (quality === 2) return 'good'
    if (quality === 1) return 'warning'
    return 'poor'
  }
}