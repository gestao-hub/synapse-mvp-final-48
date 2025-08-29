import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, Target, TrendingUp } from "lucide-react";

interface FeedbackData {
  scores: Array<{
    criterion_key: string;
    criterion_label: string;
    weight: number;
    score: number;
    feedback: string;
  }>;
  notes: {
    highlights: string[];
    improvements: string[];
    next_steps: string[];
  };
  kpis: {
    open_questions: number;
    empathy_shown: number;
    next_step_marked: boolean;
    total_interactions: number;
  };
  overall_score: number;
}

interface FeedbackPanelProps {
  feedback: FeedbackData;
  isVisible: boolean;
}

export function FeedbackPanel({ feedback, isVisible }: FeedbackPanelProps) {
  if (!isVisible || !feedback) return null;

  const getOverallScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-50 border-green-200";
    if (score >= 60) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    if (score >= 40) return "text-orange-600 bg-orange-50 border-orange-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excelente";
    if (score >= 60) return "Bom";
    if (score >= 40) return "Regular";
    return "Precisa Melhorar";
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Overall Score */}
      <Card className={`${getOverallScoreColor(feedback.overall_score)}`}>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            Score Geral: {feedback.overall_score}%
          </CardTitle>
          <Badge variant="outline" className="mx-auto">
            {getScoreLabel(feedback.overall_score)}
          </Badge>
        </CardHeader>
      </Card>

      {/* KPIs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Indicadores de Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 border rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {feedback.kpis.open_questions}
              </div>
              <div className="text-xs text-muted-foreground">
                Perguntas Abertas
              </div>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {feedback.kpis.empathy_shown}
              </div>
              <div className="text-xs text-muted-foreground">
                Demonstrações de Empatia
              </div>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {feedback.kpis.total_interactions}
              </div>
              <div className="text-xs text-muted-foreground">
                Total de Interações
              </div>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <div className={`text-2xl font-bold ${
                feedback.kpis.next_step_marked ? 'text-green-600' : 'text-red-600'
              }`}>
                {feedback.kpis.next_step_marked ? '✓' : '✗'}
              </div>
              <div className="text-xs text-muted-foreground">
                Próximos Passos Definidos
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Feedback */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Highlights */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-green-600">
              <CheckCircle className="w-5 h-5" />
              Pontos Fortes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {feedback.notes.highlights.map((highlight, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  {highlight}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Improvements */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-orange-600">
              <AlertCircle className="w-5 h-5" />
              Oportunidades de Melhoria
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {feedback.notes.improvements.map((improvement, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                  {improvement}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-blue-600">
              <Target className="w-5 h-5" />
              Próximos Passos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {feedback.notes.next_steps.map((step, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <Target className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  {step}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Scores */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Feedback Detalhado por Critério</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {feedback.scores.map((score) => (
              <div key={score.criterion_key} className="border-l-4 border-primary pl-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{score.criterion_label}</h4>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Peso {score.weight}</Badge>
                    <Badge variant={score.score >= 7 ? "default" : score.score >= 5 ? "secondary" : "destructive"}>
                      {score.score}/10
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{score.feedback}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}