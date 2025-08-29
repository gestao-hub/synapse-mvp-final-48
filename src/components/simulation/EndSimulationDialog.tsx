import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, FileText, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface EndSimulationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  simulationId: string;
  conversationHistory: Array<{
    role: string;
    content: string;
    timestamp: number;
  }>;
  scenario: {
    title: string;
    criteria: Array<{
      key: string;
      label: string;
      weight: number;
    }>;
  };
  userRole: string;
  onSimulationEnded: (feedback: any) => void;
}

export function EndSimulationDialog({
  open,
  onOpenChange,
  simulationId,
  conversationHistory,
  scenario,
  userRole,
  onSimulationEnded,
}: EndSimulationDialogProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleEndSimulation = async () => {
    setIsProcessing(true);
    
    try {
      // Step 1: Generate feedback using AI
      console.log('Generating AI feedback...');
      const feedbackResponse = await supabase.functions.invoke('generate-simulation-feedback', {
        body: {
          conversation_history: conversationHistory,
          criteria: scenario.criteria,
          user_role: userRole,
          scenario_title: scenario.title,
        }
      });

      if (feedbackResponse.error) {
        throw new Error('Failed to generate feedback: ' + feedbackResponse.error.message);
      }

      const feedback = feedbackResponse.data;
      console.log('AI feedback generated:', feedback);

      // Calculate duration
      const startTime = conversationHistory[0]?.timestamp || Date.now();
      const endTime = conversationHistory[conversationHistory.length - 1]?.timestamp || Date.now();
      const durationSec = Math.floor((endTime - startTime) / 1000);

      // Step 2: Close simulation with AI-generated data
      console.log('Closing simulation...');
      const closeResponse = await supabase.functions.invoke('close-simulation', {
        body: {
          simulation_id: simulationId,
          scores: feedback.scores,
          kpis: feedback.kpis,
          notes: feedback.notes,
          duration_sec: durationSec,
        }
      });

      if (closeResponse.error) {
        throw new Error('Failed to close simulation: ' + closeResponse.error.message);
      }

      const result = closeResponse.data;
      console.log('Simulation closed successfully:', result);

      // Add overall score to feedback
      const finalFeedback = {
        ...feedback,
        overall_score: result.overall || 0,
      };

      // Step 3: Notify parent component
      onSimulationEnded(finalFeedback);

      toast({
        title: "Simulação finalizada!",
        description: `Score geral: ${result.overall}%`,
      });

      onOpenChange(false);

    } catch (error) {
      console.error('Error ending simulation:', error);
      toast({
        title: "Erro",
        description: error.message || "Falha ao finalizar simulação.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const exportToPDF = () => {
    // TODO: Implement PDF export functionality
    toast({
      title: "Exportar PDF",
      description: "Funcionalidade em desenvolvimento.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Finalizar Simulação</DialogTitle>
          <DialogDescription>
            A simulação será analisada pela IA e você receberá um relatório completo 
            com scores detalhados e feedback personalizado.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="bg-muted/30 p-4 rounded-lg space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <FileText className="w-4 h-4" />
              <span>Total de interações: {conversationHistory.length}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <FileText className="w-4 h-4" />
              <span>Critérios avaliados: {scenario.criteria.length}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <FileText className="w-4 h-4" />
              <span>Papel interpretado: {userRole}</span>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isProcessing}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleEndSimulation}
            disabled={isProcessing}
          >
            {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isProcessing ? 'Processando...' : 'Finalizar e Avaliar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}