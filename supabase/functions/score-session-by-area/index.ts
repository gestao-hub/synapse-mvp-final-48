import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY")!;
const ALLOWED = ["https://id-preview--3b4bbca7-4357-4d2e-8f56-d2294f9f3d9a.lovable.app", "http://localhost:5173", "*"];

function cors(origin: string | null) {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
    "Content-Type": "application/json"
  };
}

function getMetricsByArea(area: string) {
  const metrics = {
    'rh': [
      { key: 'comunicacao_clara', label: 'Comunicação Clara' },
      { key: 'escuta_ativa', label: 'Escuta Ativa' },
      { key: 'empatia', label: 'Empatia' },
      { key: 'gestao_conflitos', label: 'Gestão de Conflitos' },
      { key: 'plano_acao', label: 'Plano de Ação' }
    ],
    'comercial': [
      { key: 'tecnicas_venda', label: 'Técnicas de Venda' },
      { key: 'relacionamento_cliente', label: 'Relacionamento Cliente' },
      { key: 'negociacao', label: 'Negociação' },
      { key: 'prospeccao', label: 'Prospecção' },
      { key: 'fechamento', label: 'Fechamento' }
    ],
    'educacional': [
      { key: 'clareza_didatica', label: 'Clareza Didática' },
      { key: 'engajamento', label: 'Engajamento' },
      { key: 'adaptabilidade', label: 'Adaptabilidade' },
      { key: 'feedback_construtivo', label: 'Feedback Construtivo' },
      { key: 'motivacao', label: 'Motivação' }
    ],
    'gestao': [
      { key: 'lideranca_estrategica', label: 'Liderança Estratégica' },
      { key: 'comunicacao_executiva', label: 'Comunicação Executiva' },
      { key: 'tomada_decisao', label: 'Tomada de Decisão' },
      { key: 'influencia_persuasao', label: 'Influência e Persuasão' },
      { key: 'gestao_conflitos', label: 'Gestão de Conflitos' }
    ]
  };
  return metrics[area as keyof typeof metrics] || [];
}

function buildPrompt(area: string, transcript: string) {
  const areaMetrics = getMetricsByArea(area);
  const metricsText = areaMetrics.map(m => `- ${m.label}`).join('\n');
  
  const areaContexts = {
    'rh': 'Avaliador RH brasileiro.',
    'comercial': 'Especialista vendas brasileiro.',
    'educacional': 'Especialista educação brasileiro.',
    'gestao': 'Especialista liderança brasileiro.'
  };

  return `${areaContexts[area as keyof typeof areaContexts]} Avalie 0-10:
${metricsText}
JSON: {"metrics":{${areaMetrics.map(m => `"${m.key}":X`).join(',')}},"score":X,"observacoes":"..."}
Transcript: ${transcript}`.trim();
}

serve(async (req) => {
  const headers = cors(req.headers.get("origin"));
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers });
  if (req.method !== "POST") return new Response(JSON.stringify({ error: "Método não permitido" }), { status: 405, headers });

  try {
    const { transcript, area = 'rh' } = await req.json();
    if (!transcript) return new Response(JSON.stringify({ error: "transcript obrigatório" }), { status: 400, headers });

    console.log("🔍 Iniciando análise:", { area, transcriptLength: transcript.length });
    
    if (!OPENAI_API_KEY) {
      console.error("❌ OPENAI_API_KEY não configurada");
      return new Response(JSON.stringify({ error: "Chave da API não configurada" }), { status: 500, headers });
    }

    const prompt = buildPrompt(area, transcript);
    console.log("📝 Prompt gerado:", prompt.substring(0, 200) + "...");

    console.log("🚀 Enviando para OpenAI...");
    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${OPENAI_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ 
        model: "gpt-5-nano-2025-08-07", 
        max_completion_tokens: 500,
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }
      })
    });
    
    console.log("📥 Resposta OpenAI:", { status: r.status, ok: r.ok });
    const data = await r.json();
    
    if (!r.ok) {
      console.error("❌ Erro da OpenAI:", data);
      return new Response(JSON.stringify({ error: data?.error?.message || "Falha no score" }), { status: 400, headers });
    }

    let parsed; 
    try { 
      parsed = JSON.parse(data.choices?.[0]?.message?.content || "{}"); 
    } catch { 
      parsed = {}; 
    }
    
    // Log detalhado da resposta para debug
    console.log("✅ Análise concluída:", {
      area,
      score: parsed.score,
      metrics: parsed.metrics,
      observacoes: parsed.observacoes,
      rawResponse: data.choices?.[0]?.message?.content
    });
    
    return new Response(JSON.stringify(parsed), { status: 200, headers });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || "Erro interno" }), { status: 500, headers });
  }
});