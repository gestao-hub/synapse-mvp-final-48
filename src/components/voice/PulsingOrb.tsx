import React from 'react'
import { useSimpleAudioDetector } from '@/hooks/useSimpleAudioDetector'

interface PulsingOrbProps {
  mediaStream?: MediaStream | null
  audioElement?: HTMLAudioElement | null  
  color?: 'blue' | 'green'
  className?: string
}

export function PulsingOrb({ 
  mediaStream,
  audioElement,
  color = 'blue', 
  className = "" 
}: PulsingOrbProps) {
  // Análise de áudio simplificada e robusta
  const { isActive, level } = useSimpleAudioDetector(mediaStream, audioElement)
  
  // Debug logs detalhados
  console.log(`🔊 PulsingOrb ${color}:`, {
    hasMediaStream: !!mediaStream,
    hasAudioElement: !!audioElement,
    isActive,
    level: Math.round(level * 100),
    timestamp: Date.now()
  })
  
  // Calcular intensidades baseadas no nível real
  const audioIntensity = level
  const bassIntensity = level * 0.8 
  const midIntensity = level * 1.2
  const highIntensity = level * 1.5
  
  // Detectar se há atividade real de voz  
  const isReallyActive = isActive && level > 0.08
  
  // Log quando há atividade
  if (isReallyActive) {
    console.log(`🎤 ANIMAÇÃO ATIVA ${color.toUpperCase()}:`, {
      level: Math.round(level * 100) + '%',
      audioIntensity: Math.round(audioIntensity * 100) + '%'
    })
  }

  const colorClasses = {
    blue: {
      primary: '#3b82f6', // blue-500
      secondary: '#60a5fa', // blue-400
      glow: 'shadow-blue-400/50',
      border: 'border-blue-400/30',
      activeBorder: 'border-blue-400/70',
      gradient: 'from-blue-600 via-blue-500 to-blue-400'
    },
    green: {
      primary: '#10b981', // emerald-500  
      secondary: '#34d399', // emerald-400
      glow: 'shadow-emerald-400/50',
      border: 'border-emerald-400/30',
      activeBorder: 'border-emerald-400/70',
      gradient: 'from-emerald-600 via-emerald-500 to-emerald-400'
    }
  }

  const colors = colorClasses[color]
  // Só animar quando há fala real
  const activityClass = isReallyActive ? 'animate-voice-active' : ''

  return (
    <div 
      className={`relative w-full h-full ${className}`}
      style={{
        // Reatividade ao áudio via CSS custom properties
        '--audio-intensity': audioIntensity,
        '--bass-intensity': bassIntensity,
        '--mid-intensity': midIntensity,
        '--high-intensity': highIntensity
      } as React.CSSProperties}
    >
      {/* Background pulsing gradient - só quando há áudio */}
      {isReallyActive && (
        <div 
          className={`absolute inset-0 rounded-full bg-gradient-radial ${colors.gradient} animate-pulse-slow`} 
          style={{
            opacity: Math.max(0.2, audioIntensity * 0.6),
            transform: `scale(${1 + (bassIntensity * 0.5)})`,
            transition: 'all 0.1s ease-out'
          }}
        />
      )}
      
      {/* Visual debug - sempre mostra quando há áudio */}
      {isReallyActive && (
        <div className="absolute top-2 left-2 bg-black/80 text-white text-xs px-2 py-1 rounded z-10">
          {Math.round(level * 100)}% 
        </div>
      )}
      
      {/* Outer ring - só aparece quando há fala */}
      {isReallyActive && (
        <div 
          className={`absolute inset-2 rounded-full border-2 ${colors.activeBorder} ${activityClass}`}
          style={{
            borderWidth: `${2 + (midIntensity * 4)}px`,
            opacity: audioIntensity
          }}
        >
          {/* Middle ring with particles - só quando há fala */}
          <div className="absolute inset-4 rounded-full">
            {/* Orbital particles - reativos ao áudio */}
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full animate-orbit-particle"
                style={{
                  width: `${6 + (highIntensity * 8)}px`,
                  height: `${6 + (highIntensity * 8)}px`,
                  backgroundColor: colors.secondary,
                  top: '50%',
                  left: '50%',
                  transformOrigin: '0 0',
                  animation: `orbit-particle ${Math.max(1.5, 3 - (audioIntensity * 1.5))}s infinite linear`,
                  animationDelay: `${i * 0.375}s`,
                  opacity: 0.6 + (highIntensity * 0.4)
                }}
              />
            ))}

            {/* Energy waves - só aparecem com áudio real */}
            {audioIntensity > 0.15 && (
              <>
                <div 
                  className={`absolute -inset-2 rounded-full border-2 ${colors.border} animate-wave-1`}
                  style={{
                    opacity: 0.4 + (bassIntensity * 0.4),
                    animationDuration: `${Math.max(1, 2 - (audioIntensity * 0.8))}s`
                  }}
                />
                <div 
                  className={`absolute -inset-4 rounded-full border-2 ${colors.border} animate-wave-2`}
                  style={{
                    opacity: 0.3 + (midIntensity * 0.3),
                    animationDuration: `${Math.max(1.2, 2.5 - (audioIntensity * 0.8))}s`
                  }}
                />
                <div 
                  className={`absolute -inset-6 rounded-full border-2 ${colors.border} animate-wave-3`}
                  style={{
                    opacity: 0.2 + (highIntensity * 0.3),
                    animationDuration: `${Math.max(1.5, 3 - (audioIntensity * 0.8))}s`
                  }}
                />
              </>
            )}
          </div>
        </div>
      )}

      {/* Inner core estático - núcleo sempre visível */}
      <div className="absolute inset-6 rounded-full border border-muted/30 bg-muted/10">
        {/* Core ativo só quando há fala */}
        {isReallyActive && (
          <div 
            className="absolute inset-0 rounded-full animate-core-pulse shadow-2xl"
            style={{
              backgroundColor: colors.primary,
              transform: `scale(${1 + (audioIntensity * 0.5)})`,
              boxShadow: `0 0 ${20 + (audioIntensity * 40)}px ${colors.primary}`
            }}
          >
            <div 
              className="absolute inset-2 rounded-full bg-white/20 animate-inner-glow"
              style={{
                opacity: 0.2 + (audioIntensity * 0.6)
              }}
            />
          </div>
        )}
      </div>

      {/* Floating particles - só quando há fala */}
      {isReallyActive && [...Array(Math.floor(4 + (audioIntensity * 8)))].map((_, i) => (
        <div
          key={`float-${i}`}
          className="absolute rounded-full animate-float-particle"
          style={{
            width: `${2 + (audioIntensity * 3)}px`,
            height: `${2 + (audioIntensity * 3)}px`,
            backgroundColor: colors.secondary,
            top: `${20 + Math.random() * 60}%`,
            left: `${20 + Math.random() * 60}%`,
            animation: `float-particle ${Math.max(1, 2 - (audioIntensity * 0.8))}s infinite ease-in-out`,
            animationDelay: `${i * 0.2}s`,
            opacity: 0.4 + (audioIntensity * 0.5)
          }}
        />
      ))}
    </div>
  )
}