import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { subDays } from "date-fns";
import { useAuthStore } from "@/stores/authStore";

export interface SessionData {
  id: string;
  track: string;
  duration_ms?: number;
  created_at: string;
  score?: number;
  scenario?: string;
  transcript?: string;
  user_id: string;
  type: 'regular' | 'live';
}

export interface DashboardKPIs {
  totalSessions: number;
  totalDuration: number;
  averageDuration: number;
  sessionsByTrack: Record<string, number>;
}

export function useDashboardData() {
  const { profile } = useAuthStore();
  const thirtyDaysAgo = subDays(new Date(), 30).toISOString();
  
  // Verificar se deve filtrar por usuário (apenas colaboradores veem seus próprios dados)
  const shouldFilterByUser = profile?.role === 'colaborador';
  const userId = profile?.id;

  // Buscar sessões regulares dos últimos 30 dias
  const { data: regularSessions = [] } = useQuery({
    queryKey: ['regular-sessions', thirtyDaysAgo, userId, shouldFilterByUser],
    queryFn: async () => {
      let query = supabase
        .from('sessions')
        .select('id, track, created_at, score, scenario, transcript, user_id, started_at, finished_at')
        .gte('created_at', thirtyDaysAgo)
        .order('created_at', { ascending: false });

      // Filtrar por user_id apenas se for colaborador
      if (shouldFilterByUser && userId) {
        query = query.eq('user_id', userId);
      }

      const { data, error } = await query;
      if (error) throw error;

      return data.map(session => ({
        ...session,
        duration_ms: session.started_at && session.finished_at 
          ? new Date(session.finished_at).getTime() - new Date(session.started_at).getTime()
          : 0,
        type: 'regular' as const
      }));
    },
    enabled: !!profile
  });

  // Buscar sessões live dos últimos 30 dias
  const { data: liveSessions = [] } = useQuery({
    queryKey: ['live-sessions', thirtyDaysAgo, userId, shouldFilterByUser],
    queryFn: async () => {
      let query = supabase
        .from('sessions_live')
        .select('id, track, duration_ms, created_at, transcript_user, transcript_ai, user_id')
        .gte('created_at', thirtyDaysAgo)
        .order('created_at', { ascending: false });

      // Filtrar por user_id apenas se for colaborador
      if (shouldFilterByUser && userId) {
        query = query.eq('user_id', userId);
      }

      const { data, error } = await query;
      if (error) throw error;

      return data.map(session => ({
        ...session,
        transcript: `User: ${session.transcript_user || ''}\nAI: ${session.transcript_ai || ''}`,
        type: 'live' as const
      }));
    },
    enabled: !!profile
  });

  // Buscar últimas 20 sessões (combinadas)
  const { data: recentSessions = [] } = useQuery({
    queryKey: ['recent-sessions', userId, shouldFilterByUser],
    queryFn: async () => {
      let regularQuery = supabase
        .from('sessions')
        .select('id, track, created_at, score, scenario, transcript, user_id, started_at, finished_at')
        .order('created_at', { ascending: false })
        .limit(10);

      let liveQuery = supabase
        .from('sessions_live')
        .select('id, track, duration_ms, created_at, transcript_user, transcript_ai, user_id')
        .order('created_at', { ascending: false })
        .limit(10);

      // Filtrar por user_id apenas se for colaborador
      if (shouldFilterByUser && userId) {
        regularQuery = regularQuery.eq('user_id', userId);
        liveQuery = liveQuery.eq('user_id', userId);
      }

      const { data: recentRegular, error: error1 } = await regularQuery;
      const { data: recentLive, error: error2 } = await liveQuery;

      if (error1) throw error1;
      if (error2) throw error2;

      const regular = (recentRegular || []).map(session => ({
        ...session,
        duration_ms: session.started_at && session.finished_at 
          ? new Date(session.finished_at).getTime() - new Date(session.started_at).getTime()
          : 0,
        type: 'regular' as const
      }));

      const live = (recentLive || []).map(session => ({
        ...session,
        transcript: `User: ${session.transcript_user || ''}\nAI: ${session.transcript_ai || ''}`,
        type: 'live' as const
      }));

      return [...regular, ...live]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 20);
    },
    enabled: !!profile
  });

  // Calcular KPIs
  const allSessions = [...regularSessions, ...liveSessions];
  
  const kpis: DashboardKPIs = {
    totalSessions: allSessions.length,
    totalDuration: allSessions.reduce((acc, session) => acc + (session.duration_ms || 0), 0),
    averageDuration: allSessions.length > 0 
      ? allSessions.reduce((acc, session) => acc + (session.duration_ms || 0), 0) / allSessions.length 
      : 0,
    sessionsByTrack: allSessions.reduce((acc, session) => {
      acc[session.track] = (acc[session.track] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  };

  return {
    kpis,
    chartData: Object.entries(kpis.sessionsByTrack).map(([track, count]) => ({
      track,
      sessions: count
    })),
    recentSessions,
    isLoading: false
  };
}