import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Download, FileText, BarChart3, Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/integrations/supabase/client'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface DataExporterProps {
  area?: string
}

export function DataExporter({ area }: DataExporterProps) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const exportToCSV = async (type: 'sessions' | 'analytics') => {
    try {
      setLoading(true)
      
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) throw new Error('Usuário não autenticado')

      let data: any[] = []
      let filename = ''
      let headers: string[] = []

      if (type === 'sessions') {
        // Exportar sessões regulares
        const { data: regularSessions } = await supabase
          .from('sessions')
          .select('*')
          .eq('user_id', user.user.id)
          .order('created_at', { ascending: false })

        // Exportar sessões live
        const { data: liveSessions } = await supabase
          .from('sessions_live')
          .select('*')
          .eq('user_id', user.user.id)
          .order('created_at', { ascending: false })

        // Combinar e formatar dados
        const allSessions = [
          ...(regularSessions || []).map(s => ({
            id: s.id,
            tipo: 'Regular',
            area: s.track,
            cenario: s.scenario,
            score: s.score || 'N/A',
            duracao_min: s.finished_at && s.started_at 
              ? Math.round((new Date(s.finished_at).getTime() - new Date(s.started_at).getTime()) / 60000)
              : 'N/A',
            data_criacao: format(new Date(s.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR }),
            data_inicio: format(new Date(s.started_at), 'dd/MM/yyyy HH:mm', { locale: ptBR }),
            data_fim: s.finished_at ? format(new Date(s.finished_at), 'dd/MM/yyyy HH:mm', { locale: ptBR }) : 'N/A'
          })),
          ...(liveSessions || []).map(s => ({
            id: s.id,
            tipo: 'Live',
            area: s.track,
            cenario: 'Sessão Live',
            score: (s.metadata as any)?.analyzed_score || 'N/A',
            duracao_min: Math.round(s.duration_ms / 60000),
            data_criacao: format(new Date(s.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR }),
            data_inicio: format(new Date(s.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR }),
            data_fim: format(new Date(s.updated_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })
          }))
        ]

        data = area ? allSessions.filter(s => s.area === area) : allSessions
        headers = ['ID', 'Tipo', 'Área', 'Cenário', 'Score', 'Duração (min)', 'Data Criação', 'Data Início', 'Data Fim']
        filename = `sessoes_${area || 'todas'}_${format(new Date(), 'yyyy-MM-dd')}.csv`

      } else {
        // Exportar dados analíticos
        const { data: sessions } = await supabase
          .from('sessions')
          .select('track, score, created_at')
          .eq('user_id', user.user.id)
          .not('score', 'is', null)

        const { data: liveSessions } = await supabase
          .from('sessions_live')
          .select('track, metadata, created_at')
          .eq('user_id', user.user.id)

        // Processar dados analíticos
        const analytics = [
          ...(sessions || []).map(s => ({
            area: s.track,
            score: s.score || 0,
            mes: format(new Date(s.created_at), 'MM/yyyy', { locale: ptBR }),
            data: format(new Date(s.created_at), 'dd/MM/yyyy', { locale: ptBR })
          })),
          ...(liveSessions || []).map(s => ({
            area: s.track,
            score: (s.metadata as any)?.analyzed_score || 0,
            mes: format(new Date(s.created_at), 'MM/yyyy', { locale: ptBR }),
            data: format(new Date(s.created_at), 'dd/MM/yyyy', { locale: ptBR })
          }))
        ]

        data = area ? analytics.filter(a => a.area === area) : analytics
        headers = ['Área', 'Score', 'Mês', 'Data']
        filename = `analytics_${area || 'todas'}_${format(new Date(), 'yyyy-MM-dd')}.csv`
      }

      if (data.length === 0) {
        toast({
          title: "Sem dados",
          description: "Não há dados para exportar no período selecionado.",
          variant: "default"
        })
        return
      }

      // Converter para CSV
      const csvContent = [
        headers.join(','),
        ...data.map(row => 
          headers.map(header => {
            const key = header.toLowerCase().replace(/[^a-z0-9]/g, '_')
            const value = row[key] || row[Object.keys(row).find(k => 
              k.toLowerCase().replace(/[^a-z0-9]/g, '_') === key
            )] || ''
            return `"${String(value).replace(/"/g, '""')}"`
          }).join(',')
        )
      ].join('\n')

      // Download do arquivo
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', filename)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: "Exportação concluída",
        description: `Arquivo ${filename} baixado com sucesso!`,
        variant: "default"
      })

    } catch (error) {
      console.error('Erro ao exportar dados:', error)
      toast({
        title: "Erro na exportação",
        description: "Não foi possível exportar os dados. Tente novamente.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="w-5 h-5" />
          Exportar Dados
        </CardTitle>
        <CardDescription>
          Baixe seus dados em formato CSV para análise externa
          {area && (
            <Badge variant="secondary" className="ml-2 capitalize">
              {area}
            </Badge>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2">
          <Button
            variant="outline"
            onClick={() => exportToCSV('sessions')}
            disabled={loading}
            className="justify-start"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <FileText className="w-4 h-4 mr-2" />
            )}
            Exportar Sessões
          </Button>
          
          <Button
            variant="outline"
            onClick={() => exportToCSV('analytics')}
            disabled={loading}
            className="justify-start"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <BarChart3 className="w-4 h-4 mr-2" />
            )}
            Exportar Analytics
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}