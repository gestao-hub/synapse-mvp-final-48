import jsPDF from 'jspdf'

export interface PDFColors {
  primary: string
  secondary: string
  accent: string
  success: string
  warning: string
  danger: string
  text: string
  textLight: string
}

export const synapseColors: PDFColors = {
  primary: '#8B00FF', // Electric Purple
  secondary: '#00FFAA', // Spring Green
  accent: '#0080FF', // Cyber Blue
  success: '#00CC66',
  warning: '#FF8800',
  danger: '#FF4444',
  text: '#1A1A1A',
  textLight: '#666666'
}

export class PDFUtils {
  static addGradientBackground(doc: jsPDF, startColor: string, endColor: string, height: number = 40): void {
    const canvas = document.createElement('canvas')
    canvas.width = 600
    canvas.height = height
    const ctx = canvas.getContext('2d')!
    
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0)
    gradient.addColorStop(0, startColor)
    gradient.addColorStop(1, endColor)
    
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    const imgData = canvas.toDataURL('image/png')
    doc.addImage(imgData, 'PNG', 0, 0, doc.internal.pageSize.width, height)
  }

  static addSection(doc: jsPDF, title: string, yPosition: number, colors: PDFColors): number {
    // Background colorido para a seção
    const [r, g, b] = this.hexToRgb(colors.primary + '20')
    doc.setFillColor(r, g, b)
    doc.roundedRect(15, yPosition - 5, doc.internal.pageSize.width - 30, 15, 3, 3, 'F')
    
    // Texto do título
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    this.setTextColorFromHex(doc, colors.primary)
    doc.text(title, 20, yPosition + 5)
    
    // Linha decorativa com gradiente simulado
    const startX = 20
    const endX = doc.internal.pageSize.width - 20
    const lineY = yPosition + 8
    
    // Múltiplas linhas com opacidade decrescente para simular gradiente
    for (let i = 0; i < 3; i++) {
      const opacity = 1 - (i * 0.3)
      this.setDrawColorFromHex(doc, colors.primary, opacity)
      doc.setLineWidth(0.8 - (i * 0.2))
      doc.line(startX, lineY + i * 0.3, endX, lineY + i * 0.3)
    }
    
    return yPosition + 20
  }

  static addMetricCard(
    doc: jsPDF, 
    title: string, 
    value: string, 
    x: number, 
    y: number, 
    width: number, 
    colors: PDFColors,
    status: 'excellent' | 'good' | 'warning' | 'poor' = 'good'
  ): void {
    const statusColors = {
      excellent: colors.success,
      good: colors.secondary,
      warning: colors.warning,
      poor: colors.danger
    }
    
    // Card background
    doc.setFillColor(255, 255, 255)
    doc.roundedRect(x, y, width, 25, 5, 5, 'F')
    
    // Card border
    this.setDrawColorFromHex(doc, statusColors[status])
    doc.setLineWidth(2)
    doc.roundedRect(x, y, width, 25, 5, 5, 'S')
    
    // Status indicator
    this.setFillColorFromHex(doc, statusColors[status])
    doc.circle(x + 8, y + 12.5, 3, 'F')
    
    // Title
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    this.setTextColorFromHex(doc, colors.textLight)
    doc.text(title, x + 15, y + 8)
    
    // Value
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    this.setTextColorFromHex(doc, colors.text)
    doc.text(value, x + 15, y + 18)
  }

  static addScoreCircle(
    doc: jsPDF, 
    score: number, 
    x: number, 
    y: number, 
    radius: number, 
    colors: PDFColors
  ): void {
    const percentage = score / 10
    const color = score >= 7.5 ? colors.success : score >= 6 ? colors.warning : colors.danger
    
    // Background circle
    doc.setFillColor(240, 240, 240)
    doc.circle(x, y, radius, 'F')
    
    // Progress arc (simplified as multiple small arcs)
    const segments = Math.floor(percentage * 20)
    for (let i = 0; i < segments; i++) {
      const angle = (i / 20) * 2 * Math.PI - Math.PI / 2
      const x1 = x + Math.cos(angle) * (radius - 3)
      const y1 = y + Math.sin(angle) * (radius - 3)
      const x2 = x + Math.cos(angle) * radius
      const y2 = y + Math.sin(angle) * radius
      
      this.setDrawColorFromHex(doc, color)
      doc.setLineWidth(6)
      doc.line(x1, y1, x2, y2)
    }
    
    // Score text
    doc.setFontSize(24)
    doc.setFont('helvetica', 'bold')
    this.setTextColorFromHex(doc, colors.text)
    const text = score.toString()
    const textWidth = doc.getTextWidth(text)
    doc.text(text, x - textWidth / 2, y + 3)
    
    // "/10" text
    doc.setFontSize(12)
    this.setTextColorFromHex(doc, colors.textLight)
    doc.text('/10', x + textWidth / 2 + 2, y + 3)
  }

  static addWrappedText(
    doc: jsPDF,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    colors: PDFColors,
    fontSize: number = 10
  ): number {
    doc.setFontSize(fontSize)
    doc.setFont('helvetica', 'normal')
    this.setTextColorFromHex(doc, colors.text)
    
    const lines = doc.splitTextToSize(text, maxWidth)
    doc.text(lines, x, y)
    return y + (lines.length * (fontSize * 0.6))
  }

  static addBulletPoint(
    doc: jsPDF,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    colors: PDFColors,
    bulletColor: string = colors.primary
  ): number {
    // Bullet
    this.setFillColorFromHex(doc, bulletColor)
    doc.circle(x + 3, y - 2, 2, 'F')
    
    // Text
    return this.addWrappedText(doc, text, x + 10, y, maxWidth - 10, colors, 10)
  }

  static hexToRgb(hex: string, alpha: number = 1): [number, number, number] {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.split('0')[0] || hex)
    if (!result) return [0, 0, 0]
    
    const r = parseInt(result[1], 16)
    const g = parseInt(result[2], 16)
    const b = parseInt(result[3], 16)
    
    return [Math.floor(r * alpha), Math.floor(g * alpha), Math.floor(b * alpha)]
  }

  static setTextColorFromHex(doc: jsPDF, hex: string, alpha: number = 1): void {
    const [r, g, b] = this.hexToRgb(hex, alpha)
    doc.setTextColor(r, g, b)
  }

  static setFillColorFromHex(doc: jsPDF, hex: string, alpha: number = 1): void {
    const [r, g, b] = this.hexToRgb(hex, alpha)
    doc.setFillColor(r, g, b)
  }

  static setDrawColorFromHex(doc: jsPDF, hex: string, alpha: number = 1): void {
    const [r, g, b] = this.hexToRgb(hex, alpha)
    doc.setDrawColor(r, g, b)
  }

  static addPageNumbers(doc: jsPDF, colors: PDFColors): void {
    const totalPages = doc.getNumberOfPages()
    
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i)
      
      // Footer background
      const pageHeight = doc.internal.pageSize.height
      const [r, g, b] = this.hexToRgb(colors.primary + '10')
      doc.setFillColor(r, g, b)
      doc.rect(0, pageHeight - 20, doc.internal.pageSize.width, 20, 'F')
      
      // Page number
      doc.setFontSize(9)
      doc.setFont('helvetica', 'normal')
      this.setTextColorFromHex(doc, colors.textLight)
      
      const pageText = `Página ${i} de ${totalPages}`
      const textWidth = doc.getTextWidth(pageText)
      doc.text(pageText, doc.internal.pageSize.width - textWidth - 15, pageHeight - 8)
      
      // Synapse branding
      doc.text('Gerado por Synapse IA', 15, pageHeight - 8)
      
      // Current date
      const dateText = new Date().toLocaleDateString('pt-BR')
      const dateWidth = doc.getTextWidth(dateText)
      doc.text(dateText, (doc.internal.pageSize.width - dateWidth) / 2, pageHeight - 8)
    }
  }
}