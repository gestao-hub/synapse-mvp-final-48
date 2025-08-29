import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, Target, TrendingUp, ChevronRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface RecommendedScenario {
  id: string;
  area: string;
  title: string;
  description: string;
  role_options: string[];
  coverage_score: number;
  weak_criteria: string[];
}

export default function RecommendedTraining() {
  const [recommendations, setRecommendations] = useState<RecommendedScenario[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const generateRecommendations = async (area?: string) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.functions.invoke('recommend-next', {
        body: { area, limit: 6 }
      });

      if (error) throw error;

      setRecommendations(data.recommendations || []);
      
      toast({
        title: "Recomendações geradas!",
        description: `${data.recommendations?.length || 0} cenários recomendados com base nos seus pontos fracos.`
      });
    } catch (error) {
      console.error('Erro ao gerar recomendações:', error);
      toast({
        title: "Erro",
        description: "Não foi possível gerar recomendações. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const startScenario = (scenario: RecommendedScenario) => {
    navigate(`/app/scenarios/${scenario.area}`);
  };

  const getAreaColor = (area: string) => {
    const colors = {
      'rh': 'text-blue-600 border-blue-200 bg-blue-50',
      'comercial': 'text-green-600 border-green-200 bg-green-50',
      'educacional': 'text-purple-600 border-purple-200 bg-purple-50',
      'gestao': 'text-orange-600 border-orange-200 bg-orange-50'
    };
    return colors[area as keyof typeof colors] || 'text-gray-600 border-gray-200 bg-gray-50';
  };

  const getAreaLabel = (area: string) => {
    const labels = {
      'rh': 'RH',
      'comercial': 'Comercial',
      'educacional': 'Educacional',
      'gestao': 'Gestão'
    };
    return labels[area as keyof typeof labels] || area;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container max-w-6xl mx-auto py-8 px-4">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Brain className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold">Treino Orientado por IA</h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Receba recomendações personalizadas de cenários com base nos seus pontos de melhoria identificados nas últimas simulações.
            </p>
          </div>

          {/* Generate Recommendations */}
          <div className="flex flex-col items-center space-y-4">
            <div className="flex flex-wrap gap-3 justify-center">
              <Button
                onClick={() => generateRecommendations()}
                disabled={loading}
                size="lg"
                className="min-w-[200px]"
              >
                <Target className="h-5 w-5 mr-2" />
                {loading ? 'Analisando...' : 'Gerar Recomendações'}
              </Button>
              
              <Button
                onClick={() => generateRecommendations('rh')}
                disabled={loading}
                variant="outline"
              >
                RH
              </Button>
              
              <Button
                onClick={() => generateRecommendations('comercial')}
                disabled={loading}
                variant="outline"
              >
                Comercial
              </Button>
              
              <Button
                onClick={() => generateRecommendations('educacional')}
                disabled={loading}
                variant="outline"
              >
                Educacional
              </Button>
              
              <Button
                onClick={() => generateRecommendations('gestao')}
                disabled={loading}
                variant="outline"
              >
                Gestão
              </Button>
            </div>
            
            <p className="text-sm text-muted-foreground text-center">
              Clique em "Gerar Recomendações" para análise geral ou escolha uma área específica
            </p>
          </div>

          {/* Recommendations */}
          {recommendations.length > 0 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-semibold mb-2">Cenários Recomendados</h2>
                <p className="text-muted-foreground">
                  Baseado na análise dos seus últimos 60 dias de treinamento
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendations.map((scenario) => (
                  <Card key={scenario.id} className="group hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary">
                    <CardHeader className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-1 rounded text-xs font-medium border ${getAreaColor(scenario.area)}`}>
                          {getAreaLabel(scenario.area)}
                        </span>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-4 w-4 text-orange-500" />
                          <span className="text-sm font-medium text-orange-600">
                            {Math.round(scenario.coverage_score)}% match
                          </span>
                        </div>
                      </div>
                      
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {scenario.title}
                      </CardTitle>
                      
                      <CardDescription className="text-sm">
                        {scenario.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-muted-foreground">
                          Critérios focados para melhoria:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {scenario.weak_criteria.slice(0, 3).map((criteria, index) => (
                            <span 
                              key={index}
                              className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded"
                            >
                              {criteria}
                            </span>
                          ))}
                          {scenario.weak_criteria.length > 3 && (
                            <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">
                              +{scenario.weak_criteria.length - 3}
                            </span>
                          )}
                        </div>
                      </div>

                      <Button 
                        onClick={() => startScenario(scenario)}
                        className="w-full group"
                        variant="outline"
                      >
                        Treinar Agora
                        <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && recommendations.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <Brain className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Pronto para Recomendações Inteligentes?</h3>
                <p className="text-muted-foreground mb-6">
                  Nossa IA analisará suas simulações anteriores e identificará os melhores cenários para seu desenvolvimento.
                </p>
                <Button onClick={() => generateRecommendations()} size="lg">
                  <Target className="h-5 w-5 mr-2" />
                  Começar Análise
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}