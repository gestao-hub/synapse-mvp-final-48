import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Eye } from "lucide-react";
import { CriteriaChips } from "./CriteriaChips";
import { NewSimulationModal } from "./NewSimulationModal";

interface Scenario {
  id: string;
  area: string;
  title: string;
  description?: string;
  role_options: string[];
  criteria: Array<{
    key: string;
    label: string;
    weight: number;
  }>;
  tags?: string[];
}

interface ScenarioCardProps {
  scenario: Scenario;
  onViewRubric?: (scenario: Scenario) => void;
}

export function ScenarioCard({ scenario, onViewRubric }: ScenarioCardProps) {
  const [showSimulationModal, setShowSimulationModal] = useState(false);

  const areaColors = {
    rh: "bg-blue-500/10 text-blue-700 border-blue-200",
    comercial: "bg-green-500/10 text-green-700 border-green-200",
    educacional: "bg-purple-500/10 text-purple-700 border-purple-200",
    gestao: "bg-orange-500/10 text-orange-700 border-orange-200",
  };

  return (
    <>
      <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2 mb-2">
            <CardTitle className="text-lg font-semibold line-clamp-2">
              {scenario.title}
            </CardTitle>
            <Badge 
              variant="outline"
              className={`${areaColors[scenario.area as keyof typeof areaColors]} capitalize shrink-0`}
            >
              {scenario.area}
            </Badge>
          </div>
          
          {scenario.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {scenario.description}
            </p>
          )}
        </CardHeader>

        <CardContent className="flex-1 space-y-3">
          <div>
            <h4 className="text-sm font-medium mb-2">Critérios de Avaliação:</h4>
            <CriteriaChips criteria={scenario.criteria} maxDisplay={3} />
          </div>

          {scenario.tags && scenario.tags.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">Tags:</h4>
              <div className="flex flex-wrap gap-1">
                {scenario.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {scenario.tags.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{scenario.tags.length - 3}
                  </Badge>
                )}
              </div>
            </div>
          )}

          <div>
            <h4 className="text-sm font-medium mb-2">Papéis Disponíveis:</h4>
            <div className="flex flex-wrap gap-1">
              {scenario.role_options.map((role) => (
                <Badge key={role} variant="outline" className="text-xs capitalize">
                  {role.replace(/_/g, " ")}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>

        <CardFooter className="pt-3 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewRubric?.(scenario)}
            className="flex-1"
          >
            <Eye className="w-4 h-4 mr-2" />
            Ver Rubrica
          </Button>
          <Button
            size="sm"
            onClick={() => setShowSimulationModal(true)}
            className="flex-1"
          >
            <Play className="w-4 h-4 mr-2" />
            Simular
          </Button>
        </CardFooter>
      </Card>

      <NewSimulationModal
        open={showSimulationModal}
        onOpenChange={setShowSimulationModal}
        scenario={scenario}
      />
    </>
  );
}