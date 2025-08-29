import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Settings, VolumeX, Volume2, ArrowRight, ArrowLeftIcon, Target, Briefcase, TrendingUp } from "lucide-react";
import { useRealtimeCall } from "@/hooks/useRealtimeCall";
import { useLiveSessionMetrics } from "@/hooks/useLiveSessionMetrics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { DualVoiceVisualizer } from "@/components/voice/DualVoiceVisualizer";

export default function ComercialLive() {
  const { startCall, endCall, toggleMute, muted, status, remoteAudioElement, localStream } = useRealtimeCall();
  const { metrics, loading: metricsLoading } = useLiveSessionMetrics('comercial');

  const handleStartCall = () => {
    const commercialPrompt = `Você é um assistente de IA especializado em treinamento de vendas.

PRIMEIRA FASE - COLETA DE INFORMAÇÕES:
Cumprimente o usuário de forma profissional e explique que você irá fazer 5 perguntas rápidas para personalizar a simulação de vendas.

Faça estas perguntas uma por vez, aguardando a resposta antes da próxima:
1. "Qual produto ou serviço você está vendendo?"
2. "Qual situação de venda você quer treinar? Por exemplo: prospecção fria, negociação de preço, fechamento..."
3. "Quais objeções você espera enfrentar do cliente?"
4. "Qual o perfil do cliente que você quer simular?"
5. "Qual seu objetivo principal nesta simulação?"

SEGUNDA FASE - INÍCIO DA SIMULAÇÃO:
Após coletar todas as informações, diga: "Perfeito! Entendi seu contexto. Agora vamos começar a simulação. Eu serei seu cliente [perfil mencionado], interessado em [produto/serviço], mas vou apresentar as objeções que você mencionou. Você pode começar!"

Durante a simulação:
- Seja um cliente realista com o perfil mencionado
- Apresente as objeções de forma natural
- Seja desafiador mas não impossível
- Permita que o vendedor trabalhe para convencê-lo
- Mantenha o foco na situação específica mencionada

Comece cumprimentando o usuário e fazendo a primeira pergunta.`;

    startCall({ 
      track: "comercial",
      scenario: "Simulação Comercial Personalizada",
      systemPrompt: commercialPrompt,
      voiceId: "alloy"
    });
  };

  // Layout principal
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/app/comercial">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Comercial • Cenário Personalizado</h1>
          <p className="text-muted-foreground">
            Prática personalizada em tempo real com IA especializada em vendas
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={status === "connected" ? "default" : "secondary"}>
            {status === "connected" ? "Conectado" : "Desconectado"}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Call Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Call Status Area */}
          <Card className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center justify-between group-hover:text-primary transition-colors">
                <span>Simulação Comercial Personalizada</span>
                <Badge 
                  variant="outline"
                  className="bg-green-500/10 text-green-700 border-green-200 capitalize transition-colors"
                >
                  Comercial
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
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
                <div className="flex flex-col items-center justify-center py-12 space-y-6">
                  <>
                    <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center hover:bg-green-500/10 hover:border-green-500/20 transition-all duration-300 border-2 border-transparent">
                      <Target className="w-8 h-8 text-muted-foreground group-hover:text-green-600 transition-colors" />
                    </div>
                    <div className="text-center">
                      <h3 className="text-lg font-medium">Pronto para simular</h3>
                      <p className="text-muted-foreground">
                        Clique em "Iniciar Cenário" - a IA fará perguntas por voz para personalizar seu treinamento
                      </p>
                    </div>
                  </>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Call Controls */}
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

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Sales Performance */}
          <Card className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 group-hover:text-primary transition-colors">
                <TrendingUp className="w-5 h-5 text-green-600 group-hover:text-primary transition-colors" />
                Performance Comercial
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
                    <span>Sessões este mês</span>
                    <Badge variant="outline" className="transition-colors hover:bg-green-500/10">{metrics?.total_sessions || 0}</Badge>
                  </div>
                  <div className="flex justify-between items-center hover:bg-muted/50 p-2 rounded transition-colors">
                    <span>Score médio</span>
                    <Badge variant="outline" className="transition-colors hover:bg-blue-500/10">{metrics?.avg_score?.toFixed(1) || '0.0'}/10</Badge>
                  </div>
                  <div className="flex justify-between items-center hover:bg-muted/50 p-2 rounded transition-colors">
                    <span>Duração média</span>
                    <Badge variant="outline" className="transition-colors hover:bg-orange-500/10">{metrics?.avg_duration_minutes?.toFixed(0) || 0} min</Badge>
                  </div>
                  <div className="flex justify-between items-center hover:bg-muted/50 p-2 rounded transition-colors">
                    <span>Sessões completas</span>
                    <Badge variant="outline" className="transition-colors hover:bg-purple-500/10">{metrics?.completed_sessions || 0}</Badge>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Process Flow */}
          <Card className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg group-hover:text-primary transition-colors">Como Funciona</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-start gap-3 hover:bg-muted/30 p-2 rounded transition-colors group/item">
                  <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center text-xs font-bold text-green-600 group-hover/item:animate-pulse">1</div>
                  <div>
                    <p className="font-medium text-foreground group-hover/item:text-primary transition-colors">Configuração</p>
                    <p>IA faz 5 perguntas por voz sobre seu contexto de vendas</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 hover:bg-muted/30 p-2 rounded transition-colors group/item">
                  <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center text-xs font-bold text-green-600 group-hover/item:animate-pulse">2</div>
                  <div>
                    <p className="font-medium text-foreground group-hover/item:text-primary transition-colors">Personalização</p>
                    <p>IA cria cenário específico baseado nas suas respostas</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 hover:bg-muted/30 p-2 rounded transition-colors group/item">
                  <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center text-xs font-bold text-green-600 group-hover/item:animate-pulse">3</div>
                  <div>
                    <p className="font-medium text-foreground group-hover/item:text-primary transition-colors">Simulação</p>
                    <p>Pratique com cliente virtual personalizado</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sales Techniques */}
          <Card className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg group-hover:text-primary transition-colors">Técnicas de Vendas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p className="hover:bg-muted/30 p-2 rounded transition-colors">• <strong className="text-foreground">SPIN Selling:</strong> Situation, Problem, Implication, Need</p>
                <p className="hover:bg-muted/30 p-2 rounded transition-colors">• <strong className="text-foreground">BANT:</strong> Budget, Authority, Need, Timeline</p>
                <p className="hover:bg-muted/30 p-2 rounded transition-colors">• <strong className="text-foreground">Challenger Sale:</strong> Ensine, Customize, Controle</p>
                <p className="hover:bg-muted/30 p-2 rounded transition-colors">• <strong className="text-foreground">Consultiva:</strong> Descubra antes de apresentar</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}