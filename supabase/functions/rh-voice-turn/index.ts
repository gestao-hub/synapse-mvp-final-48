import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

function getCorsHeaders(origin: string | null) {
  const ALLOWED_ORIGINS = [
    "https://preview--synapse-voice-coach.lovable.app",
    "http://localhost:5173",
    "https://excluvia.com.br",
    "https://www.excluvia.com.br"
  ];
  const allowedOrigin = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json",
    "Vary": "Origin"
  };
}

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY")!;

const SYSTEM_PROMPT = `
IMPORTANTE: Você DEVE falar exclusivamente em PORTUGUÊS BRASILEIRO. Nunca use espanhol, inglês ou qualquer outro idioma.

Você é um COLABORADOR brasileiro em uma conversa com RH/gestor.
Objetivo: ser um colaborador realista e profissional que responde adequadamente ao contexto da conversa.

Seu papel:
- Se for feedback: seja um colaborador receptivo mas também realista sobre desafios
- Se for entrevista: seja um candidato genuíno demonstrando qualificações
- Se for mediação: apresente seu ponto de vista de forma construtiva

Regras:
- Fale APENAS em português brasileiro
- Mensagens naturais e diretas (2-4 frases)
- Seja colaborativo mas não submisso
- Forneça exemplos concretos quando solicitado
- Linguagem respeitosa, direta e profissional
`;

serve(async (req) => {
  const origin = req.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);
  
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Método não permitido" }), { status: 405, headers: corsHeaders });
  }
  try {
    console.log("🎤 RH Voice Turn iniciado:", { 
      method: req.method, 
      origin: req.headers.get("origin"),
      contentType: req.headers.get("content-type") 
    });

    let audioFile: File | null = null;
    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      console.log("📝 Processando multipart/form-data");
      const form = await req.formData();
      audioFile = form.get("audio") as File | null;
    } else {
      console.log("📝 Processando JSON com audioBase64");
      const body = await req.json().catch(() => ({}));
      if (body?.audioBase64) {
        const bin = Uint8Array.from(atob(body.audioBase64), c => c.charCodeAt(0));
        audioFile = new File([bin], "audio.webm", { type: "audio/webm" });
      }
    }

    if (!audioFile) {
      console.error("❌ Nenhum arquivo de áudio recebido");
      return new Response(JSON.stringify({ error: "Envie 'audio' (form-data) ou 'audioBase64' (JSON)." }), {
        status: 400, headers: corsHeaders
      });
    }

    console.log("🎧 Arquivo de áudio recebido:", {
      name: audioFile.name,
      type: audioFile.type,
      size: audioFile.size
    });

    // 1) Transcrição (OpenAI Whisper)
    console.log("🤖 Enviando para Whisper...");
    const fd = new FormData();
    fd.append("file", audioFile, audioFile.name || "audio.webm");
    fd.append("model", "whisper-1");
    fd.append("language", "pt");
    const sttRes = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: { Authorization: `Bearer ${OPENAI_API_KEY}` },
      body: fd
    });
    const sttJson = await sttRes.json();
    console.log("📡 Resposta Whisper:", { status: sttRes.status, ok: sttRes.ok });
    if (!sttRes.ok) {
      console.error("❌ Erro no Whisper:", sttJson);
      throw new Error(sttJson?.error?.message || "Falha no Whisper");
    }
    const transcript: string = sttJson.text || "";
    console.log("✅ Transcrição:", { length: transcript.length, preview: transcript.substring(0, 100) });

    // 2) Resposta (GPT)
    console.log("💬 Enviando para GPT-4...");
    const chatRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4",
        max_tokens: 500,
        temperature: 0.6,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: transcript }
        ]
      })
    });
    const chatJson = await chatRes.json();
    console.log("🤖 Resposta GPT:", { status: chatRes.status, ok: chatRes.ok });
    if (!chatRes.ok) {
      console.error("❌ Erro no GPT:", chatJson);
      throw new Error(chatJson?.error?.message || "Falha no Chat");
    }
    const assistantText: string = chatJson.choices?.[0]?.message?.content?.trim() || "Obrigado! Poderia repetir?";
    console.log("✅ Resposta gerada:", { length: assistantText.length, preview: assistantText.substring(0, 100) });

    // 3) TTS (OpenAI)
    console.log("🔊 Enviando para TTS...");
    const ttsRes = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "tts-1",
        voice: "alloy",
        input: assistantText,
        response_format: "mp3"
      })
    });
    console.log("🎵 Resposta TTS:", { status: ttsRes.status, ok: ttsRes.ok });
    if (!ttsRes.ok) {
      const errTxt = await ttsRes.text();
      console.error("❌ Erro no TTS:", errTxt);
      throw new Error(`Falha no TTS: ${errTxt}`);
    }
    const audioBuf = new Uint8Array(await ttsRes.arrayBuffer());
    const audioBase64 = btoa(String.fromCharCode(...audioBuf));
    console.log("✅ Áudio gerado:", { size: audioBuf.length, base64Length: audioBase64.length });

    console.log("🎯 Processamento completo com sucesso");
    return new Response(JSON.stringify({ 
      ok: true, 
      transcript, 
      assistantText, 
      audioBase64 
    }), { status: 200, headers: corsHeaders });
  } catch (e) {
    console.error("💥 Erro geral:", e);
    const corsHeaders = getCorsHeaders(req.headers.get("origin"));
    return new Response(JSON.stringify({ error: e?.message || "Erro interno" }), { status: 500, headers: corsHeaders });
  }
});