import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, Clock, Target, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PDFExporter } from "@/components/simulation/PDFExporter";

type Session = {
  id: string;
  type: 'simulation' | 'live';
  track: string;
  scenario: string;
  started_at: string;
  finished_at: string | null;
  score: number | null;
  metrics: any | null;
  duration_sec?: number | null;
  duration_ms?: number | null;
  metadata?: any | null;
};

export default function Dashboard() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [exportingSession, setExportingSession] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadAllSessions();
  }, []);

  const loadAllSessions = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return setLoading(false);

      // Buscar sessões de simulação tradicionais
      const { data: regularSessions } = await supabase
        .from("sessions")
        .select("id, track, scenario, started_at, finished_at, score, metrics")
        .eq("user_id", user.id)
        .order("started_at", { ascending: false });

      // Buscar sessões live
      const { data: liveSessions } = await supabase
        .from("sessions_live")
        .select("id, track, duration_ms, created_at, updated_at, metadata")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      // Combinar e formatar as sessões
      const allSessions: Session[] = [
        ...(regularSessions || []).map(s => ({
          ...s,
          type: 'simulation' as const,
        })),
        ...(liveSessions || []).map(s => {
          const metadata = s.metadata as any;
          return {
            id: s.id,
            type: 'live' as const,
            track: s.track,
            scenario: metadata?.scenario_title || metadata?.scenario || 'Ligação Live',
            started_at: s.created_at,
            finished_at: s.updated_at,
            score: metadata?.overall_score || null,
            metrics: metadata,
            duration_ms: s.duration_ms
          };
        })
      ].sort((a, b) => new Date(b.started_at).getTime() - new Date(a.started_at).getTime());

      setSessions(allSessions);
    } catch (error) {
      console.error('Erro ao carregar sessões:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as sessões",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const exportToPDF = async (session: Session) => {
    setExportingSession(session.id);
    
    try {
      // Simular dados de relatório baseado na sessão
      const reportData = {
        overallScore: session.score || 0, // Usar score real ou 0 se não houver
        summary: `Relatório da sessão de ${session.track} realizada em ${new Date(session.started_at).toLocaleDateString()}.`,
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
          communication: { score: session.score || 8, benchmark: 7.5 },
          empathy: { score: (session.score || 8) - 1, benchmark: 7.2 },
          technical: { score: (session.score || 8) + 1, benchmark: 7.8 }
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
        title: session.scenario,
        description: `Simulação de ${session.track}`
      };

      const userRole = (session.metadata as any)?.role || "Profissional";
      const timestamp = new Date().toISOString().split('T')[0];

      await PDFExporter.exportReport({
        report: reportData,
        scenario: scenarioData,
        userRole,
        timestamp,
        metrics: session.metrics
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

  const getTrackColor = (track: string) => {
    const colors = {
      comercial: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      rh: "bg-green-500/10 text-green-400 border-green-500/20", 
      educacional: "bg-purple-500/10 text-purple-400 border-purple-500/20",
      gestao: "bg-orange-500/10 text-orange-400 border-orange-500/20"
    };
    return colors[track as keyof typeof colors] || "bg-gray-500/10 text-gray-400 border-gray-500/20";
  };

  const getScoreBadge = (score: number | null) => {
    if (!score) return <Badge variant="outline">—</Badge>;
    if (score >= 8) return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Excelente</Badge>;
    if (score >= 6) return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Bom</Badge>;
    return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Precisa Melhorar</Badge>;
  };

  const formatDuration = (session: Session) => {
    if (session.duration_ms) {
      const minutes = Math.floor(session.duration_ms / 60000);
      return `${minutes}min`;
    }
    if (session.duration_sec) {
      const minutes = Math.floor(session.duration_sec / 60);
      return `${minutes}min`;
    }
    return "—";
  };

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <div className="h-8 bg-muted animate-pulse rounded"></div>
        <div className="grid gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-muted animate-pulse rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-cal text-gradient">Dashboard</h1>
        <p className="text-muted-foreground">
          Histórico completo de suas simulações e ligações live
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total de Sessões</p>
                <p className="text-2xl font-bold">{sessions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Score Médio</p>
                <p className="text-2xl font-bold">
                  {sessions.filter(s => s.score).length > 0 
                    ? (sessions.filter(s => s.score).reduce((acc, s) => acc + (s.score || 0), 0) / sessions.filter(s => s.score).length).toFixed(1)
                    : "—"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Esta Semana</p>
                <p className="text-2xl font-bold">
                  {sessions.filter(s => {
                    const sessionDate = new Date(s.started_at);
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return sessionDate >= weekAgo;
                  }).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sessions List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Histórico de Sessões</h2>
        
        {sessions.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">Nenhuma sessão encontrada.</p>
              <p className="text-sm text-muted-foreground mt-2">
                Comece uma simulação para ver seus resultados aqui!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {sessions.map((session) => (
              <Card key={session.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-3 flex-1">
                      {/* Cabeçalho */}
                      <div className="flex items-center gap-3">
                        <Badge className={getTrackColor(session.track)}>
                          {session.track.toUpperCase()}
                        </Badge>
                        <Badge variant="outline">
                          {session.type === 'live' ? 'Ligação Live' : 'Simulação'}
                        </Badge>
                        {getScoreBadge(session.score)}
                      </div>

                      {/* Título e horário */}
                      <div>
                        <h3 className="font-semibold text-lg">{session.scenario}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <span>
                            📅 {new Date(session.started_at).toLocaleString()}
                          </span>
                          {session.finished_at && (
                            <span>
                              ⏱️ {formatDuration(session)}
                            </span>
                          )}
                          {session.score && (
                            <span>
                              🎯 Score: {session.score}/10
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Métricas (se disponível) */}
                      {session.metrics && (
                        <div className="text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg">
                          <p className="font-medium mb-1">Métricas:</p>
                          <pre className="text-xs overflow-x-auto">
                            {JSON.stringify(session.metrics, null, 2).slice(0, 200)}...
                          </pre>
                        </div>
                      )}
                    </div>

                    {/* Botão de Export */}
                    <Button
                      onClick={() => exportToPDF(session)}
                      disabled={exportingSession === session.id}
                      variant="outline"
                      size="sm"
                      className="ml-4 flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      {exportingSession === session.id ? "Exportando..." : "Exportar PDF"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}