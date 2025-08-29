import { useEffect, useRef, useState } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  life: number
  maxLife: number
  angle: number
  distance: number
  targetDistance: number
}

interface VoiceParticleSystemProps {
  audioLevel: number
  isActive: boolean
  color: 'blue' | 'green'
  width?: number
  height?: number
  className?: string
}

export function VoiceParticleSystem({ 
  audioLevel, 
  isActive, 
  color, 
  width = 300, 
  height = 300,
  className = ""
}: VoiceParticleSystemProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animationRef = useRef<number>()
  const centerX = width / 2
  const centerY = height / 2

  // Cores baseadas na referência
  const colors = {
    blue: {
      primary: '#00BFFF',
      secondary: '#4169E1',
      glow: '#87CEEB',
      core: '#0080FF'
    },
    green: {
      primary: '#00FF7F',
      secondary: '#32CD32',
      glow: '#98FB98',
      core: '#00FF80'
    }
  }

  const currentColors = colors[color]

  // Inicializar partículas
  useEffect(() => {
    const particleCount = 300
    const particles: Particle[] = []

    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2
      const distance = 20 + Math.random() * 40
      
      particles.push({
        x: centerX + Math.cos(angle) * distance,
        y: centerY + Math.sin(angle) * distance,
        vx: (Math.random() - 0.5) * 0.1,
        vy: (Math.random() - 0.5) * 0.1,
        size: 0.5 + Math.random() * 1,
        opacity: 0.4 + Math.random() * 0.6,
        life: Math.random() * 200,
        maxLife: 200 + Math.random() * 300,
        angle: angle,
        distance: distance,
        targetDistance: distance
      })
    }

    particlesRef.current = particles
  }, [centerX, centerY])

  // Loop de animação
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const animate = () => {
      // Clear canvas com trail effect mais sutil
      ctx.fillStyle = 'rgba(0, 0, 0, 0.02)'
      ctx.fillRect(0, 0, width, height)

      const particles = particlesRef.current
      const intensity = isActive ? Math.pow(audioLevel, 0.7) : 0.05
      const baseRadius = 30
      const expandedRadius = baseRadius + (intensity * 60)

      particles.forEach((particle, index) => {
        // Movimento orbital mais responsivo
        particle.angle += (0.002 + intensity * 0.05)
        particle.targetDistance = expandedRadius + Math.sin(particle.life * 0.02) * (10 + intensity * 15)

        // Interpolação mais suave
        particle.distance += (particle.targetDistance - particle.distance) * 0.08

        // Posição orbital com variação
        const orbitalX = centerX + Math.cos(particle.angle) * particle.distance
        const orbitalY = centerY + Math.sin(particle.angle) * particle.distance

        // Movimento mais fluido
        particle.x += (orbitalX - particle.x) * 0.15 + particle.vx
        particle.y += (orbitalY - particle.y) * 0.15 + particle.vy

        // Ruído mais sutil
        particle.vx += (Math.random() - 0.5) * 0.005
        particle.vy += (Math.random() - 0.5) * 0.005
        particle.vx *= 0.98
        particle.vy *= 0.98

        // Vida das partículas
        particle.life += 0.5
        if (particle.life > particle.maxLife) {
          particle.life = 0
          particle.opacity = 0.4 + Math.random() * 0.6
        }

        // Tamanho muito mais responsivo com proteção contra valores negativos
        const baseSize = particle.size * (0.3 + intensity * 1.5)
        const pulseSize = Math.max(0.1, baseSize + Math.sin(particle.life * 0.03) * (0.2 + intensity * 0.5))

        // Desenhar partícula mais refinada
        ctx.save()
        
        // Brilho mais sutil com proteção de raio
        if (intensity > 0.1) {
          const glowRadius = Math.max(1, pulseSize * 2)
          const gradient = ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, glowRadius
          )
          gradient.addColorStop(0, `${currentColors.primary}${Math.floor(particle.opacity * intensity * 180).toString(16).padStart(2, '0')}`)
          gradient.addColorStop(0.7, `${currentColors.glow}${Math.floor(particle.opacity * intensity * 60).toString(16).padStart(2, '0')}`)
          gradient.addColorStop(1, 'transparent')
          
          ctx.fillStyle = gradient
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, glowRadius, 0, Math.PI * 2)
          ctx.fill()
        }

        // Núcleo da partícula menor e mais definido
        ctx.fillStyle = `${currentColors.core}${Math.floor((particle.opacity * (0.6 + intensity * 0.4)) * 255).toString(16).padStart(2, '0')}`
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, Math.max(0.5, pulseSize), 0, Math.PI * 2)
        ctx.fill()

        ctx.restore()

        // Conectar partículas próximas com mais sutileza
        if (intensity > 0.15 && index % 4 === 0) {
          for (let j = index + 1; j < particles.length; j += 8) {
            const other = particles[j]
            const dx = particle.x - other.x
            const dy = particle.y - other.y
            const distance = Math.sqrt(dx * dx + dy * dy)

            if (distance < 40 + intensity * 30) {
              const opacity = (1 - distance / 80) * intensity * 0.15
              ctx.strokeStyle = `${currentColors.secondary}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`
              ctx.lineWidth = 0.5
              ctx.beginPath()
              ctx.moveTo(particle.x, particle.y)
              ctx.lineTo(other.x, other.y)
              ctx.stroke()
            }
          }
        }
      })

      // Núcleo central mais sutil com proteção de raio
      if (intensity > 0.1) {
        const coreSize = Math.max(1, 3 + intensity * 8)
        const coreRadius = Math.max(2, coreSize * 1.5)
        const coreGradient = ctx.createRadialGradient(
          centerX, centerY, 0,
          centerX, centerY, coreRadius
        )
        coreGradient.addColorStop(0, currentColors.core)
        coreGradient.addColorStop(0.5, currentColors.primary + '60')
        coreGradient.addColorStop(1, 'transparent')

        ctx.fillStyle = coreGradient
        ctx.beginPath()
        ctx.arc(centerX, centerY, coreRadius, 0, Math.PI * 2)
        ctx.fill()

        // Núcleo sólido menor
        ctx.fillStyle = currentColors.core + 'CC'
        ctx.beginPath()
        ctx.arc(centerX, centerY, Math.max(1, coreSize * 0.2), 0, Math.PI * 2)
        ctx.fill()
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [audioLevel, isActive, currentColors, width, height, centerX, centerY])

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className={`${className} rounded-full`}
      style={{
        filter: 'blur(0.5px)',
        background: 'radial-gradient(circle, rgba(0,0,0,0.9) 0%, rgba(0,0,0,1) 100%)'
      }}
    />
  )
}