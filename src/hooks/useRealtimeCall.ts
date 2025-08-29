import { useEffect, useRef, useState } from "react";

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
  const [status, setStatus] = useState<"idle"|"connecting"|"connected"|"ended">("idle");
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    // cria <audio> invisível para tocar o lado remoto
    const el = document.createElement("audio");
    el.autoplay = true;
    el.style.display = "none";
    document.body.appendChild(el);
    remoteAudioRef.current = el;
    return () => { el.remove(); };
  }, []);

  async function startCall({ track, scenario, systemPrompt, voiceId }: StartOpts) {
    try {
      setStatus("connecting");
      console.log("=== INICIANDO CHAMADA ===");
      console.log("Parâmetros:", { track, scenario, systemPrompt, voiceId });
      
      // 1) token efêmero - usando nova edge function
      console.log("Fazendo requisição para token...");
      const tokenRes = await fetch("https://roboonbdessuipvcpgve.supabase.co/functions/v1/realtime-token", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvYm9vbmJkZXNzdWlwdmNwZ3ZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYyMTA0NDAsImV4cCI6MjA3MTc4NjQ0MH0.lbkilZMpgno7M3NVBhE3P0MoKJEXZIIuLLPCwkN120k",
          "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvYm9vbmJkZXNzdWlwdmNwZ3ZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYyMTA0NDAsImV4cCI6MjA3MTc4NjQ0MH0.lbkilZMpgno7M3NVBhE3P0MoKJEXZIIuLLPCwkN120k"
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

      // 4) datachannel opcional (no futuro p/ eventos)
      pc.createDataChannel("oai-events");

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
      
      // Aguardar 2 segundos e forçar primeira mensagem da IA se ela não falar
      setTimeout(() => {
        console.log("Verificando se IA iniciou conversa automaticamente...");
        // Se ainda não recebeu áudio da IA, força primeira mensagem
        if (status === "connected") {
          console.log("Forçando IA a iniciar conversa...");
          // Enviar um sinal silencioso para ativar a IA (se necessário)
          // A IA deveria iniciar automaticamente com as instruções atualizadas
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

  function endCall() {
    setStatus("ended");
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
  }

  return { 
    startCall, 
    endCall, 
    toggleMute, 
    muted, 
    status,
    remoteAudioElement: remoteAudioRef.current,
    localStream: localStreamRef.current
  };
}