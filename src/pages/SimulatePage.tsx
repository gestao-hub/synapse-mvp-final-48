import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Clock, Users, Play, Mic, MicOff, Send, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CriterionBar } from "@/components/simulation/CriterionBar";
import { FeedbackPanel } from "@/components/simulation/FeedbackPanel";
import { EndSimulationDialog } from "@/components/simulation/EndSimulationDialog";

interface Simulation {
  id: string;
  user_id: string;
  scenario_id: string;
  mode: string;
  role: string;
  started_at: string;
  ended_at?: string;
  duration_sec?: number;
  scenarios: {
    id: string;
    area: string;
    title: string;
    description?: string;
    role_options: string[];
    criteria: Array<{
      key: string;
      label: string;
      weight: number;
    }>;
    tags?: string[];
    persona?: any;
  };
}

interface ConversationTurn {
  role: 'user' | 'ai';
  content: string;
  timestamp: number;
  audioUrl?: string;
}

interface CriterionScore {
  key: string;
  label: string;
  weight: number;
  currentScore: number;
  feedback: string;
}

export default function SimulatePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [simulation, setSimulation] = useState<Simulation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [conversation, setConversation] = useState<ConversationTurn[]>([]);
  const [textInput, setTextInput] = useState("");
  const [criterionScores, setCriterionScores] = useState<CriterionScore[]>([]);
  const [showEndDialog, setShowEndDialog] = useState(false);
  const [finalFeedback, setFinalFeedback] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);

  // Audio recording refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (id) {
      fetchSimulation(id);
    }
  }, [id]);

  const fetchSimulation = async (simulationId: string) => {
    try {
      const { data, error } = await supabase
        .from("simulations")
        .select(`
          *,
          scenarios (
            id,
            area,
            title,
            description,
            role_options,
            criteria,
            tags,
            persona
          )
        `)
        .eq("id", simulationId)
        .single();

      if (error) throw error;

      // Cast scenarios role_options to string array if needed
      const simulationData = {
        ...data,
        scenarios: {
          ...data.scenarios,
          role_options: Array.isArray(data.scenarios.role_options) 
            ? data.scenarios.role_options.map(opt => String(opt))
            : typeof data.scenarios.role_options === 'string' 
              ? [data.scenarios.role_options]
              : []
        }
      };
      
      setSimulation(simulationData as any);
      
      // Initialize criterion scores
      const criteria = Array.isArray(data.scenarios.criteria) ? data.scenarios.criteria : [];
      if (criteria.length > 0) {
        const initialScores = criteria.map((criterion: any) => ({
          key: criterion.key,
          label: criterion.label,
          weight: criterion.weight,
          currentScore: 0,
          feedback: "Aguardando interações para avaliação..."
        }));
        setCriterionScores(initialScores);
      }

    } catch (error) {
      console.error("Error fetching simulation:", error);
      toast({
        title: "Erro",
        description: "Falha ao carregar simulação. Redirecionando...",
        variant: "destructive",
      });
      navigate("/app/scenarios");
    } finally {
      setIsLoading(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        }
      });
      
      streamRef.current = stream;
      chunksRef.current = [];

      const mediaRecorder = new MediaRecorder(stream, { 
        mimeType: "audio/webm;codecs=opus" 
      });
      
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
        await processAudioInput(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);

    } catch (error) {
      console.error("Error starting recording:", error);
      toast({
        title: "Erro",
        description: "Não foi possível acessar o microfone.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    }
  };

  const processAudioInput = async (audioBlob: Blob) => {
    setIsProcessing(true);
    
    try {
      // Step 1: Convert audio to text using existing STT function
      const formData = new FormData();
      formData.append("audio", audioBlob, "audio.webm");

      const sttResponse = await supabase.functions.invoke("stt-whisper", {
        body: formData,
      });

      if (sttResponse.error) {
        throw new Error("Failed to transcribe audio");
      }

      const { text: transcript } = sttResponse.data;
      
      if (!transcript || transcript.trim().length === 0) {
        throw new Error("Não foi possível transcrever o áudio. Tente novamente.");
      }

      console.log("Transcript:", transcript);

      // Add user turn to conversation
      const userTurn: ConversationTurn = {
        role: 'user',
        content: transcript,
        timestamp: Date.now(),
        audioUrl: URL.createObjectURL(audioBlob)
      };

      setConversation(prev => [...prev, userTurn]);

      // Step 2: Get AI response
      await getAIResponse(transcript, [...conversation, userTurn]);

    } catch (error) {
      console.error("Error processing audio:", error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao processar áudio.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const processTextInput = async () => {
    if (!textInput.trim()) return;

    const userTurn: ConversationTurn = {
      role: 'user',
      content: textInput.trim(),
      timestamp: Date.now()
    };

    setConversation(prev => [...prev, userTurn]);
    setTextInput("");

    await getAIResponse(textInput.trim(), [...conversation, userTurn]);
  };

  const getAIResponse = async (userInput: string, currentConversation: ConversationTurn[]) => {
    setIsProcessing(true);

    try {
      // Get AI response based on scenario persona
      const aiResponse = await supabase.functions.invoke("simulation-ai-response", {
        body: {
          transcript: userInput,
          scenario_persona: simulation?.scenarios.persona,
          conversation_history: currentConversation.map(turn => ({
            role: turn.role,
            content: turn.content
          })),
          user_role: simulation?.role,
          criteria: simulation?.scenarios.criteria || []
        }
      });

      if (aiResponse.error) {
        throw new Error("Failed to get AI response");
      }

      const { response: aiText } = aiResponse.data;

      // Generate TTS for AI response
      const ttsResponse = await supabase.functions.invoke("openai-tts", {
        body: {
          text: aiText,
          voice_id: "9BWtsMINqrJLrRacOk9x" // Aria voice
        }
      });

      let audioUrl = undefined;
      if (ttsResponse.data) {
        const audioBytes = new Uint8Array(await ttsResponse.data.arrayBuffer());
        const audioBlob = new Blob([audioBytes], { type: "audio/mpeg" });
        audioUrl = URL.createObjectURL(audioBlob);
        
        // Play audio automatically
        const audio = new Audio(audioUrl);
        audio.play().catch(console.warn);
      }

      // Add AI turn to conversation
      const aiTurn: ConversationTurn = {
        role: 'ai',
        content: aiText,
        timestamp: Date.now(),
        audioUrl
      };

      setConversation(prev => [...prev, aiTurn]);

      // Update criterion scores progressively (simulated incremental scoring)
      updateCriterionScores(currentConversation.length + 1);

    } catch (error) {
      console.error("Error getting AI response:", error);
      toast({
        title: "Erro",
        description: "Erro ao obter resposta da IA.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const updateCriterionScores = (turnCount: number) => {
    setCriterionScores(prev => prev.map(criterion => ({
      ...criterion,
      currentScore: Math.min(10, Math.max(0, Math.random() * turnCount * 1.5)), // Simulated progressive scoring
      feedback: turnCount > 2 ? "Demonstrando progresso nas interações..." : "Continue interagindo para feedback detalhado"
    })));
  };

  const handleSimulationEnded = (feedback: any) => {
    setFinalFeedback(feedback);
    setShowFeedback(true);
  };

  const exportToPDF = () => {
    toast({
      title: "Exportar PDF",
      description: "Funcionalidade em desenvolvimento.",
    });
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "0m";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return minutes > 0 ? `${minutes}m ${remainingSeconds}s` : `${remainingSeconds}s`;
  };

  const areaColors = {
    rh: "bg-blue-500/10 text-blue-700 border-blue-200",
    comercial: "bg-green-500/10 text-green-700 border-green-200",
    educacional: "bg-purple-500/10 text-purple-700 border-purple-200",
    gestao: "bg-orange-500/10 text-orange-700 border-orange-200",
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-8 w-64" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-96" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-10 w-32" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!simulation) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <h1 className="text-2xl font-bold mb-2">Simulação não encontrada</h1>
            <p className="text-muted-foreground mb-4">
              A simulação solicitada não existe ou não está disponível.
            </p>
            <Link to="/app/scenarios">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar aos Cenários
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showFeedback && finalFeedback) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link to="/app/scenarios">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar aos Cenários
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Relatório Final - {simulation.scenarios.title}</h1>
            <p className="text-muted-foreground">
              Simulação concluída • Papel: <span className="capitalize font-medium">{simulation.role.replace(/_/g, " ")}</span>
            </p>
          </div>
          <Button onClick={exportToPDF} variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            Exportar PDF
          </Button>
        </div>

        <FeedbackPanel feedback={finalFeedback} isVisible={true} />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/app/scenarios">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Simulação: {simulation.scenarios.title}</h1>
          <p className="text-muted-foreground">
            Praticando como: <span className="capitalize font-medium">{simulation.role.replace(/_/g, " ")}</span>
          </p>
        </div>
        <Button 
          onClick={() => setShowEndDialog(true)}
          variant="destructive"
          disabled={conversation.length === 0}
        >
          Encerrar Simulação
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Simulation Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Conversation Area */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Conversa</span>
                <Badge 
                  variant="outline"
                  className={`${areaColors[simulation.scenarios.area as keyof typeof areaColors]} capitalize`}
                >
                  {simulation.scenarios.area}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] w-full p-4">
                <div className="space-y-4">
                  {conversation.length === 0 && (
                    <div className="text-center text-muted-foreground py-8">
                      <p>Inicie a conversa gravando um áudio ou digitando uma mensagem.</p>
                    </div>
                  )}
                  
                  {conversation.map((turn, index) => (
                    <div 
                      key={index}
                      className={`flex ${turn.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-[80%] p-3 rounded-lg ${
                          turn.role === 'user' 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted'
                        }`}
                      >
                        <p className="text-sm">{turn.content}</p>
                        {turn.audioUrl && (
                          <audio controls className="mt-2 max-w-full">
                            <source src={turn.audioUrl} type="audio/webm" />
                          </audio>
                        )}
                        <p className="text-xs opacity-70 mt-1">
                          {new Date(turn.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  {isProcessing && (
                    <div className="flex justify-start">
                      <div className="bg-muted p-3 rounded-lg">
                        <p className="text-sm">IA está pensando...</p>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Input Controls */}
          <Card>
            <CardContent className="p-4">
              <div className="space-y-4">
                {/* Audio Controls */}
                <div className="flex items-center gap-2">
                  <Button
                    onClick={isRecording ? stopRecording : startRecording}
                    disabled={isProcessing}
                    variant={isRecording ? "destructive" : "default"}
                    size="lg"
                  >
                    {isRecording ? (
                      <>
                        <MicOff className="w-5 h-5 mr-2" />
                        Parar Gravação
                      </>
                    ) : (
                       <>
                         <Mic className="w-5 h-5 mr-2" />
                         Iniciar Conversa
                       </>
                    )}
                  </Button>
                  {isRecording && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                      Gravando...
                    </div>
                  )}
                </div>

                {/* Text Input */}
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Ou digite sua mensagem aqui..."
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    disabled={isProcessing}
                    className="min-h-[80px]"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        processTextInput();
                      }
                    }}
                  />
                  <Button
                    onClick={processTextInput}
                    disabled={!textInput.trim() || isProcessing}
                    size="lg"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Session Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informações da Sessão</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4" />
                <span>Duração: {formatDuration(simulation.duration_sec)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users className="w-4 h-4" />
                <span>Interações: {conversation.length}</span>
              </div>
              <div className="text-sm">
                <span className="font-medium">Status:</span>{" "}
                <Badge variant="default">Em andamento</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Criterion Scores */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Avaliação em Tempo Real</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {criterionScores.map((criterion) => (
                <CriterionBar
                  key={criterion.key}
                  criterion={criterion}
                  currentScore={criterion.currentScore}
                  feedback={criterion.feedback}
                  showAnimation={true}
                />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <EndSimulationDialog
        open={showEndDialog}
        onOpenChange={setShowEndDialog}
        simulationId={simulation.id}
        conversationHistory={conversation}
        scenario={simulation.scenarios}
        userRole={simulation.role}
        onSimulationEnded={handleSimulationEnded}
      />
    </div>
  );
}