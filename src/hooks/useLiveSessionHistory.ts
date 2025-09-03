import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/stores/authStore';

export interface LiveSession {
  id: string;
  track: string;
  duration_ms: number;
  transcript_user: string | null;
  transcript_ai: string | null;
  score_overall: number | null;
  created_at: string;
  completed_at: string | null;
  metadata: any;
}

export function useLiveSessionHistory() {
  const [sessions, setSessions] = useState<LiveSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user) return;

    const fetchSessions = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('sessions_live')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (fetchError) {
          console.error('Erro ao buscar sessões:', fetchError);
          setError('Erro ao carregar histórico de sessões');
          return;
        }

        setSessions(data || []);
      } catch (err) {
        console.error('Erro inesperado:', err);
        setError('Erro inesperado ao carregar dados');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessions();
  }, [user]);

  const refreshSessions = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from('sessions_live')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    setSessions(data || []);
  };

  return {
    sessions,
    isLoading,
    error,
    refreshSessions
  };
}