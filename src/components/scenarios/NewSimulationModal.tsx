import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface NewSimulationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  scenario: {
    id: string;
    title: string;
    role_options: string[];
  } | null;
}

export function NewSimulationModal({ 
  open, 
  onOpenChange, 
  scenario 
}: NewSimulationModalProps) {
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleCreateSimulation = async () => {
    if (!scenario || !selectedRole) return;

    setIsLoading(true);
    try {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session.session?.user) {
        toast({
          title: "Erro",
          description: "Você precisa estar logado para criar uma simulação.",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase
        .from("simulations")
        .insert({
          user_id: session.session.user.id,
          scenario_id: scenario.id,
          mode: "turn",
          role: selectedRole,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Simulação criada!",
        description: `Simulação "${scenario.title}" iniciada com sucesso.`,
      });

      onOpenChange(false);
      navigate(`/simulate/${data.id}`);
    } catch (error) {
      console.error("Error creating simulation:", error);
      toast({
        title: "Erro",
        description: "Falha ao criar simulação. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Iniciar Simulação</DialogTitle>
        </DialogHeader>
        
        {scenario && (
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">{scenario.title}</h4>
              <p className="text-sm text-muted-foreground">
                Escolha o papel que você gostaria de interpretar nesta simulação:
              </p>
            </div>

            <RadioGroup 
              value={selectedRole} 
              onValueChange={setSelectedRole}
              className="space-y-2"
            >
              {scenario.role_options.map((role) => (
                <div key={role} className="flex items-center space-x-2">
                  <RadioGroupItem value={role} id={role} />
                  <Label 
                    htmlFor={role}
                    className="capitalize cursor-pointer flex-1"
                  >
                    {role.replace(/_/g, " ")}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        )}

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleCreateSimulation}
            disabled={!selectedRole || isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Iniciar Simulação
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}