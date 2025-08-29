import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Scenario {
  id: string;
  track: string;
  name: string;
  system_prompt: string;
  voice_id?: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export type CreateScenarioData = Omit<Scenario, 'id' | 'created_at' | 'updated_at'>;
export type UpdateScenarioData = Partial<CreateScenarioData>;

export function useScenarios() {
  return useQuery({
    queryKey: ['scenarios'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('scenarios')
        .select('*')
        .order('track', { ascending: true })
        .order('name', { ascending: true });

      if (error) throw error;
      return data as Scenario[];
    }
  });
}

export function useScenariosByTrack(track: string) {
  return useQuery({
    queryKey: ['scenarios', track],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('scenarios')
        .select('*')
        .eq('track', track)
        .order('name', { ascending: true });

      if (error) throw error;
      return data as Scenario[];
    }
  });
}

export function useDefaultScenario(track: string) {
  return useQuery({
    queryKey: ['default-scenario', track],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('scenarios')
        .select('*')
        .eq('track', track)
        .eq('is_default', true)
        .single();

      if (error) throw error;
      return data as Scenario;
    }
  });
}

export function useScenariosActions() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createScenario = useMutation({
    mutationFn: async (data: CreateScenarioData) => {
      const { data: result, error } = await supabase
        .from('scenarios')
        .insert(data)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scenarios'] });
      toast({ title: "Cenário criado com sucesso" });
    },
    onError: (error) => {
      toast({
        title: "Erro ao criar cenário",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const updateScenario = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateScenarioData }) => {
      const { data: result, error } = await supabase
        .from('scenarios')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scenarios'] });
      toast({ title: "Cenário atualizado com sucesso" });
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar cenário",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const deleteScenario = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('scenarios')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scenarios'] });
      toast({ title: "Cenário excluído com sucesso" });
    },
    onError: (error) => {
      toast({
        title: "Erro ao excluir cenário",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  return {
    createScenario,
    updateScenario,
    deleteScenario
  };
}