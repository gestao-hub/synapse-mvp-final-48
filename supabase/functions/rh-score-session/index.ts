import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY")!;
const ALLOWED = ["https://preview--synapse-voice-coach.lovable.app", "http://localhost:5173"];

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
    const { transcript } = await req.json();
    if (!transcript) return new Response(JSON.stringify({ error: "transcript obrigatório" }), { status: 400, headers });

    const prompt = `Avaliador RH brasileiro. Avalie 0-10: Comunicação, Escuta Ativa, Empatia, Conflitos, Plano de Ação.
JSON: {"metrics":{"comunicacao":X,"escuta":X,"empatia":X,"conflitos":X,"plano":X},"score":X,"observacoes":"..."}
Transcript: ${transcript}`.trim();

    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${OPENAI_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: "gpt-5-mini-2025-08-07", max_completion_tokens: 300, messages: [{ role: "user", content: prompt }] })
    });
    const data = await r.json();
    if (!r.ok) return new Response(JSON.stringify({ error: data?.error?.message || "Falha no score" }), { status: 400, headers });

    let parsed; try { parsed = JSON.parse(data.choices?.[0]?.message?.content || "{}"); } catch { parsed = {}; }
    return new Response(JSON.stringify(parsed), { status: 200, headers });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || "Erro interno" }), { status: 500, headers });
  }
});