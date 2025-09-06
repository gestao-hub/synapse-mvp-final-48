import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
  console.log("🎬 Edge function score-session-by-area iniciada");
  
  if (req.method === "OPTIONS") {
    console.log("⚡ CORS preflight request");
    return new Response(null, { status: 204, headers: corsHeaders });
  }
  
  if (req.method !== "POST") {
    console.log("❌ Método não permitido:", req.method);
    return new Response(JSON.stringify({ error: "Método não permitido" }), { 
      status: 405, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  try {
    console.log("🔍 Fazendo parse do body...");
    const { transcript, area = 'rh' } = await req.json();
    console.log("📋 Dados recebidos:", { 
      área: area,
      transcriptLength: transcript?.length,
      hasTranscript: !!transcript 
    });
    
    if (!transcript) {
      console.log("❌ Transcript não fornecido");
      return new Response(JSON.stringify({ error: "transcript obrigatório" }), { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const apiKey = Deno.env.get('OPENAI_API_KEY');
    console.log("🔑 API Key status:", { hasKey: !!apiKey });
    
    if (!apiKey) {
      console.error("❌ OPENAI_API_KEY não configurada");
      return new Response(JSON.stringify({ error: "Chave da API não configurada" }), { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Prompt simplificado
    const prompt = `Você é um avaliador brasileiro especializado em ${area}. 
Avalie o seguinte transcript de 0 a 10 em termos de desempenho geral.
Retorne APENAS um JSON no formato: {"score": X, "observacoes": "..."}

Transcript: ${transcript}`;

    console.log("🚀 Enviando para OpenAI...");
    
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { 
        "Authorization": `Bearer ${apiKey}`, 
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({ 
        model: "gpt-4o-mini", // Modelo mais estável 
        max_tokens: 200,
        temperature: 0.3,
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }
      })
    });
    
    console.log("📥 Status da resposta OpenAI:", response.status, response.ok);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error("❌ Erro da OpenAI:", errorData);
      return new Response(JSON.stringify({ 
        error: "Erro na API da OpenAI",
        details: errorData 
      }), { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    const data = await response.json();
    console.log("🔍 Resposta completa da OpenAI:", data);
    
    const content = data.choices?.[0]?.message?.content;
    console.log("📝 Conteúdo retornado:", content);
    
    if (!content) {
      console.error("❌ Nenhum conteúdo retornado");
      return new Response(JSON.stringify({ 
        error: "Nenhum conteúdo retornado pela IA"
      }), { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    let parsed;
    try {
      parsed = JSON.parse(content);
      console.log("✅ JSON parseado:", parsed);
    } catch (parseError) {
      console.error("❌ Erro ao fazer parse:", parseError);
      return new Response(JSON.stringify({ 
        error: "Erro ao fazer parse da resposta da IA",
        rawContent: content
      }), { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // Garantir que sempre retorna um score
    if (typeof parsed.score !== 'number') {
      parsed.score = 5; // Score padrão
      console.log("⚠️ Score não encontrado, usando valor padrão: 5");
    }
    
    console.log("🎯 Retornando resultado:", parsed);
    return new Response(JSON.stringify(parsed), { 
      status: 200, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error("💥 ERRO GERAL:", error);
    return new Response(JSON.stringify({ 
      error: "Erro interno do servidor",
      message: error.message
    }), { 
      status: 500, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});