import React, { useState, useMemo, Suspense } from 'react'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'
import { LoadingCard } from '@/components/common/LoadingSpinner'
import { AdvancedFilters, FilterOptions } from '@/components/filters/AdvancedFilters'
import { TrendAnalysis } from '@/components/analytics/TrendAnalysis'
import { DataExporter } from '@/components/export/DataExporter'
import { ScoreTooltip, PercentileTooltip, CompletionRateTooltip } from '@/components/common/Tooltip'
import { useDashboardData } from '@/hooks/useDashboardData'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { format, isAfter, subDays, subMonths, isValid } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Clock, Target, TrendingUp, Calendar, BarChart } from 'lucide-react'

export default function Historico() {
  const { recentSessions: sessions, isLoading: loading } = useDashboardData()
  
  const [filters, setFilters] = useState<FilterOptions>({
    period: 'all',
    area: 'all',
    minScore: null,
    maxScore: null,
    sessionType: 'all'
  })

  const resetFilters = () => {
    setFilters({
      period: 'all',
      area: 'all', 
      minScore: null,
      maxScore: null,
      sessionType: 'all'
    })
  }

  // Filtrar sessões baseado nos filtros
  const filteredSessions = useMemo(() => {
    let filtered = [...sessions]

    // Filtro por período
    if (filters.period !== 'all') {
      const now = new Date()
      let startDate: Date
      
      switch (filters.period) {
        case '7d':
          startDate = subDays(now, 7)
          break
        case '30d':
          startDate = subDays(now, 30)
          break
        case '3m':
          startDate = subMonths(now, 3)
          break
        case '6m':
          startDate = subMonths(now, 6)
          break
        case '1y':
          startDate = subMonths(now, 12)
          break
        default:
          startDate = subDays(now, 30)
      }
      
      filtered = filtered.filter(session => {
        const sessionDate = new Date(session.created_at)
        return isAfter(sessionDate, startDate)
      })
    }

    // Filtro por área
    if (filters.area !== 'all') {
      filtered = filtered.filter(session => session.track === filters.area)
    }

    // Filtro por score mínimo
    if (filters.minScore !== null) {
      filtered = filtered.filter(session => {
        const score = (session as any).score || (session as any).metadata?.analyzed_score || 0
        return score >= filters.minScore!
      })
    }

    // Filtro por score máximo
    if (filters.maxScore !== null) {
      filtered = filtered.filter(session => {
        const score = (session as any).score || (session as any).metadata?.analyzed_score || 0
        return score <= filters.maxScore!
      })
    }

    // Filtro por tipo de sessão
    if (filters.sessionType !== 'all') {
      if (filters.sessionType === 'regular') {
        filtered = filtered.filter(session => 'scenario' in session)
      } else if (filters.sessionType === 'live') {
        filtered = filtered.filter(session => !('scenario' in session))
      }
    }

    return filtered
  }, [sessions, filters])

  // Calcular estatísticas baseadas nos dados reais das sessões filtradas
  const stats = useMemo(() => {
    if (filteredSessions.length === 0) {
      return {
        totalSessions: 0,
        averageScore: 0,
        completionRate: 0,
        totalDuration: 0,
        bestScore: 0,
        mostUsedArea: 'N/A',
        recentTrend: 0
      }
    }

    // Sessões com score válido
    const sessionsWithScore = filteredSessions.filter(session => {
      const score = (session as any).score || (session as any).metadata?.analyzed_score
      return score && score > 0
    })

    const totalSessions = filteredSessions.length
    const averageScore = sessionsWithScore.length > 0 
      ? sessionsWithScore.reduce((sum, session) => {
          const score = (session as any).score || (session as any).metadata?.analyzed_score || 0
          return sum + score
        }, 0) / sessionsWithScore.length
      : 0

    // Taxa de conclusão (assumindo que sessões com score foram concluídas)
    const completionRate = totalSessions > 0 ? (sessionsWithScore.length / totalSessions) * 100 : 0

    // Duração total estimada
    const totalDuration = filteredSessions.reduce((sum, session) => {
      if ('finished_at' in session && session.finished_at && session.started_at) {
        return sum + Math.round((new Date(session.finished_at).getTime() - new Date(session.started_at).getTime()) / 60000)
      } else if ('duration_ms' in session) {
        return sum + Math.round((session as any).duration_ms / 60000)
      }
      return sum + 15 // Estimativa padrão de 15 minutos
    }, 0)

    // Melhor score
    const bestScore = sessionsWithScore.length > 0 
      ? Math.max(...sessionsWithScore.map(session => 
          (session as any).score || (session as any).metadata?.analyzed_score || 0
        ))
      : 0

    // Área mais utilizada
    const areaCounts = filteredSessions.reduce((acc, session) => {
      acc[session.track] = (acc[session.track] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    const mostUsedArea = Object.keys(areaCounts).length > 0 
      ? Object.entries(areaCounts).reduce((a, b) => a[1] > b[1] ? a : b)[0]
      : 'N/A'

    // Tendência recente (últimas 5 sessões vs 5 anteriores)
    const recent5 = sessionsWithScore.slice(0, 5)
    const previous5 = sessionsWithScore.slice(5, 10)
    
    const recentAvg = recent5.length > 0 
      ? recent5.reduce((sum, s) => sum + ((s as any).score || (s as any).metadata?.analyzed_score || 0), 0) / recent5.length
      : 0
    const previousAvg = previous5.length > 0 
      ? previous5.reduce((sum, s) => sum + ((s as any).score || (s as any).metadata?.analyzed_score || 0), 0) / previous5.length
      : 0
    
    const recentTrend = previousAvg > 0 ? ((recentAvg - previousAvg) / previousAvg) * 100 : 0

    return {
      totalSessions,
      averageScore: Number(averageScore.toFixed(1)),
      completionRate: Number(completionRate.toFixed(1)),
      totalDuration,
      bestScore: Number(bestScore.toFixed(1)),
      mostUsedArea,
      recentTrend: Number(recentTrend.toFixed(1))
    }
  }, [filteredSessions])

  if (loading) {
    return <LoadingCard message="Carregando histórico..." />
  }

  return (
    <ErrorBoundary>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Histórico de Sessões</h1>
          <Badge variant="secondary">
            {filteredSessions.length} sessão(ões)
          </Badge>
        </div>

        {/* Filtros Avançados */}
        <AdvancedFilters 
          filters={filters}
          onFiltersChange={setFilters}
          onReset={resetFilters}
        />

        {/* Estatísticas Resumidas */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Sessões</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalSessions}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-1">
                Score Médio
                <ScoreTooltip />
              </CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageScore}/10</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-1">
                Taxa de Conclusão
                <CompletionRateTooltip />
              </CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completionRate}%</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tempo Total</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(stats.totalDuration / 60)}h</div>
              <p className="text-xs text-muted-foreground">{stats.totalDuration} min</p>
            </CardContent>
          </Card>
        </div>

        {/* Análise de Tendências e Exportação */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ErrorBoundary>
              <Suspense fallback={<LoadingCard message="Carregando análise de tendências..." />}>
                <TrendAnalysis sessions={filteredSessions} area={filters.area !== 'all' ? filters.area : undefined} />
              </Suspense>
            </ErrorBoundary>
          </div>
          
          <div>
            <ErrorBoundary>
              <DataExporter area={filters.area !== 'all' ? filters.area : undefined} />
            </ErrorBoundary>
          </div>
        </div>

        {/* Lista Detalhada de Sessões */}
        <Card>
          <CardHeader>
            <CardTitle>Sessões Detalhadas</CardTitle>
            <CardDescription>
              {filteredSessions.length === 0 
                ? 'Nenhuma sessão encontrada com os filtros aplicados'
                : `${filteredSessions.length} sessão(ões) encontrada(s)`
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredSessions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma sessão encontrada</p>
                <p className="text-sm">Tente ajustar os filtros ou realizar mais simulações</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredSessions.slice(0, 20).map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="capitalize">
                          {session.track}
                        </Badge>
                        <Badge variant={('scenario' in session) ? 'default' : 'secondary'}>
                          {('scenario' in session) ? 'Regular' : 'Live'}
                        </Badge>
                      </div>
                      <p className="font-medium">
                        {('scenario' in session) ? session.scenario : 'Sessão Live'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(session.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">
                        {(session as any).score || (session as any).metadata?.analyzed_score || 'N/A'}
                        {((session as any).score || (session as any).metadata?.analyzed_score) && '/10'}
                      </div>
                      {stats.recentTrend !== 0 && (
                        <div className={`text-sm flex items-center gap-1 ${
                          stats.recentTrend > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          <TrendingUp className={`w-3 h-3 ${stats.recentTrend < 0 ? 'rotate-180' : ''}`} />
                          {Math.abs(stats.recentTrend)}%
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {filteredSessions.length > 20 && (
                  <div className="text-center py-4 text-muted-foreground">
                    <p>Mostrando 20 de {filteredSessions.length} sessões</p>
                    <p className="text-sm">Use os filtros para refinar os resultados</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ErrorBoundary>
  )
}