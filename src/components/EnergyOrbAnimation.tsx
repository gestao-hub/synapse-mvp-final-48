import { useEffect, useRef, useState } from 'react'

interface Particle {
  x: number
  y: number
  size: number
  opacity: number
  vx: number
  vy: number
  baseSize: number
  pulseOffset: number
}

interface EnergyOrbAnimationProps {
  className?: string
  size?: number
}

const EnergyOrbAnimation = ({ className = '', size = 300 }: EnergyOrbAnimationProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animationRef = useRef<number>()
  const [isHovered, setIsHovered] = useState(false)
  const [pulseIntensity, setPulseIntensity] = useState(1)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = size
    canvas.height = size

    const centerX = size / 2
    const centerY = size / 2
    const radius = size * 0.4

    // Initialize particles with center-concentrated distribution
    const initParticles = () => {
      particlesRef.current = []
      for (let i = 0; i < 180; i++) {
        const angle = Math.random() * Math.PI * 2
        // Use power distribution to concentrate particles in center
        const randomFactor = Math.pow(Math.random(), 2.5) // Higher power = more concentration
        const distance = randomFactor * radius * 0.85
        const x = centerX + Math.cos(angle) * distance
        const y = centerY + Math.sin(angle) * distance
        
        particlesRef.current.push({
          x,
          y,
          size: Math.random() * 1.5 + 0.5, // Much smaller particles
          baseSize: Math.random() * 1.5 + 0.5,
          opacity: Math.random() * 0.6 + 0.3,
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.2,
          pulseOffset: Math.random() * Math.PI * 2
        })
      }
    }

    const animate = () => {
      const time = Date.now() * 0.001
      const currentPulse = isHovered ? 1.5 + Math.sin(time * 8) * 0.3 : 1 + Math.sin(time * 2) * 0.1
      ctx.clearRect(0, 0, size, size)

      // Create linear gradient from top-left (cyan) to bottom-right (purple)
      const borderGradient = ctx.createLinearGradient(
        centerX - radius * 0.7, centerY - radius * 0.7, // top-left 
        centerX + radius * 0.7, centerY + radius * 0.7  // bottom-right
      )
      borderGradient.addColorStop(0, '#00FFFF') // bright cyan at top-left
      borderGradient.addColorStop(0.4, '#00AAFF') 
      borderGradient.addColorStop(0.8, 'rgba(138, 43, 226, 0.4)') // translucent purple
      borderGradient.addColorStop(1, 'rgba(138, 43, 226, 0.2)') // very translucent purple

      // Draw vibrating/pulsing border with sound wave effect
      const waveFrequency = isHovered ? 16 : 8
      const waveAmplitude = isHovered ? 8 : 4
      
      // Draw multiple glow layers for diffused effect (wavy for outer layers)
      for (let i = 0; i < (isHovered ? 8 : 5); i++) {
        ctx.save()
        ctx.globalAlpha = (isHovered ? 0.25 : 0.15) - i * 0.02
        ctx.strokeStyle = borderGradient
        ctx.lineWidth = 4 + i * 2
        ctx.shadowColor = isHovered ? '#00FFFF' : '#00AAFF'
        ctx.shadowBlur = (25 + i * 10) * currentPulse
        ctx.filter = `blur(${i * 2 * currentPulse}px)`
        
        // Apply wave effect only to outer glow layers (i > 1)
        if (i > 1) {
          // Create wavy border path for outer glow
          ctx.beginPath()
          for (let angle = 0; angle <= Math.PI * 2; angle += 0.1) {
            const wave1 = Math.sin(angle * waveFrequency + time * 3) * waveAmplitude
            const wave2 = Math.cos(angle * (waveFrequency * 0.7) + time * 2.5) * (waveAmplitude * 0.6)
            const waveRadius = (radius + i * 3) * currentPulse + wave1 + wave2
            
            const x = centerX + Math.cos(angle) * waveRadius
            const y = centerY + Math.sin(angle) * waveRadius
            
            if (angle === 0) {
              ctx.moveTo(x, y)
            } else {
              ctx.lineTo(x, y)
            }
          }
          ctx.closePath()
        } else {
          // Inner glow layers remain circular
          ctx.beginPath()
          ctx.arc(centerX, centerY, (radius + i * 3) * currentPulse, 0, Math.PI * 2)
        }
        
        ctx.stroke()
        ctx.restore()
      }

      // Draw main crisp border (perfect circle)
      ctx.save()
      ctx.globalAlpha = isHovered ? 1 : 0.8
      ctx.strokeStyle = borderGradient
      ctx.lineWidth = isHovered ? 3 : 2
      ctx.shadowColor = '#00FFFF'
      ctx.shadowBlur = 15 * currentPulse
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius * currentPulse, 0, Math.PI * 2)
      ctx.stroke()
      ctx.restore()

      // Update and draw particles
      particlesRef.current.forEach(particle => {
        // Enhanced movement speed when hovered
        const speedMultiplier = isHovered ? 2 : 1
        particle.x += particle.vx * speedMultiplier
        particle.y += particle.vy * speedMultiplier

        // Keep particles within the circle
        const dx = particle.x - centerX
        const dy = particle.y - centerY
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance > radius * 0.9) {
          particle.vx *= -0.5
          particle.vy *= -0.5
        }

        // Enhanced particle properties for organic look
        const distanceFromCenter = Math.sqrt(dx * dx + dy * dy) / radius
        const baseOpacity = 0.7 - distanceFromCenter * 0.4
        const pulseValue = Math.sin(time * 3 + particle.pulseOffset) * 0.4
        particle.opacity = baseOpacity + pulseValue + (isHovered ? 0.3 : 0)
        
        // Dynamic size with pulsing effect
        const pulseFactor = 1 + Math.sin(time * 4 + particle.pulseOffset) * (isHovered ? 0.6 : 0.2)
        const dynamicSize = particle.baseSize * (1.2 - distanceFromCenter * 0.4) * pulseFactor * currentPulse

        // Draw particle with enhanced glow when hovered
        ctx.save()
        ctx.globalAlpha = Math.max(0.1, Math.min(1, particle.opacity))
        ctx.fillStyle = isHovered ? '#00FFFF' : '#00AAFF'
        ctx.shadowColor = isHovered ? '#00FFFF' : '#00AAFF'
        ctx.shadowBlur = isHovered ? 15 : 8
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, Math.max(0.3, dynamicSize), 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      })

      // Add depth shadow in bottom right
      const shadowGradient = ctx.createRadialGradient(
        centerX * 1.3, centerY * 1.3, 0,
        centerX, centerY, radius
      )
      shadowGradient.addColorStop(0, 'rgba(0, 0, 0, 0.6)')
      shadowGradient.addColorStop(1, 'transparent')

      ctx.save()
      ctx.globalAlpha = 0.3
      ctx.fillStyle = shadowGradient
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius * 0.9, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()

      animationRef.current = requestAnimationFrame(animate)
    }

    initParticles()
    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [size])

  return (
    <div 
      className={`relative cursor-pointer transition-transform duration-300 ${isHovered ? 'scale-105' : ''} ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <canvas
        ref={canvasRef}
        className="block transition-all duration-300"
        style={{
          background: isHovered 
            ? 'radial-gradient(circle, #3A0060 0%, #1A1A70 100%)' 
            : 'radial-gradient(circle, #2F0050 0%, #191970 100%)',
          borderRadius: '50%',
          filter: isHovered 
            ? 'drop-shadow(0 0 50px rgba(0, 255, 255, 0.6))' 
            : 'drop-shadow(0 0 30px rgba(0, 255, 255, 0.3))'
        }}
      />
    </div>
  )
}

export default EnergyOrbAnimation
