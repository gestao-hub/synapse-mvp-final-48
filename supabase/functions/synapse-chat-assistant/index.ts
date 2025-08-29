import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, context = {} } = await req.json();

    if (!message) {
      return new Response(JSON.stringify({ error: 'Mensagem é obrigatória' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Base de conhecimento do Synapse
    const synapseKnowledge = `
SYNAPSE - PLATAFORMA DE SIMULAÇÕES EMPRESARIAIS COM IA

## SOBRE O SYNAPSE
O Synapse é uma plataforma inovadora que usa Inteligência Artificial para criar simulações realistas de treinamento empresarial, permitindo que profissionais pratiquem e aprimorem suas habilidades em um ambiente seguro e controlado.

## PRINCIPAIS FUNCIONALIDADES

### 1. SIMULAÇÕES POR ÁREA
- **Comercial**: Treinamento de vendas, negociação, objeções, fechamento de negócios
- **RH**: Feedback construtivo, gestão de pessoas, comunicação não-violenta, entrevistas
- **Educacional**: Técnicas pedagógicas, didática, engajamento de alunos
- **Gestão**: Liderança, tomada de decisão, resolução de conflitos, gestão de mudanças

### 2. TECNOLOGIA IA AVANÇADA
- IA conversacional em tempo real via OpenAI GPT-5
- Reconhecimento de voz e síntese de fala
- Análise automática de performance
- Feedback personalizado e construtivo

### 3. MÉTRICAS E AVALIAÇÕES
- Sistema de pontuação automático por critérios específicos
- Relatórios detalhados de performance
- Análise de tendências e progresso
- Métricas personalizáveis por cenário

### 4. CENÁRIOS PERSONALIZÁVEIS
- Biblioteca extensa de cenários pré-configurados
- Criação de cenários customizados
- Adaptação por setor e empresa
- Diferentes níveis de dificuldade

## BENEFÍCIOS

### Para Empresas:
- Redução de custos com treinamento presencial
- Padronização de qualidade no treinamento
- Métricas objetivas de desenvolvimento
- Flexibilidade de horários e local
- Escalabilidade para equipes grandes

### Para Profissionais:
- Ambiente seguro para praticar
- Feedback imediato e construtivo
- Desenvolvimento de soft skills
- Preparação para situações reais
- Autoavaliação e melhoria contínua

## DIFERENCIAIS COMPETITIVOS
- Tecnologia de ponta com IA mais avançada do mercado
- Interface intuitiva e brasileira
- Suporte completo em português
- Integração com sistemas corporativos
- Análises preditivas de performance

## CASOS DE USO POPULARES
- Treinamento de equipes de vendas
- Desenvolvimento de lideranças
- Capacitação em atendimento ao cliente
- Preparação para feedbacks difíceis
- Simulações de entrevistas
- Treinamento de professores e instrutores

## SEGURANÇA E PRIVACIDADE
- Dados criptografados e seguros
- Conformidade com LGPD
- Acesso controlado e auditável
- Backup automático de sessões

## PLANOS E PREÇOS
- Plano Individual: Para profissionais independentes
- Plano Corporativo: Para empresas e equipes
- Plano Enterprise: Para grandes organizações
- Versões de teste gratuitas disponíveis

## SUPORTE E IMPLEMENTAÇÃO
- Onboarding completo incluído
- Suporte técnico em português
- Treinamento para administradores
- Consultoria em estratégia de treinamento
`;

    // Prompt otimizado para o assistente do Synapse
    const systemPrompt = `Você é o assistente oficial do SYNAPSE, uma plataforma brasileira de simulações empresariais com IA.

INSTRUÇÕES IMPORTANTES:
- Responda SEMPRE em português brasileiro
- Seja especialista, confiante e prestativo
- Use linguagem profissional mas acessível
- Foque nos benefícios práticos e resultados
- Seja específico sobre as funcionalidades
- Encoraje demos e testes quando apropriado

SUA MISSÃO:
- Esclarecer dúvidas sobre o Synapse
- Destacar benefícios e diferenciais
- Guiar prospects no processo de decisão
- Sugerir o melhor plano para cada necessidade
- Converter interesse em ação (demo/teste)

ESTILO DE RESPOSTA:
- Máximo 150 palavras por resposta
- Use exemplos práticos quando possível
- Seja persuasivo mas não insistente
- Termine sempre com uma pergunta ou call-to-action
- Use emojis moderadamente para humanizar

BASE DE CONHECIMENTO:
${synapseKnowledge}

CONTEXTO DA CONVERSA: ${JSON.stringify(context)}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-5-mini-2025-08-07',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        max_completion_tokens: 300,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenAI API error:', error);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const assistantReply = data.choices[0].message.content;

    return new Response(JSON.stringify({ 
      reply: assistantReply,
      usage: data.usage
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in synapse-chat-assistant:', error);
    return new Response(JSON.stringify({ 
      error: 'Erro interno do servidor',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});