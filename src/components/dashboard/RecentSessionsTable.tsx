import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, Download } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { PDFExporter } from "@/components/simulation/PDFExporter";
import type { SessionData } from "@/hooks/useDashboardData";

interface RecentSessionsTableProps {
  sessions: SessionData[];
}

function formatDuration(ms: number): string {
  const minutes = Math.floor(ms / (1000 * 60));
  const seconds = Math.floor((ms % (1000 * 60)) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function RecentSessionsTable({ sessions }: RecentSessionsTableProps) {
  const navigate = useNavigate();
  const [exportingSession, setExportingSession] = useState<string | null>(null);
  const { toast } = useToast();

  const exportToPDF = async (session: SessionData) => {
    setExportingSession(session.id);
    
    try {
      const reportData = {
        overallScore: session.score || 0, // Usar score real ou 0 se não houver
        summary: `Relatório da sessão de ${session.track} realizada em ${format(new Date(session.created_at), 'dd/MM/yyyy', { locale: ptBR })}.`,
        benchmarkComparison: {
          userScore: session.score || 8,
          industryAverage: 7.2,
          topPerformers: 9.1
        },
        highlights: [
          "Boa comunicação inicial",
          "Técnicas de escuta ativa aplicadas",
          "Condução adequada da conversa"
        ],
        improvements: [
          "Melhore o fechamento das interações",
          "Pratique mais técnicas de objeção", 
          "Desenvolva confiança na apresentação"
        ],
        detailedMetrics: {
          speech: [
            { name: "Clareza na comunicação", score: session.score || 8, benchmark: 7.5, status: "good" },
            { name: "Tom de voz", score: (session.score || 8) - 0.5, benchmark: 7.2, status: "good" }
          ],
          conversation: [
            { name: "Escuta ativa", score: (session.score || 8) + 0.5, benchmark: 7.8, status: "excellent" },
            { name: "Gestão do tempo", score: session.score || 8, benchmark: 7.3, status: "good" }
          ],
          content: [
            { name: "Conhecimento técnico", score: (session.score || 8) + 1, benchmark: 7.6, status: "excellent" },
            { name: "Adequação ao contexto", score: session.score || 8, benchmark: 7.4, status: "good" }
          ],
          outcome: [
            { name: "Objetivos alcançados", score: session.score || 8, benchmark: 7.1, status: "good" },
            { name: "Satisfação do cliente", score: (session.score || 8) - 0.2, benchmark: 7.3, status: "good" }
          ],
          climate: [
            { name: "Empatia", score: (session.score || 8) - 0.3, benchmark: 7.2, status: "good" },
            { name: "Rapport", score: session.score || 8, benchmark: 7.0, status: "good" }
          ]
        },
        recommendations: [
          {
            category: "Comunicação",
            priority: "medium" as const,
            title: "Melhorar clareza na comunicação",
            description: "Foque em ser mais direto e claro nas explicações",
            actionItems: ["Pratique elevator pitch", "Use exemplos concretos"]
          }
        ],
        nextSteps: [
          "Pratique cenários similares",
          "Revise técnicas de comunicação",
          "Agende nova sessão em 1 semana"
        ]
      };

      const scenarioData = {
        area: session.track,
        title: session.scenario || `Sessão ${session.type}`,
        description: `Simulação de ${session.track}`
      };

      const userRole = "Profissional";
      const timestamp = new Date().toISOString().split('T')[0];

      await PDFExporter.exportReport({
        report: reportData,
        scenario: scenarioData,
        userRole,
        timestamp,
        metrics: {}
      });

      toast({
        title: "PDF Exportado",
        description: "Relatório baixado com sucesso!",
      });

    } catch (error) {
      console.error('Erro ao exportar PDF:', error);
      toast({
        title: "Erro",
        description: "Não foi possível exportar o relatório",
        variant: "destructive"
      });
    } finally {
      setExportingSession(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Últimas 20 Sessões</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Trilha</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Duração</TableHead>
              <TableHead>Score</TableHead>
              <TableHead className="w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sessions.map((session) => (
              <TableRow key={`${session.type}-${session.id}`}>
                <TableCell>
                  {format(new Date(session.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{session.track}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={session.type === 'live' ? 'secondary' : 'default'}>
                    {session.type === 'live' ? 'Live' : 'Regular'}
                  </Badge>
                </TableCell>
                <TableCell>{formatDuration(session.duration_ms || 0)}</TableCell>
                <TableCell>
                  {session.score ? session.score.toFixed(1) : '-'}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/app/session/${session.type}/${session.id}`)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => exportToPDF(session)}
                      disabled={exportingSession === session.id}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}