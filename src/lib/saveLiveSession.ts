import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface LiveSessionData {
  track: string;
  duration_ms: number;
  transcript_user?: string;
  transcript_ai?: string;
  metadata?: any;
  turns?: {
    turn_index: number;
    speaker: 'user' | 'ai';
    content: string;
    timestamp_ms: number;
  }[];
}

export async function saveLiveSession(sessionData: LiveSessionData) {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    // Insert session
    const { data: session, error: sessionError } = await supabase
      .from('sessions_live')
      .insert({
        user_id: user.id,
        track: sessionData.track,
        duration_ms: sessionData.duration_ms,
        transcript_user: sessionData.transcript_user,
        transcript_ai: sessionData.transcript_ai,
        metadata: sessionData.metadata
      })
      .select()
      .single();

    if (sessionError) throw sessionError;

    // Insert turns if they exist
    if (sessionData.turns && sessionData.turns.length > 0) {
      const turnsToInsert = sessionData.turns.map(turn => ({
        session_id: session.id,
        turn_index: turn.turn_index,
        speaker: turn.speaker,
        content: turn.content,
        timestamp_ms: turn.timestamp_ms
      }));

      const { error: turnsError } = await supabase
        .from('sessions_live_turns')
        .insert(turnsToInsert);

      if (turnsError) throw turnsError;
    }

    return { success: true, sessionId: session.id };
  } catch (error) {
    console.error('Erro ao salvar sessão:', error);
    throw error;
  }
}

export function useSaveLiveSession() {
  const { toast } = useToast();

  const saveSession = async (sessionData: LiveSessionData) => {
    try {
      const result = await saveLiveSession(sessionData);
      toast({
        title: "Sessão salva",
        description: "Dados da sessão foram salvos com sucesso",
      });
      return result;
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: "destructive",
      });
      throw error;
    }
  };

  return { saveSession };
}