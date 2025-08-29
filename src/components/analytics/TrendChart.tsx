import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface TrendData {
  date: string
  score: number
  sessions: number
}

interface TrendChartProps {
  data: TrendData[]
  area: string
}

export function TrendChart({ data, area }: TrendChartProps) {
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d'>('30d')

  const getFilteredData = () => {
    const now = new Date()
    const days = timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : 90
    const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000)
    
    return data.filter(item => new Date(item.date) >= cutoff)
  }

  const getImprovement = () => {
    const filtered = getFilteredData()
    if (filtered.length < 2) return 0
    
    const firstScore = filtered[0].score
    const lastScore = filtered[filtered.length - 1].score
    
    return ((lastScore - firstScore) / firstScore) * 100
  }

  const filteredData = getFilteredData()
  const improvement = getImprovement()

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Evolução Temporal</h3>
            <p className="text-sm text-muted-foreground">
              Performance em {area} ao longo do tempo
            </p>
          </div>
          
          <div className="flex gap-2">
            {(['7d', '30d', '90d'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setTimeframe(period)}
                className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                  timeframe === period
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">Melhoria no Período</p>
            <div className="flex items-center gap-2">
              <span className={`text-2xl font-bold ${
                improvement >= 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                {improvement >= 0 ? '+' : ''}{improvement.toFixed(1)}%
              </span>
              <div className={`w-2 h-2 rounded-full ${
                improvement >= 0 ? 'bg-green-500' : 'bg-red-500'
              }`} />
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm font-medium">Sessões Realizadas</p>
            <p className="text-2xl font-bold">
              {filteredData.reduce((sum, item) => sum + item.sessions, 0)}
            </p>
          </div>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={filteredData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="date" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                domain={[0, 10]}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
                formatter={(value: number) => [`${value.toFixed(1)}/10`, 'Score']}
                labelFormatter={(label) => `Data: ${label}`}
              />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-3">
          <h4 className="font-medium">Insights da Evolução</h4>
          <div className="space-y-2 text-sm text-muted-foreground">
            {improvement > 10 && (
              <p className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                Excelente progresso! Melhoria significativa de {improvement.toFixed(1)}%
              </p>
            )}
            {improvement > 0 && improvement <= 10 && (
              <p className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                Progresso constante com melhoria de {improvement.toFixed(1)}%
              </p>
            )}
            {improvement < 0 && (
              <p className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full" />
                Queda de {Math.abs(improvement).toFixed(1)}% - foque nos pontos de melhoria
              </p>
            )}
            <p className="flex items-center gap-2">
              <div className="w-2 h-2 bg-gray-500 rounded-full" />
              Média de {(filteredData.reduce((sum, item) => sum + item.sessions, 0) / filteredData.length || 0).toFixed(1)} sessões por período
            </p>
          </div>
        </div>
      </div>
    </Card>
  )
}