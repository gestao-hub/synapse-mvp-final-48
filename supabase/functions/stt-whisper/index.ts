import { serve } from "https://deno.land/std@0.177.0/http/server.ts"

serve(async (req) => {
  console.log(`🎤 STT Request: ${req.method} from ${req.headers.get("origin")}`)
  
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors() })
  
  try {
    const apiKey = Deno.env.get("OPENAI_API_KEY")
    if (!apiKey) {
      console.error("❌ OPENAI_API_KEY ausente")
      return json({ error: "OPENAI_API_KEY ausente" }, 500)
    }

    const ct = req.headers.get("content-type") || ""
    console.log("📝 Content-Type:", ct)
    
    if (!ct.includes("multipart/form-data")) {
      console.error("❌ Content-Type inválido:", ct)
      return json({ error: "Envie multipart/form-data com campo 'file'" }, 400)
    }

    const form = await req.formData()
    const file = form.get("file") as File | null
    
    if (!file) {
      console.error("❌ Campo 'file' não enviado")
      return json({ error: "Campo 'file' não enviado" }, 400)
    }
    
    console.log("📁 Arquivo recebido:", {
      name: file.name,
      type: file.type,
      size: file.size
    })

    const whisperForm = new FormData()
    whisperForm.append("file", file, file.name || "audio.webm")
    whisperForm.append("model", "whisper-1")
    whisperForm.append("language", "pt")

    console.log("🤖 Enviando para OpenAI Whisper...")
    const r = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}` },
      body: whisperForm,
    })
    
    console.log("📡 Resposta OpenAI:", r.status, r.statusText)
    
    if (!r.ok) {
      const errorText = await r.text()
      console.error("❌ Erro OpenAI:", errorText)
      return json({ error: `OpenAI Error: ${errorText}` }, r.status)
    }

    const data = await r.json()
    const transcriptText = data.text?.trim() || ""
    
    console.log("✅ Transcrição:", {
      length: transcriptText.length,
      preview: transcriptText.substring(0, 100)
    })
    
    return json({ text: transcriptText }, 200)
  } catch (e) {
    console.error("❌ Erro interno:", e)
    return json({ error: e?.message ?? "Erro interno do servidor" }, 500)
  }
})

function cors() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST,OPTIONS",
  }
}
function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", ...cors() } })
}