import { serve } from "https://deno.land/std@0.177.0/http/server.ts"

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors() })
  try {
    const apiKey = Deno.env.get("OPENAI_API_KEY")
    if (!apiKey) return json({ error: "OPENAI_API_KEY ausente" }, 500)

    const ct = req.headers.get("content-type") || ""
    if (!ct.includes("multipart/form-data")) {
      return json({ error: "Envie multipart/form-data com campo 'file'" }, 400)
    }

    const form = await req.formData()
    const file = form.get("file") as File | null
    if (!file) return json({ error: "Campo 'file' não enviado" }, 400)

    const whisperForm = new FormData()
    whisperForm.append("file", file, "audio.webm")
    whisperForm.append("model", "whisper-1")

    const r = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}` },
      body: whisperForm,
    })
    if (!r.ok) return json({ error: await r.text() }, 400)

    const data = await r.json()
    return json({ text: data.text ?? "" }, 200)
  } catch (e) {
    return json({ error: e?.message ?? "erro" }, 500)
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