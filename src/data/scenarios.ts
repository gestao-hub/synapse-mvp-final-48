export type Track = 'comercial'|'rh'|'educacional'|'gestao'

export type Scenario = {
  id: string
  track: Track
  title: string
  description: string
  status: 'ready' | 'soon'
  route: string
  roleOptions?: string[]
}

export const scenarios: Scenario[] = [
  {
    id: 'feedback-construtivo',
    track: 'rh',
    title: 'Feedback Construtivo',
    description: 'Colaborador defensivo; use CNV, exemplos concretos e um plano de ação.',
    status: 'ready',
    route: '/sim/rh/feedback-construtivo',
    roleOptions: ['gestor', 'colaborador']
  },
  // Gestão
  {
    id: 'reuniao-estrategica',
    track: 'gestao',
    title: 'Reunião de Planejamento Estratégico',
    description: 'Defina metas trimestrais com sua equipe de liderança.',
    status: 'ready', 
    route: '/sim/gestao/reuniao-estrategica',
    roleOptions: ['lider', 'participante']
  },
  // Comercial
  {
    id: 'venda-consultiva',
    track: 'comercial',
    title: 'Venda Consultiva B2B',
    description: 'Conduza uma venda consultiva para solução tecnológica.',
    status: 'ready',
    route: '/sim/comercial/venda-consultiva',
    roleOptions: ['vendedor', 'comprador']
  },
  // Educacional
  {
    id: 'aula-interativa',
    track: 'educacional', 
    title: 'Aula Interativa',
    description: 'Conduza uma aula sobre metodologias ágeis.',
    status: 'ready',
    route: '/sim/educacional/aula-interativa',
    roleOptions: ['professor', 'aluno']
  }
]