import { serve } from "https://deno.land/std@0.177.0/http/server.ts"

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors() })
  try {
    const { text } = await req.json()
    if (!text) return json({ error: "Campo 'text' obrigatório" }, 400)

    const apiKey = Deno.env.get("ELEVENLABS_API_KEY")
    const voiceId = Deno.env.get("ELEVENLABS_VOICE_ID")
    const modelId = Deno.env.get("ELEVENLABS_MODEL") || "eleven_multilingual_v2"
    if (!apiKey || !voiceId) return json({ error: "ELEVENLABS_API_KEY/VOICE_ID ausentes" }, 500)

    const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: "POST",
      headers: { "xi-api-key": apiKey, "Content-Type": "application/json", "Accept": "audio/mpeg" },
      body: JSON.stringify({ 
        text, 
        model_id: modelId, 
        voice_settings: { 
          stability: 0.4, 
          similarity_boost: 0.9, 
          style: 0.1,
          use_speaker_boost: true 
        },
        pronunciation_dictionary_locators: [{
          pronunciation_dictionary_id: "21m00Tcm4TlvDq8ikWAM",
          version_id: "21m00Tcm4TlvDq8ikWAM"
        }]
      }),
    })
    if (!r.ok) return json({ error: await r.text() }, 400)

    const buf = await r.arrayBuffer()
    const base64 = arrayBufferToBase64(buf)
    return json({ audioBase64: base64 }, 200)
  } catch (e) {
    return json({ error: e?.message ?? "erro" }, 500)
  }
})

function arrayBufferToBase64(buffer: ArrayBuffer) {
  let binary = ""
  const bytes = new Uint8Array(buffer)
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i])
  return btoa(binary)
}
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