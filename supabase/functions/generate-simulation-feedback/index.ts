import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

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
    const { 
      conversation_history = [],
      criteria = [],
      user_role,
      scenario_title
    } = await req.json();

    console.log('Generating simulation feedback...');

    const systemPrompt = `
IMPORTANTE: Você DEVE responder exclusivamente em PORTUGUÊS BRASILEIRO. Nunca use espanhol, inglês ou qualquer outro idioma.

Você é um especialista brasileiro em avaliação de desempenho interpessoal. Analise a simulação e forneça scores e feedback em português.

SIMULAÇÃO: ${scenario_title}
PAPEL DO USUÁRIO: ${user_role}

CRITÉRIOS DE AVALIAÇÃO:
${criteria.map(c => `- ${c.label} (peso ${c.weight}): ${c.key}`).join('\n')}

CONVERSA COMPLETA:
${conversation_history.map(h => `${h.role}: ${h.content}`).join('\n')}

TAREFA:
1. Avalie cada critério com score de 0 a 10
2. Forneça feedback específico para cada critério
3. Identifique pontos positivos (highlights)
4. Sugira melhorias específicas
5. Defina próximos passos de desenvolvimento

FORMATO DE RESPOSTA JSON:
{
  "scores": [
    {
      "criterion_key": "string",
      "criterion_label": "string", 
      "weight": number,
      "score": number,
      "feedback": "string explicando o score"
    }
  ],
  "notes": {
    "highlights": ["ponto positivo 1", "ponto positivo 2"],
    "improvements": ["melhoria 1", "melhoria 2"],
    "next_steps": ["próximo passo 1", "próximo passo 2"]
  },
  "kpis": {
    "open_questions": number,
    "empathy_shown": number,
    "next_step_marked": boolean,
    "total_interactions": number
  }
}

Seja específico, construtivo e baseie-se nas evidências da conversa.
`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4-1106-preview',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: 'Analise a simulação e forneça o feedback estruturado conforme solicitado.' }
        ],
        max_tokens: 1500,
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
    const feedback = JSON.parse(data.choices[0].message.content);

    console.log('Feedback generated successfully');

    return new Response(JSON.stringify(feedback), {
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json' 
      }
    });

  } catch (error) {
    console.error('Error in generate-simulation-feedback:', error);
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