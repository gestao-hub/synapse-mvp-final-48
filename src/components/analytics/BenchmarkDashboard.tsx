import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { TrendingUp, Users, Target, Award } from 'lucide-react'

interface BenchmarkData {
  yourScore: number
  industryAverage: number
  topPerformers: number
  percentile: number
  improvement: number
}

interface BenchmarkDashboardProps {
  data: BenchmarkData
  area: string
}

export function BenchmarkDashboard({ data, area }: BenchmarkDashboardProps) {
  const getPerformanceLevel = (percentile: number) => {
    if (percentile >= 90) return { label: 'Top 10%', color: 'text-green-500' }
    if (percentile >= 75) return { label: 'Top 25%', color: 'text-blue-500' }
    if (percentile >= 50) return { label: 'Acima da Média', color: 'text-orange-500' }
    return { label: 'Abaixo da Média', color: 'text-red-500' }
  }

  const performance = getPerformanceLevel(data.percentile)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Target className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Seu Score</p>
              <p className="text-2xl font-bold text-gradient">{data.yourScore}/10</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-secondary/10 rounded-lg">
              <Users className="h-5 w-5 text-secondary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Média da Indústria</p>
              <p className="text-2xl font-bold">{data.industryAverage}/10</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500/10 rounded-lg">
              <Award className="h-5 w-5 text-yellow-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Top Performers</p>
              <p className="text-2xl font-bold">{data.topPerformers}/10</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Melhoria (30d)</p>
              <p className="text-2xl font-bold text-green-500">+{data.improvement}%</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Posição no Percentil</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Seu percentil na área {area}</span>
            <span className={`font-semibold ${performance.color}`}>{performance.label}</span>
          </div>
          <Progress value={data.percentile} className="h-3" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0º percentil</span>
            <span>50º percentil</span>
            <span>100º percentil</span>
          </div>
        </div>
      </Card>
    </div>
  )
}