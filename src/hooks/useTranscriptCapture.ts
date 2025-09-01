import { useState, useRef, useCallback } from 'react'
import { supabase } from '@/integrations/supabase/client'

interface TranscriptCaptureOptions {
  sessionId: string
  onTranscriptUpdate?: (userTranscript: string, aiTranscript: string) => void
  onError?: (error: Error) => void
}

export function useTranscriptCapture({ sessionId, onTranscriptUpdate, onError }: TranscriptCaptureOptions) {
  const [isCapturing, setIsCapturing] = useState(false)
  const [userTranscript, setUserTranscript] = useState('')
  const [aiTranscript, setAiTranscript] = useState('')
  const turnIndexRef = useRef(0)
  
  const saveTranscript = useCallback(async (
    transcript: string, 
    speakerType: 'user' | 'ai'
  ) => {
    try {
      console.log(`💾 Salvando transcript do ${speakerType}:`, transcript.substring(0, 100))
      
      const { error } = await supabase.functions.invoke('save-live-transcript', {
        body: {
          sessionId,
          [speakerType === 'user' ? 'userTranscript' : 'aiTranscript']: transcript,
          turnIndex: turnIndexRef.current++,
          speakerType
        }
      })
      
      if (error) {
        console.error('❌ Erro ao salvar transcript:', error)
        onError?.(new Error(`Erro ao salvar transcript: ${error.message}`))
        return
      }
      
      // Atualizar estado local
      if (speakerType === 'user') {
        setUserTranscript(prev => prev + '\n' + transcript)
      } else {
        setAiTranscript(prev => prev + '\n' + transcript)
      }
      
      // Notificar callback
      const newUserTranscript = speakerType === 'user' ? userTranscript + '\n' + transcript : userTranscript
      const newAiTranscript = speakerType === 'ai' ? aiTranscript + '\n' + transcript : aiTranscript
      onTranscriptUpdate?.(newUserTranscript, newAiTranscript)
      
      console.log('✅ Transcript salvo com sucesso')
      
    } catch (error) {
      console.error('❌ Erro ao salvar transcript:', error)
      onError?.(error instanceof Error ? error : new Error('Erro desconhecido'))
    }
  }, [sessionId, userTranscript, aiTranscript, onTranscriptUpdate, onError])
  
  const startCapturing = useCallback(() => {
    console.log('🎤 Iniciando captura de transcripts para sessão:', sessionId)
    setIsCapturing(true)
    turnIndexRef.current = 0
  }, [sessionId])
  
  const stopCapturing = useCallback(() => {
    console.log('⏹️ Parando captura de transcripts')
    setIsCapturing(false)
  }, [])
  
  const clearTranscripts = useCallback(() => {
    setUserTranscript('')
    setAiTranscript('')
    turnIndexRef.current = 0
  }, [])
  
  return {
    isCapturing,
    userTranscript,
    aiTranscript,
    saveTranscript,
    startCapturing,
    stopCapturing,
    clearTranscripts
  }
}