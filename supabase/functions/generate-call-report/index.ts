import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

serve(async (req) => {
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
    const { session, messages, track } = await req.json();

    if (!session || !messages || !track) {
      return new Response(JSON.stringify({ 
        error: 'Session, messages e track são obrigatórios' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Preparar contexto específico por track
    const trackContexts = {
      comercial: {
        skills: ['comunicação', 'persuasão', 'objeções', 'fechamento'],
        objectives: 'vendas consultivas, superação de objeções, identificação de necessidades'
      },
      rh: {
        skills: ['comunicação não-violenta', 'empatia', 'feedback construtivo', 'resolução de conflitos'],
        objectives: 'feedback efetivo, gestão de pessoas, comunicação empática'
      },
      educacional: {
        skills: ['didática', 'engajamento', 'adaptação metodológica', 'gestão de turma'],
        objectives: 'ensino efetivo, engajamento de alunos, metodologias ativas'
      },
      gestao: {
        skills: ['liderança', 'tomada de decisão', 'comunicação estratégica', 'gestão de mudanças'],
        objectives: 'liderança efetiva, gestão estratégica, comunicação organizacional'
      }
    };

    const context = trackContexts[track as keyof typeof trackContexts] || trackContexts.comercial;

    // Construir transcript da conversa
    const transcript = messages
      .map((m: any) => `${m.role === 'user' ? 'Usuário' : 'IA'}: ${m.content}`)
      .join('\n');

    const systemPrompt = `
Você é um especialista em análise de performance para treinamentos de ${track}.

Analise esta conversa de treinamento e gere um relatório detalhado em português brasileiro.

CONTEXTO DO TRACK:
- Habilidades-chave: ${context.skills.join(', ')}
- Objetivos: ${context.objectives}

INSTRUÇÕES:
1. Avalie a performance geral (0-100%)
2. Analise cada habilidade-chave individualmente (0-100%)
3. Identifique pontos fortes (3-5 itens)
4. Identifique áreas de melhoria (3-5 itens)
5. Crie um resumo executivo da conversa

FORMATO DE RESPOSTA (JSON):
{
  "overall_score": number,
  "skills_breakdown": {
    "communication": number,
    "empathy": number,
    "problem_solving": number,
    "technical_knowledge": number
  },
  "highlights": ["ponto forte 1", "ponto forte 2"],
  "improvement_areas": ["área 1", "área 2"],
  "transcript_summary": "resumo executivo"
}

CONVERSA ANALISADA:
${transcript}
`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt }
        ],
        max_completion_tokens: 1000,
        temperature: 0.3,
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenAI API error:', error);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const reportData = JSON.parse(data.choices[0].message.content);

    console.log('Call report generated successfully');

    return new Response(JSON.stringify(reportData), {
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json' 
      }
    });

  } catch (error) {
    console.error('Error in generate-call-report:', error);
    return new Response(JSON.stringify({ 
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