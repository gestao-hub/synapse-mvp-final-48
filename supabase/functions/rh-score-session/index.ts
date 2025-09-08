import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY")!;
const ALLOWED = [
  "https://preview--synapse-voice-coach.lovable.app", 
  "http://localhost:5173",
  "https://excluvia.com.br",
  "https://www.excluvia.com.br"
];

function cors(origin: string | null) {
  const allow = origin && ALLOWED.includes(origin) ? origin : ALLOWED[0];
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
    "Content-Type": "application/json"
  };
}

serve(async (req) => {
  const headers = cors(req.headers.get("origin"));
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers });
  if (req.method !== "POST") return new Response(JSON.stringify({ error: "Método não permitido" }), { status: 405, headers });

  try {
    console.log("📊 RH Score Session iniciado");
    const { transcript } = await req.json();
    console.log("📝 Transcript recebido:", { 
      hasTranscript: !!transcript, 
      length: transcript?.length || 0,
      preview: transcript?.substring(0, 100) || "vazio"
    });
    
    if (!transcript) {
      console.error("❌ Transcript não fornecido");
      return new Response(JSON.stringify({ error: "transcript obrigatório" }), { status: 400, headers });
    }

    const prompt = `Avaliador RH brasileiro. Avalie 0-10: Comunicação, Escuta Ativa, Empatia, Conflitos, Plano de Ação.
JSON: {"metrics":{"comunicacao":X,"escuta":X,"empatia":X,"conflitos":X,"plano":X},"score":X,"observacoes":"..."}
Transcript: ${transcript}`.trim();

    console.log("🤖 Enviando para GPT-4...");
    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${OPENAI_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ 
        model: "gpt-4", 
        max_tokens: 500,
        temperature: 0.3,
        messages: [{ role: "user", content: prompt }] 
      })
    });
    const data = await r.json();
    console.log("📡 Resposta GPT:", { status: r.status, ok: r.ok });
    
    if (!r.ok) {
      console.error("❌ Erro na OpenAI:", data);
      return new Response(JSON.stringify({ error: data?.error?.message || "Falha no score" }), { status: 400, headers });
    }

    const content = data.choices?.[0]?.message?.content;
    console.log("📋 Conteúdo retornado:", content);
    
    let parsed; 
    try { 
      parsed = JSON.parse(content || "{}"); 
      console.log("✅ JSON parseado:", parsed);
    } catch (parseError) { 
      console.error("❌ Erro ao fazer parse:", parseError, "Conteúdo:", content);
      parsed = { score: 5, observacoes: "Erro ao processar avaliação" }; 
    }
    
    // Garantir score válido
    if (typeof parsed.score !== 'number') {
      parsed.score = 5;
      console.log("⚠️ Score inválido, usando valor padrão: 5");
    }
    
    console.log("🎯 Retornando resultado:", parsed);
    return new Response(JSON.stringify(parsed), { status: 200, headers });
  } catch (e: any) {
    console.error("💥 Erro geral:", e);
    return new Response(JSON.stringify({ error: e?.message || "Erro interno" }), { status: 500, headers });
  }
});