import { useEffect, useRef, useState } from 'react'

interface AudioDetectorState {
  isActive: boolean
  level: number
}

export function useSimpleAudioDetector(
  mediaStream: MediaStream | null,
  audioElement: HTMLAudioElement | null
): AudioDetectorState {
  const [isActive, setIsActive] = useState(false)
  const [level, setLevel] = useState(0)
  
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animationFrameRef = useRef<number | null>(null)

  useEffect(() => {
    let cleanup: (() => void) | null = null

  const setupAudioAnalysis = async () => {
    try {
      console.log('🔧 Configurando análise de áudio:', {
        hasMediaStream: !!mediaStream,
        hasAudioElement: !!audioElement,
        audioElementSrc: audioElement?.src,
        audioElementSrcObject: !!audioElement?.srcObject
      })

      // Priorizar mediaStream (microfone) sobre audioElement
      if (mediaStream) {
        console.log('✅ Configurando análise de MICROFONE')
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
        const analyser = audioContext.createAnalyser()
        const source = audioContext.createMediaStreamSource(mediaStream)
        
        analyser.fftSize = 512
        analyser.smoothingTimeConstant = 0.8
        source.connect(analyser)
        
        audioContextRef.current = audioContext
        analyserRef.current = analyser
        
        console.log('✓ Análise de microfone configurada SUCESSO')
        
        cleanup = () => {
          console.log('🧹 Limpando contexto de microfone')
          if (audioContext.state !== 'closed') {
            audioContext.close()
          }
        }
      } else if (audioElement) {
        console.log('✅ Tentando configurar análise de AUDIO ELEMENTO')
        
        // Função para configurar áudio quando estiver pronto
        const setupAudioElement = () => {
          console.log('🔄 Verificando se audioElement está pronto para análise:', {
            readyState: audioElement.readyState,
            currentTime: audioElement.currentTime,
            duration: audioElement.duration,
            paused: audioElement.paused,
            ended: audioElement.ended,
            src: audioElement.src,
            srcObject: !!audioElement.srcObject
          })
          
          const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
          const analyser = audioContext.createAnalyser()
          
          try {
            const source = audioContext.createMediaElementSource(audioElement)
            analyser.fftSize = 512
            analyser.smoothingTimeConstant = 0.8
            source.connect(analyser)
            source.connect(audioContext.destination) // Para manter o playback
            
            audioContextRef.current = audioContext
            analyserRef.current = analyser
            
            console.log('✓ Análise de áudio remoto configurada SUCESSO')
            
            cleanup = () => {
              console.log('🧹 Limpando contexto de áudio remoto')
              if (audioContext.state !== 'closed') {
                audioContext.close()
              }
            }
            
            return true
          } catch (error) {
            console.warn('❌ Não foi possível conectar ao audioElement:', error.message)
            audioContext.close()
            return false
          }
        }
        
        // Tentar configurar imediatamente
        if (setupAudioElement()) {
          console.log('✅ AudioElement configurado imediatamente')
        } else {
          console.log('⏳ AudioElement não está pronto, aguardando eventos...')
          
          // Aguardar eventos do audioElement
          const onLoadedData = () => {
            console.log('📡 AudioElement loadeddata event')
            if (setupAudioElement()) {
              audioElement.removeEventListener('loadeddata', onLoadedData)
              audioElement.removeEventListener('canplay', onCanPlay)
              audioElement.removeEventListener('playing', onPlaying)
            }
          }
          
          const onCanPlay = () => {
            console.log('📡 AudioElement canplay event')
            if (setupAudioElement()) {
              audioElement.removeEventListener('loadeddata', onLoadedData)
              audioElement.removeEventListener('canplay', onCanPlay)
              audioElement.removeEventListener('playing', onPlaying)
            }
          }
          
          const onPlaying = () => {
            console.log('📡 AudioElement playing event')
            if (setupAudioElement()) {
              audioElement.removeEventListener('loadeddata', onLoadedData)
              audioElement.removeEventListener('canplay', onCanPlay)
              audioElement.removeEventListener('playing', onPlaying)
            }
          }
          
          audioElement.addEventListener('loadeddata', onLoadedData)
          audioElement.addEventListener('canplay', onCanPlay)
          audioElement.addEventListener('playing', onPlaying)
          
          // Cleanup adicional para eventos
          const originalCleanup = cleanup
          cleanup = () => {
            audioElement.removeEventListener('loadeddata', onLoadedData)
            audioElement.removeEventListener('canplay', onCanPlay)
            audioElement.removeEventListener('playing', onPlaying)
            if (originalCleanup) originalCleanup()
          }
        }
      } else {
        console.warn('❌ Nenhuma fonte de áudio válida disponível')
        return
      }

      // Iniciar loop de análise
      if (analyserRef.current) {
        console.log('🔄 Iniciando loop de análise de áudio')
        let frameCount = 0
        
        const analyzeAudio = () => {
          if (!analyserRef.current) return

          const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount)
          analyserRef.current.getByteFrequencyData(dataArray)

          // Calcular nível médio
          let sum = 0
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i]
          }
          const avgLevel = sum / dataArray.length / 255

          // Aplicar threshold mais sensível
          const threshold = 0.03 // Ainda mais sensível
          const currentlyActive = avgLevel > threshold

          setLevel(avgLevel)
          setIsActive(currentlyActive)

          // Log periódico para debug
          frameCount++
          if (frameCount % 60 === 0) { // Log a cada 60 frames (~1 segundo)
            console.log(`📊 Frame ${frameCount}: avgLevel=${Math.round(avgLevel * 100)}%, active=${currentlyActive}`)
          }

          if (currentlyActive) {
            console.log(`🎤 ÁUDIO DETECTADO: ${Math.round(avgLevel * 100)}% (threshold: ${Math.round(threshold * 100)}%)`)
          }

          animationFrameRef.current = requestAnimationFrame(analyzeAudio)
        }

        analyzeAudio()
      } else {
        console.error('❌ analyserRef.current is null - não foi possível iniciar análise')
      }
      } catch (error) {
        console.error('Erro ao configurar análise de áudio:', error)
        setIsActive(false)
        setLevel(0)
      }
    }

    setupAudioAnalysis()

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (cleanup) {
        cleanup()
      }
      setIsActive(false)
      setLevel(0)
    }
  }, [mediaStream, audioElement])

  return { isActive, level }
}