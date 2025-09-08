import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ReportModal } from "@/components/simulation/ReportModal";
import { RealSimulationEngine } from "@/components/simulation/RealSimulationEngine";

export default function SimulatePage() {
  const [reportData, setReportData] = useState(null);
  const [showReport, setShowReport] = useState(false);
  const { toast } = useToast();

  // Função chamada pelo Engine ao finalizar simulação
  const handleSimulationEnd = async (data) => {
    try {
      // Garantir campos obrigatórios
      if (!data?.userTranscript || !data?.aiTranscript) {
        toast({
          title: "Erro no relatório",
          description: "Transcrições ausentes na simulação. Verifique se o microfone funcionou corretamente.",
          variant: "destructive",
        });
        setReportData(null);
        setShowReport(false);
        return;
      }

      // Processar feedback se for objeto JSON
      let processedFeedback = data.feedback;
      if (data.generatedFeedback && typeof data.generatedFeedback === 'object') {
        // Se temos feedback estruturado, formatá-lo de forma legível
        const feedback = data.generatedFeedback;
        const scores = feedback.scores || [];
        const notes = feedback.notes || {};
        
        processedFeedback = `AVALIAÇÃO DA SIMULAÇÃO

SCORES POR CRITÉRIO:
${scores.map(s => `• ${s.criterion_label}: ${s.score}/10 - ${s.feedback}`).join('\n')}

PONTOS FORTES:
${(notes.highlights || []).map(h => `• ${h}`).join('\n')}

ÁREAS PARA MELHORIA:
${(notes.improvements || []).map(i => `• ${i}`).join('\n')}

PRÓXIMOS PASSOS:
${(notes.next_steps || []).map(n => `• ${n}`).join('\n')}`;
      }

      const processedData = {
        ...data,
        feedback: processedFeedback,
        score: data.score || 5 // Score padrão se não houver
      };

      // Enviar para o banco/persistência (exemplo Supabase ou API)
      // await saveSimulationReport(processedData);

      setReportData(processedData);
      setShowReport(true);
      
      toast({
        title: "Relatório gerado com sucesso",
        description: `Score: ${processedData.score.toFixed(1)}/10`,
      });
    } catch (error) {
      toast({
        title: "Erro ao gerar relatório",
        description: "Falha ao processar ou exibir o relatório. Tente novamente.",
        variant: "destructive",
      });
      console.error("Erro ao finalizar simulação:", error);
      setReportData(null);
      setShowReport(false);
    }
  };

  return (
    <>
      <RealSimulationEngine onSimulationEnd={handleSimulationEnd} />
      {showReport && reportData && (
        <ReportModal
          reportData={reportData}
          onClose={() => setShowReport(false)}
        />
      )}
    </>
  );
}