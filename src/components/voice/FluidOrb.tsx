import React, { useEffect, useRef } from 'react'
import { useSimpleAudioDetector } from '@/hooks/useSimpleAudioDetector'

interface FluidOrbProps {
  mediaStream?: MediaStream | null
  audioElement?: HTMLAudioElement | null  
  color?: 'blue' | 'green'
  className?: string
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  opacity: number
  life: number
  maxLife: number
  angle: number
  speed: number
  originalX: number
  originalY: number
}

export function FluidOrb({ 
  mediaStream,
  audioElement,
  color = 'blue', 
  className = "" 
}: FluidOrbProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const particlesRef = useRef<Particle[]>([])
  const { isActive, level } = useSimpleAudioDetector(mediaStream, audioElement)
  
  console.log(`🌊 FluidOrb ${color}:`, {
    hasMediaStream: !!mediaStream,
    hasAudioElement: !!audioElement,
    isActive,
    level: Math.round(level * 100),
    timestamp: Date.now()
  })
  
  const audioIntensity = level
  const isReallyActive = isActive && level > 0.08

  const colors = {
    blue: {
      primary: { r: 59, g: 130, b: 246 },    // blue-500
      secondary: { r: 96, g: 165, b: 250 },  // blue-400
      glow: { r: 147, g: 197, b: 253 }       // blue-300
    },
    green: {
      primary: { r: 16, g: 185, b: 129 },    // emerald-500
      secondary: { r: 52, g: 211, b: 153 },  // emerald-400
      glow: { r: 110, g: 231, b: 183 }       // emerald-300
    }
  }

  const currentColors = colors[color]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Configurar canvas
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * window.devicePixelRatio
      canvas.height = rect.height * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Inicializar partículas
    const initParticles = () => {
      particlesRef.current = []
      const centerX = canvas.width / (2 * window.devicePixelRatio)
      const centerY = canvas.height / (2 * window.devicePixelRatio)
      const particleCount = 150

      for (let i = 0; i < particleCount; i++) {
        const angle = (i / particleCount) * Math.PI * 2
        const radius = 60 + Math.random() * 40
        const x = centerX + Math.cos(angle) * radius
        const y = centerY + Math.sin(angle) * radius

        particlesRef.current.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          radius: 1 + Math.random() * 2,
          opacity: 0.3 + Math.random() * 0.4,
          life: 0,
          maxLife: 60 + Math.random() * 120,
          angle: angle,
          speed: 0.02 + Math.random() * 0.03,
          originalX: x,
          originalY: y
        })
      }
    }

    initParticles()

    // Função de animação
    const animate = () => {
      const rect = canvas.getBoundingClientRect()
      ctx.clearRect(0, 0, rect.width, rect.height)

      const centerX = rect.width / 2
      const centerY = rect.height / 2
      const time = Date.now() * 0.001

      // Atualizar e desenhar partículas
      particlesRef.current.forEach((particle, index) => {
        // Física das partículas baseada no áudio - com diferença drástica entre fala e silêncio
        let audioForce, timeMultiplier, speedMultiplier
        
        if (isReallyActive) {
          // Durante a fala: movimento responsivo à entonação
          audioForce = audioIntensity * 3 // Aumentar sensibilidade ao áudio
          timeMultiplier = 1 + audioIntensity * 2 // Acelerar baseado na intensidade
          speedMultiplier = 1 + audioIntensity * 1.5
        } else {
          // Durante silêncio: movimento MUITO mais lento e sutil
          audioForce = 0.02 // Muito pequeno
          timeMultiplier = 0.1 // 10x mais lento
          speedMultiplier = 0.05 // 20x mais lento
        }

        const waveEffect = Math.sin(time * timeMultiplier + particle.angle * 3) * audioForce * 15
        const pulseEffect = Math.cos(time * timeMultiplier * 1.5 + index * 0.1) * audioForce * 8

        // Movimento orgânico - velocidade baseada no estado
        particle.angle += particle.speed * speedMultiplier
        const targetRadius = 60 + waveEffect + pulseEffect
        const targetX = centerX + Math.cos(particle.angle) * targetRadius
        const targetY = centerY + Math.sin(particle.angle) * targetRadius

        // Suavização mais lenta durante silêncio
        const smoothness = isReallyActive ? 0.08 : 0.01
        particle.x += (targetX - particle.x) * smoothness
        particle.y += (targetY - particle.y) * smoothness

        // Ruído orgânico mais sutil durante silêncio
        const noiseAmplitude = isReallyActive ? audioForce * 3 : 0.5
        particle.x += Math.sin(time * timeMultiplier * 0.8 + index * 0.2) * noiseAmplitude
        particle.y += Math.cos(time * timeMultiplier * 0.6 + index * 0.3) * noiseAmplitude

        // Velocidade adicional baseada na intensidade real da fala
        if (isReallyActive) {
          const intensityVariation = (Math.random() - 0.5) * audioIntensity * 0.2
          particle.vx += intensityVariation
          particle.vy += intensityVariation
        }
        
        // Damping mais forte durante silêncio
        const damping = isReallyActive ? 0.95 : 0.99
        particle.vx *= damping
        particle.vy *= damping

        particle.x += particle.vx * (isReallyActive ? 1 : 0.1)
        particle.y += particle.vy * (isReallyActive ? 1 : 0.1)

        // Atualizar vida da partícula
        particle.life++
        if (particle.life > particle.maxLife) {
          particle.life = 0
          particle.x = particle.originalX
          particle.y = particle.originalY
        }

        // Calcular opacidade baseada no áudio e vida - mais sutil durante silêncio
        const lifeOpacity = 1 - (particle.life / particle.maxLife)
        let audioOpacity
        
        if (isReallyActive) {
          // Durante fala: opacidade reativa à entonação
          audioOpacity = 0.4 + audioIntensity * 0.6
        } else {
          // Durante silêncio: opacidade muito baixa e estável
          audioOpacity = 0.1 + Math.sin(time * 0.5 + index * 0.1) * 0.05
        }
        
        particle.opacity = Math.min(lifeOpacity * audioOpacity, 1)

        // Calcular tamanho baseado no áudio - mais variação durante fala
        let audioSize
        if (isReallyActive) {
          // Tamanho varia com a intensidade da fala
          audioSize = 1 + audioIntensity * 1.8 + Math.sin(time * 5 + index * 0.3) * audioIntensity * 0.5
        } else {
          // Tamanho quase constante durante silêncio
          audioSize = 0.8 + Math.sin(time * 0.3 + index * 0.2) * 0.1
        }
        
        const currentRadius = particle.radius * audioSize

        // Desenhar partícula com glow
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, currentRadius * 3
        )
        
        const alpha = particle.opacity
        gradient.addColorStop(0, `rgba(${currentColors.glow.r}, ${currentColors.glow.g}, ${currentColors.glow.b}, ${alpha})`)
        gradient.addColorStop(0.4, `rgba(${currentColors.primary.r}, ${currentColors.primary.g}, ${currentColors.primary.b}, ${alpha * 0.8})`)
        gradient.addColorStop(1, `rgba(${currentColors.primary.r}, ${currentColors.primary.g}, ${currentColors.primary.b}, 0)`)

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, currentRadius * 3, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()

        // Núcleo da partícula
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, currentRadius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${currentColors.secondary.r}, ${currentColors.secondary.g}, ${currentColors.secondary.b}, ${alpha})`
        ctx.fill()
      })

      // Conectar partículas próximas - só durante fala ativa
      if (isReallyActive && audioIntensity > 0.15) {
        particlesRef.current.forEach((p1, i) => {
          particlesRef.current.slice(i + 1).forEach(p2 => {
            const dx = p1.x - p2.x
            const dy = p1.y - p2.y
            const distance = Math.sqrt(dx * dx + dy * dy)
            
            // Distância de conexão varia com a intensidade da fala
            const connectionDistance = 60 + audioIntensity * 40
            
            if (distance < connectionDistance) {
              // Opacidade baseada na intensidade real da fala
              const opacity = (1 - distance / connectionDistance) * audioIntensity * 0.4
              ctx.beginPath()
              ctx.moveTo(p1.x, p1.y)
              ctx.lineTo(p2.x, p2.y)
              ctx.strokeStyle = `rgba(${currentColors.secondary.r}, ${currentColors.secondary.g}, ${currentColors.secondary.b}, ${opacity})`
              ctx.lineWidth = 0.3 + audioIntensity * 0.7
              ctx.stroke()
            }
          })
        })
      }

      // Efeito de centro reativo à fala
      const baseCoreSize = isReallyActive ? 15 : 5
      const coreSize = baseCoreSize + (isReallyActive ? audioIntensity * 25 : Math.sin(time * 0.5) * 2)
      const coreOpacity = isReallyActive ? audioIntensity * 0.8 : 0.1
      
      if (coreSize > 0 && coreOpacity > 0.05) {
        const coreGradient = ctx.createRadialGradient(
          centerX, centerY, 0,
          centerX, centerY, coreSize
        )
        
        coreGradient.addColorStop(0, `rgba(${currentColors.glow.r}, ${currentColors.glow.g}, ${currentColors.glow.b}, ${coreOpacity})`)
        coreGradient.addColorStop(0.5, `rgba(${currentColors.primary.r}, ${currentColors.primary.g}, ${currentColors.primary.b}, ${coreOpacity * 0.6})`)
        coreGradient.addColorStop(1, `rgba(${currentColors.primary.r}, ${currentColors.primary.g}, ${currentColors.primary.b}, 0)`)

        ctx.beginPath()
        ctx.arc(centerX, centerY, coreSize, 0, Math.PI * 2)
        ctx.fillStyle = coreGradient
        ctx.fill()
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isActive, audioIntensity, color, isReallyActive])

  return (
    <div className={`relative w-full h-full ${className}`}>
      <canvas 
        ref={canvasRef}
        className="w-full h-full"
        style={{ width: '100%', height: '100%' }}
      />
      
      {/* Debug info */}
      {isReallyActive && (
        <div className="absolute top-2 left-2 bg-black/80 text-white text-xs px-2 py-1 rounded z-10">
          {Math.round(level * 100)}% 
        </div>
      )}
    </div>
  )
}