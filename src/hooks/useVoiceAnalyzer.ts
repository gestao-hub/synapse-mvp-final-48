import { useEffect, useRef, useState } from 'react'

interface VoiceAnalyzerState {
  audioLevel: number
  isActive: boolean
  frequency: number
}

export function useVoiceAnalyzer(audioStream: MediaStream | null) {
  const [state, setState] = useState<VoiceAnalyzerState>({
    audioLevel: 0,
    isActive: false,
    frequency: 0
  })

  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const dataArrayRef = useRef<Uint8Array | null>(null)
  const animationFrameRef = useRef<number | null>(null)

  useEffect(() => {
    if (!audioStream) {
      setState({ audioLevel: 0, isActive: false, frequency: 0 })
      return
    }

    // Criar contexto de áudio
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const analyser = audioContext.createAnalyser()
    const source = audioContext.createMediaStreamSource(audioStream)

    // Configurar analisador
    analyser.fftSize = 1024
    analyser.smoothingTimeConstant = 0.3
    source.connect(analyser)

    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)

    audioContextRef.current = audioContext
    analyserRef.current = analyser
    dataArrayRef.current = dataArray

    // Função de análise contínua
    const analyze = () => {
      if (!analyser || !dataArray) return

      analyser.getByteFrequencyData(dataArray)

      // Calcular nível médio de áudio
      let sum = 0
      let maxValue = 0
      for (let i = 0; i < bufferLength; i++) {
        sum += dataArray[i]
        maxValue = Math.max(maxValue, dataArray[i])
      }

      const average = sum / bufferLength
      const normalizedLevel = Math.min(average / 128, 1)
      const isActive = normalizedLevel > 0.05

      // Calcular frequência dominante
      let maxIndex = 0
      for (let i = 0; i < bufferLength; i++) {
        if (dataArray[i] > dataArray[maxIndex]) {
          maxIndex = i
        }
      }
      const frequency = (maxIndex * audioContext.sampleRate) / (2 * bufferLength)

      setState({
        audioLevel: normalizedLevel,
        isActive,
        frequency
      })

      animationFrameRef.current = requestAnimationFrame(analyze)
    }

    analyze()

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (audioContext.state !== 'closed') {
        audioContext.close()
      }
    }
  }, [audioStream])

  return state
}

// Hook para analisar áudio remoto (IA)
export function useRemoteAudioAnalyzer(audioElement: HTMLAudioElement | null) {
  const [state, setState] = useState<VoiceAnalyzerState>({
    audioLevel: 0,
    isActive: false,
    frequency: 0
  })

  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null)
  const animationFrameRef = useRef<number | null>(null)

  useEffect(() => {
    if (!audioElement) {
      setState({ audioLevel: 0, isActive: false, frequency: 0 })
      return
    }

    // Criar contexto de áudio
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const analyser = audioContext.createAnalyser()
    
    // Conectar elemento de áudio
    let source: MediaElementAudioSourceNode
    try {
      source = audioContext.createMediaElementSource(audioElement)
      source.connect(analyser)
      source.connect(audioContext.destination)
    } catch (error) {
      console.warn('Erro ao conectar análise de áudio remoto:', error)
      return
    }

    // Configurar analisador
    analyser.fftSize = 1024
    analyser.smoothingTimeConstant = 0.3

    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)

    audioContextRef.current = audioContext
    analyserRef.current = analyser
    sourceRef.current = source

    // Função de análise contínua
    const analyze = () => {
      if (!analyser) return

      analyser.getByteFrequencyData(dataArray)

      // Calcular nível médio de áudio
      let sum = 0
      for (let i = 0; i < bufferLength; i++) {
        sum += dataArray[i]
      }

      const average = sum / bufferLength
      const normalizedLevel = Math.min(average / 128, 1)
      const isActive = normalizedLevel > 0.03 && !audioElement.paused

      // Calcular frequência dominante
      let maxIndex = 0
      for (let i = 0; i < bufferLength; i++) {
        if (dataArray[i] > dataArray[maxIndex]) {
          maxIndex = i
        }
      }
      const frequency = (maxIndex * audioContext.sampleRate) / (2 * bufferLength)

      setState({
        audioLevel: normalizedLevel,
        isActive,
        frequency
      })

      animationFrameRef.current = requestAnimationFrame(analyze)
    }

    analyze()

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (audioContext.state !== 'closed') {
        audioContext.close()
      }
    }
  }, [audioElement])

  return state
}