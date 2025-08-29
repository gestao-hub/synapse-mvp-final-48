import jsPDF from 'jspdf'
import { PDFTemplate, ReportData } from './PDFTemplate'

interface ExportData {
  report: any
  metrics: any
  scenario: any
  userRole: string
  timestamp: string
}

export class PDFExporter {
  static async exportReport(data: ExportData): Promise<void> {
    try {
      const template = new PDFTemplate()
      
      const reportData: ReportData = {
        report: data.report,
        metrics: data.metrics,
        scenario: data.scenario,
        userRole: data.userRole,
        timestamp: data.timestamp
      }
      
      await template.generateReport(reportData)
      
      const doc = template.getDocument()
      const fileName = `Synapse_${data.scenario.area}_${data.scenario.title.replace(/\s+/g, '_')}_${data.timestamp}.pdf`
      
      doc.save(fileName)
    } catch (error) {
      console.error('Erro ao gerar PDF:', error)
      throw new Error('Falha na geração do relatório PDF')
    }
  }

  // Manter compatibilidade com código legado
  private static getAreaName(area: string): string {
    const names = {
      comercial: 'Comercial',
      rh: 'Recursos Humanos', 
      educacional: 'Educacional',
      gestao: 'Gestão'
    }
    return names[area as keyof typeof names] || area
  }

  private static getScoreColor(score: number): [number, number, number] {
    if (score >= 9) return [0, 153, 51] // Verde escuro
    if (score >= 7.5) return [0, 204, 102] // Verde
    if (score >= 6) return [255, 153, 0] // Laranja
    return [204, 51, 51] // Vermelho
  }

  private static getScoreLabel(score: number): string {
    if (score >= 9) return 'Excelente'
    if (score >= 7.5) return 'Bom'
    if (score >= 6) return 'Satisfatório'
    return 'Precisa Melhorar'
  }

  private static getStatusColor(status: string): [number, number, number] {
    switch (status) {
      case 'excellent': return [0, 153, 51]
      case 'good': return [0, 204, 102]
      case 'warning': return [255, 153, 0]
      case 'poor': return [204, 51, 51]
      default: return [128, 128, 128]
    }
  }

  private static getStatusLabel(status: string): string {
    switch (status) {
      case 'excellent': return 'Excelente'
      case 'good': return 'Bom'
      case 'warning': return 'Atenção'
      case 'poor': return 'Crítico'
      default: return 'N/A'
    }
  }
}