import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const url = Deno.env.get("SUPABASE_URL")!;
const service = Deno.env.get("SUPABASE_SERVICE_ROLE")!;
const sb = createClient(url, service);

type Crit = { key:string; label:string; weight:number };

type ScenarioSeed = {
  area: 'rh'|'comercial'|'educacional'|'gestao';
  title: string;
  description?: string;
  role_options: string[];     // ex: ["entrevistador","candidato"]
  criteria: Crit[];           // soma dos pesos = 10
  tags?: string[];
  persona?: any;
};

const S: ScenarioSeed[] = [
  // ===== RH (6) =====
  {
    area:'rh', title:'Feedback Construtivo',
    description:'Conduzir feedback usando CNV, empatia e próximos passos.',
    role_options:['gestor','colaborador'],
    criteria:[
      {key:'cnv',label:'CNV (observação/pedido)',weight:3},
      {key:'empatia',label:'Empatia',weight:2},
      {key:'acoes',label:'Próximos passos',weight:3},
      {key:'registro',label:'Acordos documentados',weight:2},
    ],
    tags:['feedback','desempenho'],
    persona:{tone:'caloroso', style:'claro', goal:'plano de ação'}
  },
  { area:'rh', title:'Entrevista Júnior',
    description:'Entrevista inicial para vaga júnior.',
    role_options:['entrevistador','candidato'],
    criteria:[
      {key:'clareza',label:'Clareza nas perguntas',weight:3},
      {key:'escuta',label:'Escuta ativa',weight:3},
      {key:'fit',label:'Aderência ao perfil',weight:2},
      {key:'enc',label:'Encerramento e próximos passos',weight:2},
    ],
    tags:['recrutamento']
  },
  { area:'rh', title:'Entrevista Sênior',
    description:'Explorar profundidade técnica e soft skills.',
    role_options:['entrevistador','candidato'],
    criteria:[
      {key:'prof',label:'Profundidade técnica',weight:3},
      {key:'comport',label:'Comportamentais',weight:2},
      {key:'negocio',label:'Visão de negócio',weight:3},
      {key:'fit',label:'Cultura',weight:2},
    ]
  },
  { area:'rh', title:'Onboarding 30-60-90',
    role_options:['gestor','novo_colaborador'],
    criteria:[
      {key:'objetivos',label:'Metas 30/60/90',weight:4},
      {key:'recursos',label:'Recursos e apoios',weight:3},
      {key:'alinhamento',label:'Alinhamento expectativas',weight:3},
    ]
  },
  { area:'rh', title:'Feedback Construtivo Difícil',
    role_options:['gestor','colaborador'],
    criteria:[
      {key:'respeito',label:'Respeito e tom',weight:2},
      {key:'impacto',label:'Explicar impacto',weight:3},
      {key:'plano',label:'Plano de melhoria',weight:3},
      {key:'follow',label:'Follow-up',weight:2},
    ]
  },
   { area:'rh', title:'Avaliação de Desempenho',
     role_options:['gestor','colaborador'],
     criteria:[
       {key:'dados',label:'Baseada em evidências',weight:3},
       {key:'equilibrio',label:'Pontos fortes x fracos',weight:3},
       {key:'objetivos',label:'OKRs/Metas',weight:2},
       {key:'desenvolver',label:'Plano de desenvolvimento',weight:2},
     ]
   },
   { area:'rh', title:'Blue Ocean RH',
     description:'Entrevista para vaga de Gestor de Tráfego na Blue Ocean - ambiente de alta performance e meritocracia.',
     role_options:['entrevistador','candidato'],
     criteria:[
       {key:'experiencia_trafego',label:'Experiência em Tráfego Pago',weight:4},
       {key:'conhecimento_tecnico',label:'Conhecimento Técnico (Meta, Google, TikTok)',weight:3},
       {key:'tracking',label:'Tracking e Análise de Dados',weight:2},
       {key:'performance_mindset',label:'Mentalidade de Performance',weight:1},
     ],
     tags:['marketing_digital','trafego_pago','performance','blue_ocean'],
     persona:{
       company: 'Blue Ocean',
       culture: 'alta_performance',
       values: ['resultados', 'meritocracia', 'crescimento_acelerado'],
       tone: 'direto_e_intenso',
       style: 'focado_em_performance',
       goal: 'identificar_candidato_ideal',
       context: 'Somos a maior assessoria de marketing e vendas para SaaS do Brasil. Nossa cultura é intensa, pensamos grande e jogamos para vencer. Buscamos alguém que respire tráfego pago e queira performance máxima.',
       job_details: {
         position: 'Gestor de Tráfego',
         location: 'Presencial - Águas Claras',
         requirements: [
           'Experiência sólida em tráfego pago e performance',
           'Domínio de Meta Ads, Google Ads e TikTok Ads', 
           'Conhecimento avançado em tracking (Pixel, GTM, UTMs, API de Conversão)',
           'Perfil analítico e orientado a dados',
           'Foco em crescimento e alta performance'
         ],
         responsibilities: [
           'Criar, gerenciar e otimizar campanhas de tráfego pago',
           'Analisar métricas e KPIs para ajustes estratégicos',
           'Testar criativos, segmentações e copywriting',
           'Dominar rastreamento de dados',
           'Trabalhar com designers e copywriters',
           'Gerar relatórios e insights'
         ],
         differentials: [
           'Experiência com automação de marketing',
           'Conhecimento em funis de vendas',
           'Histórico de escalar campanhas'
         ]
       }
     }
   },

  // ===== Comercial (6) =====
  { area:'comercial', title:'Prospecção Fria',
    role_options:['vendedor','cliente'],
    criteria:[
      {key:'abertura',label:'Abertura/rapport',weight:2},
      {key:'descoberta',label:'Descoberta (SPIN)',weight:4},
      {key:'valor',label:'Proposta de valor',weight:2},
      {key:'proximo',label:'Próximo passo',weight:2},
    ]
  },
  { area:'comercial', title:'Qualificação de Lead',
    role_options:['vendedor','cliente'],
    criteria:[
      {key:'fit',label:'Fit/ICP',weight:3},
      {key:'dor',label:'Dores e urgência',weight:3},
      {key:'autoridade',label:'Decisor/Orçamento',weight:2},
      {key:'next',label:'Agendamento',weight:2},
    ]
  },
  { area:'comercial', title:'Demonstração de Solução',
    role_options:['vendedor','decisor'],
    criteria:[
      {key:'alinhamento',label:'Mapeou necessidades',weight:3},
      {key:'valor',label:'Valor tangível',weight:3},
      {key:'evidencias',label:'Provas/ROI',weight:2},
      {key:'encerramento',label:'Resumo e próximos passos',weight:2},
    ]
  },
  { area:'comercial', title:'Negociação de Preço',
    role_options:['vendedor','comprador'],
    criteria:[
      {key:'preparo',label:'Estratégia e âncoras',weight:3},
      {key:'obje',label:'Contorno de objeções',weight:3},
      {key:'trocas',label:'Concessões',weight:2},
      {key:'fechamento',label:'Fechamento',weight:2},
    ]
  },
  { area:'comercial', title:'Fechamento',
    role_options:['vendedor','comprador'],
    criteria:[
      {key:'urgencia',label:'Criar urgência saudável',weight:3},
      {key:'risco',label:'Riscos e mitigação',weight:3},
      {key:'proxima',label:'Próxima etapa clara',weight:4},
    ]
  },
  { area:'comercial', title:'Pós-venda e Upsell',
    role_options:['cs','cliente'],
    criteria:[
      {key:'sucesso',label:'Sucesso do cliente',weight:3},
      {key:'oportunidade',label:'Upsell consultivo',weight:3},
      {key:'renovacao',label:'Renovação/Health',weight:4},
    ]
  },

  // ===== Educacional (6) =====
  { area:'educacional', title:'Aula – Baixo Engajamento',
    role_options:['professor','alunos'],
    criteria:[
      {key:'abertura',label:'Abertura e objetivos',weight:3},
      {key:'interacao',label:'Interação/atividade',weight:3},
      {key:'clareza',label:'Clareza/ritmo',weight:2},
      {key:'enc',label:'Encerramento/recall',weight:2},
    ]
  },
  { area:'educacional', title:'Reunião com Pais',
    role_options:['professor','pais'],
    criteria:[
      {key:'empatia',label:'Empatia e escuta',weight:3},
      {key:'dados',label:'Evidências do aluno',weight:3},
      {key:'plano',label:'Plano de apoio',weight:2},
      {key:'acordo',label:'Acordos/seguimento',weight:2},
    ]
  },
  { area:'educacional', title:'Feedback ao Aluno',
    role_options:['professor','aluno'],
    criteria:[
      {key:'especifico',label:'Feedback específico',weight:3},
      {key:'motiv',label:'Motivação',weight:3},
      {key:'orient',label:'Orientação prática',weight:2},
      {key:'proximo',label:'Próximo objetivo',weight:2},
    ]
  },
  { area:'educacional', title:'Conflito em Sala',
    role_options:['mediador','envolvido'],
    criteria:[
      {key:'mediacao',label:'Mediação e respeito',weight:4},
      {key:'regras',label:'Regras e consequências',weight:3},
      {key:'restaurativa',label:'Práticas restaurativas',weight:3},
    ]
  },
  { area:'educacional', title:'Apresentação de Projeto',
    role_options:['avaliador','grupo'],
    criteria:[
      {key:'estrutura',label:'Estrutura/clareza',weight:3},
      {key:'dominio',label:'Domínio do tema',weight:3},
      {key:'tempo',label:'Gestão do tempo',weight:2},
      {key:'recomend',label:'Recomendações',weight:2},
    ]
  },
  { area:'educacional', title:'Necessidades Especiais',
    role_options:['professor','responsavel'],
    criteria:[
      {key:'acolhimento',label:'Acolhimento',weight:3},
      {key:'adaptacoes',label:'Adaptações',weight:3},
      {key:'parceria',label:'Parceria família-escola',weight:2},
      {key:'acomp',label:'Acompanhamento',weight:2},
    ]
  },

  // ===== Gestão (6) =====
  { area:'gestao', title:'1:1 de Performance',
    role_options:['gestor','liderado'],
    criteria:[
      {key:'dados',label:'Evidências',weight:3},
      {key:'apoio',label:'Apoio/recursos',weight:3},
      {key:'plano',label:'Plano 30/60/90',weight:2},
      {key:'acordos',label:'Acordos',weight:2},
    ]
  },
  { area:'gestao', title:'Conflito entre Times',
    role_options:['gestor','parte'],
    criteria:[
      {key:'escuta',label:'Escuta/neutralidade',weight:3},
      {key:'causa',label:'Causa-raiz',weight:3},
      {key:'acordo',label:'Acordo/SLAs',weight:2},
      {key:'follow',label:'Follow-up',weight:2},
    ]
  },
  { area:'gestao', title:'Delegação Crítica',
    role_options:['gestor','responsavel'],
    criteria:[
      {key:'claridade',label:'Claridade do objetivo',weight:3},
      {key:'autonomia',label:'Autonomia/limites',weight:3},
      {key:'risco',label:'Riscos/contingência',weight:2},
      {key:'check',label:'Checkpoints',weight:2},
    ]
  },
  { area:'gestao', title:'Mudança Organizacional',
    role_options:['gestor','time'],
    criteria:[
      {key:'contexto',label:'Contexto/porquê',weight:3},
      {key:'comunic',label:'Comunicação/ritmo',weight:3},
      {key:'apoio',label:'Apoio a impactos',weight:2},
      {key:'engaj',label:'Engajamento',weight:2},
    ]
  },
  { area:'gestao', title:'Gestão de Crise',
    role_options:['gestor','stakeholder'],
    criteria:[
      {key:'situacao',label:'Diagnóstico/impacto',weight:3},
      {key:'plano',label:'Plano/contingência',weight:3},
      {key:'comun',label:'Comunicação',weight:2},
      {key:'decisao',label:'Decisão com dados',weight:2},
    ]
  },
  { area:'gestao', title:'Mentoria de Sucessão',
    role_options:['mentor','mentorado'],
    criteria:[
      {key:'potencial',label:'Potencial/forças',weight:3},
      {key:'rota',label:'Plano de carreira',weight:3},
      {key:'exposicao',label:'Exposição/oportunidades',weight:2},
      {key:'acomp',label:'Acompanhamento',weight:2},
    ]
  },
];

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Use POST", { 
      status: 405, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  try {
    console.log(`Starting seed of ${S.length} scenarios...`);
    
    let successCount = 0;
    let errorCount = 0;

    for (const s of S) {
      try {
        const { error } = await sb.from("scenarios").upsert({
          area: s.area, 
          title: s.title, 
          description: s.description || null,
          role_options: s.role_options, 
          criteria: s.criteria, 
          tags: s.tags || null,
          persona: s.persona || null
        }, { onConflict: "title" });

        if (error) {
          console.error(`Error seeding scenario "${s.title}":`, error);
          errorCount++;
        } else {
          successCount++;
          console.log(`✓ Seeded: ${s.area} - ${s.title}`);
        }
      } catch (err) {
        console.error(`Exception seeding scenario "${s.title}":`, err);
        errorCount++;
      }
    }

    console.log(`Seed completed: ${successCount} success, ${errorCount} errors`);

    return new Response(JSON.stringify({
      ok: true, 
      total: S.length,
      success: successCount,
      errors: errorCount
    }), {
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error('Fatal error during seed:', error);
    return new Response(JSON.stringify({
      ok: false,
      error: error.message
    }), {
      status: 500,
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json'
      }
    });
  }
});