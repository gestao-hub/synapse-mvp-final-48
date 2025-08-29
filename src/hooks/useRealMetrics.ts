import { useState, useEffect } from 'react'
import { useToast } from '@/hooks/use-toast'
import { calculateRealMetrics, RealMetrics, AreaSpecificMetrics } from '@/lib/realMetrics'

export function useRealMetrics(area: string) {
  const [metrics, setMetrics] = useState<(RealMetrics & AreaSpecificMetrics) | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const loadMetrics = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const realMetrics = await calculateRealMetrics(area)
      setMetrics(realMetrics)
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar métricas'
      setError(errorMessage)
      console.error('Erro ao calcular métricas:', err)
      
      toast({
        title: "Erro",
        description: "Não foi possível carregar as métricas. Usando dados padrão.",
        variant: "destructive"
      })
      
      // Fallback para métricas padrão
      setMetrics({
        yourScore: 0,
        industryAverage: 6.5,
        topPerformers: 9.0,
        percentile: 50,
        improvement: 0,
        totalSessions: 0,
        averageScore: 0,
        lastWeekImprovement: 0,
        completionRate: 0,
        averageDuration: 0,
        strongestSkill: 'N/A',
        weakestSkill: 'N/A',
        sessionsThisMonth: 0,
        streak: 0
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMetrics()
  }, [area])

  const refreshMetrics = () => {
    loadMetrics()
  }

  return {
    metrics,
    loading,
    error,
    refreshMetrics
  }
}