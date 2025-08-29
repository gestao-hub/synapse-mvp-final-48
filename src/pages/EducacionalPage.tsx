import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PlayCircle, GraduationCap, BookOpen, Users2, Settings } from 'lucide-react'
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

export default function EducacionalPage() {
  const [scenarios, setScenarios] = useState<Scenario[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null)
  const [selectedRole, setSelectedRole] = useState<string>('')
  const { toast } = useToast()
  const { metrics: realMetrics, refreshMetrics } = useRealMetrics('educacional')

  // Cenários educacionais padrão
  const defaultScenarios: Scenario[] = [
    {
      id: 'aula-interativa',
      area: 'educacional',
      title: 'Aula Interativa com Baixo Engajamento',
      description: 'Turma desatenta; melhore engajamento com técnicas ativas de aprendizagem.',
      criteria: [
        { key: 'engajamento', label: 'Técnicas de Engajamento', weight: 30 },
        { key: 'interacao', label: 'Promoção de Interação', weight: 25 },
        { key: 'clareza', label: 'Clareza na Explicação', weight: 25 },
        { key: 'objetivos', label: 'Objetivos de Aprendizagem', weight: 20 }
      ],
      persona: 'Você é uma turma desinteressada e distraída.',
      context: 'Aula de matemática no período pós-almoço.',
      role_options: ['Professor', 'Aluno']
    },
    {
      id: 'gestao-sala-diversa',
      area: 'educacional',
      title: 'Gestão de Sala Diversa',
      description: 'Turma com diferentes níveis e necessidades de aprendizagem.',
      criteria: [
        { key: 'adaptacao', label: 'Adaptação de Metodologia', weight: 30 },
        { key: 'inclusao', label: 'Inclusão de Todos', weight: 25 },
        { key: 'diferenciacao', label: 'Diferenciação Pedagógica', weight: 25 },
        { key: 'suporte', label: 'Suporte Individualizado', weight: 20 }
      ],
      persona: 'Você tem diferentes níveis de conhecimento e necessidades especiais.',
      context: 'Sala mista com alunos de diferentes backgrounds.',
      role_options: ['Professor', 'Aluno Avançado', 'Aluno com Dificuldade']
    },
    {
      id: 'avaliacao-formativa',
      area: 'educacional',
      title: 'Avaliação Formativa',
      description: 'Implemente técnicas de avaliação contínua e feedback construtivo.',
      criteria: [
        { key: 'feedback_continuo', label: 'Feedback Contínuo', weight: 30 },
        { key: 'autoavaliacao', label: 'Promoção de Autoavaliação', weight: 25 },
        { key: 'criterios_claros', label: 'Critérios Claros', weight: 25 },
        { key: 'melhoria', label: 'Foco na Melhoria', weight: 20 }
      ],
      persona: 'Você está ansioso sobre avaliações e busca clareza.',
      context: 'Processo de avaliação durante projeto em grupo.',
      role_options: ['Professor', 'Aluno']
    },
    {
      id: 'tecnologia-educacional',
      area: 'educacional',
      title: 'Integração de Tecnologia',
      description: 'Use ferramentas digitais para enriquecer o aprendizado.',
      criteria: [
        { key: 'ferramentas_digitais', label: 'Uso de Ferramentas Digitais', weight: 30 },
        { key: 'hibridizacao', label: 'Ensino Híbrido', weight: 25 },
        { key: 'competencias_digitais', label: 'Competências Digitais', weight: 25 },
        { key: 'acessibilidade', label: 'Acessibilidade Tecnológica', weight: 20 }
      ],
      persona: 'Você tem diferentes níveis de familiaridade com tecnologia.',
      context: 'Primeira aula usando plataforma digital.',
      role_options: ['Professor', 'Aluno Digital', 'Aluno Analógico']
    },
    {
      id: 'conflito-sala-aula',
      area: 'educacional',
      title: 'Resolução de Conflitos',
      description: 'Mediação de conflito entre alunos durante atividade em grupo.',
      criteria: [
        { key: 'mediacao', label: 'Técnicas de Mediação', weight: 30 },
        { key: 'ambiente_respeitoso', label: 'Ambiente Respeitoso', weight: 25 },
        { key: 'aprendizado_conflito', label: 'Aprendizado do Conflito', weight: 25 },
        { key: 'restabelecimento', label: 'Restabelecimento da Harmonia', weight: 20 }
      ],
      persona: 'Você está em conflito com colegas por diferenças de opinião.',
      context: 'Trabalho em grupo com visões divergentes.',
      role_options: ['Professor', 'Aluno A', 'Aluno B']
    },
    {
      id: 'metodologias-ativas',
      area: 'educacional',
      title: 'Metodologias Ativas',
      description: 'Implementação de aprendizagem baseada em problemas.',
      criteria: [
        { key: 'problematizacao', label: 'Problematização Efetiva', weight: 30 },
        { key: 'autonomia', label: 'Promoção de Autonomia', weight: 25 },
        { key: 'colaboracao', label: 'Aprendizagem Colaborativa', weight: 25 },
        { key: 'reflexao', label: 'Estímulo à Reflexão', weight: 20 }
      ],
      persona: 'Você está acostumado com aulas expositivas tradicionais.',
      context: 'Primeira experiência com metodologia ativa.',
      role_options: ['Facilitador', 'Estudante']
    },
    {
      id: 'educacao-inclusiva',
      area: 'educacional',
      title: 'Educação Inclusiva',
      description: 'Adaptação de conteúdo para aluno com necessidades especiais.',
      criteria: [
        { key: 'adaptacao_conteudo', label: 'Adaptação de Conteúdo', weight: 30 },
        { key: 'recursos_assistivos', label: 'Recursos Assistivos', weight: 25 },
        { key: 'participacao_plena', label: 'Participação Plena', weight: 25 },
        { key: 'sensibilidade', label: 'Sensibilidade e Empatia', weight: 20 }
      ],
      persona: 'Você tem deficiência visual e precisa de adaptações.',
      context: 'Aula de ciências com experimentos visuais.',
      role_options: ['Professor', 'Aluno com NEE', 'Aluno Típico']
    },
    {
      id: 'pais-professores',
      area: 'educacional',
      title: 'Reunião Pais e Professores',
      description: 'Comunicação sobre desenvolvimento e desafios do aluno.',
      criteria: [
        { key: 'comunicacao_clara', label: 'Comunicação Clara', weight: 25 },
        { key: 'parceria', label: 'Construção de Parceria', weight: 30 },
        { key: 'plano_acao', label: 'Plano de Ação Conjunto', weight: 25 },
        { key: 'expectativas', label: 'Alinhamento de Expectativas', weight: 20 }
      ],
      persona: 'Você está preocupado com o desempenho do seu filho.',
      context: 'Reunião trimestral de acompanhamento.',
      role_options: ['Professor', 'Pais']
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
        .eq('area', 'educacional')
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
      description: "Relatório educacional gerado com sucesso"
    })
  }

  if (selectedScenario) {
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
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <GraduationCap className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <h1 className="text-3xl font-cal text-gradient">Educacional</h1>
              <p className="text-muted-foreground">
                Desenvolva técnicas de ensino e engajamento para diferentes públicos
              </p>
            </div>
          </div>
          <Button 
            onClick={() => window.location.href = '/app/educacional-live'}
            className="btn-primary flex items-center gap-2 hover:scale-105 transition-transform duration-300"
          >
            <Settings className="w-4 h-4" /> Cenário Personalizado
          </Button>
        </div>
      </div>

      {/* Benchmark Dashboard - Métricas Reais */}
      <RealBenchmarkDashboard area="educacional" />

      {/* Cenários Disponíveis */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Cenários Educacionais</h2>
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
            <div className="p-2 bg-green-500/10 rounded-lg">
              <BookOpen className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Engajamento Médio</p>
              <p className="text-2xl font-bold">89%</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Users2 className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Participação Ativa</p>
              <p className="text-2xl font-bold">76%</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <GraduationCap className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Objetivos Atingidos</p>
              <p className="text-2xl font-bold">94%</p>
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

  const getSubjectColor = (title: string) => {
    if (title.toLowerCase().includes('tecnologia') || title.toLowerCase().includes('digital')) {
      return 'bg-blue-500/10 text-blue-500'
    }
    if (title.toLowerCase().includes('inclusiva') || title.toLowerCase().includes('especiais')) {
      return 'bg-green-500/10 text-green-500'
    }
    if (title.toLowerCase().includes('conflito') || title.toLowerCase().includes('gestão')) {
      return 'bg-orange-500/10 text-orange-500'
    }
    if (title.toLowerCase().includes('metodologia') || title.toLowerCase().includes('ativa')) {
      return 'bg-purple-500/10 text-purple-500'
    }
    return 'bg-gray-500/10 text-gray-500'
  }

  const getSubjectLabel = (title: string) => {
    if (title.toLowerCase().includes('tecnologia') || title.toLowerCase().includes('digital')) {
      return 'Tecnologia'
    }
    if (title.toLowerCase().includes('inclusiva') || title.toLowerCase().includes('especiais')) {
      return 'Inclusão'
    }
    if (title.toLowerCase().includes('conflito') || title.toLowerCase().includes('gestão')) {
      return 'Gestão'
    }
    if (title.toLowerCase().includes('metodologia') || title.toLowerCase().includes('ativa')) {
      return 'Metodologia'
    }
    return 'Geral'
  }

  return (
    <Card className="p-6 hover:shadow-lg transition-all duration-200 hover:scale-[1.02] h-full flex flex-col">
      <div className="flex-1 space-y-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-lg leading-tight">{scenario.title}</h3>
            <Badge className={`text-xs ${getSubjectColor(scenario.title)}`}>
              {getSubjectLabel(scenario.title)}
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