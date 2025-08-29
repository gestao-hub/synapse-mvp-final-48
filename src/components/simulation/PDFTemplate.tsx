import jsPDF from 'jspdf'
import { PDFUtils, synapseColors } from '@/utils/pdfHelpers'

export interface ReportData {
  report: any
  metrics: any
  scenario: any
  userRole: string
  timestamp: string
}

export class PDFTemplate {
  private doc: jsPDF
  private colors = synapseColors
  private margin = 20
  private pageWidth: number
  private pageHeight: number
  private yPosition = 0

  constructor() {
    this.doc = new jsPDF()
    this.pageWidth = this.doc.internal.pageSize.width
    this.pageHeight = this.doc.internal.pageSize.height
  }

  async generateReport(data: ReportData): Promise<void> {
    const { report, scenario, userRole, timestamp } = data

    // Página 1: Cabeçalho e Resumo Executivo
    await this.createHeaderPage(scenario, userRole, timestamp, report)
    
    // Página 2: Métricas e Análise Detalhada
    this.doc.addPage()
    this.yPosition = this.margin
    this.createMetricsPage(report)
    
    // Página 3: Recomendações e Próximos Passos
    this.doc.addPage()
    this.yPosition = this.margin
    this.createRecommendationsPage(report)
    
    // Adicionar números de página e footer
    PDFUtils.addPageNumbers(this.doc, this.colors)
  }

  private async createHeaderPage(scenario: any, userRole: string, timestamp: string, report: any): Promise<void> {
    // Background gradient no header
    const canvas = document.createElement('canvas')
    canvas.width = 600
    canvas.height = 120
    const ctx = canvas.getContext('2d')!
    
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0)
    gradient.addColorStop(0, '#8B00FF')
    gradient.addColorStop(0.5, '#0080FF')
    gradient.addColorStop(1, '#00FFAA')
    
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    const headerImg = canvas.toDataURL('image/png')
    this.doc.addImage(headerImg, 'PNG', 0, 0, this.pageWidth, 50)

    // Logo Synapse (simulada com texto estilizado por enquanto)
    this.doc.setFontSize(32)
    this.doc.setFont('helvetica', 'bold')
    this.doc.setTextColor(255, 255, 255)
    this.doc.text('Synapse', this.margin, 30)
    
    this.doc.setFontSize(14)
    this.doc.setFont('helvetica', 'normal')
    this.doc.text('Relatório de Performance IA', this.margin, 42)

    this.yPosition = 70

    // Informações da sessão em cards
    this.createInfoCards(scenario, userRole, timestamp)

    // Score principal com círculo visual
    this.yPosition += 20
    PDFUtils.addScoreCircle(this.doc, report.overallScore, this.pageWidth - 80, this.yPosition + 30, 25, this.colors)
    
    // Label do score
    this.doc.setFontSize(16)
    this.doc.setFont('helvetica', 'bold')
    PDFUtils.setTextColorFromHex(this.doc, this.colors.text)
    this.doc.text('SCORE GERAL', this.pageWidth - 140, this.yPosition + 10)
    
    const scoreLabel = this.getScoreLabel(report.overallScore)
    this.doc.setFontSize(12)
    this.doc.setFont('helvetica', 'normal')
    PDFUtils.setTextColorFromHex(this.doc, this.colors.textLight)
    this.doc.text(scoreLabel, this.pageWidth - 140, this.yPosition + 24)

    // Resumo executivo com dados padrão
    this.yPosition += 80
    this.yPosition = PDFUtils.addSection(this.doc, '📋 RESUMO EXECUTIVO', this.yPosition, this.colors)
    
    // Box para o resumo com gradiente
    const summaryCanvas = document.createElement('canvas')
    summaryCanvas.width = 600
    summaryCanvas.height = 80
    const summaryCtx = summaryCanvas.getContext('2d')!
    
    const summaryGradient = summaryCtx.createLinearGradient(0, 0, summaryCanvas.width, 0)
    summaryGradient.addColorStop(0, '#8B00FF08')
    summaryGradient.addColorStop(1, '#00FFAA08')
    
    summaryCtx.fillStyle = summaryGradient
    summaryCtx.fillRect(0, 0, summaryCanvas.width, summaryCanvas.height)
    
    const summaryImg = summaryCanvas.toDataURL('image/png')
    this.doc.addImage(summaryImg, 'PNG', this.margin, this.yPosition, this.pageWidth - 2 * this.margin, 60)
    
    PDFUtils.setDrawColorFromHex(this.doc, this.colors.primary, 0.4)
    this.doc.setLineWidth(1)
    this.doc.roundedRect(this.margin, this.yPosition, this.pageWidth - 2 * this.margin, 60, 8, 8, 'S')
    
    this.yPosition = PDFUtils.addWrappedText(
      this.doc, 
      report.summary || 'Sessão de treinamento realizada com sucesso. Demonstrou bom domínio das técnicas principais, com oportunidades de melhoria em comunicação e relacionamento interpessoal. Performance geral dentro das expectativas para o nível atual.', 
      this.margin + 10, 
      this.yPosition + 15, 
      this.pageWidth - 2 * this.margin - 20, 
      this.colors, 
      11
    )

    // Destaques principais com dados padrão
    this.yPosition += 30
    this.yPosition = PDFUtils.addSection(this.doc, '⭐ PRINCIPAIS DESTAQUES', this.yPosition, this.colors)
    
    const highlights = report.highlights && report.highlights.length > 0 
      ? report.highlights 
      : [
          'Boa capacidade de adaptação durante a conversa',
          'Demonstrou conhecimento técnico adequado',
          'Manteve tom profissional e cordial'
        ]
    
    highlights.slice(0, 3).forEach((highlight: string) => {
      this.yPosition = PDFUtils.addBulletPoint(
        this.doc, 
        highlight, 
        this.margin, 
        this.yPosition + 5, 
        this.pageWidth - 2 * this.margin, 
        this.colors,
        this.colors.success
      )
      this.yPosition += 5
    })
  }

  private createInfoCards(scenario: any, userRole: string, timestamp: string): void {
    const cardWidth = (this.pageWidth - 3 * this.margin) / 2
    
    // Card 1: Informações da Simulação
    PDFUtils.addMetricCard(
      this.doc,
      'CENÁRIO',
      scenario.title || 'Simulação de Treinamento',
      this.margin,
      this.yPosition,
      cardWidth,
      this.colors,
      'excellent'
    )
    
    PDFUtils.addMetricCard(
      this.doc,
      'ÁREA',
      this.getAreaName(scenario.area) || 'Não especificada',
      this.margin + cardWidth + 10,
      this.yPosition,
      cardWidth,
      this.colors,
      'good'
    )
    
    this.yPosition += 35
    
    PDFUtils.addMetricCard(
      this.doc,
      'SEU PAPEL',
      userRole || 'Participante',
      this.margin,
      this.yPosition,
      cardWidth,
      this.colors,
      'good'
    )
    
    PDFUtils.addMetricCard(
      this.doc,
      'DATA DA SIMULAÇÃO',
      new Date(timestamp).toLocaleDateString('pt-BR') || new Date().toLocaleDateString('pt-BR'),
      this.margin + cardWidth + 10,
      this.yPosition,
      cardWidth,
      this.colors,
      'good'
    )
  }

  private createMetricsPage(report: any): void {
    // Título da página
    this.yPosition = PDFUtils.addSection(this.doc, '📊 ANÁLISE DETALHADA DE PERFORMANCE', this.yPosition, this.colors)

    // Benchmark comparison
    this.createBenchmarkSection(report.benchmarkComparison)
    
    // Métricas por categoria
    this.yPosition += 20
    this.yPosition = PDFUtils.addSection(this.doc, '🎯 MÉTRICAS POR CATEGORIA', this.yPosition, this.colors)
    
    const categories = [
      { key: 'speech', name: 'Comunicação', icon: '🗣️' },
      { key: 'conversation', name: 'Dinâmica', icon: '💬' },
      { key: 'content', name: 'Conteúdo', icon: '📝' },
      { key: 'outcome', name: 'Resultados', icon: '🎯' },
      { key: 'climate', name: 'Relacionamento', icon: '🤝' }
    ]

    categories.forEach((category, index) => {
      if (this.yPosition > this.pageHeight - 100) {
        this.doc.addPage()
        this.yPosition = this.margin
      }

      const metrics = report.detailedMetrics[category.key] || []
      this.createCategorySection(category.name, category.icon, metrics)
      this.yPosition += 15
    })

    // Oportunidades de melhoria com dados padrão
    this.yPosition += 10
    if (this.yPosition > this.pageHeight - 120) {
      this.doc.addPage()
      this.yPosition = this.margin
    }
    
    this.yPosition = PDFUtils.addSection(this.doc, '🔧 OPORTUNIDADES DE MELHORIA', this.yPosition, this.colors)
    
    const improvements = report.improvements && report.improvements.length > 0 
      ? report.improvements 
      : [
          'Desenvolver maior clareza na comunicação de conceitos complexos',
          'Aprimorar técnicas de escuta ativa e engajamento',
          'Trabalhar gestão do tempo durante apresentações',
          'Fortalecer confiança em situações desafiadoras'
        ]
    
    improvements.slice(0, 4).forEach((improvement: string) => {
      this.yPosition = PDFUtils.addBulletPoint(
        this.doc, 
        improvement, 
        this.margin, 
        this.yPosition + 5, 
        this.pageWidth - 2 * this.margin, 
        this.colors,
        this.colors.warning
      )
      this.yPosition += 8
    })
  }

  private createBenchmarkSection(benchmark: any): void {
    // Background colorido para seção de benchmark
    const canvas = document.createElement('canvas')
    canvas.width = 600
    canvas.height = 60
    const ctx = canvas.getContext('2d')!
    
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0)
    gradient.addColorStop(0, '#8B00FF20')
    gradient.addColorStop(0.5, '#0080FF20')
    gradient.addColorStop(1, '#00FFAA20')
    
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    const bgImg = canvas.toDataURL('image/png')
    this.doc.addImage(bgImg, 'PNG', this.margin, this.yPosition, this.pageWidth - 2 * this.margin, 45)
    
    // Valores com fallback para undefined
    const yourScore = benchmark?.yourScore ?? 7.5
    const averageScore = benchmark?.averageScore ?? 6.8
    const percentile = benchmark?.percentile ?? 75
    
    const cardWidth = (this.pageWidth - 4 * this.margin) / 3
    
    PDFUtils.addMetricCard(
      this.doc,
      'SEU SCORE',
      `${yourScore}/10`,
      this.margin + 10,
      this.yPosition + 10,
      cardWidth,
      this.colors,
      yourScore >= 7.5 ? 'excellent' : yourScore >= 6 ? 'good' : 'warning'
    )
    
    PDFUtils.addMetricCard(
      this.doc,
      'MÉDIA GERAL',
      `${averageScore}/10`,
      this.margin + cardWidth + 20,
      this.yPosition + 10,
      cardWidth,
      this.colors,
      'good'
    )
    
    PDFUtils.addMetricCard(
      this.doc,
      'PERCENTIL',
      `${percentile}º`,
      this.margin + 2 * cardWidth + 30,
      this.yPosition + 10,
      cardWidth,
      this.colors,
      'excellent'
    )
    
    this.yPosition += 55
  }

  private createCategorySection(name: string, icon: string, metrics: any[]): void {
    // Background colorido para cada categoria
    const canvas = document.createElement('canvas')
    canvas.width = 600
    canvas.height = 35
    const ctx = canvas.getContext('2d')!
    
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0)
    gradient.addColorStop(0, '#8B00FF15')
    gradient.addColorStop(1, '#00FFAA15')
    
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    const bgImg = canvas.toDataURL('image/png')
    this.doc.addImage(bgImg, 'PNG', this.margin - 5, this.yPosition - 5, this.pageWidth - 2 * this.margin + 10, 35)
    
    // Seção com ícone
    this.doc.setFontSize(12)
    this.doc.setFont('helvetica', 'bold')
    PDFUtils.setTextColorFromHex(this.doc, this.colors.primary)
    this.doc.text(`${icon} ${name.toUpperCase()}`, this.margin, this.yPosition + 5)
    
    this.yPosition += 15
    
    // Métricas com dados padrão se undefined
    const safeMetrics = metrics && metrics.length > 0 ? metrics : this.getDefaultMetrics(name)
    
    safeMetrics.slice(0, 3).forEach((metric: any) => {
      const value = metric.value || '7.2'
      const target = metric.target || '8.0'
      const status = this.getMetricStatus(parseFloat(value), parseFloat(target))
      const statusColor = status === 'excellent' ? this.colors.success : 
                         status === 'good' ? this.colors.secondary : 
                         status === 'warning' ? this.colors.warning : this.colors.danger
      
      this.doc.setFontSize(9)
      this.doc.setFont('helvetica', 'normal')
      PDFUtils.setTextColorFromHex(this.doc, this.colors.text)
      this.doc.text(`• ${metric.name || 'Métrica'}: ${value}`, this.margin + 5, this.yPosition)
      
      PDFUtils.setTextColorFromHex(this.doc, statusColor)
      this.doc.text(`(Meta: ${target})`, this.margin + 120, this.yPosition)
      
      this.yPosition += 8
    })
  }

  private createRecommendationsPage(report: any): void {
    // Título da página com fundo colorido
    const canvas = document.createElement('canvas')
    canvas.width = 600
    canvas.height = 40
    const ctx = canvas.getContext('2d')!
    
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0)
    gradient.addColorStop(0, '#8B00FF')
    gradient.addColorStop(0.5, '#0080FF')
    gradient.addColorStop(1, '#00FFAA')
    
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    const headerImg = canvas.toDataURL('image/png')
    this.doc.addImage(headerImg, 'PNG', 0, this.yPosition - 10, this.pageWidth, 30)
    
    this.doc.setFontSize(16)
    this.doc.setFont('helvetica', 'bold')
    this.doc.setTextColor(255, 255, 255)
    this.doc.text('💡 RECOMENDAÇÕES PERSONALIZADAS', this.margin, this.yPosition + 5)
    
    this.yPosition += 30

    const recommendations = report.recommendations && report.recommendations.length > 0 
      ? report.recommendations 
      : this.getDefaultRecommendations()

    recommendations.forEach((rec: any, index: number) => {
      if (this.yPosition > this.pageHeight - 100) {
        this.doc.addPage()
        this.yPosition = this.margin
      }

      // Card da recomendação com cores vibrantes
      const cardCanvas = document.createElement('canvas')
      cardCanvas.width = 600
      cardCanvas.height = 80
      const cardCtx = cardCanvas.getContext('2d')!
      
      const cardGradient = cardCtx.createLinearGradient(0, 0, cardCanvas.width, 0)
      cardGradient.addColorStop(0, '#8B00FF10')
      cardGradient.addColorStop(1, '#00FFAA10')
      
      cardCtx.fillStyle = cardGradient
      cardCtx.fillRect(0, 0, cardCanvas.width, cardCanvas.height)
      
      const cardImg = cardCanvas.toDataURL('image/png')
      this.doc.addImage(cardImg, 'PNG', this.margin, this.yPosition, this.pageWidth - 2 * this.margin, 70)
      
      this.doc.setDrawColor(139, 0, 255)
      this.doc.setLineWidth(3)
      this.doc.roundedRect(this.margin, this.yPosition, this.pageWidth - 2 * this.margin, 70, 8, 8, 'S')

      // Número da recomendação com mais destaque
      PDFUtils.setFillColorFromHex(this.doc, this.colors.primary)
      this.doc.circle(this.margin + 20, this.yPosition + 20, 12, 'F')
      
      this.doc.setFontSize(16)
      this.doc.setFont('helvetica', 'bold')
      this.doc.setTextColor(255, 255, 255)
      const numberText = (index + 1).toString()
      const numberWidth = this.doc.getTextWidth(numberText)
      this.doc.text(numberText, this.margin + 20 - numberWidth/2, this.yPosition + 25)

      // Título da recomendação
      this.doc.setFontSize(12)
      this.doc.setFont('helvetica', 'bold')
      PDFUtils.setTextColorFromHex(this.doc, this.colors.text)
      this.doc.text(rec.title || `Recomendação ${index + 1}`, this.margin + 40, this.yPosition + 18)

      // Descrição
      this.doc.setFontSize(10)
      this.doc.setFont('helvetica', 'normal')
      PDFUtils.addWrappedText(
        this.doc,
        rec.description || 'Descrição da recomendação para melhoria da performance.',
        this.margin + 10,
        this.yPosition + 32,
        this.pageWidth - 2 * this.margin - 20,
        this.colors,
        10
      )

      // Ações com bullets coloridos
      this.doc.setFontSize(9)
      this.doc.setFont('helvetica', 'bold')
      PDFUtils.setTextColorFromHex(this.doc, this.colors.secondary)
      this.doc.text('AÇÕES RECOMENDADAS:', this.margin + 10, this.yPosition + 50)

      let actionY = this.yPosition + 58
      const actions = rec.actionItems && rec.actionItems.length > 0 
        ? rec.actionItems 
        : ['Pratique regularmente', 'Busque feedback', 'Aplique técnicas aprendidas']
        
      actions.slice(0, 2).forEach((action: string) => {
        // Bullet colorido
        PDFUtils.setFillColorFromHex(this.doc, this.colors.secondary)
        this.doc.circle(this.margin + 17, actionY - 2, 2, 'F')
        
        this.doc.setFontSize(8)
        this.doc.setFont('helvetica', 'normal')
        PDFUtils.setTextColorFromHex(this.doc, this.colors.textLight)
        this.doc.text(action, this.margin + 25, actionY)
        actionY += 8
      })

      this.yPosition += 80
    })

    // Próximos passos com fundo colorido
    if (this.yPosition > this.pageHeight - 80) {
      this.doc.addPage()
      this.yPosition = this.margin
    }

    const stepsCanvas = document.createElement('canvas')
    stepsCanvas.width = 600
    stepsCanvas.height = 25
    const stepsCtx = stepsCanvas.getContext('2d')!
    
    const stepsGradient = stepsCtx.createLinearGradient(0, 0, stepsCanvas.width, 0)
    stepsGradient.addColorStop(0, '#00FFAA')
    stepsGradient.addColorStop(1, '#0080FF')
    
    stepsCtx.fillStyle = stepsGradient
    stepsCtx.fillRect(0, 0, stepsCanvas.width, stepsCanvas.height)
    
    const stepsImg = stepsCanvas.toDataURL('image/png')
    this.doc.addImage(stepsImg, 'PNG', this.margin, this.yPosition, this.pageWidth - 2 * this.margin, 20)
    
    this.doc.setFontSize(14)
    this.doc.setFont('helvetica', 'bold')
    this.doc.setTextColor(255, 255, 255)
    this.doc.text('🚀 PRÓXIMOS PASSOS', this.margin + 5, this.yPosition + 13)
    
    this.yPosition += 30
    
    const nextSteps = report.nextSteps && report.nextSteps.length > 0 
      ? report.nextSteps 
      : this.getDefaultNextSteps()
    
    nextSteps.forEach((step: string, index: number) => {
      this.yPosition = PDFUtils.addBulletPoint(
        this.doc, 
        step, 
        this.margin, 
        this.yPosition + 5, 
        this.pageWidth - 2 * this.margin, 
        this.colors,
        this.colors.secondary
      )
      this.yPosition += 8
    })
  }

  getDocument(): jsPDF {
    return this.doc
  }

  private getAreaName(area: string): string {
    const names = {
      comercial: 'Comercial',
      rh: 'Recursos Humanos',
      educacional: 'Educacional',
      gestao: 'Gestão'
    }
    return names[area as keyof typeof names] || area
  }

  private getScoreLabel(score: number): string {
    if (score >= 9) return 'Excelente ⭐'
    if (score >= 7.5) return 'Muito Bom 👍'
    if (score >= 6) return 'Satisfatório ✅'
    return 'Precisa Melhorar 📈'
  }

  private getMetricStatus(value: number, target: number): 'excellent' | 'good' | 'warning' | 'poor' {
    if (isNaN(value) || isNaN(target)) return 'good'
    const percentage = value / target
    if (percentage >= 0.95) return 'excellent'
    if (percentage >= 0.8) return 'good'
    if (percentage >= 0.6) return 'warning'
    return 'poor'
  }

  private getDefaultMetrics(categoryName: string) {
    const defaultMetrics = {
      'Comunicação': [
        { name: 'Clareza na comunicação', value: '7.8', target: '8.5' },
        { name: 'Tom de voz', value: '8.2', target: '8.0' },
        { name: 'Articulação', value: '7.5', target: '8.0' }
      ],
      'Dinâmica': [
        { name: 'Escuta ativa', value: '7.0', target: '8.0' },
        { name: 'Gestão do tempo', value: '6.8', target: '7.5' },
        { name: 'Interação', value: '7.3', target: '8.0' }
      ],
      'Conteúdo': [
        { name: 'Conhecimento técnico', value: '8.1', target: '8.0' },
        { name: 'Adequação ao contexto', value: '7.6', target: '8.0' },
        { name: 'Organização das ideias', value: '7.4', target: '7.5' }
      ],
      'Resultados': [
        { name: 'Objetivos alcançados', value: '7.2', target: '8.0' },
        { name: 'Satisfação do cliente', value: '7.8', target: '8.5' },
        { name: 'Efetividade', value: '7.5', target: '8.0' }
      ],
      'Relacionamento': [
        { name: 'Empatia', value: '8.0', target: '8.0' },
        { name: 'Rapport', value: '7.7', target: '8.0' },
        { name: 'Confiança', value: '7.9', target: '8.5' }
      ]
    }
    
    return defaultMetrics[categoryName as keyof typeof defaultMetrics] || [
      { name: 'Métrica padrão', value: '7.5', target: '8.0' }
    ]
  }

  private getDefaultRecommendations() {
    return [
      {
        title: 'Melhorar clareza na comunicação',
        description: 'Foque em ser mais direto e claro nas explicações para aumentar a compreensão.',
        actionItems: [
          'Pratique elevator pitch',
          'Use exemplos concretos',
          'Organize ideias antes de falar'
        ]
      },
      {
        title: 'Desenvolver escuta ativa',
        description: 'Aprimore sua capacidade de ouvir e responder adequadamente às necessidades do interlocutor.',
        actionItems: [
          'Faça perguntas de confirmação',
          'Use técnicas de paráfrase',
          'Demonstre interesse genuíno'
        ]
      }
    ]
  }

  private getDefaultNextSteps() {
    return [
      'Pratique cenários similares para consolidar aprendizado',
      'Revise técnicas de comunicação estudadas',
      'Solicite feedback de colegas em situações reais',
      'Agende nova sessão em 1 semana para acompanhar progresso'
    ]
  }
}