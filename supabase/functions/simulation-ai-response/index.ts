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
      transcript, 
      scenario_persona, 
      conversation_history = [],
      user_role,
      criteria = []
    } = await req.json();

    if (!transcript) {
      return new Response(JSON.stringify({ error: 'Transcript is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log('Processing turn with transcript:', transcript);

    // Build context for the AI - Use system_prompt if available, otherwise build from persona
    const systemPrompt = scenario_persona && typeof scenario_persona === 'object' && scenario_persona.system_prompt 
      ? scenario_persona.system_prompt
      : `
IMPORTANTE: Você DEVE falar exclusivamente em PORTUGUÊS BRASILEIRO. Nunca use espanhol, inglês ou qualquer outro idioma.

Você está conduzindo uma simulação de treinamento interpessoal.

CONTEXTO DA SIMULAÇÃO:
- Persona/Instruções: ${scenario_persona ? (typeof scenario_persona === 'string' ? scenario_persona : JSON.stringify(scenario_persona)) : 'Atue de forma natural e profissional'}
- Papel do usuário: ${user_role}
- Critérios de avaliação: ${criteria.map(c => `${c.label} (peso ${c.weight})`).join(', ')}

INSTRUÇÕES:
1. Responda SEMPRE em português brasileiro
2. Responda como o personagem descrito na persona
3. Mantenha a simulação realística e envolvente
4. Forneça desafios apropriados para o papel do usuário
5. Seja conciso mas natural (máximo 100 palavras)
6. Use linguagem e expressões brasileiras

HISTÓRICO DA CONVERSA:
${conversation_history.map(h => `${h.role}: ${h.content}`).join('\n')}

Responda à última fala do usuário de forma natural e apropriada ao contexto.
`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: transcript }
        ],
        max_tokens: 200,
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenAI API error:', error);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    console.log('AI response generated:', aiResponse);

    return new Response(JSON.stringify({ 
      response: aiResponse,
      usage: data.usage
    }), {
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json' 
      }
    });

  } catch (error) {
    console.error('Error in simulation-ai-response:', error);
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