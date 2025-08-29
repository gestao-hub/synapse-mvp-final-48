import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { track, scenario, system_prompt, voice_id } = await req.json().catch(() => ({}));
    console.log("Creating OpenAI realtime session for:", { track, scenario });
    
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY is not set');
      throw new Error('OPENAI_API_KEY is not set');
    }

    // Contextos específicos por track com mensagens iniciais
    const trackInstructions = {
      comercial: `Você é um cliente brasileiro interessado mas cético em uma simulação de vendas. 
        
        SEMPRE INICIE A CONVERSA COM: "Olá! Estamos aqui para a [nome do cenário]. Sou [sua persona específica]. Como você pode me ajudar?"
        
        Depois:
        - Faça perguntas sobre soluções e preços
        - Demonstre objeções realistas de valor
        - Seja educado mas direto sobre suas necessidades
        - Teste a capacidade do vendedor de descobrir suas dores`,
      
      rh: `Você é um colaborador brasileiro em uma simulação de RH/feedback. 
        
        SEMPRE INICIE A CONVERSA COM: "Oi! Vim para nossa conversa sobre [cenário específico]. O que precisamos discutir?"
        
        Depois:
        - Seja inicialmente um pouco defensivo mas aberto ao diálogo
        - Responda às técnicas de comunicação não-violenta
        - Faça perguntas sobre desenvolvimento`,
      
      educacional: `Você é um aluno brasileiro em uma simulação educacional. 
        
        SEMPRE INICIE A CONVERSA COM: "Oi professor! Estamos na aula sobre [cenário]. Pode me explicar melhor?"
        
        Depois:
        - Demonstre curiosidade ou dificuldades iniciais
        - Faça perguntas quando não entender
        - Responda positivamente a técnicas pedagógicas efetivas`,
      
      gestao: `Você é um membro da equipe brasileiro em uma simulação de gestão. 
        
        SEMPRE INICIE A CONVERSA COM: "Oi! Recebi que precisamos conversar sobre [cenário]. O que está acontecendo?"
        
        Depois:
        - Apresente preocupações válidas sobre mudanças
        - Questione decisões quando necessário
        - Seja colaborativo quando o líder demonstrar empatia`
    };

    const baseInstruction = trackInstructions[track as keyof typeof trackInstructions] || trackInstructions.educacional;
    
    const contextualPrompt = `
IMPORTANTE: Você DEVE falar exclusivamente em PORTUGUÊS BRASILEIRO.

${baseInstruction}

CONTEXTO ESPECÍFICO DO CENÁRIO:
${system_prompt || 'Simulação profissional geral'}

NOME DO CENÁRIO: ${scenario || 'Conversa profissional'}

REGRAS ESSENCIAIS:
- INICIE A CONVERSA IMEDIATAMENTE após conectar (não espere o usuário falar primeiro)
- Sua primeira fala deve contextualizar o cenário e explicar quem você é
- Fale APENAS em português brasileiro natural
- Mantenha respostas curtas e conversacionais (máximo 3 frases)
- Use expressões brasileiras naturais
- Adapte-se completamente ao contexto específico fornecido
- Termine com perguntas para manter a conversa fluindo
- Seja realista e desafiador dentro do contexto

IMPORTANTE: FALE PRIMEIRO! Não espere o usuário começar. Sua primeira mensagem DEVE sempre contextualizar o cenário.
`;

    // Request an ephemeral token from OpenAI
    const response = await fetch("https://api.openai.com/v1/realtime/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-realtime-preview-2024-12-17",
        voice: voice_id || "alloy",
        modalities: ["audio", "text"],
        instructions: contextualPrompt,
        input_audio_transcription: {
          model: "whisper-1",
          language: "pt"
        },
        turn_detection: {
          type: "server_vad",
          threshold: 0.5,
          prefix_padding_ms: 300,
          silence_duration_ms: 500
        },
        temperature: 0.8
      }),
    });

    console.log("OpenAI response status:", response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI error:", errorText);
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log("OpenAI response:", JSON.stringify(data, null, 2));

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});