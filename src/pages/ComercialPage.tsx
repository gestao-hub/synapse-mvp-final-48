import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PlayCircle, TrendingUp, Users, Target, Settings } from 'lucide-react'
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

export default function ComercialPage() {
  const [scenarios, setScenarios] = useState<Scenario[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null)
  const [selectedRole, setSelectedRole] = useState<string>('')
  const [simulationResults, setSimulationResults] = useState<any>(null)
  const { toast } = useToast()
  const { metrics: realMetrics, refreshMetrics } = useRealMetrics('comercial')

  // Cenários comerciais padrão (enquanto não carrega do banco)
  const defaultScenarios: Scenario[] = [
    {
      id: 'venda-consultiva-b2b',
      area: 'comercial',
      title: 'Venda Consultiva B2B',
      description: 'Conduza uma venda consultiva para solução tecnológica empresarial.',
      criteria: [
        { key: 'descoberta', label: 'Descoberta de Necessidades', weight: 30 },
        { key: 'apresentacao', label: 'Apresentação de Valor', weight: 25 },
        { key: 'objecoes', label: 'Tratamento de Objeções', weight: 25 },
        { key: 'fechamento', label: 'Técnicas de Fechamento', weight: 20 }
      ],
      persona: 'Você é um diretor de TI interessado em soluções, mas cético sobre custos.',
      context: 'Primeira reunião de apresentação de solução de automação.',
      role_options: ['Vendedor', 'Comprador']
    },
    {
      id: 'prospeccao-fria',
      area: 'comercial',
      title: 'Prospecção Fria',
      description: 'Primeiro contato telefônico com prospect qualificado.',
      criteria: [
        { key: 'abertura', label: 'Abertura Impactante', weight: 25 },
        { key: 'qualificacao', label: 'Qualificação BANT', weight: 30 },
        { key: 'interesse', label: 'Geração de Interesse', weight: 25 },
        { key: 'proximo_passo', label: 'Agendamento', weight: 20 }
      ],
      persona: 'Você é um empresário ocupado, resistente a vendedores.',
      context: 'Primeira ligação de prospecção - 5 minutos disponíveis.',
      role_options: ['SDR', 'Prospect']
    },
    {
      id: 'negociacao-preco',
      area: 'comercial',
      title: 'Negociação de Preço',
      description: 'Cliente interessado questiona valor e busca desconto.',
      criteria: [
        { key: 'valor', label: 'Reforço de Valor', weight: 30 },
        { key: 'flexibilidade', label: 'Flexibilidade Estratégica', weight: 25 },
        { key: 'alternativas', label: 'Criação de Alternativas', weight: 25 },
        { key: 'acordo', label: 'Fechamento do Acordo', weight: 20 }
      ],
      persona: 'Você está interessado mas preocupado com orçamento.',
      context: 'Segunda reunião - decisão de compra em andamento.',
      role_options: ['Vendedor', 'Cliente']
    },
    {
      id: 'renovacao-contrato',
      area: 'comercial',
      title: 'Renovação de Contrato',
      description: 'Cliente atual avaliando renovação versus concorrência.',
      criteria: [
        { key: 'relacionamento', label: 'Fortalecimento do Relacionamento', weight: 25 },
        { key: 'resultados', label: 'Demonstração de Resultados', weight: 30 },
        { key: 'melhorias', label: 'Proposta de Melhorias', weight: 25 },
        { key: 'retencao', label: 'Estratégias de Retenção', weight: 20 }
      ],
      persona: 'Você é cliente há 2 anos mas recebeu proposta da concorrência.',
      context: 'Reunião de renovação - contrato vence em 30 dias.',
      role_options: ['Account Manager', 'Cliente']
    },
    {
      id: 'venda-complexa',
      area: 'comercial',
      title: 'Venda Complexa Multiárea',
      description: 'Apresentação para comitê de decisão com múltiplos stakeholders.',
      criteria: [
        { key: 'stakeholders', label: 'Gestão de Stakeholders', weight: 30 },
        { key: 'roi', label: 'Apresentação de ROI', weight: 25 },
        { key: 'riscos', label: 'Mitigação de Riscos', weight: 25 },
        { key: 'consenso', label: 'Construção de Consenso', weight: 20 }
      ],
      persona: 'Você é um comitê com diferentes prioridades e preocupações.',
      context: 'Apresentação final para decisão de investimento alto.',
      role_options: ['Vendedor', 'Comitê']
    },
    {
      id: 'recuperacao-cliente',
      area: 'comercial',
      title: 'Recuperação de Cliente',
      description: 'Cliente insatisfeito considerando cancelamento do serviço.',
      criteria: [
        { key: 'empatia', label: 'Demonstração de Empatia', weight: 25 },
        { key: 'problemas', label: 'Identificação de Problemas', weight: 30 },
        { key: 'solucoes', label: 'Proposta de Soluções', weight: 25 },
        { key: 'compromisso', label: 'Compromissos Concretos', weight: 20 }
      ],
      persona: 'Você está frustrado com falhas no serviço e atendimento.',
      context: 'Cliente ameaça cancelar após problemas recorrentes.',
      role_options: ['Account Manager', 'Cliente']
    },
    {
      id: 'venda-inbound',
      area: 'comercial',
      title: 'Conversão Inbound',
      description: 'Lead qualificado que baixou material e agendou demo.',
      criteria: [
        { key: 'preparacao', label: 'Preparação Pré-Demo', weight: 20 },
        { key: 'demo', label: 'Demo Consultiva', weight: 30 },
        { key: 'personalizacao', label: 'Personalização', weight: 25 },
        { key: 'next_steps', label: 'Próximos Passos', weight: 25 }
      ],
      persona: 'Você baixou material e quer entender se a solução serve.',
      context: 'Demo agendada - lead tem orçamento e autoridade.',
      role_options: ['Vendedor', 'Lead']
    },
    {
      id: 'upsell-crosssell',
      area: 'comercial',
      title: 'Upsell e Cross-sell',
      description: 'Cliente satisfeito com potencial para expansão da conta.',
      criteria: [
        { key: 'oportunidade', label: 'Identificação de Oportunidades', weight: 30 },
        { key: 'timing', label: 'Timing Adequado', weight: 20 },
        { key: 'beneficios', label: 'Comunicação de Benefícios', weight: 30 },
        { key: 'implementacao', label: 'Plano de Implementação', weight: 20 }
      ],
      persona: 'Você está satisfeito mas conservador com novos investimentos.',
      context: 'Reunião trimestral de acompanhamento do cliente.',
      role_options: ['Account Manager', 'Cliente']
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
        .eq('area', 'comercial')
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
    setSimulationResults(results)
    setSelectedScenario(null)
    setSelectedRole('')
    
    // Atualizar métricas após simulação
    refreshMetrics()
    
    toast({
      title: "Simulação Concluída",
      description: `Pontuação final: ${results.overallScore}/10`,
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
            <div className="p-2 bg-primary/10 rounded-lg">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-cal text-gradient">Comercial</h1>
              <p className="text-muted-foreground">
                Desenvolva suas habilidades de vendas com cenários reais de mercado
              </p>
            </div>
          </div>
          <Button 
            onClick={() => window.location.href = '/app/comercial-live'}
            className="btn-primary flex items-center gap-2 hover:scale-105 transition-transform duration-300"
          >
            <Settings className="w-4 h-4" /> Cenário Personalizado
          </Button>
        </div>
      </div>

      {/* Benchmark Dashboard - Métricas Reais */}
      <RealBenchmarkDashboard area="comercial" />

      {/* Cenários Disponíveis */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Cenários Disponíveis</h2>
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
            <div className="p-2 bg-green-500/10 rounded-lg">
              <Target className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Taxa de Fechamento</p>
              <p className="text-2xl font-bold">{realMetrics?.closingRate || 0}%</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Users className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Objeções Resolvidas</p>
              <p className="text-2xl font-bold">{realMetrics?.objectionHandling || 0}%</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500/10 rounded-lg">
              <TrendingUp className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tempo Médio</p>
              <p className="text-2xl font-bold">{realMetrics?.averageDuration || 0}min</p>
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

  const getDifficultyColor = (title: string) => {
    if (title.toLowerCase().includes('complexa') || title.toLowerCase().includes('multiárea')) {
      return 'bg-red-500/10 text-red-500'
    }
    if (title.toLowerCase().includes('negociação') || title.toLowerCase().includes('recuperação')) {
      return 'bg-orange-500/10 text-orange-500'
    }
    return 'bg-green-500/10 text-green-500'
  }

  const getDifficultyLevel = (title: string) => {
    if (title.toLowerCase().includes('complexa') || title.toLowerCase().includes('multiárea')) {
      return 'Avançado'
    }
    if (title.toLowerCase().includes('negociação') || title.toLowerCase().includes('recuperação')) {
      return 'Intermediário'
    }
    return 'Iniciante'
  }

  return (
    <Card className="p-6 hover:shadow-lg transition-all duration-200 hover:scale-[1.02] h-full flex flex-col">
      <div className="flex-1 space-y-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-lg leading-tight">{scenario.title}</h3>
            <Badge className={`text-xs ${getDifficultyColor(scenario.title)}`}>
              {getDifficultyLevel(scenario.title)}
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