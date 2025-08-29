import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { ScenarioCardWithRoles } from '@/components/scenarios/ScenarioCardWithRoles';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users, Target } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Scenario {
  id: string;
  area: string;
  title: string;
  description: string;
  role_options: any;
  tags: string[];
  criteria?: any;
  persona?: any;
  context?: string;
  system_prompt?: string;
}

export default function ScenariosByAreaWithRoles() {
  const { area } = useParams<{ area: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadScenarios();
  }, [area]);

  const loadScenarios = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('scenarios')
        .select('id, area, title, description, role_options, tags')
        .eq('area', area)
        .order('title');

      if (error) throw error;

      setScenarios((data || []).map(item => ({
        ...item,
        role_options: Array.isArray(item.role_options) ? item.role_options : 
                     typeof item.role_options === 'string' ? JSON.parse(item.role_options) : []
      })) as Scenario[])
    } catch (error) {
      console.error('Erro ao carregar cenários:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os cenários.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getAreaInfo = (area: string) => {
    const info = {
      'rh': {
        title: 'Recursos Humanos',
        description: 'Desenvolva habilidades essenciais de comunicação, feedback e gestão de pessoas',
        color: 'text-blue-600 dark:text-blue-400'
      },
      'comercial': {
        title: 'Comercial',
        description: 'Aprimore técnicas de venda, negociação e relacionamento com clientes',
        color: 'text-green-600 dark:text-green-400'
      },
      'educacional': {
        title: 'Educacional',
        description: 'Desenvolva competências pedagógicas e de facilitação de aprendizagem',
        color: 'text-purple-600 dark:text-purple-400'
      },
      'gestao': {
        title: 'Gestão',
        description: 'Fortaleça habilidades de liderança, tomada de decisão e gestão estratégica',
        color: 'text-orange-600 dark:text-orange-400'
      }
    };
    return info[area as keyof typeof info] || { title: area, description: '', color: 'text-gray-600' };
  };

  const areaInfo = getAreaInfo(area || '');

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
        <div className="container max-w-7xl mx-auto py-8 px-4">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="h-4 bg-muted rounded w-2/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-muted rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container max-w-7xl mx-auto py-8 px-4">
        <div className="space-y-8">
          {/* Header */}
          <div className="space-y-6">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/scenarios')}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar aos Cenários
            </Button>

            <div className="text-center space-y-4">
              <h1 className={`text-4xl font-bold ${areaInfo.color}`}>
                {areaInfo.title}
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                {areaInfo.description}
              </p>
            </div>

            <div className="flex justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                {scenarios.length} cenários disponíveis
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Múltiplas perspectivas por cenário
              </div>
            </div>
          </div>

          {/* Scenarios Grid */}
          {scenarios.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {scenarios.map((scenario) => (
                <ScenarioCardWithRoles 
                  key={scenario.id} 
                  scenario={scenario} 
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto space-y-4">
                <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                  <Target className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold">Nenhum cenário encontrado</h3>
                <p className="text-muted-foreground">
                  Os cenários para esta área estão sendo preparados. Volte em breve!
                </p>
                <Button variant="outline" onClick={() => navigate('/scenarios')}>
                  Ver Outras Áreas
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}