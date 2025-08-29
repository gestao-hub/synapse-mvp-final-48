import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Settings, VolumeX, Volume2, BookOpen, GraduationCap, Award, Users } from "lucide-react";
import { useRealtimeCall } from "@/hooks/useRealtimeCall";
import { useLiveSessionMetrics } from "@/hooks/useLiveSessionMetrics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { DualVoiceVisualizer } from "@/components/voice/DualVoiceVisualizer";

export default function EducacionalLive() {
  const { startCall, endCall, toggleMute, muted, status, remoteAudioElement, localStream } = useRealtimeCall();
  const { metrics, loading: metricsLoading } = useLiveSessionMetrics('educacional');

  const handleStartCall = () => {
    const educacionalPrompt = `Você é um assistente de IA especializado em treinamento pedagógico e educação.

PRIMEIRA FASE - COLETA DE INFORMAÇÕES:
Cumprimente o usuário de forma profissional e explique que você irá fazer 5 perguntas rápidas para personalizar a simulação educacional.

Faça estas perguntas uma por vez, aguardando a resposta antes da próxima:
1. "Qual matéria ou assunto você está ensinando?"
2. "Qual o perfil do aluno que você quer simular? Por exemplo: adolescente desmotivado, adulto ansioso, criança agitada..."
3. "Quais dificuldades de aprendizagem você espera enfrentar?"
4. "Qual método pedagógico você quer treinar?"
5. "Qual resultado educacional você espera alcançar com esta simulação?"

SEGUNDA FASE - INÍCIO DA SIMULAÇÃO:
Após coletar todas as informações, diga: "Perfeito! Entendi o contexto educacional. Agora vamos começar a simulação. Eu serei seu aluno [perfil mencionado] com as dificuldades que você mencionou. Você pode começar a aula!"

Durante a simulação:
- Seja um aluno com o perfil mencionado
- Demonstre as dificuldades de aprendizagem de forma realista
- Seja autêntico às características etárias e comportamentais
- Responda de acordo com seu nível de conhecimento sobre o assunto
- Permita que o professor aplique a metodologia e trabalhe para atingir o resultado

Comece cumprimentando o usuário e fazendo a primeira pergunta.`;

    startCall({ 
      track: "educacional",
      scenario: "Simulação Educacional Personalizada",
      systemPrompt: educacionalPrompt,
      voiceId: "shimmer"
    });
  };


  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/app/educacional">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Educacional • Cenário Personalizado</h1>
          <p className="text-muted-foreground">
            Prática personalizada em tempo real com IA especializada em educação
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
                <span>Simulação Educacional Personalizada</span>
                <Badge variant="outline" className="bg-purple-500/10 text-purple-700 border-purple-200 transition-colors">
                  Educacional
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
                    <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center hover:bg-purple-500/10 hover:border-purple-500/20 transition-all duration-300 border-2 border-transparent">
                      <GraduationCap className="w-8 h-8 text-muted-foreground group-hover:text-purple-600 transition-colors" />
                    </div>
                    <div className="text-center">
                      <h3 className="text-lg font-medium">Pronto para ensinar</h3>
                      <p className="text-muted-foreground">
                        Clique em "Iniciar Cenário" - a IA fará perguntas por voz para personalizar seu treinamento
                      </p>
                    </div>
                  </>
                </div>
              )}
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
                <Award className="w-5 h-5 text-purple-600 group-hover:text-primary transition-colors" />
                Performance Educacional
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
                    <span>Aulas simuladas</span>
                    <Badge variant="outline" className="transition-colors hover:bg-green-500/10">{metrics?.total_sessions || 0}</Badge>
                  </div>
                  <div className="flex justify-between items-center hover:bg-muted/50 p-2 rounded transition-colors">
                    <span>Avaliação média</span>
                    <Badge variant="outline" className="transition-colors hover:bg-blue-500/10">{metrics?.avg_score?.toFixed(1) || '0.0'}/10</Badge>
                  </div>
                  <div className="flex justify-between items-center hover:bg-muted/50 p-2 rounded transition-colors">
                    <span>Tempo médio de aula</span>
                    <Badge variant="outline" className="transition-colors hover:bg-orange-500/10">{metrics?.avg_duration_minutes?.toFixed(0) || 0} min</Badge>
                  </div>
                  <div className="flex justify-between items-center hover:bg-muted/50 p-2 rounded transition-colors">
                    <span>Aulas concluídas</span>
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
                  <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-xs font-bold text-purple-600">1</div>
                  <div>
                    <p className="font-medium text-foreground">Configuração</p>
                    <p>IA faz 5 perguntas por voz sobre seu contexto educacional</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-xs font-bold text-purple-600">2</div>
                  <div>
                    <p className="font-medium text-foreground">Personalização</p>
                    <p>IA cria aluno virtual baseado nas suas respostas</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-xs font-bold text-purple-600">3</div>
                  <div>
                    <p className="font-medium text-foreground">Simulação</p>
                    <p>Pratique ensino personalizado com cenário realista</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Metodologias Pedagógicas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>• <strong>Construtivismo:</strong> Aluno constrói seu conhecimento</p>
                <p>• <strong>Aprendizagem Ativa:</strong> Participação e experimentação</p>
                <p>• <strong>Ensino Híbrido:</strong> Combine presencial e digital</p>
                <p>• <strong>Taxonomia de Bloom:</strong> Níveis progressivos de aprendizagem</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}