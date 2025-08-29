import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface SessionDetailData {
  id: string;
  track: string;
  created_at: string;
  duration_ms?: number;
  score?: number;
  scenario?: string;
  transcript?: string;
  transcript_user?: string;
  transcript_ai?: string;
  metrics?: any;
  metadata?: any;
  type: 'regular' | 'live';
  turns?: {
    turn_index: number;
    speaker: 'user' | 'ai';
    content: string;
    timestamp_ms: number;
  }[];
}

export function useSessionDetail(type: 'regular' | 'live', sessionId: string) {
  return useQuery({
    queryKey: ['session-detail', type, sessionId],
    queryFn: async () => {
      if (type === 'regular') {
        const { data, error } = await supabase
          .from('sessions')
          .select('*')
          .eq('id', sessionId)
          .single();

        if (error) throw error;

        return {
          ...data,
          type: 'regular' as const,
          duration_ms: data.started_at && data.finished_at 
            ? new Date(data.finished_at).getTime() - new Date(data.started_at).getTime()
            : 0
        };
      } else {
        // Buscar sessão live
        const { data: session, error: sessionError } = await supabase
          .from('sessions_live')
          .select('*')
          .eq('id', sessionId)
          .single();

        if (sessionError) throw sessionError;

        // Buscar turns da sessão live
        const { data: turns, error: turnsError } = await supabase
          .from('sessions_live_turns')
          .select('*')
          .eq('session_id', sessionId)
          .order('turn_index');

        if (turnsError) throw turnsError;

        return {
          ...session,
          type: 'live' as const,
          turns: turns || []
        };
      }
    },
    enabled: !!sessionId
  });
}