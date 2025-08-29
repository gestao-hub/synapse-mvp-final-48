import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PlayCircle, TrendingUp, Users, Target, Settings, BarChart3, Building2 } from 'lucide-react'
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

export default function GestaoPage() {
  const [scenarios, setScenarios] = useState<Scenario[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null)
  const [selectedRole, setSelectedRole] = useState<string>('')
  const [simulationResults, setSimulationResults] = useState<any>(null)
  const { toast } = useToast()
  const { metrics: realMetrics, refreshMetrics } = useRealMetrics('gestao')

  // Cenários de gestão padrão (enquanto não carrega do banco)
  const defaultScenarios: Scenario[] = [
    {
      id: 'reuniao-estrategica',
      area: 'gestao',
      title: 'Reunião de Planejamento Estratégico',
      description: 'Conduza uma reunião de planejamento estratégico definindo metas trimestrais.',
      criteria: [
        { key: 'visao_estrategica', label: 'Visão Estratégica', weight: 30 },
        { key: 'lideranca', label: 'Liderança', weight: 25 },
        { key: 'comunicacao', label: 'Comunicação Executiva', weight: 20 },
        { key: 'tomada_decisao', label: 'Tomada de Decisão', weight: 25 }
      ],
      persona: 'CEO experiente com foco em crescimento sustentável',
      context: 'Reunião trimestral com diretoria para definir estratégias e metas',
      role_options: ['CEO', 'Diretor', 'Gerente']
    },
    {
      id: 'negociacao-executiva',
      area: 'gestao',
      title: 'Negociação Executiva',
      description: 'Negocie um acordo estratégico de parceria entre empresas multinacionais.',
      criteria: [
        { key: 'negociacao', label: 'Habilidades de Negociação', weight: 35 },
        { key: 'estrategia', label: 'Pensamento Estratégico', weight: 25 },
        { key: 'relacionamento', label: 'Construção de Relacionamentos', weight: 20 },
        { key: 'persuasao', label: 'Persuasão Executiva', weight: 20 }
      ],
      persona: 'Executivo senior especialista em fusões e aquisições',
      context: 'Negociação de alto nível para parceria estratégica global',
      role_options: ['CEO', 'VP', 'Diretor']
    },
    {
      id: 'gestao-crise',
      area: 'gestao',
      title: 'Gestão de Crise Organizacional',
      description: 'Lidere a organização durante uma crise reputacional e operacional.',
      criteria: [
        { key: 'lideranca_crise', label: 'Liderança em Crise', weight: 30 },
        { key: 'comunicacao_crise', label: 'Comunicação de Crise', weight: 25 },
        { key: 'tomada_decisao_rapida', label: 'Decisões Rápidas', weight: 25 },
        { key: 'gestao_emocional', label: 'Gestão Emocional', weight: 20 }
      ],
      persona: 'CEO experiente em gestão de crises corporativas',
      context: 'Situação de crise que afeta reputação e operações da empresa',
      role_options: ['CEO', 'Diretor', 'Porta-voz']
    },
    {
      id: 'reestruturacao',
      area: 'gestao',
      title: 'Reestruturação Organizacional',
      description: 'Implemente uma reestruturação mantendo motivação e produtividade.',
      criteria: [
        { key: 'gestao_mudanca', label: 'Gestão de Mudança', weight: 30 },
        { key: 'comunicacao_transparente', label: 'Comunicação Transparente', weight: 25 },
        { key: 'engajamento', label: 'Engajamento de Equipes', weight: 25 },
        { key: 'execucao', label: 'Execução Estratégica', weight: 20 }
      ],
      persona: 'Diretor de RH e CEO especialistas em transformação',
      context: 'Processo de reestruturação para otimização organizacional',
      role_options: ['CEO', 'Diretor RH', 'Gerente']
    },
    {
      id: 'board-meeting',
      area: 'gestao',
      title: 'Apresentação para Conselho',
      description: 'Apresente resultados anuais e propostas estratégicas para o conselho.',
      criteria: [
        { key: 'apresentacao_executiva', label: 'Apresentação Executiva', weight: 30 },
        { key: 'analise_financeira', label: 'Análise Financeira', weight: 25 },
        { key: 'visao_futuro', label: 'Visão de Futuro', weight: 25 },
        { key: 'governanca', label: 'Governança Corporativa', weight: 20 }
      ],
      persona: 'Membro do conselho com vasta experiência corporativa',
      context: 'Reunião anual do conselho de administração',
      role_options: ['CEO', 'CFO', 'Membro Conselho']
    },
    {
      id: 'fusao-aquisicao',
      area: 'gestao',
      title: 'Processo de Fusão e Aquisição',
      description: 'Conduza due diligence e negociação em processo de M&A.',
      criteria: [
        { key: 'due_diligence', label: 'Due Diligence', weight: 30 },
        { key: 'valuation', label: 'Avaliação Empresarial', weight: 25 },
        { key: 'negociacao_complexa', label: 'Negociação Complexa', weight: 25 },
        { key: 'integracao', label: 'Planejamento de Integração', weight: 20 }
      ],
      persona: 'Investment banker senior especialista em M&A',
      context: 'Processo de aquisição entre empresas do mesmo setor',
      role_options: ['CEO', 'CFO', 'Consultor']
    },
    {
      id: 'transformacao-digital',
      area: 'gestao',
      title: 'Liderança em Transformação Digital',
      description: 'Lidere iniciativa de transformação digital com resistência interna.',
      criteria: [
        { key: 'visao_digital', label: 'Visão Digital', weight: 30 },
        { key: 'gestao_resistencia', label: 'Gestão de Resistência', weight: 25 },
        { key: 'inovacao', label: 'Liderança em Inovação', weight: 25 },
        { key: 'execucao_digital', label: 'Execução Digital', weight: 20 }
      ],
      persona: 'CTO com experiência em transformação organizacional',
      context: 'Projeto de digitalização enfrentando resistência cultural',
      role_options: ['CEO', 'CTO', 'Diretor']
    },
    {
      id: 'stakeholder-management',
      area: 'gestao',
      title: 'Gestão de Stakeholders Estratégicos',
      description: 'Gerencie relacionamentos complexos com investidores e reguladores.',
      criteria: [
        { key: 'relacionamento_stakeholder', label: 'Relacionamento com Stakeholders', weight: 30 },
        { key: 'comunicacao_institucional', label: 'Comunicação Institucional', weight: 25 },
        { key: 'gestao_expectativas', label: 'Gestão de Expectativas', weight: 25 },
        { key: 'transparencia', label: 'Transparência Corporativa', weight: 20 }
      ],
      persona: 'Diretor de relações com investidores experiente',
      context: 'Gestão de múltiplos stakeholders com interesses diversos',
      role_options: ['CEO', 'Diretor', 'Investidor']
    }
  ]

  useEffect(() => {
    loadScenarios()
  }, [])

  const loadScenarios = async () => {
    try {
      setLoading(true)
      
      const { data, error } = await supabase
        .from('scenarios')
        .select('*')
        .eq('area', 'gestao')
        .order('created_at', { ascending: false })

      if (error) throw error

      // Se não houver cenários no banco, usa os padrão
      if (!data || data.length === 0) {
        setScenarios(defaultScenarios)
        toast({
          title: "Cenários Carregados",
          description: "8 cenários de gestão estratégica disponíveis para treinamento.",
        })
      } else {
        setScenarios(data)
      }
    } catch (error) {
      console.error('Erro ao carregar cenários:', error)
      // Em caso de erro, usa os cenários padrão
      setScenarios(defaultScenarios)
      toast({
        title: "Cenários Carregados (Offline)",
        description: "Usando cenários padrão de gestão estratégica.",
        variant: "default"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleStartSimulation = async (scenario: Scenario, role: string) => {
    try {
      // Salvar sessão no banco
      const { data: { user } } = await supabase.auth.getUser()
      const { data: session, error } = await supabase
        .from('sessions_live')
        .insert({
          track: 'gestao',
          user_id: user?.id,
          metadata: {
            scenario_id: scenario.id,
            scenario_title: scenario.title,
            role: role,
            criteria: scenario.criteria
          }
        })
        .select()
        .single()

      if (error) throw error

      setSelectedScenario(scenario)
      setSelectedRole(role)
      
      toast({
        title: "Simulação Iniciada",
        description: `Cenário: ${scenario.title} - Papel: ${role}`,
      })
    } catch (error) {
      console.error('Erro ao iniciar simulação:', error)
      toast({
        title: "Erro",
        description: "Não foi possível iniciar a simulação. Tente novamente.",
        variant: "destructive"
      })
    }
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

  if (selectedScenario && selectedRole) {
    return (
      <RealSimulationEngine
        scenario={selectedScenario as any}
        userRole={selectedRole}
        onComplete={handleSimulationComplete}
        onExit={() => setSelectedScenario(null)}
      />
    )
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-muted rounded w-2/3 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-64 bg-muted rounded-lg"></div>
            ))}
          </div>
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
            <div className="p-2 bg-orange-500/10 rounded-lg">
              <Settings className="h-6 w-6 text-orange-500" />
            </div>
            <div>
              <h1 className="text-3xl font-cal text-gradient">Gestão Estratégica</h1>
              <p className="text-muted-foreground">
                Desenvolva competências de liderança executiva e tomada de decisão estratégica
              </p>
            </div>
          </div>
          <Button 
            onClick={() => window.location.href = '/app/gestao-live'}
            className="btn-primary flex items-center gap-2 hover:scale-105 transition-transform duration-300"
          >
            <Settings className="w-4 h-4" /> Cenário Personalizado
          </Button>
        </div>
      </div>

      {/* Benchmark Dashboard - Métricas Reais */}
      <RealBenchmarkDashboard area="gestao" />

      {/* Cenários Disponíveis */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Cenários de Gestão</h2>
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

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500/10 rounded-lg">
              <Target className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Decisões Estratégicas</p>
              <p className="text-2xl font-bold">89%</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Building2 className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Liderança Efetiva</p>
              <p className="text-2xl font-bold">8.2/10</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <BarChart3 className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tempo Médio</p>
              <p className="text-2xl font-bold">22min</p>
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
  const [showRoleSelector, setShowRoleSelector] = useState(false)

  const handleStart = () => {
    if (selectedRole) {
      onStart(scenario, selectedRole)
      setShowRoleSelector(false)
      setSelectedRole('')
    } else {
      setShowRoleSelector(true)
    }
  }

  const getDifficultyLevel = (scenarioId: string) => {
    const expertScenarios = ['board-meeting', 'fusao-aquisicao', 'negociacao-executiva']
    const advancedScenarios = ['gestao-crise', 'reestruturacao', 'transformacao-digital', 'stakeholder-management']
    
    if (expertScenarios.includes(scenarioId)) return 'Expert'
    if (advancedScenarios.includes(scenarioId)) return 'Avançado'
    return 'Avançado'
  }

  const difficulty = getDifficultyLevel(scenario.id)

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/20 h-full flex flex-col">
      <div className="p-6 flex-1 space-y-4">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-lg group-hover:text-primary transition-colors line-clamp-2">
              {scenario.title}
            </h3>
            <Badge variant={difficulty === 'Expert' ? 'destructive' : 'secondary'} className="text-xs shrink-0 ml-2">
              {difficulty}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-3">
            {scenario.description}
          </p>
        </div>

        {/* Critérios */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">CRITÉRIOS DE AVALIAÇÃO</p>
          <div className="flex flex-wrap gap-1">
            {scenario.criteria.map((criterion) => (
              <Badge key={criterion.key} variant="outline" className="text-xs">
                {criterion.label}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Botão único de simulação */}
      <div className="p-6 pt-0">
        {/* Role Selector */}
        {showRoleSelector ? (
          <div className="space-y-3">
            <p className="text-sm font-medium">Escolha seu papel:</p>
            <div className="space-y-2">
              {scenario.role_options.map((role) => (
                <Button
                  key={role}
                  variant={selectedRole === role ? "default" : "outline"}
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => setSelectedRole(role)}
                >
                  {role}
                </Button>
              ))}
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleStart}
                disabled={!selectedRole}
                className="flex-1"
              >
                <PlayCircle className="h-4 w-4 mr-2" />
                Iniciar
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowRoleSelector(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Users className="h-3 w-3" />
              {scenario.role_options.length} papéis
            </div>
            <Button size="sm" onClick={handleStart} className="btn-primary">
              <PlayCircle className="h-4 w-4 mr-2" />
              Simulação
            </Button>
          </div>
        )}
      </div>
    </Card>
  )
}