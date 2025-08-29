import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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

const areaLabels = {
  rh: "Recursos Humanos",
  comercial: "Comercial",
  educacional: "Educacional",
  gestao: "Gestão",
};

const areaDescriptions = {
  rh: "Desenvolva suas habilidades em gestão de pessoas, feedback, recrutamento e desenvolvimento de equipes.",
  comercial: "Pratique técnicas de vendas, negociação, relacionamento com clientes e fechamento de negócios.",
  educacional: "Aprimore suas competências em ensino, gestão de sala de aula e relacionamento com estudantes e pais.",
  gestao: "Fortaleça sua liderança, tomada de decisão, gestão de conflitos e comunicação organizacional.",
};

export default function ScenariosByArea() {
  const { area } = useParams<{ area: string }>();
  const navigate = useNavigate();
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [filteredScenarios, setFilteredScenarios] = useState<Scenario[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (area) {
      fetchScenarios(area);
    }
  }, [area]);

  useEffect(() => {
    // Filter scenarios based on search term
    const filtered = scenarios.filter((scenario) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        scenario.title.toLowerCase().includes(searchLower) ||
        scenario.description?.toLowerCase().includes(searchLower) ||
        scenario.tags?.some(tag => tag.toLowerCase().includes(searchLower)) ||
        scenario.criteria.some(criterion => 
          criterion.label.toLowerCase().includes(searchLower)
        )
      );
    });
    setFilteredScenarios(filtered);
  }, [scenarios, searchTerm]);

  const fetchScenarios = async (areaParam: string) => {
    try {
      const { data, error } = await supabase
        .from("scenarios")
        .select("*")
        .eq("area", areaParam)
        .order("title", { ascending: true });

      if (error) throw error;

      setScenarios((data || []).map(item => ({
        ...item,
        title: item.title || item.name,
        role_options: Array.isArray(item.role_options) ? item.role_options : 
                     typeof item.role_options === 'string' ? JSON.parse(item.role_options) : []
      })) as Scenario[])
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

  if (!area || !(area in areaLabels)) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <h1 className="text-2xl font-bold mb-2">Área não encontrada</h1>
            <p className="text-muted-foreground mb-4">
              A área solicitada não existe ou não está disponível.
            </p>
            <Link to="/scenarios">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar aos Cenários
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const areaLabel = areaLabels[area as keyof typeof areaLabels];
  const areaDescription = areaDescriptions[area as keyof typeof areaDescriptions];

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/scenarios">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold">{areaLabel}</h1>
            <Badge variant="outline" className="capitalize">
              {scenarios.length} cenários
            </Badge>
          </div>
          <p className="text-muted-foreground">{areaDescription}</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Input
            placeholder="Buscar cenários..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-4"
          />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="w-4 h-4 mr-2" />
          Filtros
        </Button>
      </div>

      {/* Results */}
      {isLoading ? (
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
      ) : filteredScenarios.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredScenarios.map((scenario) => (
            <ScenarioCard
              key={scenario.id}
              scenario={scenario}
              onViewRubric={handleViewRubric}
            />
          ))}
        </div>
      ) : searchTerm ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <h3 className="text-lg font-medium mb-2">Nenhum resultado encontrado</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Não encontramos cenários que correspondam à sua busca "{searchTerm}".
            </p>
            <Button 
              variant="outline" 
              onClick={() => setSearchTerm("")}
            >
              Limpar busca
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <h3 className="text-lg font-medium mb-2">Nenhum cenário disponível</h3>
            <p className="text-sm text-muted-foreground">
              Não há cenários disponíveis para a área de {areaLabel} no momento.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}