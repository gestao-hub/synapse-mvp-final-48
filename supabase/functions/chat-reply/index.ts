import { serve } from "https://deno.land/std@0.177.0/http/server.ts"

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors() })
  try {
    const { transcript, scenario } = await req.json()
    const apiKey = Deno.env.get("OPENAI_API_KEY")
    if (!apiKey) return json({ error: "OPENAI_API_KEY ausente" }, 500)

    const system = `Colaborador brasileiro em "${scenario}". Respostas naturais, máx 3 frases.`
    const user = `Transcrição do usuário:\n${transcript}`

    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "system", content: system }, { role: "user", content: user }],
        max_completion_tokens: 150,
      }),
    })
    if (!r.ok) return json({ error: await r.text() }, 400)

    const data = await r.json()
    const reply = data.choices?.[0]?.message?.content ?? ""
    return json({ reply }, 200)
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