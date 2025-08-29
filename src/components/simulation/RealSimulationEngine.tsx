import { useState, useEffect, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Mic, MicOff, Square, Play, Pause, Volume2, X, Download, Phone, PhoneOff } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/integrations/supabase/client'
import VoiceReactiveOrb from '@/components/VoiceReactiveOrb'
import { checkAndSetupApiKeys, ensureDatabaseTables } from '@/lib/apiKeySetup'
import { useRealtimeCall } from '@/hooks/useRealtimeCall'

interface Scenario {
  id: string
  area: string
  title: string
  description: string
  criteria: any
  persona: any
  context?: string
  system_prompt?: string
  role_options?: any
}

interface ConversationMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  audioUrl?: string
}

interface SimulationScores {
  scores: Record<string, number>
  feedback: Record<string, string>
  overallScore: number
  suggestions: string[]
}

interface RealSimulationEngineProps {
  scenario: Scenario
  userRole: string
  onComplete: (results: any) => void
  onExit: () => void
}

export function RealSimulationEngine({ scenario, userRole, onComplete, onExit }: RealSimulationEngineProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [conversation, setConversation] = useState<ConversationMessage[]>([])
  const [currentScores, setCurrentScores] = useState<SimulationScores | null>(null)
  const [sessionId, setSessionId] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [turnCount, setTurnCount] = useState(0)
  const [showReport, setShowReport] = useState(false)
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const audioRef = useRef<HTMLAudioElement | null>(null)
  
  const { toast } = useToast()

  useEffect(() => {
    initializeSession()
    startConversation()
    
    // Verificar e configurar APIs automaticamente
    const setupApis = async () => {
      await ensureDatabaseTables()
      await checkAndSetupApiKeys()
    }
    setupApis()
  }, [])

  const initializeSession = async () => {
    const newSessionId = crypto.randomUUID()
    setSessionId(newSessionId)
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      // Criar nova sessão live
      await supabase
        .from('sessions_live')
        .insert({
          id: newSessionId,
          track: scenario.area,
          user_id: user?.id,
          duration_ms: 0,
          metadata: { 
            scenario_title: scenario.title,
            scenario_id: scenario.id,
            user_role: userRole,
            criteria: scenario.criteria
          }
        })
    } catch (error) {
      console.error('Erro ao salvar sessão:', error)
    }
  }

  const startConversation = async () => {
    // Mensagem inicial da IA
    const initialMessage = `Olá! Vamos começar a simulação "${scenario.title}". ${scenario.context || scenario.system_prompt || 'Vamos começar nossa conversa!'} Você está no papel de ${userRole}. Como podemos começar?`
    
    const aiAudio = await textToSpeech(initialMessage)
    
    const initialConversation: ConversationMessage = {
      role: 'assistant',
      content: initialMessage,
      timestamp: new Date().toISOString(),
      audioUrl: aiAudio
    }
    
    setConversation([initialConversation])
    playAudio(aiAudio)
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      })
      
      audioChunksRef.current = []
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }
      
      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm;codecs=opus' })
        await processUserAudio(audioBlob)
        
        // Parar o stream
        stream.getTracks().forEach(track => track.stop())
      }
      
      mediaRecorderRef.current.start()
      setIsRecording(true)
      
      toast({
        title: "Conversa iniciada",
        description: "Fale agora. Clique em parar quando terminar."
      })
      
    } catch (error) {
      console.error('Erro ao iniciar gravação:', error)
      toast({
        title: "Erro",
        description: "Não foi possível acessar o microfone.",
        variant: "destructive"
      })
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const processUserAudio = async (audioBlob: Blob) => {
    setIsProcessing(true)
    
    try {
      // 1. Converter áudio para texto
      const userText = await speechToText(audioBlob)
      
      if (!userText.trim()) {
        toast({
          title: "Não consegui entender",
          description: "Tente falar mais claramente.",
          variant: "destructive"
        })
        setIsProcessing(false)
        return
      }

      // 2. Adicionar mensagem do usuário
      const userMessage: ConversationMessage = {
        role: 'user',
        content: userText,
        timestamp: new Date().toISOString()
      }
      
      setConversation(prev => [...prev, userMessage])

      // 3. Processar com IA
      const response = await processWithAI(userText)
      
      // 4. Converter resposta para áudio
      const aiAudio = await textToSpeech(response.aiResponse)
      
      // 5. Adicionar resposta da IA
      const aiMessage: ConversationMessage = {
        role: 'assistant',
        content: response.aiResponse,
        timestamp: new Date().toISOString(),
        audioUrl: aiAudio
      }
      
      setConversation(prev => [...prev, aiMessage])
      setCurrentScores(response)
      setTurnCount(prev => prev + 1)
      
      // 6. Reproduzir áudio da IA
      playAudio(aiAudio)
      
      // 7. Salvar no banco
      await saveConversationTurn(userMessage, aiMessage, response)
      
    } catch (error) {
      console.error('Erro ao processar áudio:', error)
      toast({
        title: "Erro",
        description: "Erro ao processar sua fala. Tente novamente.",
        variant: "destructive"
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const speechToText = async (audioBlob: Blob): Promise<string> => {
    const formData = new FormData()
    formData.append('audio', audioBlob, 'audio.webm')
    
    const { data, error } = await supabase.functions.invoke('openai-stt', {
      body: formData
    })
    
    if (error) throw error
    return data.text
  }

  const textToSpeech = async (text: string): Promise<string> => {
    const { data, error } = await supabase.functions.invoke('elevenlabs-tts', {
      body: { text }
    })
    
    if (error) throw error
    
    // Converter arrayBuffer para blob URL
    const audioBlob = new Blob([data], { type: 'audio/mpeg' })
    return URL.createObjectURL(audioBlob)
  }

  const processWithAI = async (userMessage: string) => {
    const { data, error } = await supabase.functions.invoke('ai-simulation-engine', {
      body: {
        scenario,
        userRole,
        userMessage,
        conversationHistory: conversation,
        sessionId
      }
    })
    
    if (error) throw error
    return data
  }

  const playAudio = (audioUrl: string) => {
    if (audioRef.current) {
      audioRef.current.pause()
    }
    
    audioRef.current = new Audio(audioUrl)
    audioRef.current.onplay = () => setIsPlaying(true)
    audioRef.current.onended = () => setIsPlaying(false)
    audioRef.current.onerror = () => setIsPlaying(false)
    
    audioRef.current.play().catch(console.error)
  }

  const saveConversationTurn = async (userMsg: ConversationMessage, aiMsg: ConversationMessage, scores: SimulationScores) => {
    try {
      // Salvar turnos na tabela sessions_live_turns
      await supabase.from('sessions_live_turns').insert([
        {
          session_id: sessionId,
          turn_index: turnCount,
          speaker: 'user',
          content: userMsg.content,
          timestamp_ms: new Date(userMsg.timestamp).getTime()
        },
        {
          session_id: sessionId,
          turn_index: turnCount,
          speaker: 'ai',
          content: aiMsg.content,
          timestamp_ms: new Date(aiMsg.timestamp).getTime()
        }
      ])
    } catch (error) {
      console.error('Erro ao salvar conversa:', error)
    }
  }

  const analyzeSessionScore = async (userTranscript: string, area: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('score-session-by-area', {
        body: { 
          transcript: userTranscript,
          area: area
        }
      })
      
      if (error) {
        console.error('Erro ao analisar score:', error)
        return
      }

      // Atualizar metadata com o score real da análise
      if (data?.score) {
        await supabase
          .from('sessions_live')
          .update({
            metadata: {
              ...currentScores,
              analyzed_score: data.score,
              analysis_metrics: data.metrics || {},
              overall_score: data.score
            }
          })
          .eq('id', sessionId)
      }
    } catch (error) {
      console.error('Erro ao chamar análise de score:', error)
    }
  }

  const endSimulation = async () => {
    try {
      // Gerar transcripts reais baseados na conversa
      const userTranscript = conversation
        .filter(msg => msg.role === 'user')
        .map(msg => msg.content)
        .join('\n')
      
      const aiTranscript = conversation
        .filter(msg => msg.role === 'assistant')
        .map(msg => msg.content)
        .join('\n')

      // Atualizar sessão live com transcripts reais
      await supabase
        .from('sessions_live')
        .update({
          duration_ms: Date.now() - (conversation[0] ? new Date(conversation[0].timestamp).getTime() : Date.now()),
          transcript_user: userTranscript || 'Sem fala do usuário registrada',
          transcript_ai: aiTranscript || 'Sem resposta da IA registrada',
          metadata: {
            ...conversation[0] ? { scenario_title: scenario.title } : {},
            overall_score: currentScores?.overallScore || 0,
            total_turns: turnCount,
            completed: true,
            conversation_length: conversation.length,
            criteria: scenario.criteria
          }
        })
        .eq('id', sessionId)

      // Chamar análise da sessão de forma assíncrona
      if (userTranscript && userTranscript.trim().length > 0) {
        analyzeSessionScore(userTranscript, scenario.area);
      }

      const finalResults = {
        sessionId,
        scenario,
        userRole,
        conversation,
        scores: currentScores,
        totalTurns: turnCount,
        overallScore: currentScores?.overallScore || 0,
        duration: Math.round((Date.now() - Date.parse(conversation[0]?.timestamp)) / 1000 / 60) // minutos
      }

      onComplete(finalResults)
    } catch (error) {
      console.error('Erro ao finalizar simulação:', error)
      toast({
        title: "Erro",
        description: "Erro ao finalizar simulação.",
        variant: "destructive"
      })
    }
  }

  if (showReport && currentScores) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Relatório da Simulação
                <Button variant="outline" onClick={() => setShowReport(false)}>
                  <X className="h-4 w-4 mr-2" />
                  Voltar
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-2">Pontuação Final</h2>
                <div className="text-6xl font-bold text-primary mb-4">
                  {currentScores.overallScore}/10
                </div>
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  {currentScores.overallScore >= 8 ? 'Excelente' : 
                   currentScores.overallScore >= 6 ? 'Bom' : 
                   currentScores.overallScore >= 4 ? 'Satisfatório' : 'Precisa Melhorar'}
                </Badge>
              </div>
              
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {scenario.criteria?.map && Array.isArray(scenario.criteria) ? scenario.criteria.map((criterion) => {
                  const score = currentScores.scores[criterion.key] || 0
                  return (
                    <Card key={criterion.key}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-medium">{criterion.label}</h3>
                          <Badge variant="outline">{score}/10</Badge>
                        </div>
                        <Progress value={score * 10} className="mb-2" />
                        {currentScores.feedback[criterion.key] && (
                          <p className="text-sm text-muted-foreground">
                            {currentScores.feedback[criterion.key]}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  )
                }) : null}
              </div>
              
              {currentScores.suggestions.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Sugestões de Melhoria</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {currentScores.suggestions.map((suggestion, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-primary">•</span>
                          <span className="text-sm">{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
              
              <div className="flex justify-center gap-4">
                <Button onClick={() => setShowReport(false)}>
                  Nova Simulação
                </Button>
                <Button variant="outline" onClick={onExit}>
                  Voltar ao Menu
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                {scenario.title}
                <Badge variant="outline">{scenario.area}</Badge>
              </CardTitle>
              <p className="text-muted-foreground mt-1">
                Papel: {userRole} • Turno: {turnCount + 1}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowReport(true)} disabled={!currentScores}>
                <Download className="h-4 w-4 mr-2" />
                Relatório
              </Button>
              <Button variant="outline" onClick={onExit}>
                <X className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Voice Interface */}
        <Card>
          <CardContent className="p-8 text-center space-y-6">
            <VoiceReactiveOrb 
              size={200}
            />
            
            <div className="space-y-4">
              {isProcessing ? (
                <div>
                  <p className="text-muted-foreground mb-2">Processando sua fala...</p>
                  <Progress value={undefined} className="w-64 mx-auto" />
                </div>
              ) : (
                <div className="flex justify-center gap-4">
                  {!isRecording ? (
                    <Button 
                     size="lg" 
                     onClick={startRecording}
                     disabled={isPlaying || isProcessing}
                     className="bg-green-600 hover:bg-green-700"
                   >
                     <Mic className="h-5 w-5 mr-2" />
                     Iniciar
                    </Button>
                  ) : (
                    <Button 
                      size="lg" 
                      onClick={stopRecording}
                      variant="destructive"
                    >
                      <Square className="h-5 w-5 mr-2" />
                      Parar
                    </Button>
                  )}
                  
                  {isPlaying && (
                    <Button variant="outline" size="lg" disabled>
                      <Volume2 className="h-5 w-5 mr-2" />
                      IA Falando...
                    </Button>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Conversation History */}
        {conversation.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Conversa</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 max-h-96 overflow-y-auto">
              {conversation.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    {message.audioUrl && message.role === 'assistant' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-2 h-6 px-2"
                        onClick={() => playAudio(message.audioUrl!)}
                      >
                        <Play className="h-3 w-3 mr-1" />
                        Ouvir
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Current Scores */}
        {currentScores && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Pontuação Atual
                <Badge variant="secondary" className="text-lg px-3 py-1">
                  {currentScores.overallScore}/10
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {scenario.criteria?.map && Array.isArray(scenario.criteria) ? scenario.criteria.map((criterion) => {
                const score = currentScores.scores[criterion.key] || 0
                return (
                  <div key={criterion.key} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{criterion.label}</span>
                      <span>{score}/10</span>
                    </div>
                    <Progress value={score * 10} className="h-2" />
                    {currentScores.feedback[criterion.key] && (
                      <p className="text-xs text-muted-foreground">
                        {currentScores.feedback[criterion.key]}
                      </p>
                    )}
                  </div>
                )
              }) : <p className="text-sm text-muted-foreground">Critérios não disponíveis</p>}
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <Button onClick={endSimulation} size="lg" disabled={conversation.length < 4}>
            Finalizar Simulação
          </Button>
        </div>
      </div>
    </div>
  )
}