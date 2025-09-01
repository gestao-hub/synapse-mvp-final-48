import { useRef, useState } from "react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function VoiceInterfaceRh() {
  const [recording, setRecording] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [lastUser, setLastUser] = useState<string>("");
  const [lastBot, setLastBot] = useState<string>("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [turns, setTurns] = useState<Array<{user:string; bot:string}>>([]);
  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  async function ensureSession() {
    if (sessionId) return sessionId;
    const { data: { user }, error: uErr } = await supabase.auth.getUser();
    if (uErr || !user) throw new Error("Usuário não autenticado");
    const { data, error } = await supabase.from("sessions").insert({
      user_id: user.id, track: "rh", scenario: "feedback-construtivo"
    }).select("id").single();
    if (error) throw error;
    setSessionId(data.id);
    return data.id;
  }

  async function start() {
    try {
      await ensureSession();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream, { mimeType: "audio/webm;codecs=opus" });
      chunksRef.current = [];
      rec.ondataavailable = (e) => e.data.size && chunksRef.current.push(e.data);
      rec.onstop = onStop;
      rec.start();
      mediaRef.current = rec;
      setRecording(true);
    } catch (e:any) {
      toast({ variant: "destructive", title: "Microfone/Sessão", description: e.message });
    }
  }

  function stop() {
    mediaRef.current?.stop();
    mediaRef.current?.stream.getTracks().forEach(t => t.stop());
    setRecording(false);
  }

  async function onStop() {
    try {
      setThinking(true);
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      const fd = new FormData();
      fd.append("audio", blob, "user.webm");

      console.log('🎤 Enviando áudio para processamento:', blob.size, 'bytes')
      
      const { data, error } = await supabase.functions.invoke('rh-voice-turn', {
        body: fd
      })
      
      if (error) {
        console.error('❌ Erro na Edge Function:', error)
        throw error
      }
      
      const json = data
      console.log('✅ Resposta recebida:', json)

      const userText = json.transcript || "";
      const botText  = json.assistantText || "";
      setLastUser(userText); setLastBot(botText);
      setTurns(prev => [...prev, { user: userText, bot: botText }]);

      const sid = await ensureSession();
      if (userText) await supabase.from("messages").insert({ session_id: sid, role: "user", content: userText });
      if (botText)  await supabase.from("messages").insert({ session_id: sid, role: "assistant", content: botText });

      if (json.audioBase64) {
        const bytes = Uint8Array.from(atob(json.audioBase64), c => c.charCodeAt(0));
        const mp3 = new Blob([bytes], { type: "audio/mpeg" });
        const url = URL.createObjectURL(mp3);
        const audio = new Audio(url);
        audio.play().catch(() => console.warn("Autoplay bloqueado — clique para tocar."));
        audio.onended = () => URL.revokeObjectURL(url);
      }
    } catch (e:any) {
      toast({ variant: "destructive", title: "Erro", description: e.message });
    } finally {
      setThinking(false);
    }
  }

  async function finish() {
    try {
      const sid = await ensureSession();
      const transcript = turns.map(t => `Você: ${t.user}\nIA: ${t.bot}`).join("\n");

      const { data: scored, error: scoreError } = await supabase.functions.invoke('rh-score-session', {
        body: { transcript }
      })
      
      if (scoreError) throw new Error(scoreError.message || "Falha no score")

      await supabase.from("sessions").update({
        finished_at: new Date().toISOString(),
        score: scored.score ?? null,
        metrics: scored.metrics ?? null,
        transcript
      }).eq("id", sid);

      toast({ title: "Simulação finalizada!", description: `Score: ${scored.score ?? "—"}` });
    } catch (e:any) {
      toast({ variant: "destructive", title: "Finalização", description: e.message });
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        {!recording ? <button onClick={start} className="btn-primary">🎙️ Iniciar</button>
                    : <button onClick={stop} className="btn-secondary">⏹️ Parar</button>}
        <button onClick={finish} className="btn-secondary" disabled={!sessionId || thinking}>✅ Finalizar simulação</button>
        {thinking && <span className="text-white/70">Processando…</span>}
      </div>

      <div className="rounded-xl p-4 bg-white/5 space-y-3">
        <div>
          <div className="text-white/60 text-sm">Você</div>
          <div className="text-white whitespace-pre-wrap">{lastUser || "Fale algo para começar…"}</div>
        </div>
        <div>
          <div className="text-white/60 text-sm">IA (RH)</div>
          <div className="text-white whitespace-pre-wrap">{lastBot || "Aguardando sua fala…"}</div>
        </div>
      </div>
    </div>
  );
}