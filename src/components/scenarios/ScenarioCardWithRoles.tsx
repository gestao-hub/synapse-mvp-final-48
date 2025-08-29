import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RoleSelector } from '@/components/ui/role-selector';
import { Play, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ScenarioCardWithRolesProps {
  scenario: {
    id: string;
    area: string;
    title: string;
    description: string;
    role_options: string[];
    tags?: string[];
  };
}

export function ScenarioCardWithRoles({ scenario }: ScenarioCardWithRolesProps) {
  const [showRoleSelector, setShowRoleSelector] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleRoleSelect = async (selectedRole: string) => {
    try {
      // Criar nova simulação
      const { data: simulation, error } = await supabase
        .from('simulations')
        .insert({
          scenario_id: scenario.id,
          role: selectedRole,
          mode: 'live',
          user_id: (await supabase.auth.getUser()).data.user?.id || ''
        })
        .select()
        .single();

      if (error) throw error;

      // Navegar para a página de simulação específica da área
      const areaRoutes = {
        'rh': '/sim/rh',
        'comercial': '/sim/comercial', 
        'educacional': '/sim/educacional',
        'gestao': '/sim/gestao'
      };

      const baseRoute = areaRoutes[scenario.area as keyof typeof areaRoutes] || '/simulate';
      navigate(`${baseRoute}?simulation_id=${simulation.id}`);

      toast({
        title: "Simulação iniciada!",
        description: `Você está simulando como ${selectedRole}`,
      });
    } catch (error) {
      console.error('Erro ao criar simulação:', error);
      toast({
        title: "Erro",
        description: "Não foi possível iniciar a simulação. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const getAreaColor = (area: string) => {
    const colors = {
      'rh': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'comercial': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'educacional': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      'gestao': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
    };
    return colors[area as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getAreaLabel = (area: string) => {
    const labels = {
      'rh': 'Recursos Humanos',
      'comercial': 'Comercial',
      'educacional': 'Educacional', 
      'gestao': 'Gestão'
    };
    return labels[area as keyof typeof labels] || area;
  };

  return (
    <>
      <Card className="h-full group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/20">
        <CardHeader className="space-y-3">
          <div className="flex items-start justify-between">
            <Badge className={getAreaColor(scenario.area)}>
              {getAreaLabel(scenario.area)}
            </Badge>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Users className="h-3 w-3" />
              {scenario.role_options.length} perspectivas
            </div>
          </div>
          
          <CardTitle className="text-lg group-hover:text-primary transition-colors">
            {scenario.title}
          </CardTitle>
          
          <CardDescription className="text-sm leading-relaxed">
            {scenario.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {scenario.tags && scenario.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {scenario.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {scenario.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{scenario.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          <Button 
            onClick={() => setShowRoleSelector(true)}
            className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
            variant="outline"
          >
            <Play className="h-4 w-4 mr-2" />
            Iniciar Simulação
          </Button>
        </CardContent>
      </Card>

      <RoleSelector
        open={showRoleSelector}
        onOpenChange={setShowRoleSelector}
        roleOptions={scenario.role_options}
        onRoleSelect={handleRoleSelect}
        scenarioTitle={scenario.title}
        scenarioDescription={scenario.description}
      />
    </>
  );
}