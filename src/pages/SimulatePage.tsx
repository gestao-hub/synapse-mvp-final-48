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
      if (!data?.userTranscript || !data?.aiTranscript || !data?.score) {
        toast({
          title: "Erro no relatório",
          description: "Dados críticos ausentes na simulação. Relatório incompleto.",
          variant: "destructive",
        });
        setReportData(null);
        setShowReport(false);
        return;
      }
      // Enviar para o banco/persistência (exemplo Supabase ou API)
      // await saveSimulationReport(data);

      setReportData(data);
      setShowReport(true);
    } catch (error) {
      toast({
        title: "Erro ao gerar relatório",
        description: "Falha ao salvar ou exibir o relatório. Tente novamente.",
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