import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/integrations/supabase/client'
import { Mic, MicOff, Loader2, CheckCircle, AlertCircle } from 'lucide-react'

export function TranscriptionTestComponent() {
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [testResults, setTestResults] = useState<any>({})
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const { toast } = useToast()

  const startRecording = async () => {
    try {
      console.log('🎤 Iniciando gravação de teste...')
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
        await processAudioTest()
        stream.getTracks().forEach(track => track.stop())
      }
      
      mediaRecorderRef.current.start()
      setIsRecording(true)
      
      toast({
        title: "Gravação iniciada",
        description: "Fale algo para testar a transcrição..."
      })
      
    } catch (error) {
      console.error('❌ Erro ao iniciar gravação:', error)
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

  const processAudioTest = async () => {
    setIsProcessing(true)
    setTestResults({})
    
    try {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm;codecs=opus' })
      
      console.log('📁 Áudio gravado:', {
        size: audioBlob.size,
        type: audioBlob.type
      })
      
      // Teste 1: Verificar se o áudio foi capturado
      setTestResults(prev => ({
        ...prev,
        audioCapture: { 
          success: audioBlob.size > 0, 
          size: audioBlob.size,
          type: audioBlob.type 
        }
      }))

      if (audioBlob.size === 0) {
        throw new Error('Nenhum áudio foi capturado')
      }

      // Teste 2: Testar a Edge Function STT diretamente
      const formData = new FormData()
      formData.append('audio', audioBlob, 'test-audio.webm')
      
      console.log('🤖 Testando Edge Function STT...')
      const { data: sttData, error: sttError } = await supabase.functions.invoke('openai-stt', {
        body: formData
      })
      
      console.log('📡 Resposta STT:', { data: sttData, error: sttError })
      
      setTestResults(prev => ({
        ...prev,
        sttFunction: { 
          success: !sttError && sttData?.text,
          data: sttData,
          error: sttError
        }
      }))

      if (sttError) {
        throw new Error(`STT Error: ${sttError.message}`)
      }

      const transcriptText = sttData?.text || ''
      setTranscript(transcriptText)

      // Teste 3: Verificar se o transcript foi salvo (simular salvamento)
      if (transcriptText.trim()) {
        console.log('✅ Transcrição obtida:', transcriptText)
        
        // Simular criação de uma sessão de teste
        const testSessionId = crypto.randomUUID()
        
        const { data: { user } } = await supabase.auth.getUser()
        
        // Teste de salvamento na sessão live
        const { error: saveError } = await supabase
          .from('sessions_live')
          .insert({
            id: testSessionId,
            track: 'test',
            user_id: user?.id,
            duration_ms: 5000,
            transcript_user: transcriptText,
            transcript_ai: 'Teste de resposta da IA',
            metadata: {
              test: true,
              created_at: new Date().toISOString()
            }
          })
        
        setTestResults(prev => ({
          ...prev,
          saveToDatabase: { 
            success: !saveError,
            sessionId: testSessionId,
            error: saveError
          }
        }))

        if (!saveError) {
          // Limpar a sessão de teste
          await supabase
            .from('sessions_live')
            .delete()
            .eq('id', testSessionId)
        }

        toast({
          title: "Teste concluído!",
          description: `Transcrição: "${transcriptText.substring(0, 50)}..."`
        })
      } else {
        throw new Error('Nenhum texto foi transcrito')
      }

    } catch (error) {
      console.error('❌ Erro no teste de transcrição:', error)
      setTestResults(prev => ({
        ...prev,
        overallTest: { 
          success: false,
          error: error instanceof Error ? error.message : 'Erro desconhecido'
        }
      }))
      toast({
        title: "Erro no teste",
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: "destructive"
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const runFullSystemTest = async () => {
    setTestResults({})
    setTranscript('')
    
    // Simular uma sessão completa
    toast({
      title: "Teste do sistema completo",
      description: "Grave um áudio para testar todo o fluxo de transcrição"
    })
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🎤 Teste do Sistema de Transcrição
          {isProcessing && <Loader2 className="h-5 w-5 animate-spin" />}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Controles de gravação */}
        <div className="flex gap-4 items-center justify-center">
          {!isRecording ? (
            <Button onClick={startRecording} disabled={isProcessing} size="lg">
              <Mic className="h-5 w-5 mr-2" />
              Iniciar Gravação de Teste
            </Button>
          ) : (
            <Button onClick={stopRecording} variant="destructive" size="lg">
              <MicOff className="h-5 w-5 mr-2" />
              Parar Gravação
            </Button>
          )}
          
          <Button onClick={runFullSystemTest} variant="outline">
            Testar Sistema Completo
          </Button>
        </div>

        {/* Status da gravação */}
        {isRecording && (
          <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
            <div className="text-red-600 font-medium">🔴 Gravando...</div>
            <div className="text-sm text-red-500">Fale algo para testar a transcrição</div>
          </div>
        )}

        {/* Resultados dos testes */}
        {Object.keys(testResults).length > 0 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Resultados dos Testes</h3>
            
            {testResults.audioCapture && (
              <Card className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">1. Captura de Áudio</span>
                  {testResults.audioCapture.success ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  Tamanho: {testResults.audioCapture.size} bytes | 
                  Tipo: {testResults.audioCapture.type}
                </div>
              </Card>
            )}

            {testResults.sttFunction && (
              <Card className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">2. Edge Function STT</span>
                  {testResults.sttFunction.success ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  )}
                </div>
                {testResults.sttFunction.error && (
                  <div className="text-sm text-red-600">
                    Erro: {testResults.sttFunction.error.message}
                  </div>
                )}
                {testResults.sttFunction.data?.text && (
                  <div className="text-sm text-green-600">
                    Texto: "{testResults.sttFunction.data.text}"
                  </div>
                )}
              </Card>
            )}

            {testResults.saveToDatabase && (
              <Card className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">3. Salvamento no Banco</span>
                  {testResults.saveToDatabase.success ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  )}
                </div>
                {testResults.saveToDatabase.error && (
                  <div className="text-sm text-red-600">
                    Erro: {JSON.stringify(testResults.saveToDatabase.error)}
                  </div>
                )}
                {testResults.saveToDatabase.sessionId && (
                  <div className="text-sm text-green-600">
                    Sessão criada: {testResults.saveToDatabase.sessionId}
                  </div>
                )}
              </Card>
            )}
          </div>
        )}

        {/* Transcrição */}
        {transcript && (
          <Card className="p-4 bg-green-50 border-green-200">
            <h3 className="font-semibold mb-2">✅ Transcrição Obtida:</h3>
            <div className="text-sm bg-white p-3 rounded border">
              "{transcript}"
            </div>
          </Card>
        )}

        {/* Instruções */}
        <Card className="p-4 bg-blue-50 border-blue-200">
          <h3 className="font-semibold mb-2">ℹ️ Como usar este teste:</h3>
          <ol className="text-sm space-y-1 list-decimal list-inside">
            <li>Clique em "Iniciar Gravação de Teste"</li>
            <li>Fale claramente por alguns segundos</li>
            <li>Clique em "Parar Gravação"</li>
            <li>Aguarde o processamento e verifique os resultados</li>
            <li>Se algum teste falhar, verifique os logs do console</li>
          </ol>
        </Card>
      </CardContent>
    </Card>
  )
}