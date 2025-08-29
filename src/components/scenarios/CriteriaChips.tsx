import { Badge } from "@/components/ui/badge";

interface Criterion {
  key: string;
  label: string;
  weight: number;
}

interface CriteriaChipsProps {
  criteria: Criterion[];
  maxDisplay?: number;
}

export function CriteriaChips({ criteria, maxDisplay = 3 }: CriteriaChipsProps) {
  const displayCriteria = criteria.slice(0, maxDisplay);
  const remainingCount = criteria.length - maxDisplay;

  return (
    <div className="flex flex-wrap gap-1">
      {displayCriteria.map((criterion) => (
        <Badge 
          key={criterion.key} 
          variant="outline" 
          className="text-xs font-medium"
        >
          {criterion.label} ({criterion.weight})
        </Badge>
      ))}
      {remainingCount > 0 && (
        <Badge variant="secondary" className="text-xs">
          +{remainingCount}
        </Badge>
      )}
    </div>
  );
}