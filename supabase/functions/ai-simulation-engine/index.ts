import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SimulationRequest {
  scenario: {
    id: string
    title: string
    description: string
    criteria: Array<{
      key: string
      label: string
      weight: number
    }>
    persona: string
    context: string
  }
  userRole: string
  userMessage: string
  conversationHistory: Array<{
    role: 'user' | 'assistant'
    content: string
    timestamp: string
  }>
  sessionId?: string
}

interface SimulationResponse {
  aiResponse: string
  scores: Record<string, number>
  feedback: Record<string, string>
  overallScore: number
  suggestions: string[]
  sessionId: string
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { scenario, userRole, userMessage, conversationHistory, sessionId } = await req.json() as SimulationRequest
    
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      throw new Error('OPENAI_API_KEY não configurada')
    }

    // 1. Gerar resposta da IA baseada no cenário e persona
    const aiResponse = await generateAIResponse(
      scenario,
      userRole,
      userMessage,
      conversationHistory,
      openaiApiKey
    )

    // 2. Calcular scores baseados nos critérios
    const evaluation = await evaluatePerformance(
      scenario,
      userMessage,
      conversationHistory,
      openaiApiKey
    )

    // 3. Salvar no banco de dados
    const finalSessionId = sessionId || crypto.randomUUID()
    
    const response: SimulationResponse = {
      aiResponse,
      scores: evaluation.scores,
      feedback: evaluation.feedback,
      overallScore: evaluation.overallScore,
      suggestions: evaluation.suggestions,
      sessionId: finalSessionId
    }

    return new Response(
      JSON.stringify(response),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Erro na simulação:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

async function generateAIResponse(
  scenario: any,
  userRole: string,
  userMessage: string,
  conversationHistory: any[],
  apiKey: string
): Promise<string> {
  const systemPrompt = `
Você está simulando o seguinte cenário: ${scenario.title}

CONTEXTO: ${scenario.context}
DESCRIÇÃO: ${scenario.description}
PERSONA: ${scenario.persona}

O usuário está no papel de: ${userRole}

Você deve:
1. Responder de forma realista e desafiadora
2. Manter consistência com a persona definida
3. Criar situações que testem as habilidades do usuário
4. Ser específico e detalhado nas suas respostas
5. Provocar o usuário a demonstrar competências relevantes

IMPORTANTE: Mantenha um tom profissional mas desafiador, criando cenários que realmente testem as habilidades do usuário.
`

  const messages = [
    { role: 'system', content: systemPrompt },
    ...conversationHistory,
    { role: 'user', content: userMessage }
  ]

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages,
      max_completion_tokens: 300,
    }),
  })

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`)
  }

  const data = await response.json()
  return data.choices[0].message.content
}

async function evaluatePerformance(
  scenario: any,
  userMessage: string,
  conversationHistory: any[],
  apiKey: string
): Promise<{
  scores: Record<string, number>
  feedback: Record<string, string>
  overallScore: number
  suggestions: string[]
}> {
  const evaluationPrompt = `
Analise a performance do usuário nesta simulação:

CENÁRIO: ${scenario.title}
CRITÉRIOS DE AVALIAÇÃO:
${scenario.criteria.map((c: any) => `- ${c.label} (peso: ${c.weight}%)`).join('\n')}

CONVERSA COMPLETA:
${conversationHistory.map((msg: any, i: number) => `${i + 1}. ${msg.role}: ${msg.content}`).join('\n')}
ÚLTIMA MENSAGEM: ${userMessage}

Para cada critério, forneça:
1. Uma nota de 0 a 10
2. Feedback específico e construtivo
3. Sugestões de melhoria

Responda APENAS em formato JSON válido:
{
  "scores": {
    "criterio1": nota,
    "criterio2": nota,
    ...
  },
  "feedback": {
    "criterio1": "feedback específico",
    "criterio2": "feedback específico",
    ...
  },
  "suggestions": [
    "sugestão 1",
    "sugestão 2",
    "sugestão 3"
  ]
}
`

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: evaluationPrompt }],
      max_completion_tokens: 800,
    }),
  })

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`)
  }

  const data = await response.json()
  const evaluation = JSON.parse(data.choices[0].message.content)

  // Calcular score geral baseado nos pesos
  let overallScore = 0
  let totalWeight = 0

  for (const criterion of scenario.criteria) {
    const score = evaluation.scores[criterion.key] || 0
    overallScore += score * (criterion.weight / 100)
    totalWeight += criterion.weight / 100
  }

  return {
    scores: evaluation.scores,
    feedback: evaluation.feedback,
    overallScore: Math.round(overallScore * 10) / 10,
    suggestions: evaluation.suggestions
  }
}