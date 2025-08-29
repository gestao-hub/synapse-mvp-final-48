import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { ScenarioCard } from "@/components/scenarios/ScenarioCard";

interface Scenario {
  id: string;
  area: string;
  title: string;
  description?: string;
  role_options: any;
  criteria: any;
  tags?: string[];
  name?: string;
  system_prompt?: string;
  context?: string;
  persona?: any;
}

const areas = [
  { key: "rh", label: "RH", description: "Recursos Humanos e Gestão de Pessoas" },
  { key: "comercial", label: "Comercial", description: "Vendas e Relacionamento com Clientes" },
  { key: "educacional", label: "Educacional", description: "Ensino e Desenvolvimento Acadêmico" },
  { key: "gestao", label: "Gestão", description: "Liderança e Administração" },
];

export default function Scenarios() {
  const [scenarios, setScenarios] = useState<Record<string, Scenario[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("rh");
  const navigate = useNavigate();

  useEffect(() => {
    fetchScenarios();
  }, []);

  const fetchScenarios = async () => {
    try {
      const { data, error } = await supabase
        .from("scenarios")
        .select("*")
        .order("area", { ascending: true })
        .order("title", { ascending: true });

      if (error) throw error;

      // Group scenarios by area
      const groupedScenarios = data.reduce((acc: Record<string, Scenario[]>, scenario) => {
        if (!acc[scenario.area]) {
          acc[scenario.area] = [];
        }
        acc[scenario.area].push({
          ...scenario,
          title: scenario.title || scenario.name,
          role_options: Array.isArray(scenario.role_options) ? scenario.role_options : 
                       typeof scenario.role_options === 'string' ? JSON.parse(scenario.role_options) : []
        } as Scenario);
        return acc;
      }, {});

      setScenarios(groupedScenarios);
    } catch (error) {
      console.error("Error fetching scenarios:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewRubric = (scenario: Scenario) => {
    // Navigate to detailed scenario view
    navigate(`/scenarios/${scenario.area}/${scenario.id}`);
  };

  const renderScenarioGrid = (areaScenarios: Scenario[]) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {areaScenarios.map((scenario) => (
        <ScenarioCard
          key={scenario.id}
          scenario={scenario}
          onViewRubric={handleViewRubric}
        />
      ))}
    </div>
  );

  const renderEmptyState = (area: string) => (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <div className="text-center space-y-2">
          <h3 className="text-lg font-medium">Nenhum cenário encontrado</h3>
          <p className="text-sm text-muted-foreground">
            Não há cenários disponíveis para a área de {area} no momento.
          </p>
        </div>
      </CardContent>
    </Card>
  );

  const renderLoadingGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="h-[300px]">
          <CardContent className="p-6 space-y-4">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-2/3" />
            <div className="space-y-2">
              <Skeleton className="h-3 w-1/2" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-12" />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Skeleton className="h-8 flex-1" />
              <Skeleton className="h-8 flex-1" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Cenários de Simulação</h1>
        <p className="text-muted-foreground">
          Escolha um cenário para praticar suas habilidades interpessoais e receber feedback personalizado.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          {areas.map((area) => (
            <TabsTrigger key={area.key} value={area.key} className="capitalize">
              {area.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {areas.map((area) => (
          <TabsContent key={area.key} value={area.key} className="space-y-4">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">{area.label}</h2>
              <p className="text-sm text-muted-foreground">{area.description}</p>
            </div>

            {isLoading ? (
              renderLoadingGrid()
            ) : scenarios[area.key] && scenarios[area.key].length > 0 ? (
              renderScenarioGrid(scenarios[area.key])
            ) : (
              renderEmptyState(area.label)
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}