import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Defaults por área
const DEFAULT_SYSTEM_PREAMBLES = {
  rh: "Você é um candidato/colaborador em um contexto de RH. Responda em PT-BR de forma natural e profissional, demonstrando suas qualificações e interesse quando necessário.",
  comercial: "Você é um cliente/comprador em potencial. Responda em PT-BR, seja realista nas suas objeções e permita que o vendedor trabalhe para te convencer.",
  educacional: "Você é um aluno/estudante que precisa de ajuda. Responda em PT-BR, faça perguntas relevantes e demonstre dificuldades realistas que um estudante teria.",
  gestao: "Você é um membro da equipe/subordinado. Responda em PT-BR, seja colaborativo mas também realista sobre desafios e limitações."
};

// Função para gerar role_prompts automaticamente
function generateRolePrompts(roleOptions: string[]): Record<string, string> {
  const prompts: Record<string, string> = {};
  roleOptions.forEach((role, index) => {
    // Determinar se é o papel ativo (quem conduz) ou reativo (quem responde)
    const isActiveRole = ['entrevistador', 'gestor', 'vendedor', 'professor', 'account', 'avaliador', 'rh', 'lider'].includes(role.toLowerCase());
    
    if (isActiveRole) {
      prompts[role] = `Seu papel é: ${role}. Conduza a situação com perguntas relevantes, mantenha o foco nos objetivos e finalize com próximos passos claros.`;
    } else {
      prompts[role] = `Seu papel é: ${role}. Responda de forma natural e realista, forneça exemplos concretos quando solicitado e seja colaborativo na conversa.`;
    }
  });
  return prompts;
}

// Dados dos 32 cenários
const SCENARIOS = [
  // RH (8)
  {
    area: 'rh',
    title: 'Entrevista Júnior – Suporte',
    description: 'Condução de entrevista para vaga de suporte técnico nível júnior',
    role_options: ['entrevistador', 'candidato'],
    criteria: [
      { label: 'clareza', weight: 3 },
      { label: 'evidencias', weight: 3 },
      { label: 'escuta', weight: 2 },
      { label: 'fit', weight: 2 }
    ]
  },
  {
    area: 'rh',
    title: 'Entrevista Sênior – Tech Lead',
    description: 'Entrevista para posição de liderança técnica sênior',
    role_options: ['entrevistador', 'candidato'],
    criteria: [
      { label: 'lideranca', weight: 3 },
      { label: 'profundidade', weight: 3 },
      { label: 'negociacao', weight: 2 },
      { label: 'exec', weight: 2 }
    ]
  },
  {
    area: 'rh',
    title: 'Feedback Construtivo – Baixa Entrega',
    description: 'Conversa de feedback para colaborador com performance abaixo do esperado',
    role_options: ['gestor', 'colaborador'],
    criteria: [
      { label: 'cnv', weight: 3 },
      { label: 'empatia', weight: 2 },
      { label: 'acoes', weight: 3 },
      { label: 'registro', weight: 2 }
    ]
  },
  {
    area: 'rh',
    title: 'Feedback Positivo + Stretch',
    description: 'Reconhecimento de bom desempenho e proposição de novos desafios',
    role_options: ['gestor', 'colaborador'],
    criteria: [
      { label: 'reconhecimento', weight: 3 },
      { label: 'stretch', weight: 3 },
      { label: 'apoio', weight: 2 },
      { label: 'engajamento', weight: 2 }
    ]
  },
  {
    area: 'rh',
    title: 'Demissão – Postura Difícil',
    description: 'Comunicação de desligamento para colaborador com postura defensiva',
    role_options: ['gestor', 'colaborador'],
    criteria: [
      { label: 'clareza', weight: 3 },
      { label: 'empatia', weight: 3 },
      { label: 'riscos', weight: 2 },
      { label: 'encaminhamento', weight: 2 }
    ]
  },
  {
    area: 'rh',
    title: 'Onboarding 30/60/90',
    description: 'Acompanhamento de novo colaborador nos primeiros 90 dias',
    role_options: ['gestor', 'novo_colaborador'],
    criteria: [
      { label: 'objetivos', weight: 4 },
      { label: 'recursos', weight: 2 },
      { label: 'checagens', weight: 2 },
      { label: 'adesao', weight: 2 }
    ]
  },
  {
    area: 'rh',
    title: 'Avaliação 360°',
    description: 'Condução de processo de avaliação multidimensional',
    role_options: ['avaliador', 'avaliado'],
    criteria: [
      { label: 'dados', weight: 3 },
      { label: 'equilibrio', weight: 3 },
      { label: 'objetivos', weight: 2 },
      { label: 'desenvolver', weight: 2 }
    ]
  },
  {
    area: 'rh',
    title: 'Mediação RH x Gestor',
    description: 'Mediação de conflito entre área de RH e gestão',
    role_options: ['rh', 'gestor'],
    criteria: [
      { label: 'escuta', weight: 3 },
      { label: 'priorizacao', weight: 3 },
      { label: 'expectativas', weight: 2 },
      { label: 'follow', weight: 2 }
    ]
  },

  // Comercial (8)
  {
    area: 'comercial',
    title: 'Prospecção Fria – Decisor Cético',
    description: 'Primeiro contato com tomador de decisão resistente',
    role_options: ['vendedor', 'cliente'],
    criteria: [
      { label: 'abertura', weight: 2 },
      { label: 'descoberta', weight: 4 },
      { label: 'valor', weight: 2 },
      { label: 'proximo', weight: 2 }
    ]
  },
  {
    area: 'comercial',
    title: 'Qualificação – BANT/SPIN',
    description: 'Qualificação de prospect usando metodologia BANT/SPIN',
    role_options: ['vendedor', 'cliente'],
    criteria: [
      { label: 'fit', weight: 3 },
      { label: 'dor', weight: 3 },
      { label: 'autoridade', weight: 2 },
      { label: 'next', weight: 2 }
    ]
  },
  {
    area: 'comercial',
    title: 'Demonstração Técnica – Decisor Analítico',
    description: 'Apresentação de solução para decisor com perfil técnico/analítico',
    role_options: ['vendedor', 'decisor'],
    criteria: [
      { label: 'alinhamento', weight: 3 },
      { label: 'valor', weight: 3 },
      { label: 'provas', weight: 2 },
      { label: 'cta', weight: 2 }
    ]
  },
  {
    area: 'comercial',
    title: 'Negociação de Preço',
    description: 'Negociação comercial focada em condições de preço',
    role_options: ['vendedor', 'comprador'],
    criteria: [
      { label: 'ancora', weight: 3 },
      { label: 'obje', weight: 3 },
      { label: 'trocas', weight: 2 },
      { label: 'fechamento', weight: 2 }
    ]
  },
  {
    area: 'comercial',
    title: 'Objeções de Segurança/Compliance',
    description: 'Tratamento de objeções técnicas sobre segurança e compliance',
    role_options: ['account', 'procurement'],
    criteria: [
      { label: 'escuta', weight: 2 },
      { label: 'tecnico', weight: 3 },
      { label: 'valor', weight: 3 },
      { label: 'next', weight: 2 }
    ]
  },
  {
    area: 'comercial',
    title: 'Fechamento com Comitê',
    description: 'Apresentação final para comitê de decisão',
    role_options: ['account', 'comite'],
    criteria: [
      { label: 'mapeamento', weight: 3 },
      { label: 'consenso', weight: 3 },
      { label: 'risco', weight: 2 },
      { label: 'decisao', weight: 2 }
    ]
  },
  {
    area: 'comercial',
    title: 'Renegociação de Contrato',
    description: 'Renegociação de termos contratuais com cliente existente',
    role_options: ['account', 'cliente'],
    criteria: [
      { label: 'valor', weight: 3 },
      { label: 'escopo', weight: 3 },
      { label: 'relacao', weight: 2 },
      { label: 'acordo', weight: 2 }
    ]
  },
  {
    area: 'comercial',
    title: 'Pós-venda / Upsell',
    description: 'Identificação de oportunidades de expansão em conta existente',
    role_options: ['cs', 'cliente'],
    criteria: [
      { label: 'sucesso', weight: 3 },
      { label: 'oportunidade', weight: 3 },
      { label: 'risco', weight: 2 },
      { label: 'compromisso', weight: 2 }
    ]
  },

  // Educacional (8)
  {
    area: 'educacional',
    title: 'Aula – Baixo Engajamento',
    description: 'Condução de aula com turma pouco participativa',
    role_options: ['professor', 'alunos'],
    criteria: [
      { label: 'abertura', weight: 3 },
      { label: 'interacao', weight: 3 },
      { label: 'clareza', weight: 2 },
      { label: 'enc', weight: 2 }
    ]
  },
  {
    area: 'educacional',
    title: 'Reunião com Pais',
    description: 'Conversa com responsáveis sobre desenvolvimento do aluno',
    role_options: ['professor', 'pais'],
    criteria: [
      { label: 'empatia', weight: 3 },
      { label: 'dados', weight: 3 },
      { label: 'plano', weight: 2 },
      { label: 'acordo', weight: 2 }
    ]
  },
  {
    area: 'educacional',
    title: 'Feedback ao Aluno',
    description: 'Conversa individual de feedback sobre desempenho',
    role_options: ['professor', 'aluno'],
    criteria: [
      { label: 'especifico', weight: 3 },
      { label: 'motiv', weight: 3 },
      { label: 'orient', weight: 2 },
      { label: 'proximo', weight: 2 }
    ]
  },
  {
    area: 'educacional',
    title: 'Conflito em Sala',
    description: 'Mediação de conflito entre alunos',
    role_options: ['mediador', 'envolvido'],
    criteria: [
      { label: 'mediacao', weight: 4 },
      { label: 'regras', weight: 3 },
      { label: 'restaurativa', weight: 3 },
      { label: 'follow', weight: 0 }
    ]
  },
  {
    area: 'educacional',
    title: 'Apresentação de Projeto',
    description: 'Avaliação de apresentação de projeto por grupo de alunos',
    role_options: ['avaliador', 'grupo'],
    criteria: [
      { label: 'estrutura', weight: 3 },
      { label: 'dominio', weight: 3 },
      { label: 'tempo', weight: 2 },
      { label: 'recomend', weight: 2 }
    ]
  },
  {
    area: 'educacional',
    title: 'Aula Avaliativa Oral',
    description: 'Condução de avaliação oral individual',
    role_options: ['professor', 'aluno'],
    criteria: [
      { label: 'criterios', weight: 3 },
      { label: 'perguntas', weight: 3 },
      { label: 'feedback', weight: 2 },
      { label: 'plano', weight: 2 }
    ]
  },
  {
    area: 'educacional',
    title: 'Inclusão/NEE',
    description: 'Conversa sobre necessidades educacionais especiais',
    role_options: ['professor', 'responsavel'],
    criteria: [
      { label: 'acolh', weight: 3 },
      { label: 'adapt', weight: 3 },
      { label: 'parceria', weight: 2 },
      { label: 'acomp', weight: 2 }
    ]
  },
  {
    area: 'educacional',
    title: 'Conselho de Classe',
    description: 'Reunião de conselho para decisões sobre progressão de alunos',
    role_options: ['coordenador', 'professores'],
    criteria: [
      { label: 'dados', weight: 3 },
      { label: 'equidade', weight: 3 },
      { label: 'decisoes', weight: 2 },
      { label: 'monitor', weight: 2 }
    ]
  },

  // Gestão (8)
  {
    area: 'gestao',
    title: '1:1 – Performance Crítica',
    description: 'Conversa individual sobre performance crítica de liderado',
    role_options: ['head', 'liderado'],
    criteria: [
      { label: 'dados', weight: 3 },
      { label: 'apoio', weight: 2 },
      { label: 'plano', weight: 3 },
      { label: 'acordos', weight: 2 }
    ]
  },
  {
    area: 'gestao',
    title: 'Reorg – Comunicado Difícil',
    description: 'Comunicação de reestruturação organizacional para equipe',
    role_options: ['head', 'equipe'],
    criteria: [
      { label: 'narrativa', weight: 3 },
      { label: 'transpar', weight: 3 },
      { label: 'apoio', weight: 2 },
      { label: 'adocao', weight: 2 }
    ]
  },
  {
    area: 'gestao',
    title: 'OKRs – Planejamento Trimestral',
    description: 'Definição de objetivos e resultados-chave trimestrais',
    role_options: ['head', 'time'],
    criteria: [
      { label: 'foco', weight: 3 },
      { label: 'metricas', weight: 3 },
      { label: 'alinh', weight: 2 },
      { label: 'rituais', weight: 2 }
    ]
  },
  {
    area: 'gestao',
    title: 'Board Update (C-Level → Conselho)',
    description: 'Apresentação executiva para conselho de administração',
    role_options: ['c_level', 'board'],
    criteria: [
      { label: 'sintese', weight: 3 },
      { label: 'riscos', weight: 3 },
      { label: 'dados', weight: 2 },
      { label: 'pedido', weight: 2 }
    ]
  },
  {
    area: 'gestao',
    title: 'Crise Reputacional',
    description: 'Gestão de comunicação em situação de crise reputacional',
    role_options: ['c_level', 'stakeholders'],
    criteria: [
      { label: 'prior', weight: 3 },
      { label: 'comunic', weight: 3 },
      { label: 'acao', weight: 2 },
      { label: 'pos', weight: 2 }
    ]
  },
  {
    area: 'gestao',
    title: 'Alocação de Orçamento',
    description: 'Negociação de recursos orçamentários entre áreas',
    role_options: ['cfo', 'head'],
    criteria: [
      { label: 'tco', weight: 3 },
      { label: 'tradeoff', weight: 3 },
      { label: 'equidade', weight: 2 },
      { label: 'decisao', weight: 2 }
    ]
  },
  {
    area: 'gestao',
    title: 'Desligamento de Líder',
    description: 'Comunicação de desligamento de posição de liderança',
    role_options: ['head', 'lider'],
    criteria: [
      { label: 'compliance', weight: 3 },
      { label: 'respeito', weight: 3 },
      { label: 'riscos', weight: 2 },
      { label: 'transicao', weight: 2 }
    ]
  },
  {
    area: 'gestao',
    title: 'Due Diligence de Fornecedor Crítico',
    description: 'Avaliação técnica de fornecedor estratégico',
    role_options: ['cto', 'fornecedor'],
    criteria: [
      { label: 'seg', weight: 3 },
      { label: 'contin', weight: 3 },
      { label: 'custo', weight: 2 },
      { label: 'contrato', weight: 2 }
    ]
  }
];

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { 
      status: 405, 
      headers: corsHeaders 
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('Starting scenarios seed...');

    // Processar e inserir cada cenário
    for (const scenario of SCENARIOS) {
      const persona = {
        system_preamble: DEFAULT_SYSTEM_PREAMBLES[scenario.area as keyof typeof DEFAULT_SYSTEM_PREAMBLES],
        role_prompts: generateRolePrompts(scenario.role_options),
        scoring_style: "Notas 0–10 por critério; feedback breve e acionável."
      };

      const scenarioData = {
        title: scenario.title,
        description: scenario.description,
        area: scenario.area,
        role_options: scenario.role_options,
        criteria: scenario.criteria,
        tags: [],
        persona: persona
      };

      const { error } = await supabase
        .from('scenarios')
        .upsert(scenarioData, { 
          onConflict: 'title',
          ignoreDuplicates: false 
        });

      if (error) {
        console.error(`Error upserting scenario "${scenario.title}":`, error);
        throw error;
      }

      console.log(`✓ Upserted: ${scenario.title}`);
    }

    console.log(`Successfully seeded ${SCENARIOS.length} scenarios`);

    return new Response(JSON.stringify({ 
      success: true, 
      message: `Successfully seeded ${SCENARIOS.length} scenarios`,
      scenarios_count: SCENARIOS.length
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in seed-scenarios-v2:', error);
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});