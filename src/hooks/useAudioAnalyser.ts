import { useEffect, useRef, useState, useCallback } from 'react'

export type SourceMode = 'mic' | 'element'

interface AudioAnalyserOptions {
  mode: SourceMode
  audioElement?: HTMLAudioElement | null
}

interface AudioBands {
  low: number    // 0-250 Hz
  mid: number    // 250-4000 Hz
  high: number   // 4000+ Hz
}

interface AudioAnalyserState {
  ready: boolean
  level: number      // Overall audio level (0-1)
  bands: AudioBands  // Frequency bands (0-1)
  resumeAudio: () => void
}

export function useAudioAnalyser({ mode, audioElement }: AudioAnalyserOptions): AudioAnalyserState {
  const [ready, setReady] = useState(false)
  const [level, setLevel] = useState(0)
  const [bands, setBands] = useState<AudioBands>({ low: 0, mid: 0, high: 0 })

  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const sourceRef = useRef<AudioNode | null>(null)
  const dataArrayRef = useRef<Uint8Array | null>(null)
  const animationFrameRef = useRef<number | null>(null)

  const resumeAudio = useCallback(async () => {
    if (audioContextRef.current?.state === 'suspended') {
      await audioContextRef.current.resume()
    }
  }, [])

  useEffect(() => {
    let stream: MediaStream | null = null

    const initializeAudio = async () => {
      try {
        // Só prosseguir se tiver configuração válida
        if (mode === 'mic') {
          // Para modo mic, sempre criar novo stream
          stream = await navigator.mediaDevices.getUserMedia({ 
            audio: {
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true
            } 
          })
        } else if (mode === 'element') {
          // Para modo element, precisa ter audioElement válido
          if (!audioElement) {
            console.warn('Modo element sem audioElement válido')
            setReady(false)
            return
          }
        } else {
          throw new Error('Invalid audio source configuration')
        }

        // Create audio context
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
        const analyser = audioContext.createAnalyser()
        
        // Configure analyser for better frequency resolution
        analyser.fftSize = 2048
        analyser.smoothingTimeConstant = 0.3
        analyser.minDecibels = -90
        analyser.maxDecibels = -10

        let source: AudioNode

        if (mode === 'mic' && stream) {
          source = audioContext.createMediaStreamSource(stream)
        } else if (mode === 'element' && audioElement) {
          try {
            source = audioContext.createMediaElementSource(audioElement)
            // Conectar ao destination para permitir playback
            source.connect(audioContext.destination)
          } catch (error) {
            console.warn('Audio element connection failed, skipping analysis')
            setReady(false)
            return
          }
        } else {
          throw new Error('Invalid audio source configuration')
        }

        source.connect(analyser)

        const bufferLength = analyser.frequencyBinCount
        const dataArray = new Uint8Array(bufferLength)

        audioContextRef.current = audioContext
        analyserRef.current = analyser
        sourceRef.current = source
        dataArrayRef.current = dataArray

        setReady(true)

        // Start analysis loop
        const analyze = () => {
          if (!analyser || !dataArray) return

          analyser.getByteFrequencyData(dataArray)

          // Calculate overall level
          let sum = 0
          for (let i = 0; i < bufferLength; i++) {
            sum += dataArray[i]
          }
          const averageLevel = sum / bufferLength / 255

          // Calculate frequency bands
          const sampleRate = audioContext.sampleRate
          const nyquist = sampleRate / 2
          const binWidth = nyquist / bufferLength

          // Low frequencies (0-250 Hz)
          const lowEndBin = Math.floor(250 / binWidth)
          let lowSum = 0
          for (let i = 0; i < lowEndBin; i++) {
            lowSum += dataArray[i]
          }
          const lowLevel = lowSum / lowEndBin / 255

          // Mid frequencies (250-4000 Hz)
          const midStartBin = lowEndBin
          const midEndBin = Math.floor(4000 / binWidth)
          let midSum = 0
          for (let i = midStartBin; i < midEndBin; i++) {
            midSum += dataArray[i]
          }
          const midLevel = midSum / (midEndBin - midStartBin) / 255

          // High frequencies (4000+ Hz)
          const highStartBin = midEndBin
          let highSum = 0
          for (let i = highStartBin; i < bufferLength; i++) {
            highSum += dataArray[i]
          }
          const highLevel = highSum / (bufferLength - highStartBin) / 255

          setLevel(averageLevel)
          setBands({
            low: Math.min(lowLevel, 1),
            mid: Math.min(midLevel, 1),
            high: Math.min(highLevel, 1)
          })

          animationFrameRef.current = requestAnimationFrame(analyze)
        }

        analyze()

      } catch (error) {
        console.error('Error initializing audio analyser:', error)
        setReady(false)
      }
    }

    initializeAudio()

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
      if (audioContextRef.current?.state !== 'closed') {
        audioContextRef.current?.close()
      }
      setReady(false)
      setLevel(0)
      setBands({ low: 0, mid: 0, high: 0 })
    }
  }, [mode, audioElement])

  return {
    ready,
    level,
    bands,
    resumeAudio
  }
}