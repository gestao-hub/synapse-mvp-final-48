import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type StartOpts = { 
  track: "rh" | "comercial" | "educacional" | "gestao"; 
  scenario?: string; 
  systemPrompt?: string; 
  voiceId?: string; 
};

export function useRealtimeCall() {
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteAudioRef = useRef<HTMLAudioElement | null>(null);
  const dataChannelRef = useRef<RTCDataChannel | null>(null);
  const [status, setStatus] = useState<"idle"|"connecting"|"connected"|"ended">("idle");
  const [muted, setMuted] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [userTranscript, setUserTranscript] = useState("");
  const [aiTranscript, setAiTranscript] = useState("");

  useEffect(() => {
    // cria <audio> invisível para tocar o lado remoto
    const el = document.createElement("audio");
    el.autoplay = true;
    el.style.display = "none";
    document.body.appendChild(el);
    remoteAudioRef.current = el;
    return () => { el.remove(); };
  }, []);

  // Controles para evitar duplicação
  const lastSavedUserText = useRef<string>('');
  const lastSavedAiText = useRef<string>('');
  const turnCounter = useRef<number>(0);

  // Função para salvar transcrições em tempo real
  const saveTranscript = async (text: string, speaker: 'user' | 'ai') => {
    if (!currentSessionId || !text?.trim()) return;
    // Evitar duplicação - verificar se já foi salvo
    const lastSaved = speaker === 'user' ? lastSavedUserText.current : lastSavedAiText.current;
    if (lastSaved === text) {
      console.log(`⏭️ Transcript ${speaker} já foi salvo, ignorando duplicação`);
    }
    try {
      console.log(`📝 Salvando transcript ${speaker}:`, text.substring(0, 50) + '...');
      const currentTurn = turnCounter.current++;
      const response = await supabase.functions.invoke('save-live-transcript', {
        body: {
          sessionId: currentSessionId,
          [speaker === 'user' ? 'userTranscript' : 'aiTranscript']: text,
          turnIndex: currentTurn,
          speakerType: speaker
        }
      });
      if (response.error) {
        console.error(`❌ Erro na função save-live-transcript:`, response.error);
        return;
      }
      // Atualizar referência para evitar duplicação
      if (speaker === 'user') {
        lastSavedUserText.current = text;
        setUserTranscript(prev => prev + (prev ? '\n' : '') + text);
      } else {
        lastSavedAiText.current = text;
        setAiTranscript(prev => prev + (prev ? '\n' : '') + text);
      }
      console.log(`✅ Transcript ${speaker} salvo:`, text.substring(0, 50), `turno ${currentTurn}`);
    } catch (error) {
      console.error(`❌ Erro ao salvar transcript ${speaker}:`, error);
    }
  };

  // Adicionamos uma referência ao tempo de início
  const startTimeRef = useRef<number | null>(null);

  async function startCall({ track, scenario, systemPrompt, voiceId }: StartOpts) {
    try {
      setStatus("connecting");
      console.log("=== INICIANDO CHAMADA ===");
      console.log("Parâmetros:", { track, scenario, systemPrompt, voiceId });
      // Marcar tempo de início real
      startTimeRef.current = Date.now();
      // Criar nova sessão no banco
      const sessionId = crypto.randomUUID();
      setCurrentSessionId(sessionId);
      const { data: { user } } = await supabase.auth.getUser();
      const { error: sessionError } = await supabase
        .from('sessions_live')
        .insert({
          id: sessionId,
          track: track,
          user_id: user?.id,
          duration_ms: 0,
          metadata: {
            scenario_title: scenario || 'Simulação Live',
            system_prompt: systemPrompt,
            voice_id: voiceId,
            started_at: new Date().toISOString(),
            start_timestamp: startTimeRef.current
          }
        });
      if (sessionError) {
        console.error('❌ Erro ao criar sessão:', sessionError);
        throw sessionError;
      }
      console.log('✅ Sessão criada:', sessionId);
      // 1) token efêmero - usando nova edge function
      console.log("Fazendo requisição para token...");
      const tokenRes = await fetch("https://roboonbdessuipvcpgve.supabase.co/functions/v1/realtime-token", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvYm9vbmJkZXNzdWlpdmNwZ3ZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYyMTA0NDAsImV4cCI6MjA3MTc4NjQ0MH0.lbkilZMpgno7M3NVBhE3P0MoKJEXZIIuLLPCwkN120k",
          "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvYm9vbmJkZXNzdWlpdmNwZ3ZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYyMTA0NDAsImV4cCI6MjA3MTc4NjQ0MH0.lbkilZMpgno7M3NVBhE3P0MoKJEXZIIuLLPCwkN120k"
        },
        body: JSON.stringify({
          track,
          scenario,
          system_prompt: systemPrompt,
          voice_id: voiceId
        })
      });
      console.log("Status da resposta:", tokenRes.status);
      if (!tokenRes.ok) {
        const errorText = await tokenRes.text();
        console.error("Erro na requisição do token:", errorText);
        throw new Error(`Falha ao obter token: ${tokenRes.status} - ${errorText}`);
      }
      const tokenJson = await tokenRes.json();
      console.log("Conteúdo da resposta:", tokenJson);
      const EPHEMERAL = tokenJson?.client_secret?.value || tokenJson?.token;
      if (!EPHEMERAL) {
        console.error("Token efêmero não encontrado na resposta:", tokenJson);
        throw new Error("Token efêmero ausente");
      }
      console.log("✓ Token obtido com sucesso, iniciando WebRTC...");
      // 2) captura microfone
      console.log("Solicitando acesso ao microfone...");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      localStreamRef.current = stream;
      console.log("Microfone capturado");
      // 3) RTCPeerConnection
      const pc = new RTCPeerConnection();
      pcRef.current = pc;
      console.log("RTCPeerConnection criado");
      // remote track -> audio element
      pc.ontrack = (event) => {
        console.log("Track remoto recebido");
        const [remoteStream] = event.streams;
        if (remoteAudioRef.current) {
          remoteAudioRef.current.srcObject = remoteStream;
        }
      };
      // add local audio track
      stream.getAudioTracks().forEach(track => pc.addTrack(track, stream));
      console.log("Track local adicionado");
      // 4) datachannel para capturar eventos e transcrições
      const dataChannel = pc.createDataChannel("oai-events");
      dataChannelRef.current = dataChannel;
      dataChannel.addEventListener("open", () => {
        console.log("✅ DataChannel aberto - aguardando session.created para configurar");
      });
      let sessionConfigured = false;
      const configureSession = () => {
        if (sessionConfigured) return;
        sessionConfigured = true;
        console.log("🔧 Configurando sessão com transcrição ativada");
        const sessionConfig = {
          type: "session.update",
          session: {
            modalities: ["text", "audio"],
            input_audio_format: "pcm16",
            output_audio_format: "pcm16",
            input_audio_transcription: {
              model: "whisper-1"
            },
            turn_detection: {
              type: "server_vad",
              threshold: 0.3, // Mais sensível
              prefix_padding_ms: 300,
              silence_duration_ms: 800 // Menos tempo de silêncio
            },
            temperature: 0.8,
            max_response_output_tokens: "inf"
          }
        };
        dataChannel.send(JSON.stringify(sessionConfig));
        console.log("📡 Configuração de sessão enviada:", sessionConfig);
      };
      let currentAiTranscript = '';
      dataChannel.addEventListener("message", (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("📡 Evento recebido:", data.type, data);

          // Captura robusta: qualquer campo de transcrição válido deve ser salvo (mesmo duplicado)
          const possibleTranscript = data.transcript || data.delta || data.item?.content?.[0]?.transcript;
          if (possibleTranscript && typeof possibleTranscript === 'string' && possibleTranscript.trim().length > 0) {
            saveTranscript(possibleTranscript, 'user');
            console.log("📝 Transcript capturado e salvo:", possibleTranscript);
          }

          // Eventos de erro de transcrição
          if (
            data.type === 'conversation.item.input_audio_transcription.failed' ||
            data.type === 'response.audio_transcript.failed' ||
            data.type === 'error'
          ) {
            // @ts-ignore
            toast && toast({
              title: "Erro na transcrição",
              description: data.error ? String(data.error) : "Não foi possível transcrever o áudio.",
              variant: "destructive"
            });
            console.error("❌ Falha na transcrição:", data.error || data);
          }

          // Eventos de transcrição da IA
          if (data.type === 'response.audio_transcript.delta') {
            console.log("📝 Delta da IA:", data.delta);
            currentAiTranscript += data.delta;
            setAiTranscript(prev => prev + data.delta);
          }

          if (data.type === 'response.audio_transcript.done') {
            console.log("📝 Transcrição da IA completa:", currentAiTranscript);
            if (currentAiTranscript.trim()) {
              saveTranscript(currentAiTranscript, 'ai');
              currentAiTranscript = '';
            }
          }

          // Log para debug de timeouts e limites
          if (data.type === 'session.updated') {
            console.log("⚙️ Sessão atualizada:", data.session);
          }

          if (data.type === 'rate_limits.updated') {
            console.log("⏱️ Rate limits atualizados:", data.rate_limits);
          }

          // Log completo do evento recebido
          console.log("🔍 EVENTO COMPLETO:", data);

        } catch (error) {
          console.error("❌ Erro ao processar evento:", error);
          // @ts-ignore
          toast && toast({
            title: "Erro",
            description: error instanceof Error ? error.message : String(error),
            variant: "destructive"
          });
        }
      });
      // 5) negocia SDP via fetch (WebRTC com OpenAI)
      console.log("Criando oferta SDP...");
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      console.log("Enviando SDP para OpenAI...");
      const sdpResponse = await fetch(
        "https://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-12-17",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${EPHEMERAL}`,
            "Content-Type": "application/sdp"
          },
          body: offer.sdp
        }
      );
      console.log("Resposta SDP:", sdpResponse.status);
      if (!sdpResponse.ok) {
        const errorText = await sdpResponse.text();
        console.error("Erro SDP:", errorText);
        throw new Error(`Falha na negociação SDP: ${sdpResponse.status} - ${errorText}`);
      }
      const answer = { type: "answer", sdp: await sdpResponse.text() } as RTCSessionDescriptionInit;
      await pc.setRemoteDescription(answer);
      console.log("Conexão WebRTC estabelecida");
      setStatus("connected");
      // Aguardar conexão estabelecer e tentar configurar se ainda não foi feito
      setTimeout(() => {
        console.log("✅ Conexão WebRTC totalmente estabelecida");
        console.log("🎤 Captura de transcrições ativada para sessão:", sessionId);
        // Fallback: se session.created não foi recebido, forçar configuração
        if (!sessionConfigured) {
          console.log("🔄 Forçando configuração da sessão como fallback");
          configureSession();
        }
      }, 2000);
    } catch (error) {
      console.error("=== ERRO DETALHADO ===");
      console.error("Tipo do erro:", error);
      console.error("Mensagem:", error instanceof Error ? error.message : String(error));
      console.error("Stack:", error instanceof Error ? error.stack : "N/A");
      // Limpar recursos se houver erro
      const pc = pcRef.current;
      if (pc) {
        pc.close();
        pcRef.current = null;
      }
      const ls = localStreamRef.current;
      if (ls) {
        ls.getTracks().forEach(t => t.stop());
        localStreamRef.current = null;
      }
      setStatus("ended");
      // Re-throw para que possa ser tratado pela UI se necessário
      throw error;
    }
  }

  function toggleMute() {
    setMuted((m) => {
      const next = !m;
      const tracks = localStreamRef.current?.getAudioTracks?.() || [];
      for (const t of tracks) t.enabled = !next;
      return next;
    });
  }

  async function endCall() {
    console.log("🏁 Finalizando chamada e salvando dados finais...");
    // Finalizar a sessão no banco antes de fechar conexões
    if (currentSessionId && startTimeRef.current) {
      try {
        const actualDuration = Date.now() - startTimeRef.current;
        console.log('🕐 Duração real calculada:', actualDuration, 'ms');
        const { error: finalizeError } = await supabase
          .from('sessions_live')
          .update({
            completed_at: new Date().toISOString(),
            duration_ms: actualDuration,
            transcript_user: userTranscript || null,
            transcript_ai: aiTranscript || null,
            metadata: {
              completed: true,
              final_user_transcript: userTranscript,
              final_ai_transcript: aiTranscript,
              total_interactions: (userTranscript.split('\n').length + aiTranscript.split('\n').length),
              actual_duration: actualDuration
            }
          })
          .eq('id', currentSessionId);
        if (finalizeError) {
          console.error('❌ Erro ao finalizar sessão:', finalizeError);
        } else {
          console.log('✅ Sessão finalizada com sucesso:', currentSessionId, 'duração:', actualDuration);
        }
      } catch (error) {
        console.error('❌ Erro ao salvar dados finais:', error);
      }
    }
    setStatus("ended");
    // Fechar conexões
    const pc = pcRef.current;
    pc?.getSenders().forEach(s => s.track && s.track.stop());
    pc?.close();
    pcRef.current = null;
    const ls = localStreamRef.current;
    ls?.getTracks().forEach(t => t.stop());
    localStreamRef.current = null;
    if (remoteAudioRef.current) {
      (remoteAudioRef.current as any).srcObject = null;
    }
    // Limpar estado
    dataChannelRef.current = null;
    setCurrentSessionId(null);
    setUserTranscript("");
    setAiTranscript("");
    startTimeRef.current = null;
    lastSavedUserText.current = '';
    lastSavedAiText.current = '';
    turnCounter.current = 0;
  }

  return { 
    startCall, 
    endCall, 
    toggleMute, 
    muted, 
    status,
    remoteAudioElement: remoteAudioRef.current,
    localStream: localStreamRef.current,
    currentSessionId,
    userTranscript,
    aiTranscript
  };
}