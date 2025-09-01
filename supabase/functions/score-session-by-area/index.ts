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
    'rh': 'Você é um avaliador de RH brasileiro especializado em competências comportamentais e de gestão de pessoas.',
    'comercial': 'Você é um especialista em vendas brasileiro avaliando competências comerciais e de relacionamento com clientes.',
    'educacional': 'Você é um especialista em educação brasileiro avaliando competências pedagógicas e de facilitação.',
    'gestao': 'Você é um especialista em liderança brasileiro avaliando competências executivas e de gestão estratégica.'
  };

  return `
IMPORTANTE: Responda SEMPRE em PORTUGUÊS BRASILEIRO. Nunca use espanhol, inglês ou qualquer outro idioma.

${areaContexts[area as keyof typeof areaContexts]}

Avalie o transcript abaixo de 0 a 10 nas seguintes métricas específicas da área ${area}:
${metricsText}

Responda APENAS com JSON puro no formato:
{
  "metrics": {
    ${areaMetrics.map(m => `"${m.key}": X`).join(',\n    ')}
  },
  "score": X,
  "observacoes": "Observações específicas em português brasileiro..."
}

Transcript:
${transcript}`.trim();
}

serve(async (req) => {
  const headers = cors(req.headers.get("origin"));
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers });
  if (req.method !== "POST") return new Response(JSON.stringify({ error: "Método não permitido" }), { status: 405, headers });

  try {
    const { transcript, area = 'rh' } = await req.json();
    if (!transcript) return new Response(JSON.stringify({ error: "transcript obrigatório" }), { status: 400, headers });

    const prompt = buildPrompt(area, transcript);

    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${OPENAI_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ 
        model: "gpt-4-1106-preview", 
        temperature: 0.2, 
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }
      })
    });
    
    const data = await r.json();
    if (!r.ok) return new Response(JSON.stringify({ error: data?.error?.message || "Falha no score" }), { status: 400, headers });

    let parsed; 
    try { 
      parsed = JSON.parse(data.choices?.[0]?.message?.content || "{}"); 
    } catch { 
      parsed = {}; 
    }
    
    return new Response(JSON.stringify(parsed), { status: 200, headers });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || "Erro interno" }), { status: 500, headers });
  }
});