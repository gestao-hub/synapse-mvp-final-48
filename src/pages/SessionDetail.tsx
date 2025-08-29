import { useParams, useNavigate } from "react-router-dom";
import { useSessionDetail } from "@/hooks/useSessionDetail";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, User, Bot, Clock, Target, FileText } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";

function formatDuration(ms: number): string {
  const minutes = Math.floor(ms / (1000 * 60));
  const seconds = Math.floor((ms % (1000 * 60)) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export default function SessionDetail() {
  const { type, sessionId } = useParams();
  const navigate = useNavigate();
  
  const sessionType = (type === 'live' ? 'live' : 'regular') as 'regular' | 'live';
  const { data: session, isLoading, error } = useSessionDetail(sessionType, sessionId!);

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-[400px]" />
          <Skeleton className="h-[400px]" />
        </div>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive">Sessão não encontrada</h1>
          <Button onClick={() => navigate('/app/dashboard')} className="mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const renderTranscript = () => {
    if (session.type === 'live' && session.turns) {
      return (
        <div className="space-y-4">
          {session.turns.map((turn, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="flex-shrink-0">
                {turn.speaker === 'user' ? (
                  <User className="w-5 h-5 text-blue-500" />
                ) : (
                  <Bot className="w-5 h-5 text-green-500" />
                )}
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium mb-1">
                  {turn.speaker === 'user' ? 'Usuário' : 'IA'}
                  <span className="text-muted-foreground ml-2">
                    {Math.floor(turn.timestamp_ms / 1000)}s
                  </span>
                </div>
                <p className="text-sm">{turn.content}</p>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (session.type === 'live') {
      return (
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <User className="w-4 h-4 text-blue-500" />
              Usuário
            </h4>
            <p className="text-sm whitespace-pre-wrap">
              {session.transcript_user || 'Sem transcrição disponível'}
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Bot className="w-4 h-4 text-green-500" />
              IA
            </h4>
            <p className="text-sm whitespace-pre-wrap">
              {session.transcript_ai || 'Sem transcrição disponível'}
            </p>
          </div>
        </div>
      );
    }

    return (
      <div>
        <h4 className="font-medium mb-2 flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Transcrição Completa
        </h4>
        <p className="text-sm whitespace-pre-wrap">
          {session.transcript || 'Sem transcrição disponível'}
        </p>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => navigate('/app/dashboard')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Detalhes da Sessão</h1>
          <p className="text-muted-foreground">
            {format(new Date(session.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Informações Gerais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Trilha:</span>
              <Badge variant="outline">{session.track}</Badge>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Tipo:</span>
              <Badge variant={session.type === 'live' ? 'secondary' : 'default'}>
                {session.type === 'live' ? 'Live' : 'Regular'}
              </Badge>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Duração:
              </span>
              <span className="text-sm">{formatDuration(session.duration_ms || 0)}</span>
            </div>

            {(session.type === 'regular' && 'score' in session && session.score) ? (
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium flex items-center gap-1">
                  <Target className="w-3 h-3" />
                  Score:
                </span>
                <span className="text-sm font-bold">{session.score.toFixed(1)}</span>
              </div>
            ) : session.type === 'live' && session.metadata ? (
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium flex items-center gap-1">
                  <Target className="w-3 h-3" />
                  Score:
                </span>
                <span className="text-sm font-bold">{((session.metadata as any)?.overall_score || 0).toFixed(1)}</span>
              </div>
            ) : null}

            {(session.type === 'regular' && 'scenario' in session && session.scenario) ? (
              <div>
                <span className="text-sm font-medium">Cenário:</span>
                <p className="text-sm text-muted-foreground mt-1">{session.scenario}</p>
              </div>
            ) : session.type === 'live' && session.metadata ? (
              <div>
                <span className="text-sm font-medium">Cenário:</span>
                <p className="text-sm text-muted-foreground mt-1">{(session.metadata as any)?.scenario_title || 'N/A'}</p>
              </div>
            ) : null}
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Transcrição</CardTitle>
          </CardHeader>
          <CardContent>
            {renderTranscript()}
          </CardContent>
        </Card>
      </div>

      {((session.type === 'regular' && 'metrics' in session && session.metrics) || 
        (session.type === 'live' && session.metadata)) && (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Performance Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Desempenho da Sessão
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {session.type === 'live' && session.metadata && (
                <>
                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg">
                    <span className="text-sm font-medium">Papel Desempenhado:</span>
                    <Badge variant="secondary">{(session.metadata as any)?.role || 'SDR'}</Badge>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-accent/10 to-accent/5 rounded-lg">
                    <span className="text-sm font-medium">Score Geral:</span>
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary">
                        {((session.metadata as any)?.overall_score || 0).toFixed(1)}/10
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {((session.metadata as any)?.overall_score || 0) >= 8 ? 'Excelente' : 
                         ((session.metadata as any)?.overall_score || 0) >= 6 ? 'Bom' : 
                         ((session.metadata as any)?.overall_score || 0) >= 4 ? 'Regular' : 'Precisa Melhorar'}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {(session.metadata as any)?.criteria && (
                    <div className="space-y-3">
                      <h4 className="font-medium text-sm">Avaliação por Critérios:</h4>
                      {(session.metadata as any).criteria.map((criterion: any, index: number) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-sm">{criterion.label}:</span>
                          <div className="flex items-center gap-2">
                            <div className={`w-12 h-2 rounded-full bg-gradient-to-r ${
                              (criterion.score || 0) >= 8 ? 'from-green-400 to-green-600' :
                              (criterion.score || 0) >= 6 ? 'from-yellow-400 to-yellow-600' :
                              'from-red-400 to-red-600'
                            }`} />
                            <span className="text-sm font-medium">{(criterion.score || 0).toFixed(1)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {session.type === 'regular' && 'metrics' in session && session.metrics && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg">
                    <span className="text-sm font-medium">Performance Geral:</span>
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary">
                        {session.score?.toFixed(1) || 'N/A'}/10
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Call Analytics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="w-5 h-5 text-accent" />
                Análise da Conversa
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30 rounded-lg">
                  <div className="text-lg font-bold text-blue-600">
                    {session.type === 'live' && session.turns ? session.turns.filter(t => t.speaker === 'user').length : 'N/A'}
                  </div>
                  <div className="text-xs text-muted-foreground">Falas do Usuário</div>
                </div>
                <div className="text-center p-3 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/30 rounded-lg">
                  <div className="text-lg font-bold text-green-600">
                    {session.type === 'live' && session.turns ? session.turns.filter(t => t.speaker === 'ai').length : 'N/A'}
                  </div>
                  <div className="text-xs text-muted-foreground">Respostas da IA</div>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="font-medium text-sm">Indicadores de Qualidade:</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Duração da Conversa:</span>
                    <Badge variant="outline">{formatDuration(session.duration_ms || 0)}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Engajamento:</span>
                    <Badge variant={
                      (session.duration_ms || 0) > 180000 ? 'default' : 
                      (session.duration_ms || 0) > 60000 ? 'secondary' : 'outline'
                    }>
                      {(session.duration_ms || 0) > 180000 ? 'Alto' : 
                       (session.duration_ms || 0) > 60000 ? 'Médio' : 'Baixo'}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Interatividade:</span>
                    <Badge variant={
                      session.type === 'live' && session.turns && session.turns.length > 10 ? 'default' :
                      session.type === 'live' && session.turns && session.turns.length > 5 ? 'secondary' : 'outline'
                    }>
                      {session.type === 'live' && session.turns ? 
                        (session.turns.length > 10 ? 'Alta' : session.turns.length > 5 ? 'Média' : 'Baixa') : 
                        'N/A'}
                    </Badge>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="p-3 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg">
                <div className="text-sm font-medium mb-2">💡 Próximos Passos:</div>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Revise as áreas com menor pontuação</li>
                  <li>• Pratique cenários similares</li>
                  <li>• Foque na escuta ativa e empatia</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}