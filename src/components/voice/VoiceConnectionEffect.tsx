import { useEffect, useRef } from 'react'

interface VoiceConnectionEffectProps {
  isActive: boolean
  intensity?: number
  className?: string
}

export function VoiceConnectionEffect({ isActive, intensity = 0.5, className = "" }: VoiceConnectionEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    let time = 0

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      if (isActive) {
        time += 0.02
        const pulseIntensity = 0.5 + intensity * 0.5 + Math.sin(time * 2) * 0.2

        // Ondas concêntricas
        for (let i = 0; i < 5; i++) {
          const radius = (20 + i * 15) * pulseIntensity
          const opacity = (1 - i * 0.2) * intensity * 0.3

          ctx.beginPath()
          ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
          ctx.strokeStyle = `rgba(147, 51, 234, ${opacity})`
          ctx.lineWidth = 2
          ctx.stroke()
        }

        // Partículas flutuantes
        for (let i = 0; i < 8; i++) {
          const angle = (i / 8) * Math.PI * 2 + time
          const distance = 40 + Math.sin(time + i) * 10
          const x = centerX + Math.cos(angle) * distance
          const y = centerY + Math.sin(angle) * distance
          const size = 2 + Math.sin(time * 3 + i) * 1

          ctx.beginPath()
          ctx.arc(x, y, size, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(147, 51, 234, ${intensity * 0.6})`
          ctx.fill()
        }
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isActive, intensity])

  return (
    <canvas
      ref={canvasRef}
      width={200}
      height={200}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ opacity: isActive ? 1 : 0, transition: 'opacity 0.3s ease' }}
    />
  )
}