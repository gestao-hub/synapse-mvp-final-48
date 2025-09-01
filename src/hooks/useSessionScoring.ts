import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useSessionScoring() {
  const { toast } = useToast();

  const analyzeSession = async (sessionId: string, transcript: string, area: string, sessionType: 'live' | 'regular' = 'live') => {
    try {
      console.log(`Analisando sessão ${sessionId} da área ${area}`);
      
      // Verificar se há transcript para análise
      if (!transcript || transcript.trim().length < 10) {
        console.warn('Transcript muito curto para análise:', transcript);
        return { success: false, reason: 'Transcript insuficiente' };
      }

      // Chamar edge function de análise baseada na área
      const { data, error } = await supabase.functions.invoke('score-session-by-area', {
        body: { 
          transcript: transcript,
          area: area.toLowerCase()
        }
      });

      if (error) {
        console.error('Erro na edge function de análise:', error);
        throw error;
      }

      if (!data || typeof data.score !== 'number') {
        console.warn('Resposta inválida da análise:', data);
        return { success: false, reason: 'Resposta inválida da IA' };
      }

      // Atualizar sessão com o score analisado
      const updateData = {
        score_overall: data.score,
        metadata: {
          analyzed_score: data.score,
          analysis_metrics: data.metrics || {},
          analysis_observations: data.observacoes || '',
          analysis_timestamp: new Date().toISOString(),
          overall_score: data.score
        }
      };

      if (sessionType === 'live') {
        await supabase
          .from('sessions_live')
          .update(updateData)
          .eq('id', sessionId);
      } else {
        await supabase
          .from('sessions')
          .update({ 
            score: data.score,
            ...updateData 
          })
          .eq('id', sessionId);
      }

      console.log(`✅ Análise concluída para sessão ${sessionId}: score ${data.score}`);
      
      return { 
        success: true, 
        score: data.score, 
        metrics: data.metrics,
        observations: data.observacoes 
      };

    } catch (error) {
      console.error('Erro durante análise da sessão:', error);
      
      toast({
        title: "Aviso",
        description: "Não foi possível analisar a sessão automaticamente",
        variant: "default"
      });

      return { success: false, error: error instanceof Error ? error.message : 'Erro desconhecido' };
    }
  };

  const ensureSessionAnalysis = async (sessionId: string, sessionType: 'live' | 'regular' = 'live') => {
    try {
      // Buscar dados da sessão
      let session: any = null;

      if (sessionType === 'live') {
        const { data } = await supabase
          .from('sessions_live')
          .select('transcript_user, track, metadata')
          .eq('id', sessionId)
          .single();
        session = data;
      } else {
        const { data } = await supabase
          .from('sessions')
          .select('transcript, track, score')
          .eq('id', sessionId)
          .single();
        session = data;
      }

      if (!session) {
        console.warn(`Sessão ${sessionId} não encontrada`);
        return { success: false, reason: 'Sessão não encontrada' };
      }

      // Verificar se já foi analisada
      const hasAnalysis = sessionType === 'live' 
        ? session.metadata?.analyzed_score !== undefined
        : session.score !== null;

      if (hasAnalysis) {
        console.log(`Sessão ${sessionId} já foi analisada`);
        return { success: true, reason: 'Já analisada' };
      }

      // Obter transcript
      const transcript = sessionType === 'live' 
        ? session.transcript_user || ''
        : session.transcript || '';

      if (!transcript || transcript.includes('Conversa em tempo real via WebRTC')) {
        console.warn(`Transcript inválido para sessão ${sessionId}:`, transcript);
        return { success: false, reason: 'Transcript inválido' };
      }

      // Executar análise
      return await analyzeSession(sessionId, transcript, session.track, sessionType);

    } catch (error) {
      console.error('Erro ao garantir análise da sessão:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Erro desconhecido' };
    }
  };

  const batchAnalyzeSessions = async (maxSessions: number = 10) => {
    try {
      console.log('Iniciando análise em lote de sessões pendentes...');
      
      // Buscar sessões live não analisadas
      const { data: liveSessions } = await supabase
        .from('sessions_live')
        .select('id, transcript_user, track, metadata')
        .or('metadata->>analyzed_score.is.null,metadata.is.null')
        .not('transcript_user', 'is', null)
        .not('transcript_user', 'eq', '')
        .not('transcript_user', 'eq', 'Conversa em tempo real via WebRTC')
        .order('created_at', { ascending: false })
        .limit(maxSessions);

      // Buscar sessões regulares não analisadas  
      const { data: regularSessions } = await supabase
        .from('sessions')
        .select('id, transcript, track, score')
        .is('score', null)
        .not('transcript', 'is', null)
        .not('transcript', 'eq', '')
        .order('created_at', { ascending: false })
        .limit(maxSessions);

      const results = [];

      // Analisar sessões live
      for (const session of liveSessions || []) {
        const result = await analyzeSession(session.id, session.transcript_user, session.track, 'live');
        results.push({ sessionId: session.id, type: 'live', ...result });
        
        // Aguardar um pouco entre análises para não sobrecarregar
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Analisar sessões regulares
      for (const session of regularSessions || []) {
        const result = await analyzeSession(session.id, session.transcript, session.track, 'regular');
        results.push({ sessionId: session.id, type: 'regular', ...result });
        
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      const successCount = results.filter(r => r.success).length;
      console.log(`✅ Análise em lote concluída: ${successCount}/${results.length} sessões analisadas com sucesso`);

      return { success: true, results, successCount, totalCount: results.length };

    } catch (error) {
      console.error('Erro na análise em lote:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Erro desconhecido' };
    }
  };

  return {
    analyzeSession,
    ensureSessionAnalysis,
    batchAnalyzeSessions
  };
}