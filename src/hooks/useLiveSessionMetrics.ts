import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'

interface LiveSessionMetrics {
  total_sessions: number
  avg_score: number
  avg_duration_minutes: number
  completed_sessions: number
  recent_sessions: any[]
  criteria_breakdown: {
    criterion_key: string
    criterion_label: string
    avg_score: number
    evaluation_count: number
  }[]
}

export const useLiveSessionMetrics = (area: string) => {
  const [metrics, setMetrics] = useState<LiveSessionMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true)
        
        // Buscar sessões live dos últimos 30 dias
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
        
        const { data: recentSessions, error: sessionsError } = await supabase
          .from('sessions_live')
          .select('*')
          .eq('track', area)
          .gte('created_at', thirtyDaysAgo.toISOString())
          .order('created_at', { ascending: false })

        if (sessionsError) throw sessionsError

        // Calcular métricas básicas
        const totalSessions = recentSessions?.length || 0
        const completedSessions = recentSessions?.filter(s => s.completed_at !== null) || []
        
        // Calcular scores das sessões que têm overall_score no metadata
        const sessionsWithScores = recentSessions?.filter(s => {
          const metadata = s.metadata as any
          return metadata?.overall_score !== undefined || s.score_overall !== null
        }) || []
        
        const avgScore = sessionsWithScores.length > 0 
          ? sessionsWithScores.reduce((sum, session) => {
              const metadata = session.metadata as any
              const score = session.score_overall || metadata?.overall_score
              return sum + (score || 0)
            }, 0) / sessionsWithScores.length
          : 0

        // Calcular duração média em minutos
        const sessionsWithDuration = recentSessions?.filter(s => s.duration_ms > 0) || []
        const avgDurationMinutes = sessionsWithDuration.length > 0
          ? sessionsWithDuration.reduce((sum, session) => sum + session.duration_ms, 0) / 
            (sessionsWithDuration.length * 60000) // converter ms para minutos
          : 0

        // Análise por critério baseada nos metadados das sessões
        const criteriaMap = new Map<string, { sum: number, count: number, label: string }>()
        
        sessionsWithScores.forEach(session => {
          const metadata = session.metadata as any
          const scores = metadata?.scores || {}
          const criteria = metadata?.criteria || []
          
          Object.entries(scores).forEach(([key, score]) => {
            const criterion = criteria.find((c: any) => c.key === key)
            if (criterion) {
              if (!criteriaMap.has(key)) {
                criteriaMap.set(key, { sum: 0, count: 0, label: criterion.label })
              }
              const existing = criteriaMap.get(key)!
              existing.sum += Number(score)
              existing.count += 1
            }
          })
        })

        const criteriaBreakdown = Array.from(criteriaMap.entries()).map(([key, data]) => ({
          criterion_key: key,
          criterion_label: data.label,
          avg_score: data.count > 0 ? Math.round((data.sum / data.count) * 100) / 100 : 0,
          evaluation_count: data.count
        }))

        setMetrics({
          total_sessions: totalSessions,
          avg_score: Math.round(avgScore * 100) / 100,
          avg_duration_minutes: Math.round(avgDurationMinutes * 100) / 100,
          completed_sessions: completedSessions.length,
          recent_sessions: recentSessions?.slice(0, 10) || [],
          criteria_breakdown: criteriaBreakdown
        })

      } catch (err) {
        console.error('Erro ao buscar métricas de sessões live:', err)
        setError(err instanceof Error ? err.message : 'Erro desconhecido')
      } finally {
        setLoading(false)
      }
    }

    if (area) {
      fetchMetrics()
    }
  }, [area])

  return { metrics, loading, error, refetch: () => setLoading(true) }
}

// Hook para métricas de performance específicas
export const useLiveSessionPerformance = (area: string) => {
  const [performance, setPerformance] = useState({
    conversionRate: 0,
    avgCallDuration: '0 min',
    scenarioCompletionRate: 0,
    improvementTrend: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        const { data: sessions } = await supabase
          .from('sessions_live')
          .select('*')
          .eq('track', area)
          .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())

        if (sessions) {
          const totalSessions = sessions.length
          const completedSessions = sessions.filter(s => s.completed_at).length
          const averageDuration = sessions
            .filter(s => s.duration_ms > 0)
            .reduce((sum, s) => sum + s.duration_ms, 0) / 
            (sessions.filter(s => s.duration_ms > 0).length || 1)

          // Calcular taxa de conversão baseada em sessões que têm score alto
          const highScoreSessions = sessions.filter(s => {
            const metadata = s.metadata as any
            const score = s.score_overall || metadata?.overall_score
            return score && score >= 7
          }).length

          setPerformance({
            conversionRate: totalSessions > 0 ? Math.round((highScoreSessions / totalSessions) * 100) : 0,
            avgCallDuration: `${Math.round(averageDuration / 60000)} min`,
            scenarioCompletionRate: totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0,
            improvementTrend: Math.floor(Math.random() * 20) - 10 // Placeholder - implementar cálculo real
          })
        }
      } catch (error) {
        console.error('Erro ao calcular performance:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPerformance()
  }, [area])

  return { performance, loading }
}