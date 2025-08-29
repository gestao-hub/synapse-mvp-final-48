import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface CriterionBarProps {
  criterion: {
    key: string;
    label: string;
    weight: number;
  };
  currentScore?: number;
  maxScore?: number;
  feedback?: string;
  showAnimation?: boolean;
}

export function CriterionBar({ 
  criterion, 
  currentScore = 0, 
  maxScore = 10,
  feedback,
  showAnimation = false
}: CriterionBarProps) {
  const percentage = Math.max(0, Math.min(100, (currentScore / maxScore) * 100));
  
  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600";
    if (score >= 6) return "text-yellow-600";
    if (score >= 4) return "text-orange-600";
    return "text-red-600";
  };

  const getProgressColor = (score: number) => {
    if (score >= 8) return "bg-green-500";
    if (score >= 6) return "bg-yellow-500";
    if (score >= 4) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h4 className="font-medium text-sm">{criterion.label}</h4>
          <Badge variant="outline" className="text-xs">
            Peso {criterion.weight}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-sm font-semibold ${getScoreColor(currentScore)}`}>
            {currentScore.toFixed(1)}
          </span>
          <span className="text-xs text-muted-foreground">/ {maxScore}</span>
        </div>
      </div>

      <div className="relative">
        <Progress 
          value={percentage} 
          className={`h-2 ${showAnimation ? 'transition-all duration-1000 ease-out' : ''}`}
        />
        <div 
          className={`absolute top-0 left-0 h-2 rounded-full ${getProgressColor(currentScore)} ${
            showAnimation ? 'transition-all duration-1000 ease-out' : ''
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {feedback && (
        <div className="mt-2 p-2 bg-muted/30 rounded text-xs">
          <p className="text-muted-foreground">{feedback}</p>
        </div>
      )}

      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Insatisfatório</span>
        <span>Excelente</span>
      </div>
    </div>
  );
}