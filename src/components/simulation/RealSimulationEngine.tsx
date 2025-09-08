import { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRealtimeCall } from "@/hooks/useRealtimeCall";
import { supabase } from "@/integrations/supabase/client";

export function RealSimulationEngine({ onSimulationEnd }) {
  const { toast } = useToast();
  const {
    userTranscript,
    aiTranscript,
    currentSessionId,
    startCall,
    endCall,
    status,
    muted,
    toggleMute,
    sttError,
    isManualInput,
    handleManualTranscript
  } = useRealtimeCall();

  const [score, setScore] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [duration, setDuration] = useState(0);
  const [isSimulationStarted, setIsSimulationStarted] = useState(false);
  const startTimeRef = useRef<number | null>(null);

  // Ao iniciar simulação
  const handleStart = async () => {
    try {
      startTimeRef.current = Date.now();
      setIsSimulationStarted(true);
      
      // Configurar simulação com parâmetros padrão
      await startCall({
        track: "rh", // Valor padrão, pode ser ajustado conforme necessário
        scenario: "Simulação de Treinamento",
        systemPrompt: "Você é um assistente de treinamento interpessoal. Conduza uma simulação realística em português brasileiro.",
        voiceId: "default"
      });

      toast({
        title: "Simulação iniciada",
        description: "A simulação foi iniciada com sucesso. Comece a falar!",
      });
    } catch (error) {
      console.error("Erro ao iniciar simulação:", error);
      toast({
        title: "Erro ao iniciar simulação",
        description: "Não foi possível iniciar a simulação. Verifique suas permissões de microfone.",
        variant: "destructive",
      });
      setIsSimulationStarted(false);
    }
  };

  // Ao finalizar simulação
  const handleFinish = async () => {
    try {
      const endTime = Date.now();
      const totalDuration = startTimeRef.current
        ? Math.floor((endTime - startTimeRef.current) / 1000)
        : 0;
      setDuration(totalDuration);

      // Finalizar chamada primeiro para salvar transcrições
      await endCall();
      
      if (!userTranscript?.trim() || !aiTranscript?.trim()) {
        toast({
          title: "Transcrição ausente",
          description: "Uma das transcrições está vazia. Verifique se o microfone funcionou corretamente.",
          variant: "destructive",
        });
        return;
      }

      // Gerar feedback usando a função supabase
      let generatedFeedback = null;
      let calculatedScore = 5; // Score padrão

      if (currentSessionId) {
        try {
          const { data: feedbackData, error: feedbackError } = await supabase.functions
            .invoke('generate-simulation-feedback', {
              body: {
                scenario_title: "Simulação de Treinamento",
                user_role: "Usuário",
                criteria: [
                  { key: "communication", label: "Comunicação", weight: 1 },
                  { key: "empathy", label: "Empatia", weight: 1 },
                  { key: "problem_solving", label: "Resolução de Problemas", weight: 1 }
                ],
                conversation_history: [
                  { role: "user", content: userTranscript },
                  { role: "ai", content: aiTranscript }
                ]
              }
            });

          if (feedbackError) {
            console.error("Erro ao gerar feedback:", feedbackError);
          } else if (feedbackData) {
            generatedFeedback = feedbackData;
            // Calcular score médio dos critérios
            const scores = feedbackData.scores || [];
            if (scores.length > 0) {
              calculatedScore = scores.reduce((acc, s) => acc + (s.score || 5), 0) / scores.length;
            }
          }
        } catch (error) {
          console.error("Erro ao processar feedback:", error);
        }
      }

      const report = {
        userTranscript,
        aiTranscript,
        score: calculatedScore,
        feedback: generatedFeedback ? JSON.stringify(generatedFeedback) : "Simulação concluída com sucesso.",
        duration: totalDuration,
        sessionId: currentSessionId,
        generatedFeedback
      };

      setScore(calculatedScore);
      setFeedback(report.feedback);
      setIsSimulationStarted(false);
      
      onSimulationEnd(report);
      
      toast({
        title: "Simulação finalizada",
        description: `Score: ${calculatedScore.toFixed(1)}/10 - Duração: ${Math.floor(totalDuration / 60)}min`,
      });
    } catch (error) {
      toast({
        title: "Erro ao finalizar simulação",
        description: "Falha inesperada ao gerar relatório.",
        variant: "destructive",
      });
      console.error("Erro ao finalizar simulação (engine):", error);
    }
  };

  // JSX do engine
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Simulação de Treinamento</h1>
        
        {/* Status da simulação */}
        <div className="mb-6 text-center">
          <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
            status === 'connected' ? 'bg-green-100 text-green-800' :
            status === 'connecting' ? 'bg-yellow-100 text-yellow-800' :
            status === 'ended' ? 'bg-gray-100 text-gray-800' :
            'bg-blue-100 text-blue-800'
          }`}>
            Status: {
              status === 'connected' ? 'Conectado' :
              status === 'connecting' ? 'Conectando...' :
              status === 'ended' ? 'Finalizado' :
              'Pronto para iniciar'
            }
          </div>
        </div>

        {/* Controles principais */}
        <div className="flex flex-col items-center gap-4 mb-6">
          {!isSimulationStarted && status === 'idle' && (
            <button 
              onClick={handleStart}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
            >
              Iniciar Simulação
            </button>
          )}

          {isSimulationStarted && status === 'connected' && (
            <>
              <button 
                onClick={toggleMute}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  muted 
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : 'bg-gray-600 hover:bg-gray-700 text-white'
                }`}
              >
                {muted ? 'Ativar Microfone' : 'Desativar Microfone'}
              </button>
              
              <button 
                onClick={handleFinish}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
              >
                Finalizar e gerar relatório
              </button>
            </>
          )}
        </div>

        {/* Área de transcrições */}
        {isSimulationStarted && (
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Sua transcrição:</h3>
              <div className="bg-gray-50 p-4 rounded-lg min-h-32 max-h-64 overflow-y-auto">
                {userTranscript || "Aguardando sua fala..."}
              </div>
              {sttError && (
                <p className="text-red-600 text-sm mt-2">{sttError}</p>
              )}
              {isManualInput && (
                <div className="mt-2">
                  <input
                    type="text"
                    placeholder="Digite sua mensagem..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleManualTranscript(e.target.value);
                        e.target.value = '';
                      }
                    }}
                  />
                </div>
              )}
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3">IA Transcrição:</h3>
              <div className="bg-blue-50 p-4 rounded-lg min-h-32 max-h-64 overflow-y-auto">
                {aiTranscript || "Aguardando resposta da IA..."}
              </div>
            </div>
          </div>
        )}

        {/* Informações da sessão */}
        {currentSessionId && (
          <div className="text-center text-sm text-gray-600">
            ID da Sessão: {currentSessionId}
          </div>
        )}
      </div>
    </div>
  );
}
