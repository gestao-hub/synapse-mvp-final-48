import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, Users, Target, Award, BarChart3, Flame } from 'lucide-react'
import { useRealMetrics } from '@/hooks/useRealMetrics'
import { Skeleton } from '@/components/ui/skeleton'

interface RealBenchmarkDashboardProps {
  area: string
}

export function RealBenchmarkDashboard({ area }: RealBenchmarkDashboardProps) {
  const { metrics, loading, error, refreshMetrics } = useRealMetrics(area)

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="p-6">
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-24" />
            </Card>
          ))}
        </div>
        <Skeleton className="h-48 w-full" />
      </div>
    )
  }

  if (error || !metrics) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <p className="text-muted-foreground">Erro ao carregar métricas</p>
          <button onClick={refreshMetrics} className="text-primary text-sm mt-2">
            Tentar novamente
          </button>
        </div>
      </Card>
    )
  }

  const getPerformanceLevel = (percentile: number) => {
    if (percentile >= 90) return { label: 'Top 10%', color: 'text-green-500', bgColor: 'bg-green-500/10' }
    if (percentile >= 75) return { label: 'Top 25%', color: 'text-blue-500', bgColor: 'bg-blue-500/10' }
    if (percentile >= 50) return { label: 'Acima da Média', color: 'text-orange-500', bgColor: 'bg-orange-500/10' }
    return { label: 'Abaixo da Média', color: 'text-red-500', bgColor: 'bg-red-500/10' }
  }

  const performance = getPerformanceLevel(metrics.percentile)

  const getAreaLabel = (area: string) => {
    const labels: Record<string, string> = {
      comercial: 'área comercial',
      rh: 'área de RH',
      educacional: 'área educacional',
      gestao: 'área de gestão'
    }
    return labels[area] || area
  }

  return (
    <div className="space-y-6">
      {/* KPIs Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Target className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Seu Score</p>
              <p className="text-2xl font-bold">{metrics.yourScore}/10</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-secondary/10 rounded-lg">
              <Users className="h-5 w-5 text-secondary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Média da Indústria</p>
              <p className="text-2xl font-bold">{metrics.industryAverage}/10</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500/10 rounded-lg">
              <Award className="h-5 w-5 text-yellow-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Top Performers</p>
              <p className="text-2xl font-bold">{metrics.topPerformers}/10</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Melhoria (30d)</p>
              <p className="text-2xl font-bold">
                {metrics.improvement > 0 ? '+' : ''}{metrics.improvement}%
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Posição no Percentil */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Posição no Percentil</h3>
            <Badge className={`${performance.color} ${performance.bgColor}`}>
              {performance.label}
            </Badge>
          </div>
          
          <p className="text-sm text-muted-foreground">
            Seu percentil na {getAreaLabel(area)}
          </p>
          
          <div className="space-y-2">
            <Progress value={metrics.percentile} className="h-3" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0º percentil</span>
              <span>50º percentil</span>
              <span>100º percentil</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Estatísticas Adicionais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <BarChart3 className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total de Simulações</p>
              <p className="text-2xl font-bold">{metrics.totalSessions}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <Flame className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Sequência Atual</p>
              <p className="text-2xl font-bold">{metrics.streak} dias</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500/10 rounded-lg">
              <TrendingUp className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Este Mês</p>
              <p className="text-2xl font-bold">{metrics.sessionsThisMonth}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Pontos Fortes e Fracos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-green-600">Ponto Mais Forte</h3>
          <div className="text-center">
            <div className="p-4 bg-green-500/10 rounded-lg mb-3">
              <Award className="h-8 w-8 text-green-500 mx-auto" />
            </div>
            <p className="font-medium">{metrics.strongestSkill}</p>
            <p className="text-sm text-muted-foreground">Continue focando nesta competência!</p>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-orange-600">Área de Melhoria</h3>
          <div className="text-center">
            <div className="p-4 bg-orange-500/10 rounded-lg mb-3">
              <Target className="h-8 w-8 text-orange-500 mx-auto" />
            </div>
            <p className="font-medium">{metrics.weakestSkill}</p>
            <p className="text-sm text-muted-foreground">Foque mais simulações nesta área</p>
          </div>
        </Card>
      </div>
    </div>
  )
}