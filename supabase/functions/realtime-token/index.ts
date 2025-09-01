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

    // Usar o system_prompt enviado diretamente, que já contém as instruções específicas
    // Se não houver system_prompt, usar instruções básicas por track
    const fallbackInstructions = {
      comercial: `Você é um cliente brasileiro interessado em uma simulação de vendas.
        Seja educado mas apresente objeções realistas e teste o vendedor.`,
      
      rh: `Você é um colaborador brasileiro em uma simulação de RH.
        Seja inicialmente defensivo mas aberto ao diálogo e desenvolvimento.`,
      
      educacional: `Você é um aluno brasileiro em uma simulação educacional.
        Demonstre curiosidade ou dificuldades e responda positivamente a boas técnicas pedagógicas.`,
      
      gestao: `Você é um membro da equipe brasileiro em uma simulação de gestão.
        Apresente preocupações válidas mas seja colaborativo com liderança empática.`
    };

    // Usar o system_prompt enviado ou construir um otimizado
    const contextualPrompt = system_prompt || `Você é ${fallbackInstructions[track as keyof typeof fallbackInstructions] || fallbackInstructions.educacional}

CENÁRIO: ${scenario || 'Simulação profissional'}

REGRAS:
- Fale português brasileiro
- Inicie a conversa imediatamente
- Respostas curtas (máx 3 frases)
- Seja realista e desafiador
- Termine com perguntas`;

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
        temperature: 0.7,
        max_response_output_tokens: 400
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