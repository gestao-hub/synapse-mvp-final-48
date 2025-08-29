import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Cenários de Gestão
    const gestaoScenarios = [
      {
        area: 'gestao',
        title: 'Reunião Estratégica Executiva',
        description: 'Defina metas trimestrais com sua equipe de liderança, alinhando objetivos e recursos.',
        role_options: ['lider', 'participante'],
        criteria: [
          { key: 'lideranca_estrategica', label: 'Liderança Estratégica', weight: 1 },
          { key: 'comunicacao_executiva', label: 'Comunicação Executiva', weight: 1 },
          { key: 'tomada_decisao', label: 'Tomada de Decisão', weight: 1 },
          { key: 'influencia_persuasao', label: 'Influência e Persuasão', weight: 1 },
          { key: 'gestao_conflitos', label: 'Gestão de Conflitos', weight: 1 }
        ],
        tags: ['gestao', 'lideranca', 'planejamento'],
        persona: {
          lider: 'Você é um diretor experiente conduzindo uma reunião estratégica. Mantenha foco nos objetivos e facilite decisões.',
          participante: 'Você é um gerente sênior participando da reunião. Contribua com insights e questione quando necessário.'
        }
      },
      {
        area: 'gestao',
        title: 'Feedback Executivo',
        description: 'Conduza uma conversa de avaliação com um colaborador sobre seu desempenho anual.',
        role_options: ['gestor', 'colaborador'],
        criteria: [
          { key: 'lideranca_estrategica', label: 'Liderança Estratégica', weight: 1 },
          { key: 'comunicacao_executiva', label: 'Comunicação Executiva', weight: 1 },
          { key: 'gestao_conflitos', label: 'Gestão de Conflitos', weight: 1 },
          { key: 'influencia_persuasao', label: 'Influência e Persuasão', weight: 1 },
          { key: 'tomada_decisao', label: 'Tomada de Decisão', weight: 0.8 }
        ],
        tags: ['gestao', 'feedback', 'performance'],
        persona: {
          gestor: 'Você é um líder experiente dando feedback construtivo. Seja específico, empático e orientado a soluções.',
          colaborador: 'Você é um funcionário recebendo feedback. Demonstre receptividade e faça perguntas para melhorar.'
        }
      },
      {
        area: 'gestao',
        title: 'Negociação Orçamentária',
        description: 'Apresente e negocie o orçamento de seu departamento para o próximo ano fiscal.',
        role_options: ['solicitante', 'aprovador'],
        criteria: [
          { key: 'comunicacao_executiva', label: 'Comunicação Executiva', weight: 1 },
          { key: 'influencia_persuasao', label: 'Influência e Persuasão', weight: 1 },
          { key: 'tomada_decisao', label: 'Tomada de Decisão', weight: 1 },
          { key: 'lideranca_estrategica', label: 'Liderança Estratégica', weight: 0.9 },
          { key: 'gestao_conflitos', label: 'Gestão de Conflitos', weight: 0.8 }
        ],
        tags: ['gestao', 'orcamento', 'negociacao'],
        persona: {
          solicitante: 'Você é um diretor defendendo seu orçamento. Use dados convincentes e seja assertivo mas flexível.',
          aprovador: 'Você é um CFO avaliando solicitações. Questione números e priorize o ROI empresarial.'
        }
      },
      {
        area: 'gestao',
        title: 'Gestão de Crise',
        description: 'Gerencie uma crise que afeta múltiplos departamentos e requer decisões rápidas.',
        role_options: ['decisor', 'reportador'],
        criteria: [
          { key: 'tomada_decisao', label: 'Tomada de Decisão', weight: 1 },
          { key: 'lideranca_estrategica', label: 'Liderança Estratégica', weight: 1 },
          { key: 'comunicacao_executiva', label: 'Comunicação Executiva', weight: 1 },
          { key: 'gestao_conflitos', label: 'Gestão de Conflitos', weight: 0.9 },
          { key: 'influencia_persuasao', label: 'Influência e Persuasão', weight: 0.8 }
        ],
        tags: ['gestao', 'crise', 'operacional'],
        persona: {
          decisor: 'Você é o CEO lidando com uma crise. Tome decisões rápidas, comunique claramente e mantenha a calma.',
          reportador: 'Você é um gerente reportando a crise. Seja objetivo, urgente e proponha soluções iniciais.'
        }
      },
      {
        area: 'gestao',
        title: 'Apresentação para Board',
        description: 'Apresente os resultados trimestrais e estratégias futuras para o conselho administrativo.',
        role_options: ['apresentador', 'conselheiro'],
        criteria: [
          { key: 'comunicacao_executiva', label: 'Comunicação Executiva', weight: 1 },
          { key: 'lideranca_estrategica', label: 'Liderança Estratégica', weight: 1 },
          { key: 'influencia_persuasao', label: 'Influência e Persuasão', weight: 0.9 },
          { key: 'tomada_decisao', label: 'Tomada de Decisão', weight: 0.8 },
          { key: 'gestao_conflitos', label: 'Gestão de Conflitos', weight: 0.7 }
        ],
        tags: ['gestao', 'board', 'resultados'],
        persona: {
          apresentador: 'Você é o CEO apresentando para o board. Seja transparente, estratégico e prepare-se para questionamentos.',
          conselheiro: 'Você é um conselheiro experiente. Faça perguntas estratégicas e avalie a viabilidade dos planos.'
        }
      },
      {
        area: 'gestao',
        title: 'Mediação Interdepartamental',
        description: 'Medite um conflito entre vendas e operações sobre prazos e expectativas de entrega.',
        role_options: ['mediador', 'parte_conflitante'],
        criteria: [
          { key: 'gestao_conflitos', label: 'Gestão de Conflitos', weight: 1 },
          { key: 'lideranca_estrategica', label: 'Liderança Estratégica', weight: 1 },
          { key: 'comunicacao_executiva', label: 'Comunicação Executiva', weight: 0.9 },
          { key: 'influencia_persuasao', label: 'Influência e Persuasão', weight: 0.8 },
          { key: 'tomada_decisao', label: 'Tomada de Decisão', weight: 0.9 }
        ],
        tags: ['gestao', 'conflito', 'departamentos'],
        persona: {
          mediador: 'Você é um diretor mediando o conflito. Ouça ambos os lados, mantenha neutralidade e busque soluções win-win.',
          parte_conflitante: 'Você representa um departamento no conflito. Defenda sua posição mas esteja aberto ao diálogo.'
        }
      },
      {
        area: 'gestao',
        title: 'Reestruturação Corporativa',
        description: 'Comunique e implemente uma reestruturação organizacional que afeta várias áreas.',
        role_options: ['lider_mudanca', 'afetado'],
        criteria: [
          { key: 'lideranca_estrategica', label: 'Liderança Estratégica', weight: 1 },
          { key: 'comunicacao_executiva', label: 'Comunicação Executiva', weight: 1 },
          { key: 'gestao_conflitos', label: 'Gestão de Conflitos', weight: 0.9 },
          { key: 'influencia_persuasao', label: 'Influência e Persuasão', weight: 0.9 },
          { key: 'tomada_decisao', label: 'Tomada de Decisão', weight: 0.8 }
        ],
        tags: ['gestao', 'reestruturacao', 'mudanca'],
        persona: {
          lider_mudanca: 'Você é um VP conduzindo a reestruturação. Seja transparente, empático e focado nos benefícios futuros.',
          afetado: 'Você é um funcionário impactado pela mudança. Expresse preocupações legítimas e busque esclarecimentos.'
        }
      },
      {
        area: 'gestao',
        title: 'Decisão de Aquisição',
        description: 'Decida sobre uma grande aquisição empresarial com múltiplas variáveis e stakeholders.',
        role_options: ['ceo', 'consultor'],
        criteria: [
          { key: 'tomada_decisao', label: 'Tomada de Decisão', weight: 1 },
          { key: 'lideranca_estrategica', label: 'Liderança Estratégica', weight: 1 },
          { key: 'comunicacao_executiva', label: 'Comunicação Executiva', weight: 0.8 },
          { key: 'influencia_persuasao', label: 'Influência e Persuasão', weight: 0.7 },
          { key: 'gestao_conflitos', label: 'Gestão de Conflitos', weight: 0.6 }
        ],
        tags: ['gestao', 'estrategia', 'aquisicao'],
        persona: {
          ceo: 'Você é o CEO avaliando uma aquisição estratégica. Pese riscos, benefícios e impactos nos stakeholders.',
          consultor: 'Você é um consultor estratégico. Forneça análises objetivas, cenários e recomendações baseadas em dados.'
        }
      }
    ];

    // Primeiro, deletar cenários existentes de gestão (para evitar duplicatas)
    await supabaseClient
      .from('scenarios')
      .delete()
      .eq('area', 'gestao');

    // Inserir os novos cenários
    const { data, error } = await supabaseClient
      .from('scenarios')
      .insert(gestaoScenarios);

    if (error) {
      console.error('Erro ao inserir cenários:', error);
      throw error;
    }

    return new Response(JSON.stringify({ 
      success: true, 
      inserted: gestaoScenarios.length,
      message: 'Cenários de gestão inseridos com sucesso!' 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Erro:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});