// Tipos unificados para simulações
export interface SimulationScenario {
  id: string;
  area: string;
  title: string;
  description: string;
  criteria: any;
  persona: any;
  context?: string;
  role_options: any;
  system_prompt?: string;
  name?: string;
  tags?: string[];
}

export interface SimulationData {
  id: string;
  scenario_id: string;
  user_id: string;
  role: string;
  mode: string;
  started_at?: string;
  ended_at?: string;
  duration_sec?: number;
  recording_url?: string;
  transcript_url?: string;
  kpis?: any;
  notes?: any;
  scenarios?: SimulationScenario;
}

// Helper para converter dados do banco
export function castToSimulationScenario(data: any): SimulationScenario {
  return {
    id: data.id,
    area: data.area,
    title: data.title || data.name,
    description: data.description,
    criteria: data.criteria,
    persona: data.persona,
    context: data.context || data.system_prompt,
    role_options: Array.isArray(data.role_options) ? data.role_options : 
                 typeof data.role_options === 'string' ? JSON.parse(data.role_options) : 
                 data.role_options || [],
    system_prompt: data.system_prompt,
    name: data.name,
    tags: data.tags || []
  };
}