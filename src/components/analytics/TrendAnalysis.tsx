import React, { useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { format, subDays, startOfDay } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface SessionData {
  created_at: string
  score?: number | null
  track: string
  [key: string]: any
}

interface TrendAnalysisProps {
  sessions: SessionData[]
  area?: string
}

export function TrendAnalysis({ sessions, area }: TrendAnalysisProps) {
  const trendData = useMemo(() => {
    // Agrupar sessões por dia dos últimos 30 dias
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = startOfDay(subDays(new Date(), 29 - i))
      return {
        date: format(date, 'yyyy-MM-dd'),
        displayDate: format(date, 'dd/MM', { locale: ptBR }),
        sessions: sessions.filter(session => {
          const sessionDate = startOfDay(new Date(session.created_at))
          return sessionDate.getTime() === date.getTime() && 
                 session.score !== null &&
                 (!area || session.track === area)
        })
      }
    })

    return last30Days.map(day => ({
      date: day.displayDate,
      score: day.sessions.length > 0 
        ? Number((day.sessions.reduce((sum, s) => sum + (s.score || 0), 0) / day.sessions.length).toFixed(1))
        : null,
      sessionCount: day.sessions.length
    })).filter(d => d.score !== null)
  }, [sessions, area])

  const trend = useMemo(() => {
    if (trendData.length < 2) return { direction: 'stable', change: 0 }
    
    const recent = trendData.slice(-7).filter(d => d.score !== null)
    const previous = trendData.slice(-14, -7).filter(d => d.score !== null)
    
    if (recent.length === 0 || previous.length === 0) return { direction: 'stable', change: 0 }
    
    const recentAvg = recent.reduce((sum, d) => sum + d.score!, 0) / recent.length
    const previousAvg = previous.reduce((sum, d) => sum + d.score!, 0) / previous.length
    
    const change = Number(((recentAvg - previousAvg) / previousAvg * 100).toFixed(1))
    
    return {
      direction: change > 2 ? 'up' : change < -2 ? 'down' : 'stable',
      change: Math.abs(change)
    }
  }, [trendData])

  const getTrendIcon = () => {
    switch (trend.direction) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-500" />
      case 'down': return <TrendingDown className="w-4 h-4 text-red-500" />
      default: return <Minus className="w-4 h-4 text-gray-500" />
    }
  }

  const getTrendColor = () => {
    switch (trend.direction) {
      case 'up': return 'text-green-500'
      case 'down': return 'text-red-500'
      default: return 'text-gray-500'
    }
  }

  if (trendData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tendência de Performance</CardTitle>
          <CardDescription>Evolução dos seus scores ao longo do tempo</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Dados insuficientes para análise de tendência
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Tendência de Performance</CardTitle>
            <CardDescription>Últimos 30 dias</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {getTrendIcon()}
            <span className={getTrendColor()}>
              {trend.direction === 'stable' ? 'Estável' : `${trend.change}%`}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="date" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                domain={[0, 10]}
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload
                    return (
                      <div className="bg-background border rounded-lg shadow-lg p-3">
                        <p className="font-medium">{label}</p>
                        <p className="text-primary">
                          Score: {payload[0].value}/10
                        </p>
                        <p className="text-muted-foreground text-sm">
                          {data.sessionCount} sessão(ões)
                        </p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Area
                type="monotone"
                dataKey="score"
                stroke="hsl(var(--primary))"
                fillOpacity={1}
                fill="url(#scoreGradient)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}