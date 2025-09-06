import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, CheckCircle, RefreshCw, Database } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AnalysisResult {
  sessionId: string;
  sessionType: 'live' | 'regular';
  success: boolean;
  score?: number;
  error?: string;
  reason?: string;
}

export function SessionAnalyzer() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [pendingSessions, setPendingSessions] = useState<number>(0);
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    loadPendingSessions();
  }, []);

  const loadPendingSessions = async () => {
    try {
      // Contar sessões live não analisadas
      const { count: liveCount } = await supabase
        .from('sessions_live')
        .select('*', { count: 'exact', head: true })
        .or('metadata->>analyzed_score.is.null,metadata.is.null')
        .not('transcript_user', 'is', null)
        .not('transcript_user', 'eq', '')
        .not('transcript_user', 'eq', 'Conversa em tempo real via WebRTC');

      // Contar sessões regulares não analisadas
      const { count: regularCount } = await supabase
        .from('sessions')
        .select('*', { count: 'exact', head: true })
        .is('score', null)
        .not('transcript', 'is', null)
        .not('transcript', 'eq', '');

      setPendingSessions((liveCount || 0) + (regularCount || 0));
    } catch (error) {
      console.error('Erro ao carregar sessões pendentes:', error);
    }
  };

  const analyzeSession = async (sessionId: string, transcript: string, area: string, sessionType: 'live' | 'regular'): Promise<AnalysisResult> => {
    try {
      console.log(`🔍 Iniciando análise da sessão ${sessionId} (${sessionType}):`, { 
        area, 
        transcriptLength: transcript.length,
        transcriptPreview: transcript.substring(0, 100) + '...'
      });

      // Verificar se há transcript para análise
      if (!transcript || transcript.trim().length < 10) {
        console.warn('❌ Transcript insuficiente:', transcript);
        return {
          sessionId,
          sessionType,
          success: false,
          reason: 'Transcript insuficiente'
        };
      }

      console.log('🚀 Chamando edge function score-session-by-area...');
      
      // Chamar edge function de análise
      const { data, error } = await supabase.functions.invoke('score-session-by-area', {
        body: { 
          transcript: transcript,
          area: area.toLowerCase()
        }
      });

      console.log('📥 Resposta da edge function:', { data, error });

      if (error) {
        console.error('❌ Erro na edge function:', error);
        
        // Verificar se é problema de configuração
        if (error.message?.includes('Failed to send') || error.message?.includes('Failed to fetch')) {
          console.error('🚨 Possível problema de configuração da edge function');
          return {
            sessionId,
            sessionType,
            success: false,
            reason: 'Edge function não disponível - verifique a configuração do Supabase'
          };
        }
        
        throw error;
      }

      if (!data || typeof data.score !== 'number') {
        console.warn('❌ Resposta inválida da OpenAI:', data);
        console.warn('📊 Dados recebidos completos:', JSON.stringify(data, null, 2));
        return {
          sessionId,
          sessionType,
          success: false,
          reason: `Resposta inválida da IA: ${JSON.stringify(data)}`
        };
      }

      // Atualizar sessão com o score analisado
      console.log('💾 Salvando resultado no banco de dados...');
      const updateData = {
        metadata: {
          analyzed_score: data.score,
          analysis_metrics: data.metrics || {},
          analysis_observations: data.observacoes || '',
          analysis_timestamp: new Date().toISOString(),
          overall_score: data.score
        }
      };

      if (sessionType === 'live') {
        const { error: updateError } = await supabase
          .from('sessions_live')
          .update(updateData)
          .eq('id', sessionId);
        
        if (updateError) {
          console.error('❌ Erro ao atualizar sessão live:', updateError);
          throw updateError;
        }
      } else {
        const { error: updateError } = await supabase
          .from('sessions')
          .update({ 
            score: data.score,
            ...updateData 
          })
          .eq('id', sessionId);
          
        if (updateError) {
          console.error('❌ Erro ao atualizar sessão:', updateError);
          throw updateError;
        }
      }

      console.log(`✅ Análise concluída com sucesso para sessão ${sessionId}:`, {
        score: data.score,
        metrics: data.metrics
      });

      return {
        sessionId,
        sessionType,
        success: true,
        score: data.score
      };

    } catch (error) {
      console.error(`❌ Erro durante análise da sessão ${sessionId}:`, error);
      return {
        sessionId,
        sessionType,
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  };

  const runBatchAnalysis = async () => {
    setIsAnalyzing(true);
    setResults([]);
    setProgress(0);

    try {
      // Buscar sessões live não analisadas
      const { data: liveSessions } = await supabase
        .from('sessions_live')
        .select('id, transcript_user, track, metadata')
        .or('metadata->>analyzed_score.is.null,metadata.is.null')
        .not('transcript_user', 'is', null)
        .not('transcript_user', 'eq', '')
        .not('transcript_user', 'eq', 'Conversa em tempo real via WebRTC')
        .order('created_at', { ascending: false })
        .limit(20);

      // Buscar sessões regulares não analisadas  
      const { data: regularSessions } = await supabase
        .from('sessions')
        .select('id, transcript, track, score')
        .is('score', null)
        .not('transcript', 'is', null)
        .not('transcript', 'eq', '')
        .order('created_at', { ascending: false })
        .limit(20);

      const allSessions = [
        ...(liveSessions || []).map(s => ({ ...s, type: 'live' as const, transcript: s.transcript_user })),
        ...(regularSessions || []).map(s => ({ ...s, type: 'regular' as const }))
      ];

      if (allSessions.length === 0) {
        toast({
          title: "Nenhuma sessão pendente",
          description: "Todas as sessões já foram analisadas!",
        });
        setIsAnalyzing(false);
        return;
      }

      const analysisResults: AnalysisResult[] = [];

      // Analisar cada sessão
      for (let i = 0; i < allSessions.length; i++) {
        const session = allSessions[i];
        
        const result = await analyzeSession(
          session.id, 
          session.transcript, 
          session.track, 
          session.type
        );
        
        analysisResults.push(result);
        setResults([...analysisResults]);
        setProgress(((i + 1) / allSessions.length) * 100);
        
        // Aguardar um pouco entre análises para não sobrecarregar
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      const successCount = analysisResults.filter(r => r.success).length;
      
      toast({
        title: "Análise concluída",
        description: `${successCount}/${analysisResults.length} sessões analisadas com sucesso`,
      });

      // Recarregar contagem de sessões pendentes
      await loadPendingSessions();

    } catch (error) {
      console.error('Erro na análise em lote:', error);
      toast({
        title: "Erro",
        description: "Erro durante a análise em lote",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Analisador de Sessões
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium">
              Sessões pendentes de análise: <Badge variant="outline">{pendingSessions}</Badge>
            </p>
            <p className="text-xs text-muted-foreground">
              Sessões com transcripts válidos mas sem scores calculados
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={loadPendingSessions}
              disabled={isAnalyzing}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button
              onClick={runBatchAnalysis}
              disabled={isAnalyzing || pendingSessions === 0}
              size="sm"
            >
              {isAnalyzing ? 'Analisando...' : 'Analisar Sessões'}
            </Button>
          </div>
        </div>

        {isAnalyzing && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progresso da análise</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {results.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Resultados:</h4>
            <div className="max-h-40 overflow-y-auto space-y-1">
              {results.map((result, index) => (
                <div key={index} className="flex items-center justify-between text-xs p-2 bg-muted/50 rounded">
                  <div className="flex items-center gap-2">
                    {result.success ? (
                      <CheckCircle className="h-3 w-3 text-green-500" />
                    ) : (
                      <AlertCircle className="h-3 w-3 text-red-500" />
                    )}
                    <span className="font-mono text-xs">
                      {result.sessionId.substring(0, 8)}...
                    </span>
                    <Badge variant="outline" className="text-xs px-1 py-0">
                      {result.sessionType}
                    </Badge>
                  </div>
                  <div className="text-right">
                    {result.success ? (
                      <span className="text-green-600 font-medium">
                        Score: {result.score}/10
                      </span>
                    ) : (
                      <span className="text-red-600 text-xs">
                        {result.reason || result.error || 'Erro'}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground space-y-1">
          <p>• Sessões com transcripts válidos são analisadas automaticamente</p>
          <p>• Edge functions calculam scores baseados no conteúdo real das conversas</p>
          <p>• Resultados são salvos no banco de dados para relatórios</p>
        </div>
      </CardContent>
    </Card>
  );
}