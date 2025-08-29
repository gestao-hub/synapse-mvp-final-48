import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PlayCircle, Users, Heart, MessageSquare, Settings } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { RealSimulationEngine } from '@/components/simulation/FullDuplexSimulationEngine'
import { RealBenchmarkDashboard } from '@/components/analytics/RealBenchmarkDashboard'
import { useRealMetrics } from '@/hooks/useRealMetrics'


interface Scenario {
  id: string
  area: string
  title: string
  description: string
  criteria: any
  persona: any
  context?: string
  role_options: any
  system_prompt?: string
}

export default function RhPage() {
  const [scenarios, setScenarios] = useState<Scenario[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null)
  const [selectedRole, setSelectedRole] = useState<string>('')
  const { toast } = useToast()
  const { metrics: realMetrics, refreshMetrics } = useRealMetrics('rh')

  // Cenários de RH padrão 
  const defaultScenarios: Scenario[] = [
    {
      id: 'feedback-construtivo',
      area: 'rh',
      title: 'Feedback Construtivo',
      description: 'Colaborador defensivo; use CNV, exemplos concretos e um plano de ação.',
      criteria: [
        { key: 'cnv', label: 'Comunicação Não-Violenta', weight: 30 },
        { key: 'exemplos', label: 'Exemplos Concretos', weight: 25 },
        { key: 'plano_acao', label: 'Plano de Ação', weight: 25 },
        { key: 'follow_up', label: 'Follow-up Definido', weight: 20 }
      ],
      persona: 'Você é um colaborador que fica defensivo com feedbacks.',
      context: 'Avaliação de desempenho mensal - metas não atingidas.',
      role_options: ['Gestor', 'Colaborador']
    },
    {
      id: 'entrevista-comportamental',
      area: 'rh',
      title: 'Entrevista Comportamental',
      description: 'Candidato experiente para posição sênior - use técnica STAR.',
      criteria: [
        { key: 'star', label: 'Método STAR', weight: 30 },
        { key: 'competencias', label: 'Avaliação de Competências', weight: 25 },
        { key: 'fit_cultural', label: 'Fit Cultural', weight: 25 },
        { key: 'decisao', label: 'Critérios de Decisão', weight: 20 }
      ],
      persona: 'Você é candidato sênior confiante com experiência relevante.',
      context: 'Entrevista final para vaga de liderança.',
      role_options: ['Recrutador', 'Candidato']
    },
    {
      id: 'gestao-conflitos',
      area: 'rh',
      title: 'Gestão de Conflitos',
      description: 'Dois colaboradores em conflito afetando a equipe.',
      criteria: [
        { key: 'mediacao', label: 'Técnicas de Mediação', weight: 30 },
        { key: 'imparcialidade', label: 'Imparcialidade', weight: 25 },
        { key: 'solucoes', label: 'Busca por Soluções', weight: 25 },
        { key: 'acordo', label: 'Acordo Estabelecido', weight: 20 }
      ],
      persona: 'Você são dois colegas com visões diferentes sobre processo.',
      context: 'Conflito interpessoal afetando produtividade da equipe.',
      role_options: ['Mediador', 'Colaborador A', 'Colaborador B']
    },
    {
      id: 'one-on-one',
      area: 'rh',
      title: 'One-on-One de Desenvolvimento',
      description: 'Colaborador talentoso buscando crescimento na carreira.',
      criteria: [
        { key: 'escuta_ativa', label: 'Escuta Ativa', weight: 25 },
        { key: 'metas_carreira', label: 'Metas de Carreira', weight: 30 },
        { key: 'plano_desenvolvimento', label: 'Plano de Desenvolvimento', weight: 25 },
        { key: 'recursos', label: 'Recursos e Suporte', weight: 20 }
      ],
      persona: 'Você quer crescer na empresa mas não vê oportunidades.',
      context: 'Conversa mensal de desenvolvimento de carreira.',
      role_options: ['Gestor', 'Colaborador']
    },
    {
      id: 'avaliacao-desempenho',
      area: 'rh',
      title: 'Avaliação de Desempenho',
      description: 'Colaborador com performance mista - pontos fortes e melhorias.',
      criteria: [
        { key: 'equilibrio', label: 'Equilíbrio Pontos Fortes/Melhorias', weight: 25 },
        { key: 'especificidade', label: 'Feedback Específico', weight: 30 },
        { key: 'metas_smart', label: 'Metas SMART', weight: 25 },
        { key: 'desenvolvimento', label: 'Plano de Desenvolvimento', weight: 20 }
      ],
      persona: 'Você tem resultados mistos e busca direcionamento.',
      context: 'Avaliação formal semestral de desempenho.',
      role_options: ['Avaliador', 'Avaliado']
    },
    {
      id: 'desligamento-sensivel',
      area: 'rh',
      title: 'Desligamento Sensível',
      description: 'Comunicação de desligamento com empatia e profissionalismo.',
      criteria: [
        { key: 'empatia', label: 'Demonstração de Empatia', weight: 30 },
        { key: 'clareza', label: 'Clareza na Comunicação', weight: 25 },
        { key: 'suporte', label: 'Oferecimento de Suporte', weight: 25 },
        { key: 'transicao', label: 'Plano de Transição', weight: 20 }
      ],
      persona: 'Você está surpreso e emotivo com a notícia.',
      context: 'Reestruturação da empresa exige redução de equipe.',
      role_options: ['RH', 'Colaborador']
    },
    {
      id: 'integracao-novato',
      area: 'rh',
      title: 'Integração de Novato',
      description: 'Primeiro dia de trabalho - apresentação da empresa e papel.',
      criteria: [
        { key: 'acolhimento', label: 'Acolhimento Caloroso', weight: 25 },
        { key: 'informacoes', label: 'Informações Essenciais', weight: 30 },
        { key: 'expectativas', label: 'Alinhamento de Expectativas', weight: 25 },
        { key: 'buddy_system', label: 'Sistema de Apoio', weight: 20 }
      ],
      persona: 'Você está ansioso e cheio de dúvidas no primeiro dia.',
      context: 'Onboarding de novo colaborador contratado.',
      role_options: ['RH', 'Gestor', 'Novo Colaborador']
    },
    {
      id: 'promocao-interna',
      area: 'rh',
      title: 'Comunicação de Promoção',
      description: 'Colaborador promovido assume nova responsabilidade.',
      criteria: [
        { key: 'reconhecimento', label: 'Reconhecimento de Mérito', weight: 25 },
        { key: 'expectativas', label: 'Novas Expectativas', weight: 30 },
        { key: 'suporte', label: 'Suporte na Transição', weight: 25 },
        { key: 'metas', label: 'Metas do Novo Cargo', weight: 20 }
      ],
      persona: 'Você está animado mas ansioso com as novas responsabilidades.',
      context: 'Comunicação oficial de promoção interna.',
      role_options: ['Gestor', 'Promovido']
    },
    {
      id: 'blue-ocean-rh',
      area: 'rh',
      title: 'Blue Ocean RH',
      description: 'Entrevista para vaga de Gestor de Tráfego na Blue Ocean - ambiente de alta performance e meritocracia.',
      criteria: [
        { key: 'experiencia_trafego', label: 'Experiência em Tráfego Pago', weight: 40 },
        { key: 'conhecimento_tecnico', label: 'Conhecimento Técnico (Meta, Google, TikTok)', weight: 30 },
        { key: 'tracking', label: 'Tracking e Análise de Dados', weight: 20 },
        { key: 'performance_mindset', label: 'Mentalidade de Performance', weight: 10 }
      ],
      persona: {
        company: 'Blue Ocean',
        culture: 'alta_performance',
        values: ['resultados', 'meritocracia', 'crescimento_acelerado'],
        tone: 'direto_e_intenso',
        style: 'focado_em_performance',
        goal: 'identificar_candidato_ideal',
        context: 'Somos a maior assessoria de marketing e vendas para SaaS do Brasil. Nossa cultura é intensa, pensamos grande e jogamos para vencer. Buscamos alguém que respire tráfego pago e queira performance máxima.',
        system_prompt: `IMPORTANTE: Você DEVE falar exclusivamente em PORTUGUÊS BRASILEIRO.

Você é um entrevistador sênior da Blue Ocean, a maior assessoria de marketing e vendas para SaaS do Brasil.

CONTEXTO DA ENTREVISTA:
- Vaga: Gestor de Tráfego (Presencial - Águas Claras)
- Cultura: Alta performance, intensa, meritocrática  
- Foco: Resultados máximos e crescimento acelerado

COMO ENTREVISTADOR DA BLUE OCEAN:

1. INÍCIO DA ENTREVISTA:
   - Se apresente brevemente como entrevistador da Blue Ocean
   - Explique que a cultura da empresa é intensa e focada em performance
   - Peça para o candidato se apresentar e falar da experiência com tráfego pago

2. ÁREAS OBRIGATÓRIAS A EXPLORAR:
   - Experiência prática com Meta Ads, Google Ads, TikTok Ads
   - Conhecimento de tracking (Pixel, GTM, UTMs, API de Conversão)
   - Cases específicos com métricas e resultados (CPM, CPC, ROAS, etc.)
   - Experiência escalando campanhas e orçamentos
   - Como lida com pressão por performance e metas agressivas

3. ESTILO DE PERGUNTAS:
   - Seja direto e técnico
   - Peça exemplos específicos e números concretos
   - Faça perguntas de follow-up para aprofundar respostas
   - Teste conhecimento prático, não apenas teórico

4. PERGUNTAS SUGERIDAS:
   - "Me conte um case específico onde você escalou uma campanha de tráfego pago"
   - "Qual foi o melhor ROAS que você já conseguiu? Como chegou nesse resultado?"  
   - "Como você estrutura o tracking para garantir dados precisos?"
   - "Nossa cultura é intensa e focada em resultados agressivos. Como você lida com metas desafiadoras?"
   - "Que ferramentas você usa para análise e otimização de campanhas?"

5. AVALIE:
   - Experiência técnica comprovada
   - Mentalidade orientada a dados
   - Capacidade de entregar resultados sob pressão
   - Fit cultural com ambiente de alta performance
   - Proatividade e fome de crescimento

6. ENCERRAMENTO:
   - Explique próximos passos do processo
   - Reforce a cultura intensa da empresa
   - Pergunte se tem dúvidas sobre a vaga ou empresa

Seja um entrevistador experiente, direto e focado em identificar se o candidato tem o perfil técnico e cultural para prosperar na Blue Ocean.`
      },
      context: 'Entrevista para vaga de Gestor de Tráfego - Presencial Águas Claras. Empresa com cultura intensa, alta performance e meritocrática.',
      role_options: ['Entrevistador', 'Candidato']
    }
  ]

  useEffect(() => {
    loadScenarios()
  }, [])

  const loadScenarios = async () => {
    try {
      const { data, error } = await supabase
        .from('scenarios')
        .select('*')
        .eq('area', 'rh')
        .order('title')

      if (error) {
        console.warn('Erro ao carregar do banco, usando cenários padrão:', error)
        setScenarios(defaultScenarios)
      } else {
        // Se houver menos de 8 cenários no banco, usa os padrão
        setScenarios(data && data.length >= 8 ? data : defaultScenarios)
      }
    } catch (error) {
      console.warn('Erro na conexão, usando cenários padrão:', error)
      setScenarios(defaultScenarios)
    } finally {
      setLoading(false)
    }
  }

  const handleStartSimulation = (scenario: Scenario, role: string) => {
    setSelectedScenario(scenario)
    setSelectedRole(role)
  }

  const handleSimulationComplete = (results: any) => {
    setSelectedScenario(null)
    setSelectedRole('')
    
    // Atualizar métricas após simulação
    refreshMetrics()
    
    toast({
      title: "Simulação finalizada!",
      description: "Relatório de RH gerado com sucesso"
    })
  }

  const handleExit = () => {
    setSelectedScenario(null)
    setSelectedRole('')
  }

  if (selectedScenario) {
    return (
      <RealSimulationEngine
        scenario={selectedScenario}
        userRole={selectedRole}
        onComplete={handleSimulationComplete}
        onExit={handleExit}
      />
    )
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="h-8 bg-muted animate-pulse rounded"></div>
          <div className="h-4 bg-muted animate-pulse rounded w-2/3"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-64 bg-muted animate-pulse rounded-2xl"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-secondary/10 rounded-lg">
              <Users className="h-6 w-6 text-secondary" />
            </div>
            <div>
              <h1 className="text-3xl font-cal text-gradient">Recursos Humanos</h1>
              <p className="text-muted-foreground">
                Aprimore suas habilidades de gestão de pessoas e comunicação interpessoal
              </p>
            </div>
          </div>
          <Button 
            onClick={() => window.location.href = '/app/rh-live'}
            className="btn-primary flex items-center gap-2 hover:scale-105 transition-transform duration-300"
          >
            <Settings className="w-4 h-4" /> Cenário Personalizado
          </Button>
        </div>
      </div>


      {/* Benchmark Dashboard - Métricas Reais */}
      <RealBenchmarkDashboard area="rh" />

      {/* Cenários Disponíveis */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Cenários de RH</h2>
          <Badge variant="secondary" className="text-sm">
            {scenarios.length} cenários
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {scenarios.map((scenario) => (
            <ScenarioCard
              key={scenario.id}
              scenario={scenario}
              onStart={handleStartSimulation}
            />
          ))}
        </div>
      </div>

      {/* Quick Stats - Baseado em Métricas Reais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <MessageSquare className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Feedbacks Efetivos</p>
              <p className="text-2xl font-bold">{realMetrics?.feedbackEffectiveness || 0}%</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <Heart className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Empatia Score</p>
              <p className="text-2xl font-bold">{realMetrics?.empathyScore || 0}/10</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <Users className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Entrevistas Precisas</p>
              <p className="text-2xl font-bold">{realMetrics?.interviewAccuracy || 0}%</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

interface ScenarioCardProps {
  scenario: Scenario
  onStart: (scenario: Scenario, role: string) => void
}

function ScenarioCard({ scenario, onStart }: ScenarioCardProps) {
  const [selectedRole, setSelectedRole] = useState<string>('')
  const [showRoles, setShowRoles] = useState(false)

  const getTypeColor = (title: string) => {
    if (title.toLowerCase().includes('feedback') || title.toLowerCase().includes('avaliação')) {
      return 'bg-blue-500/10 text-blue-500'
    }
    if (title.toLowerCase().includes('entrevista') || title.toLowerCase().includes('integração') || title.toLowerCase().includes('blue ocean')) {
      return 'bg-green-500/10 text-green-500'
    }
    if (title.toLowerCase().includes('conflito') || title.toLowerCase().includes('desligamento')) {
      return 'bg-red-500/10 text-red-500'
    }
    return 'bg-purple-500/10 text-purple-500'
  }

  const getTypeLabel = (title: string) => {
    if (title.toLowerCase().includes('feedback') || title.toLowerCase().includes('avaliação')) {
      return 'Feedback'
    }
    if (title.toLowerCase().includes('entrevista') || title.toLowerCase().includes('integração') || title.toLowerCase().includes('blue ocean')) {
      return 'Seleção'
    }
    if (title.toLowerCase().includes('conflito') || title.toLowerCase().includes('desligamento')) {
      return 'Conflito'
    }
    return 'Desenvolvimento'
  }

  return (
    <Card className="p-6 hover:shadow-lg transition-all duration-200 hover:scale-[1.02] h-full flex flex-col">
      <div className="flex-1 space-y-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-lg leading-tight">{scenario.title}</h3>
            <Badge className={`text-xs ${getTypeColor(scenario.title)}`}>
              {getTypeLabel(scenario.title)}
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {scenario.description}
          </p>
        </div>

        <div className="flex flex-wrap gap-1">
          {scenario.criteria?.map((criterion) => (
            <Badge key={criterion.key} variant="outline" className="text-xs">
              {criterion.label}
            </Badge>
          ))}
        </div>
      </div>

      {/* Botão único de simulação */}
      <div className="mt-4">
        {!showRoles ? (
          <Button 
            onClick={() => setShowRoles(true)}
            className="w-full btn-primary"
          >
            <PlayCircle className="w-4 h-4 mr-2" />
            Simulação
          </Button>
        ) : (
          <div className="space-y-3">
            <p className="text-sm font-medium">Escolha seu papel:</p>
            <div className="grid grid-cols-2 gap-2">
              {scenario.role_options?.map((role) => (
                <Button
                  key={role}
                  variant={selectedRole === role ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedRole(role)}
                  className="text-xs"
                >
                  {role}
                </Button>
              ))}
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setShowRoles(false)}
                variant="outline"
                size="sm"
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={() => selectedRole && onStart(scenario, selectedRole)}
                disabled={!selectedRole}
                className="flex-1 btn-primary"
                size="sm"
              >
                Iniciar
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}