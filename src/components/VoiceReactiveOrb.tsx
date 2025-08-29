import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface VoiceReactiveOrbProps {
  className?: string;
  size?: number;
}

const VoiceReactiveOrb: React.FC<VoiceReactiveOrbProps> = ({ 
  className = '', 
  size = 300 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  const [isListening, setIsListening] = useState(false);
  const [audioIntensity, setAudioIntensity] = useState(0);
  const [frequencyData, setFrequencyData] = useState<number[]>([]);
  
  const { toast } = useToast();

  const startListening = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 44100,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: false,
          autoGainControl: true
        }
      });
      
      streamRef.current = stream;
      audioContextRef.current = new AudioContext({ sampleRate: 44100 });
      analyserRef.current = audioContextRef.current.createAnalyser();
      
      analyserRef.current.fftSize = 256;
      analyserRef.current.smoothingTimeConstant = 0.8;
      
      microphoneRef.current = audioContextRef.current.createMediaStreamSource(stream);
      microphoneRef.current.connect(analyserRef.current);
      
      setIsListening(true);
      
      toast({
        title: "Microfone ativado",
        description: "A esfera agora reage à sua voz",
      });
    } catch (error) {
      console.error('Erro ao acessar microfone:', error);
      toast({
        title: "Erro",
        description: "Não foi possível acessar o microfone",
        variant: "destructive",
      });
    }
  }, [toast]);

  const stopListening = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (microphoneRef.current) {
      microphoneRef.current.disconnect();
      microphoneRef.current = null;
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    
    analyserRef.current = null;
    setIsListening(false);
    setAudioIntensity(0);
    setFrequencyData([]);
    
    toast({
      title: "Microfone desativado",
      description: "A esfera voltou ao modo padrão",
    });
  }, [toast]);

  const analyzeAudio = useCallback(() => {
    if (!analyserRef.current) return;
    
    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyserRef.current.getByteFrequencyData(dataArray);
    
    // Calcular intensidade média
    const average = dataArray.reduce((sum, value) => sum + value, 0) / bufferLength;
    const normalizedIntensity = Math.min(average / 128, 1);
    
    // Extrair frequências para diferentes efeitos
    const lowFreq = dataArray.slice(0, 8).reduce((sum, val) => sum + val, 0) / 8;
    const midFreq = dataArray.slice(8, 24).reduce((sum, val) => sum + val, 0) / 16;
    const highFreq = dataArray.slice(24, 64).reduce((sum, val) => sum + val, 0) / 40;
    
    setAudioIntensity(normalizedIntensity);
    setFrequencyData([lowFreq / 255, midFreq / 255, highFreq / 255]);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = size;
    canvas.height = size;

    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size * 0.4;

    // Inicializar partículas
    const particles: Array<{
      x: number;
      y: number;
      baseSize: number;
      opacity: number;
      vx: number;
      vy: number;
      pulseOffset: number;
    }> = [];

    for (let i = 0; i < 180; i++) {
      const angle = Math.random() * Math.PI * 2;
      const randomFactor = Math.pow(Math.random(), 2.5);
      const distance = randomFactor * radius * 0.85;
      const x = centerX + Math.cos(angle) * distance;
      const y = centerY + Math.sin(angle) * distance;
      
      particles.push({
        x,
        y,
        baseSize: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.6 + 0.3,
        vx: (Math.random() - 0.5) * 0.1, // Reduzido de 0.2 para 0.1 - velocidade base mais lenta
        vy: (Math.random() - 0.5) * 0.1, // Reduzido de 0.2 para 0.1 - velocidade base mais lenta
        pulseOffset: Math.random() * Math.PI * 2
      });
    }

    const animate = () => {
      if (isListening && analyserRef.current) {
        analyzeAudio();
      }

      const time = Date.now() * 0.001;
      
      // Calcular intensidade baseada no áudio
      const voiceIntensity = isListening ? audioIntensity : 0;
      const basePulse = 1 + Math.sin(time * 2) * 0.1;
      const voicePulse = 1 + voiceIntensity * 0.8;
      const currentPulse = basePulse * voicePulse;
      
      // Frequências para efeitos diferentes
      const [lowFreq = 0, midFreq = 0, highFreq = 0] = frequencyData;
      
      ctx.clearRect(0, 0, size, size);

      // Gradiente das bordas
      const borderGradient = ctx.createLinearGradient(
        centerX - radius * 0.7, centerY - radius * 0.7,
        centerX + radius * 0.7, centerY + radius * 0.7
      );
      borderGradient.addColorStop(0, '#00FFFF');
      borderGradient.addColorStop(0.4, '#00AAFF');
      borderGradient.addColorStop(0.8, 'rgba(138, 43, 226, 0.4)');
      borderGradient.addColorStop(1, 'rgba(138, 43, 226, 0.2)');

      // Parâmetros de onda baseados no áudio
      const waveFrequency = 8 + voiceIntensity * 12;
      const waveAmplitude = 4 + voiceIntensity * 15 + lowFreq * 8;
      
      // Bordas externas onduladas (reagindo ao áudio)
      for (let i = 2; i < 8; i++) {
        ctx.save();
        ctx.globalAlpha = (0.25 - i * 0.02) * (1 + voiceIntensity * 0.5);
        ctx.strokeStyle = borderGradient;
        ctx.lineWidth = 4 + i * 2;
        ctx.shadowColor = voiceIntensity > 0.1 ? '#00FFFF' : '#00AAFF';
        ctx.shadowBlur = (25 + i * 10) * currentPulse;
        ctx.filter = `blur(${i * 2 * currentPulse}px)`;
        
        ctx.beginPath();
        for (let angle = 0; angle <= Math.PI * 2; angle += 0.1) {
          const wave1 = Math.sin(angle * waveFrequency + time * 3) * waveAmplitude;
          const wave2 = Math.cos(angle * (waveFrequency * 0.7) + time * 2.5) * (waveAmplitude * 0.6);
          const waveRadius = (radius + i * 3) * currentPulse + wave1 + wave2;
          
          const x = centerX + Math.cos(angle) * waveRadius;
          const y = centerY + Math.sin(angle) * waveRadius;
          
          if (angle === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
      }

      // Bordas internas (círculos perfeitos)
      for (let i = 0; i < 2; i++) {
        ctx.save();
        ctx.globalAlpha = (0.25 - i * 0.02) * (1 + voiceIntensity * 0.3);
        ctx.strokeStyle = borderGradient;
        ctx.lineWidth = 4 + i * 2;
        ctx.shadowColor = voiceIntensity > 0.1 ? '#00FFFF' : '#00AAFF';
        ctx.shadowBlur = (25 + i * 10) * currentPulse;
        ctx.filter = `blur(${i * 2 * currentPulse}px)`;
        ctx.beginPath();
        ctx.arc(centerX, centerY, (radius + i * 3) * currentPulse, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // Borda principal (círculo perfeito)
      ctx.save();
      ctx.globalAlpha = 0.8 + voiceIntensity * 0.2;
      ctx.strokeStyle = borderGradient;
      ctx.lineWidth = 2 + voiceIntensity * 2;
      ctx.shadowColor = '#00FFFF';
      ctx.shadowBlur = 15 * currentPulse;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * currentPulse, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Partículas reativas ao áudio (movimento bem mais suave)
      particles.forEach(particle => {
        const speedMultiplier = 1 + voiceIntensity * 0.3 + midFreq * 0.2; // Reduzido ainda mais para 0.3 e 0.2
        particle.x += particle.vx * speedMultiplier;
        particle.y += particle.vy * speedMultiplier;

        const dx = particle.x - centerX;
        const dy = particle.y - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > radius * 0.9) {
          particle.vx *= -0.5;
          particle.vy *= -0.5;
        }

        const distanceFromCenter = distance / radius;
        const baseOpacity = 0.7 - distanceFromCenter * 0.4;
        const pulseValue = Math.sin(time * 1.5 + particle.pulseOffset) * 0.2; // Reduzido ainda mais para time * 1.5 e 0.2
        particle.opacity = baseOpacity + pulseValue + voiceIntensity * 0.2; // Reduzido de 0.3 para 0.2
        
        const pulseFactor = 1 + Math.sin(time * 2.5 + particle.pulseOffset) * (0.15 + voiceIntensity * 0.2); // Reduzido ainda mais
        const dynamicSize = particle.baseSize * (1.2 - distanceFromCenter * 0.4) * pulseFactor * currentPulse * (1 + highFreq * 0.2); // Reduzido para 0.2

        ctx.save();
        ctx.globalAlpha = Math.max(0.1, Math.min(1, particle.opacity));
        ctx.fillStyle = voiceIntensity > 0.1 ? '#00FFFF' : '#00AAFF';
        ctx.shadowColor = voiceIntensity > 0.1 ? '#00FFFF' : '#00AAFF';
        ctx.shadowBlur = 8 + voiceIntensity * 12;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, Math.max(0.3, dynamicSize), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Sombra de profundidade
      const shadowGradient = ctx.createRadialGradient(
        centerX * 1.3, centerY * 1.3, 0,
        centerX, centerY, radius
      );
      shadowGradient.addColorStop(0, 'rgba(0, 0, 0, 0.6)');
      shadowGradient.addColorStop(1, 'transparent');

      ctx.save();
      ctx.globalAlpha = 0.3;
      ctx.fillStyle = shadowGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 0.9, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [size, isListening, audioIntensity, frequencyData, analyzeAudio]);

  useEffect(() => {
    return () => {
      stopListening();
    };
  }, [stopListening]);

  return (
    <div className={`relative ${className}`}>
      <div className="flex flex-col items-center gap-4">
        <canvas
          ref={canvasRef}
          className="block transition-all duration-300"
          style={{
            background: isListening 
              ? 'radial-gradient(circle, #3A0060 0%, #1A1A70 100%)' 
              : 'radial-gradient(circle, #2F0050 0%, #191970 100%)',
            borderRadius: '50%',
            filter: isListening 
              ? `drop-shadow(0 0 ${30 + audioIntensity * 40}px rgba(0, 255, 255, ${0.3 + audioIntensity * 0.4}))` 
              : 'drop-shadow(0 0 30px rgba(0, 255, 255, 0.3))'
          }}
        />
        
        {isListening && (
          <div className="text-center text-white/80 text-sm">
            <p>🎤 Microfone ativo - a esfera reage à sua voz</p>
            <p className="text-xs text-white/60 mt-1">
              Intensidade: {Math.round(audioIntensity * 100)}%
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceReactiveOrb;