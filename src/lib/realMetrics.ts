import { supabase } from '@/integrations/supabase/client'

export interface RealMetrics {
  yourScore: number
  industryAverage: number
  topPerformers: number
  percentile: number
  improvement: number
  totalSessions: number
  averageScore: number
  lastWeekImprovement: number
  completionRate: number
  averageDuration: number
  strongestSkill: string
  weakestSkill: string
  sessionsThisMonth: number
  streak: number
}

export interface AreaSpecificMetrics {
  // Comercial
  closingRate?: number
  objectionHandling?: number
  averageDealTime?: number
  
  // RH
  empathyScore?: number
  interviewAccuracy?: number
  feedbackEffectiveness?: number
  
  // Educacional
  studentEngagement?: number
  knowledgeTransfer?: number
  classroomManagement?: number
  
  // Gestão
  strategicDecisions?: number
  leadershipEffectiveness?: number
  crisisManagement?: number
}

export async function calculateRealMetrics(area: string, userId?: string): Promise<RealMetrics & AreaSpecificMetrics> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    const currentUserId = userId || user?.id
    
    if (!currentUserId) {
      throw new Error('Usuário não autenticado')
    }

    // Buscar sessões do usuário atual
    const { data: userSessions, error: userError } = await supabase
      .from('sessions_live')
      .select(`
        *,
        sessions_live_turns (*)
      `)
      .eq('user_id', currentUserId)
      .eq('track', area)
      .order('created_at', { ascending: false })

    if (userError) throw userError

    // 2. Buscar dados de todos os usuários para comparação (últimos 30 dias)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    const { data: allSessions, error: allError } = await supabase
      .from('sessions_live')
      .select('metadata, created_at')
      .eq('track', area)
      .gte('created_at', thirtyDaysAgo.toISOString())

    if (allError) throw allError

    // 3. Calcular métricas básicas
    const completedSessions = userSessions?.filter(s => {
      const metadata = s.metadata as any
      return metadata?.completed === true
    }) || []
    
    const scores = completedSessions.map(s => {
      const metadata = s.metadata as any
      return metadata?.overall_score
    }).filter(Boolean)
    
    const yourScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0
    const totalSessions = completedSessions.length
    
    // 4. Calcular métricas comparativas
    const allScores = allSessions?.map(s => {
      const metadata = s.metadata as any
      return metadata?.overall_score
    }).filter(Boolean) || []
    const industryAverage = allScores.length > 0 ? allScores.reduce((a, b) => a + b, 0) / allScores.length : 6.5
    const topPerformers = allScores.length > 0 ? Math.max(...allScores) * 0.95 : 9.0
    
    // 5. Calcular percentil
    const betterThanCount = allScores.filter(score => score < yourScore).length
    const percentile = allScores.length > 0 ? Math.round((betterThanCount / allScores.length) * 100) : 50
    
    // 6. Calcular melhoria (últimas 5 vs primeiras 5 sessões)
    const recentScores = scores.slice(0, 5)
    const oldScores = scores.slice(-5)
    const recentAvg = recentScores.length > 0 ? recentScores.reduce((a, b) => a + b, 0) / recentScores.length : yourScore
    const oldAvg = oldScores.length > 0 ? oldScores.reduce((a, b) => a + b, 0) / oldScores.length : yourScore
    const improvement = recentAvg > 0 && oldAvg > 0 ? Math.round(((recentAvg - oldAvg) / oldAvg) * 100) : 0
    
    // 7. Calcular métricas específicas da área
    const areaMetrics = await calculateAreaSpecificMetrics(area, completedSessions)
    
    // 8. Calcular streak e outras métricas
    const sessionsThisMonth = completedSessions.filter(s => {
      const sessionDate = new Date(s.created_at)
      const now = new Date()
      return sessionDate.getMonth() === now.getMonth() && sessionDate.getFullYear() === now.getFullYear()
    }).length
    
    const averageDuration = completedSessions.length > 0 
      ? completedSessions.reduce((acc, session) => {
          const duration = session.duration_ms || 900000 // 15 min default
          return acc + (duration / 1000 / 60) // em minutos
        }, 0) / completedSessions.length
      : 15

    return {
      yourScore: Math.round(yourScore * 10) / 10,
      industryAverage: Math.round(industryAverage * 10) / 10,
      topPerformers: Math.round(topPerformers * 10) / 10,
      percentile,
      improvement,
      totalSessions,
      averageScore: yourScore,
      lastWeekImprovement: improvement,
      completionRate: totalSessions > 0 ? Math.round((completedSessions.length / totalSessions) * 100) : 100,
      averageDuration: Math.round(averageDuration),
      strongestSkill: await getStrongestSkill(completedSessions),
      weakestSkill: await getWeakestSkill(completedSessions),
      sessionsThisMonth,
      streak: await calculateStreak(completedSessions),
      ...areaMetrics
    }

  } catch (error) {
    console.error('Erro ao calcular métricas:', error)
    // Retorna métricas padrão em caso de erro
    return {
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
    }
  }
}

async function calculateAreaSpecificMetrics(area: string, sessions: any[]): Promise<AreaSpecificMetrics> {
  const areaMetrics: AreaSpecificMetrics = {}
  
  switch (area) {
    case 'comercial':
      // Calcular métricas comerciais baseadas nos critérios
      const commercialScores = extractCriteriaScores(sessions)
      areaMetrics.closingRate = Math.round((commercialScores.fechamento || 6) * 10)
      areaMetrics.objectionHandling = Math.round((commercialScores.objecoes || 6) * 10)
      areaMetrics.averageDealTime = Math.round(sessions.reduce((acc, s) => acc + (s.total_turns || 5), 0) / sessions.length || 5)
      break
      
    case 'rh':
      const rhScores = extractCriteriaScores(sessions)
      areaMetrics.empathyScore = rhScores.empatia || 6
      areaMetrics.interviewAccuracy = Math.round((rhScores.entrevista || 6) * 10)
      areaMetrics.feedbackEffectiveness = Math.round((rhScores.feedback || 6) * 10)
      break
      
    case 'educacional':
      const eduScores = extractCriteriaScores(sessions)
      areaMetrics.studentEngagement = Math.round((eduScores.engajamento || 6) * 10)
      areaMetrics.knowledgeTransfer = Math.round((eduScores.conhecimento || 6) * 10)
      areaMetrics.classroomManagement = Math.round((eduScores.gestao_sala || 6) * 10)
      break
      
    case 'gestao':
      const gestaoScores = extractCriteriaScores(sessions)
      areaMetrics.strategicDecisions = Math.round((gestaoScores.decisao_estrategica || 6) * 10)
      areaMetrics.leadershipEffectiveness = Math.round((gestaoScores.lideranca || 6) * 10)
      areaMetrics.crisisManagement = Math.round((gestaoScores.crise || 6) * 10)
      break
  }
  
  return areaMetrics
}

function extractCriteriaScores(sessions: any[]): Record<string, number> {
  const criteriaScores: Record<string, number> = {}
  const criteriaCount: Record<string, number> = {}
  
  sessions.forEach(session => {
    if (session.sessions_live_turns) {
      session.sessions_live_turns.forEach((turn: any) => {
        if (turn.scores) {
          Object.entries(turn.scores).forEach(([key, score]: [string, any]) => {
            if (typeof score === 'number') {
              criteriaScores[key] = (criteriaScores[key] || 0) + score
              criteriaCount[key] = (criteriaCount[key] || 0) + 1
            }
          })
        }
      })
    }
  })
  
  // Calcular médias
  Object.keys(criteriaScores).forEach(key => {
    criteriaScores[key] = criteriaScores[key] / criteriaCount[key]
  })
  
  return criteriaScores
}

async function getStrongestSkill(sessions: any[]): Promise<string> {
  const criteriaScores = extractCriteriaScores(sessions)
  const criteriaEntries = Object.entries(criteriaScores)
  
  if (criteriaEntries.length === 0) return 'N/A'
  
  const strongest = criteriaEntries.reduce((a, b) => a[1] > b[1] ? a : b)
  return strongest[0].replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
}

async function getWeakestSkill(sessions: any[]): Promise<string> {
  const criteriaScores = extractCriteriaScores(sessions)
  const criteriaEntries = Object.entries(criteriaScores)
  
  if (criteriaEntries.length === 0) return 'N/A'
  
  const weakest = criteriaEntries.reduce((a, b) => a[1] < b[1] ? a : b)
  return weakest[0].replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
}

async function calculateStreak(sessions: any[]): Promise<number> {
  if (sessions.length === 0) return 0
  
  const sortedSessions = sessions.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  let streak = 0
  let currentDate = new Date()
  
  for (const session of sortedSessions) {
    const sessionDate = new Date(session.created_at)
    const daysDiff = Math.floor((currentDate.getTime() - sessionDate.getTime()) / (1000 * 3600 * 24))
    
    if (daysDiff <= 1) {
      streak++
      currentDate = sessionDate
    } else {
      break
    }
  }
  
  return streak
}