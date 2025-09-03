// ... existing imports ...

export const RealSimulationEngine = ({ 
  scenario,
  userRole,
  onComplete,
  sessionId
}: RealSimulationEngineProps) => {
  // ... existing state and refs ...

  const endSimulation = async () => {
    try {
      console.log('🚀 Iniciando processo de finalização da simulação:', {
        sessionId,
        scenarioId: scenario.id,
        conversationLength: conversation.length
      });

      const userTranscript = conversation
        .filter(msg => msg.role === 'user')
        .map(msg => msg.content)
        .join('\n')
      
      const aiTranscript = conversation
        .filter(msg => msg.role === 'assistant')
        .map(msg => msg.content)
        .join('\n')

      console.log('📝 Transcrições geradas:', {
        userTranscriptLength: userTranscript.length,
        aiTranscriptLength: aiTranscript.length,
        firstUserMessage: userTranscript.slice(0, 100) + '...',
        firstAiMessage: aiTranscript.slice(0, 100) + '...'
      });

      const metrics = await MetricsCalculator.calculate(
        conversation.map(c => ({
          speaker: c.role === 'user' ? 'user' : 'ai',
          content: c.content,
          timestamp: new Date(c.timestamp).getTime()
        })),
        scenario.area,
        scenario.criteria || []
      );

      console.log('📊 Métricas calculadas:', {
        overallScore: metrics.overallScore,
        speechMetrics: metrics.speechMetrics,
        contentMetrics: metrics.contentMetrics
      });

      const sessionUpdate = {
        duration_ms: Date.now() - (conversation[0] ? new Date(conversation[0].timestamp).getTime() : Date.now()),
        transcript_user: userTranscript || null,
        transcript_ai: aiTranscript || null,
        completed_at: new Date().toISOString(),
        metadata: {
          scenario_title: scenario.title,
          scenario_id: scenario.id,
          user_role: userRole,
          overall_score: metrics.overallScore,
          total_turns: conversation.length,
          metrics: metrics,
          completed: true,
          conversation_length: conversation.length,
          criteria: scenario.criteria
        }
      };

      console.log('💾 Tentando salvar dados da sessão:', {
        sessionId,
        update: sessionUpdate
      });

      const { error: updateError } = await supabase
        .from('sessions_live')
        .update(sessionUpdate)
        .eq('id', sessionId)

      if (updateError) {
        console.error('❌ Erro ao finalizar sessão:', updateError);
        throw new Error(`Falha ao atualizar sessão: ${updateError.message}`);
      }

      console.log('✅ Sessão finalizada com sucesso');

      // Chamar análise da sessão
      console.log("🔍 Iniciando análise da sessão:", sessionId, "área:", scenario.area);
      
      try {
        const analysisResult = await supabase.functions.invoke('score-session-by-area', {
          body: { 
            sessionId, 
            area: scenario.area,
            metrics: metrics
          }
        });
        
        if (analysisResult.error) {
          console.error('❌ Erro na análise:', analysisResult.error);
          throw new Error(`Falha na análise: ${analysisResult.error}`);
        }
        
        console.log("✅ Análise concluída:", analysisResult.data);
        
      } catch (error) {
        console.error('❌ Erro ao chamar análise:', error);
      }

      const finalResults = {
        sessionId,
        scenario,
        userRole,
        conversation,
        scores: metrics,
        totalTurns: conversation.length,
        overallScore: metrics.overallScore,
        duration: Math.round((Date.now() - Date.parse(conversation[0]?.timestamp)) / 1000 / 60)
      };

      console.log('🏁 Resultados finais da simulação:', finalResults);

      onComplete(finalResults);
      
    } catch (error) {
      console.error('❌ Erro fatal ao finalizar simulação:', error);
      toast({
        title: "Erro na Finalização",
        description: "Ocorreu um erro ao finalizar a simulação. Por favor, tente novamente.",
        variant: "destructive"
      });
    }
  };

  // ... resto do código existente ...
};