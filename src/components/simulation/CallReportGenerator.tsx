import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, Clock, Users, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface CallReport {
  overall_score: number;
  duration_minutes: number;
  interaction_count: number;
  skills_breakdown: {
    communication: number;
    empathy: number;
    problem_solving: number;
    technical_knowledge: number;
  };
  highlights: string[];
  improvement_areas: string[];
  transcript_summary: string;
}

interface CallReportGeneratorProps {
  sessionId: string;
  track: "comercial" | "rh" | "educacional" | "gestao";
  onReportGenerated?: (report: CallReport) => void;
}

export function CallReportGenerator({ 
  sessionId, 
  track, 
  onReportGenerated 
}: CallReportGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [report, setReport] = useState<CallReport | null>(null);

  const generateReport = async () => {
    setIsGenerating(true);
    try {
      // Buscar dados da sessão
      const { data: session, error: sessionError } = await supabase
        .from('sessions')
        .select('*')
        .eq('id', sessionId)
        .single();

      if (sessionError) throw sessionError;

      // Buscar mensagens da sessão
      const { data: messages, error: messagesError } = await supabase
        .from('messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (messagesError) throw messagesError;

      // Gerar relatório usando IA
      const { data: reportData, error: reportError } = await supabase.functions.invoke(
        'generate-call-report',
        {
          body: {
            session,
            messages,
            track
          }
        }
      );

      if (reportError) throw reportError;

      const generatedReport: CallReport = {
        overall_score: reportData.overall_score || 0,
        duration_minutes: Math.floor((session.finished_at 
          ? new Date(session.finished_at).getTime() - new Date(session.created_at).getTime() 
          : 0) / 60000),
        interaction_count: messages?.length || 0,
        skills_breakdown: reportData.skills_breakdown || {
          communication: 0,
          empathy: 0,
          problem_solving: 0,
          technical_knowledge: 0
        },
        highlights: reportData.highlights || [],
        improvement_areas: reportData.improvement_areas || [],
        transcript_summary: reportData.transcript_summary || ""
      };

      setReport(generatedReport);
      onReportGenerated?.(generatedReport);

    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadReport = () => {
    if (!report) return;
    
    const reportText = `
RELATÓRIO DE PERFORMANCE - ${track.toUpperCase()}
===============================================

Score Geral: ${report.overall_score}%
Duração: ${report.duration_minutes} minutos
Interações: ${report.interaction_count}

BREAKDOWN DE HABILIDADES:
- Comunicação: ${report.skills_breakdown.communication}%
- Empatia: ${report.skills_breakdown.empathy}%
- Resolução de Problemas: ${report.skills_breakdown.problem_solving}%
- Conhecimento Técnico: ${report.skills_breakdown.technical_knowledge}%

PONTOS FORTES:
${report.highlights.map(h => `• ${h}`).join('\n')}

ÁREAS DE MELHORIA:
${report.improvement_areas.map(a => `• ${a}`).join('\n')}

RESUMO DA CONVERSA:
${report.transcript_summary}
    `;

    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-${track}-${sessionId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return <Badge className="bg-green-500">Excelente</Badge>;
    if (score >= 60) return <Badge className="bg-yellow-500">Bom</Badge>;
    return <Badge className="bg-red-500">Precisa Melhorar</Badge>;
  };

  return (
    <div className="space-y-4">
      {!report ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Relatório de Performance
            </CardTitle>
            <CardDescription>
              Gere um relatório detalhado da sua ligação com análise de IA
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={generateReport} 
              disabled={isGenerating}
              className="w-full"
            >
              {isGenerating ? "Gerando relatório..." : "Gerar Relatório"}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {/* Score Geral */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Performance Geral</span>
                {getScoreBadge(report.overall_score)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="text-3xl font-bold text-primary">
                  {report.overall_score}%
                </div>
                <div className="flex-1">
                  <Progress value={report.overall_score} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Métricas da Ligação */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Duração</p>
                    <p className="text-lg font-semibold">{report.duration_minutes}min</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Interações</p>
                    <p className="text-lg font-semibold">{report.interaction_count}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Classificação</p>
                    <p className="text-lg font-semibold">{getScoreBadge(report.overall_score)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Breakdown de Habilidades */}
          <Card>
            <CardHeader>
              <CardTitle>Análise de Habilidades</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(report.skills_breakdown).map(([skill, score]) => (
                <div key={skill} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="capitalize">{skill.replace('_', ' ')}</span>
                    <span className={`font-semibold ${getScoreColor(score)}`}>
                      {score}%
                    </span>
                  </div>
                  <Progress value={score} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Pontos Fortes e Melhorias */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-green-600">Pontos Fortes</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {report.highlights.map((highlight, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">•</span>
                      <span className="text-sm">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-yellow-600">Áreas de Melhoria</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {report.improvement_areas.map((area, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-yellow-500 mt-1">•</span>
                      <span className="text-sm">{area}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Resumo da Conversa */}
          <Card>
            <CardHeader>
              <CardTitle>Resumo da Conversa</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {report.transcript_summary}
              </p>
            </CardContent>
          </Card>

          {/* Ações */}
          <div className="flex gap-2">
            <Button onClick={downloadReport} variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Baixar Relatório
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}