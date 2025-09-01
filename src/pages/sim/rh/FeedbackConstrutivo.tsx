// src/pages/sim/rh/FeedbackConstrutivo.tsx
import { useEffect, useRef, useState } from 'react'
import { supabase } from '@/integrations/supabase/client'

type RecState = 'idle' | 'recording' | 'processing'

export default function RHFeedbackConstrutivo() {
  const [recState, setRecState] = useState<RecState>('idle')
  const [error, setError] = useState<string | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [transcript, setTranscript] = useState<string>('') // TODO: preencher com Whisper
  const [aiReply, setAiReply] = useState<string>('')       // TODO: preencher com GPT + TTS

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<BlobPart[]>([])
  const audioCtxRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const rafRef = useRef<number | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null)

  // desenho da onda
  function drawWave() {
    const analyser = analyserRef.current
    const canvas = canvasRef.current
    if (!analyser || !canvas) return
    const ctx = canvas.getContext('2d')!
    const bufferLength = analyser.fftSize
    const dataArray = new Uint8Array(bufferLength)

    const render = () => {
      analyser.getByteTimeDomainData(dataArray)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.lineWidth = 2
      ctx.strokeStyle = '#00FF99'
      ctx.beginPath()
      const sliceWidth = (canvas.width * 1.0) / bufferLength
      let x = 0
      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0
        const y = (v * canvas.height) / 2
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
        x += sliceWidth
      }
      ctx.lineTo(canvas.width, canvas.height / 2)
      ctx.stroke()
      rafRef.current = requestAnimationFrame(render)
    }
    rafRef.current = requestAnimationFrame(render)
  }

  async function startRecording() {
    setError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      // audio context + analyser
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      analyserRef.current = audioCtxRef.current.createAnalyser()
      analyserRef.current.fftSize = 2048
      sourceRef.current = audioCtxRef.current.createMediaStreamSource(stream)
      sourceRef.current.connect(analyserRef.current)

      drawWave()

      // media recorder
      const mr = new MediaRecorder(stream)
      mediaRecorderRef.current = mr
      chunksRef.current = []
      mr.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data) }
      mr.onstop = async () => {
        stopVisual()
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        const url = URL.createObjectURL(blob)
        setAudioUrl(url)
        setRecState('processing')

        try {
          // 1) STT: enviar blob para stt-whisper
          const formData = new FormData()
          formData.append('file', blob, 'audio.webm')
          
          const sttResponse = await fetch('https://roboonbdessuipvcpgve.supabase.co/functions/v1/stt-whisper', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
              'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
            },
            body: formData,
          })
          
          if (!sttResponse.ok) {
            throw new Error(`STT failed: ${await sttResponse.text()}`)
          }
          
          const { text } = await sttResponse.json()
          console.log('STT result:', { text })
          setTranscript(text)

          // 2) Chat: enviar transcript para chat-reply
          const chatResponse = await fetch('https://roboonbdessuipvcpgve.supabase.co/functions/v1/chat-reply', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
              'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              transcript: text,
              scenario: 'feedback-construtivo'
            }),
          })
          
          if (!chatResponse.ok) {
            throw new Error(`Chat failed: ${await chatResponse.text()}`)
          }
          
          const { reply } = await chatResponse.json()
          console.log('Chat result:', { reply })
          setAiReply(reply)

          // 3) TTS: enviar reply para openai-tts
          const ttsResponse = await supabase.functions.invoke('openai-tts', {
            body: { text: reply }
          })
          
          if (ttsResponse.error) {
            throw new Error(`TTS failed: ${ttsResponse.error}`)
          }
          
          console.log('TTS result: audio received')
          
          // Tocar áudio
          if (ttsResponse.data) {
            const audioBytes = new Uint8Array(await ttsResponse.data.arrayBuffer());
            const audioBlob = new Blob([audioBytes], { type: "audio/mpeg" });
            const audioUrl = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioUrl);
            audio.play();
          }

          // 4) Salvar sessão no Supabase
          const { data: user } = await supabase.auth.getUser()
          if (user?.user) {
            const { error: insertError } = await supabase
              .from('sessions')
              .insert({
                user_id: user.user.id,
                track: 'rh',
                scenario: 'feedback-construtivo',
                transcript: text,
                finished_at: new Date().toISOString()
              })
            
            if (insertError) {
              console.error('Failed to save session:', insertError)
            } else {
              console.log('Session saved successfully')
            }
          }
        } catch (error: any) {
          console.error('Pipeline error:', error)
          setError(error.message)
        }

        setRecState('idle')
      }
      mr.start()
      setRecState('recording')
    } catch (e: any) {
      setError(e?.message || 'Não foi possível acessar o microfone')
      stopVisual()
    }
  }

  function stopVisual() {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    if (audioCtxRef.current) audioCtxRef.current.close().catch(() => {})
    audioCtxRef.current = null
    analyserRef.current = null
    sourceRef.current = null
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop()
    mediaRecorderRef.current = null
    // parar todas as trilhas do stream
    const tracks = (sourceRef.current as any)?.mediaStream?.getTracks?.() || []
    tracks.forEach((t: MediaStreamTrack) => t.stop())
  }

  useEffect(() => {
    return () => stopVisual()
  }, [])

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">RH • Feedback Construtivo</h1>
       <p className="text-white/70">
         Clique em "Iniciar" para começar a conversa. O microfone será ativado automaticamente.
       </p>

      <div className="card p-6 space-y-4">
        <canvas ref={canvasRef} width={800} height={180} className="w-full rounded-xl bg-white/5" />
        <div className="flex gap-3">
          {recState !== 'recording' ? (
            <button onClick={startRecording} className="btn-primary">🎙️ Iniciar</button>
          ) : (
            <button onClick={stopRecording} className="rounded-2xl px-5 py-2 bg-white/10">⏹️ Parar</button>
          )}
          {error && <span className="text-red-400 text-sm">{error}</span>}
        </div>
      </div>

      {audioUrl && (
        <div className="card p-6 space-y-3">
          <h3 className="font-semibold">Seu áudio gravado</h3>
          <audio controls src={audioUrl} className="w-full" />
        </div>
      )}

      {!!transcript && (
        <div className="card p-6 space-y-2">
          <h3 className="font-semibold">Transcrição (Whisper) — TODO</h3>
          <p className="text-white/80">{transcript}</p>
        </div>
      )}

      {!!aiReply && (
        <div className="card p-6 space-y-2">
          <h3 className="font-semibold">Resposta da IA — TODO</h3>
          <p className="text-white/80">{aiReply}</p>
        </div>
      )}
    </div>
  )
}