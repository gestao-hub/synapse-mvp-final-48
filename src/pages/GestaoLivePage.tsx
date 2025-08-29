import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Phone, PhoneOff, Volume2, VolumeX, Settings, Shield, TrendingUp, Users } from "lucide-react";
import { useRealtimeCall } from "@/hooks/useRealtimeCall";
import { useLiveSessionMetrics } from "@/hooks/useLiveSessionMetrics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { DualVoiceVisualizer } from "@/components/voice/DualVoiceVisualizer";

export default function GestaoLive() {
  const { startCall, endCall, toggleMute, muted, status, remoteAudioElement, localStream } = useRealtimeCall();
  const { metrics, loading: metricsLoading } = useLiveSessionMetrics('gestao');

  const handleStartCall = () => {
    const gestaoPrompt = `Você é um assistente de IA especializado em treinamento de liderança e gestão.

PRIMEIRA FASE - COLETA DE INFORMAÇÕES:
Cumprimente o usuário de forma profissional e explique que você irá fazer 5 perguntas rápidas para personalizar a simulação de liderança.

Faça estas perguntas uma por vez, aguardando a resposta antes da próxima:
1. "Qual situação de liderança você quer treinar? Por exemplo: reunião de resultados, mudança organizacional, gestão de crise..."
2. "Qual o perfil da sua equipe? Por exemplo: equipe desmotivada, grupo resistente a mudanças, time de alta performance..."
3. "Quais desafios de liderança você espera enfrentar?"
4. "Qual o contexto organizacional atual da empresa?"
5. "Qual seu objetivo principal como líder nesta simulação?"

SEGUNDA FASE - INÍCIO DA SIMULAÇÃO:
Após coletar todas as informações, diga: "Perfeito! Entendi o contexto de liderança. Agora vamos começar a simulação. Eu representarei sua equipe [perfil mencionado] e demonstrarei os desafios que você mencionou. Você pode iniciar como líder!"

Durante a simulação:
- Represente a equipe com o perfil mencionado
- Demonstre os desafios de liderança de forma realista
- Seja autêntico nas reações e comportamentos de equipe
- Responda de acordo com o contexto organizacional
- Apresente resistências típicas do perfil descrito
- Permita que o líder trabalhe para atingir seu objetivo

Comece cumprimentando o usuário e fazendo a primeira pergunta.`;

    startCall({ 
      track: "gestao",
      scenario: "Simulação de Gestão Personalizada",
      systemPrompt: gestaoPrompt,
      voiceId: "echo"
    });
  };


  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/app/gestao">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Gestão • Cenário Personalizado</h1>
          <p className="text-muted-foreground">
            Prática personalizada em tempo real com IA especializada em gestão
          </p>
        </div>
        <Badge variant={status === "connected" ? "default" : "secondary"}>
          {status === "connected" ? "Conectado" : "Desconectado"}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center justify-between group-hover:text-primary transition-colors">
                <span>Simulação de Gestão Personalizada</span>
                <Badge variant="outline" className="bg-orange-500/10 text-orange-700 border-orange-200 transition-colors">
                  Gestão
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12 space-y-6">
                {status === "connected" ? (
                  <div className="flex-1 flex items-center justify-center px-6 py-4">
                    <DualVoiceVisualizer
                      aiAudioElement={remoteAudioElement}
                      userMicStream={localStream}
                      isAIActive={false} // TODO: Detectar quando IA está falando
                      isUserActive={false} // TODO: Detectar quando usuário está falando
                      className="my-4"
                    />
                  </div>
                ) : (
                  <>
                    <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center hover:bg-orange-500/10 hover:border-orange-500/20 transition-all duration-300 border-2 border-transparent">
                      <Shield className="w-8 h-8 text-muted-foreground group-hover:text-orange-600 transition-colors" />
                    </div>
                    <div className="text-center">
                      <h3 className="text-lg font-medium">Pronto para liderar</h3>
                      <p className="text-muted-foreground">
                        Clique em "Iniciar Cenário" - a IA fará perguntas por voz para personalizar seu treinamento
                      </p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-center gap-4">
                {status !== "connected" ? (
                  <Button 
                    size="lg"
                    onClick={handleStartCall}
                    className="px-8 hover:scale-105 transition-transform duration-300"
                  >
                    <Settings className="w-5 h-5 mr-2" />
                    Iniciar Cenário
                  </Button>
                ) : (
                  <>
                    <Button 
                      size="lg"
                      variant="destructive"
                      onClick={endCall}
                      className="px-8 hover:scale-105 transition-transform duration-300"
                    >
                      <VolumeX className="w-5 h-5 mr-2" />
                      Encerrar
                    </Button>
                    <Button 
                      size="lg"
                      variant="outline"
                      onClick={toggleMute}
                      className="hover:scale-105 transition-transform duration-300"
                    >
                      {muted ? <VolumeX className="w-5 h-5 mr-2" /> : <Volume2 className="w-5 h-5 mr-2" />}
                      {muted ? "Desmutar" : "Mutar"}
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 group-hover:text-primary transition-colors">
                <TrendingUp className="w-5 h-5 text-orange-600 group-hover:text-primary transition-colors" />
                Performance de Liderança
              </CardTitle>
            </CardHeader>
            <CardContent>
              {metricsLoading ? (
                <div className="space-y-3 text-sm">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="flex justify-between items-center hover:bg-muted/50 p-2 rounded transition-colors">
                      <div className="h-4 bg-muted rounded w-24 animate-pulse"></div>
                      <div className="h-6 bg-muted rounded w-16 animate-pulse"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center hover:bg-muted/50 p-2 rounded transition-colors">
                    <span>Sessões de liderança</span>
                    <Badge variant="outline" className="transition-colors hover:bg-green-500/10">{metrics?.total_sessions || 0}</Badge>
                  </div>
                  <div className="flex justify-between items-center hover:bg-muted/50 p-2 rounded transition-colors">
                    <span>Eficácia de liderança</span>
                    <Badge variant="outline" className="transition-colors hover:bg-blue-500/10">{metrics?.avg_score?.toFixed(1) || '0.0'}/10</Badge>
                  </div>
                  <div className="flex justify-between items-center hover:bg-muted/50 p-2 rounded transition-colors">
                    <span>Tempo médio de reunião</span>
                    <Badge variant="outline" className="transition-colors hover:bg-orange-500/10">{metrics?.avg_duration_minutes?.toFixed(0) || 0} min</Badge>
                  </div>
                  <div className="flex justify-between items-center hover:bg-muted/50 p-2 rounded transition-colors">
                    <span>Decisões executadas</span>
                    <Badge variant="outline" className="transition-colors hover:bg-purple-500/10">{metrics?.completed_sessions || 0}</Badge>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg">Como Funciona</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-orange-500/20 rounded-full flex items-center justify-center text-xs font-bold text-orange-600">1</div>
                  <div>
                    <p className="font-medium text-foreground">Configuração</p>
                    <p>IA faz 5 perguntas por voz sobre seu contexto de liderança</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-orange-500/20 rounded-full flex items-center justify-center text-xs font-bold text-orange-600">2</div>
                  <div>
                    <p className="font-medium text-foreground">Personalização</p>
                    <p>IA cria equipe virtual baseada nas suas respostas</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-orange-500/20 rounded-full flex items-center justify-center text-xs font-bold text-orange-600">3</div>
                  <div>
                    <p className="font-medium text-foreground">Simulação</p>
                    <p>Pratique liderança com cenários desafiadores</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Estilos de Liderança</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>• <strong>Transformacional:</strong> Inspire e motive grandes mudanças</p>
                <p>• <strong>Situacional:</strong> Adapte seu estilo ao contexto</p>
                <p>• <strong>Servant Leadership:</strong> Sirva para liderar</p>
                <p>• <strong>Coaching:</strong> Desenvolva o potencial da equipe</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}