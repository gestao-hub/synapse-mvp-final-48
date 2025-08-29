import React from 'react'
import { useSimpleAudioDetector } from '@/hooks/useSimpleAudioDetector'

interface SiriLikeOrbProps {
  mediaStream?: MediaStream | null
  audioElement?: HTMLAudioElement | null  
  color?: 'blue' | 'green'
  className?: string
}

export function SiriLikeOrb({ 
  mediaStream,
  audioElement,
  color = 'blue', 
  className = "" 
}: SiriLikeOrbProps) {
  const { isActive, level } = useSimpleAudioDetector(mediaStream, audioElement)
  
  console.log(`🎵 SiriLikeOrb ${color}:`, {
    hasMediaStream: !!mediaStream,
    hasAudioElement: !!audioElement,
    isActive,
    level: Math.round(level * 100),
    timestamp: Date.now()
  })
  
  // Calcular intensidades baseadas no nível real
  const audioIntensity = level
  const isReallyActive = isActive && level > 0.08
  
  const colorClasses = {
    blue: {
      primary: 'hsl(var(--primary))',
      secondary: 'hsl(var(--primary) / 0.8)',
      gradient: 'from-primary via-primary/80 to-primary/60',
      glow: 'shadow-primary/50'
    },
    green: {
      primary: 'hsl(142 76% 36%)', // emerald-600
      secondary: 'hsl(142 76% 36% / 0.8)',
      gradient: 'from-emerald-600 via-emerald-500 to-emerald-400',
      glow: 'shadow-emerald-500/50'
    }
  }

  const colors = colorClasses[color]

  return (
    <div 
      className={`relative w-full h-full flex items-center justify-center ${className}`}
      style={{
        '--audio-intensity': audioIntensity,
        '--audio-level': level
      } as React.CSSProperties}
    >
      {/* Container principal das ondas */}
      <div className="relative w-32 h-32 md:w-40 md:h-40">
        
        {/* Ondas Siri-like - só aparecem quando há áudio */}
        {isReallyActive && (
          <>
            {/* Onda central principal */}
            <div 
              className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2`}
              style={{
                width: `${60 + (audioIntensity * 120)}px`,
                height: `${8 + (audioIntensity * 16)}px`,
                backgroundColor: colors.primary,
                borderRadius: '50px',
                animation: `siri-wave-1 ${Math.max(0.5, 1.5 - (audioIntensity * 0.8))}s ease-in-out infinite`,
                opacity: 0.9
              }}
            />
            
            {/* Ondas laterais */}
            {[...Array(6)].map((_, i) => {
              const offset = (i - 2.5) * 25
              const delay = i * 0.1
              const heightMultiplier = Math.max(0.3, 1 - Math.abs(i - 2.5) * 0.2)
              
              return (
                <div
                  key={i}
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                  style={{
                    width: `${20 + (audioIntensity * 60)}px`,
                    height: `${(4 + (audioIntensity * 12)) * heightMultiplier}px`,
                    backgroundColor: colors.secondary,
                    borderRadius: '50px',
                    transform: `translate(calc(-50% + ${offset}px), -50%)`,
                    animation: `siri-wave-${(i % 3) + 1} ${Math.max(0.6, 1.8 - (audioIntensity * 0.9))}s ease-in-out infinite`,
                    animationDelay: `${delay}s`,
                    opacity: 0.6 + (audioIntensity * 0.3)
                  }}
                />
              )
            })}

            {/* Ondas de fundo mais sutis */}
            {[...Array(4)].map((_, i) => {
              const offset = (i - 1.5) * 40
              const delay = i * 0.15
              
              return (
                <div
                  key={`bg-${i}`}
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                  style={{
                    width: `${15 + (audioIntensity * 40)}px`,
                    height: `${2 + (audioIntensity * 8)}px`,
                    backgroundColor: colors.secondary,
                    borderRadius: '50px',
                    transform: `translate(calc(-50% + ${offset}px), -50%)`,
                    animation: `siri-wave-bg ${Math.max(0.8, 2.2 - (audioIntensity * 1.0))}s ease-in-out infinite`,
                    animationDelay: `${delay}s`,
                    opacity: 0.4 + (audioIntensity * 0.2)
                  }}
                />
              )
            })}

            {/* Partículas flutuantes */}
            {audioIntensity > 0.3 && [...Array(Math.floor(3 + (audioIntensity * 6)))].map((_, i) => (
              <div
                key={`particle-${i}`}
                className="absolute rounded-full"
                style={{
                  width: `${2 + (audioIntensity * 4)}px`,
                  height: `${2 + (audioIntensity * 4)}px`,
                  backgroundColor: colors.secondary,
                  top: `${30 + Math.random() * 40}%`,
                  left: `${30 + Math.random() * 40}%`,
                  animation: `siri-particle ${Math.max(1, 2.5 - (audioIntensity * 1.2))}s ease-in-out infinite`,
                  animationDelay: `${i * 0.3}s`,
                  opacity: 0.5 + (audioIntensity * 0.4)
                }}
              />
            ))}
          </>
        )}

        {/* Estado inativo - apenas um ponto central */}
        {!isReallyActive && (
          <div 
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full transition-all duration-500"
            style={{
              backgroundColor: colors.primary,
              opacity: 0.6
            }}
          />
        )}

        {/* Debug info */}
        {isReallyActive && (
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded z-10">
            {Math.round(level * 100)}%
          </div>
        )}
      </div>
    </div>
  )
}