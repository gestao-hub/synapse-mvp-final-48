// Unified Scenario interface to avoid conflicts
export interface Scenario {
  id: string
  area: string
  title: string
  description: string
  criteria: any
  persona: any
  context?: string
  role_options: any
  system_prompt?: string
  name?: string
  tags?: string[]
}

// Helper function to cast database records to Scenario
export function castToScenario(data: any): Scenario {
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
  }
}