import { useEffect, useRef } from 'react'
import { useAudioAnalyser, SourceMode } from '@/hooks/useAudioAnalyser'

interface ReactiveOrbProps {
  mode: SourceMode
  audioElement?: HTMLAudioElement | null
  className?: string
  color?: 'blue' | 'green'
}

export function ReactiveOrb({ mode, audioElement, className = "", color = 'blue' }: ReactiveOrbProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const { ready, level, bands, resumeAudio } = useAudioAnalyser({ mode, audioElement })

  // Color schemes
  const colors = {
    blue: {
      primary: '#00D2FF',
      secondary: '#0B78FF',
      glow: '#AADDCFF',
      core: '#00E0FF'
    },
    green: {
      primary: '#00FF7F',
      secondary: '#32CD32',
      glow: '#AAFFCC',
      core: '#00FF80'
    }
  }

  const currentColors = colors[color]

  useEffect(() => {
    const cv = canvasRef.current
    if (!cv) return
    
    const ctx = cv.getContext('2d', { alpha: true })
    if (!ctx) return

    let raf: number
    const DPR = window.devicePixelRatio || 1

    function resize() {
      const { width, height } = cv.getBoundingClientRect()
      cv.width = Math.floor(width * DPR)
      cv.height = Math.floor(height * DPR)
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0)
    }

    const ro = new ResizeObserver(resize)
    ro.observe(cv)
    resize()

    // MUITO mais partículas para movimento intenso
    const particleCount = window.innerWidth < 768 ? 75 : 150
    const particles = Array.from({ length: particleCount }, (_, i) => ({
      angle: (i / particleCount) * Math.PI * 2,
      radius: 40 + Math.random() * 120,
      baseRadius: 40 + Math.random() * 120,
      size: 0.3 + Math.random() * 3,
      speed: 0.003 + Math.random() * 0.02,
      phase: Math.random() * Math.PI * 2,
      pulsePhase: Math.random() * Math.PI * 2,
      life: Math.random() * Math.PI * 2,
      spiralSpeed: 0.001 + Math.random() * 0.005,
      spiralRadius: Math.random() * 30
    }))

    // Sistema de ondas concêntricas dinâmicas
    const waves = Array.from({ length: 8 }, (_, i) => ({
      radius: 0,
      maxRadius: 120 + i * 40,
      speed: 1.5 + i * 0.3,
      alpha: 0,
      active: false,
      startTime: 0
    }))

    // Partículas de energia que explodem
    const energyParticles = Array.from({ length: 50 }, () => ({
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      life: 0,
      maxLife: 0,
      size: 0,
      active: false
    }))

    let t = 0
    let waveSpawnTimer = 0
    let energyBurstTimer = 0

    function spawnEnergyBurst(centerX: number, centerY: number, intensity: number) {
      for (let i = 0; i < 10; i++) {
        const particle = energyParticles.find(p => !p.active)
        if (particle) {
          particle.x = centerX
          particle.y = centerY
          const angle = Math.random() * Math.PI * 2
          const speed = 2 + Math.random() * 6 * intensity
          particle.vx = Math.cos(angle) * speed
          particle.vy = Math.sin(angle) * speed
          particle.life = 0
          particle.maxLife = 30 + Math.random() * 40
          particle.size = 1 + Math.random() * 3 * intensity
          particle.active = true
        }
      }
    }

    function draw() {
      const w = cv.clientWidth
      const h = cv.clientHeight
      const cx = w / 2
      const cy = h / 2

      ctx.clearRect(0, 0, w, h)

      // Audio reactive values with enhanced fallback
      const amp = ready ? Math.max(level, 0.05) : 0.15 + 0.1 * Math.sin(t * 0.01)
      const low = ready ? Math.max(bands.low, 0.02) : 0.1 + 0.05 * Math.sin(t * 0.008)
      const mid = ready ? Math.max(bands.mid, 0.02) : 0.08 + 0.04 * Math.sin(t * 0.012)
      const high = ready ? Math.max(bands.high, 0.02) : 0.06 + 0.03 * Math.sin(t * 0.016)
      
      // Detectar se há fala ativa - sempre true para demonstração das animações
      const isActive = ready ? amp > 0.12 : true // Forçar sempre ativo para mostrar animações
      const isSuperActive = ready ? amp > 0.4 : Math.sin(t * 0.005) > 0.5

      // Fundo pulsante mais intenso
      const bgRadius = Math.max(w, h) * 0.9
      const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, bgRadius)
      const bgIntensity = isActive ? 0.4 + amp * 0.6 : 0.15
      const bgPulse = 0.05 * Math.sin(t * 0.008) + 0.1 * Math.sin(t * 0.015)
      bg.addColorStop(0, `${currentColors.secondary}${Math.floor((bgIntensity + bgPulse) * 255).toString(16).padStart(2, '0')}`)
      bg.addColorStop(0.5, `${currentColors.secondary}${Math.floor((bgIntensity * 0.3) * 255).toString(16).padStart(2, '0')}`)
      bg.addColorStop(1, 'transparent')
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, w, h)

      // Núcleo com pulsação muito mais intensa
      const breathing = 0.3 * Math.sin(t * 0.006) + 0.2 * Math.sin(t * 0.012)
      const baseR = Math.min(w, h) * 0.11
      const reactiveGrowth = isActive ? (0.8 * amp + 0.4 * Math.sin(t * 0.02)) : 0.2
      const r = baseR * (1 + reactiveGrowth + breathing)

      // Gradiente do núcleo ultra dinâmico
      const coreIntensity = isActive ? 1.2 + amp * 0.8 : 0.7
      const grad = ctx.createRadialGradient(cx, cy, r * 0.05, cx, cy, r * 1.8)
      grad.addColorStop(0, `rgba(255, 255, 255, ${isSuperActive ? 0.8 : 0.3})`)
      grad.addColorStop(0.2, currentColors.primary)
      grad.addColorStop(0.5, currentColors.secondary)
      grad.addColorStop(0.8, `${currentColors.secondary}${Math.floor(0.5 * coreIntensity * 255).toString(16).padStart(2, '0')}`)
      grad.addColorStop(1, 'transparent')
      
      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.arc(cx, cy, r, 0, Math.PI * 2)
      ctx.fill()

      // Sistema de ondas expansivas quando há fala
      if (isActive) {
        waveSpawnTimer += 16.666
        if (waveSpawnTimer > (isSuperActive ? 100 : 180)) {
          const inactiveWave = waves.find(w => !w.active)
          if (inactiveWave) {
            inactiveWave.radius = r * 0.5
            inactiveWave.alpha = 0.6 + amp * 0.4
            inactiveWave.active = true
            inactiveWave.startTime = t
          }
          waveSpawnTimer = 0
        }

        // Explosões de energia em picos de áudio
        if (isSuperActive) {
          energyBurstTimer += 16.666
          if (energyBurstTimer > 200) {
            spawnEnergyBurst(cx, cy, amp)
            energyBurstTimer = 0
          }
        }
      }

      // Animar ondas concêntricas
      waves.forEach(wave => {
        if (wave.active) {
          const speedMultiplier = isActive ? (1.5 + amp * 2) : 1
          wave.radius += wave.speed * speedMultiplier
          wave.alpha *= 0.97
          
          if (wave.radius > wave.maxRadius || wave.alpha < 0.01) {
            wave.active = false
            return
          }

          // Onda com gradiente
          const waveGrad = ctx.createRadialGradient(cx, cy, wave.radius - 5, cx, cy, wave.radius + 5)
          waveGrad.addColorStop(0, 'transparent')
          waveGrad.addColorStop(0.5, `${currentColors.primary}${Math.floor(wave.alpha * 255).toString(16).padStart(2, '0')}`)
          waveGrad.addColorStop(1, 'transparent')
          
          ctx.strokeStyle = waveGrad
          ctx.lineWidth = 3 + amp * 6
          ctx.beginPath()
          ctx.arc(cx, cy, wave.radius, 0, Math.PI * 2)
          ctx.stroke()
        }
      })

      // Animar partículas de energia
      energyParticles.forEach(particle => {
        if (particle.active) {
          particle.x += particle.vx
          particle.y += particle.vy
          particle.life++
          particle.vx *= 0.98
          particle.vy *= 0.98

          if (particle.life > particle.maxLife) {
            particle.active = false
            return
          }

          const lifeRatio = 1 - (particle.life / particle.maxLife)
          const alpha = lifeRatio * 0.8
          
          ctx.fillStyle = `${currentColors.primary}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, particle.size * lifeRatio, 0, Math.PI * 2)
          ctx.fill()
        }
      })

      // Anéis reativos com movimento orbital
      ctx.globalCompositeOperation = 'lighter'
      
      // Anel interno - super reativo aos graves
      const ring1Radius = r * (1.3 + 0.5 * low + 0.3 * Math.sin(t * 0.01))
      const ring1Wobble = 0.2 * Math.sin(t * 0.008) * low
      ctx.strokeStyle = `${currentColors.primary}${Math.floor((0.4 + low * 0.6) * 255).toString(16).padStart(2, '0')}`
      ctx.lineWidth = 6 + 25 * low
      ctx.beginPath()
      for (let i = 0; i < 50; i++) {
        const angle = (i / 50) * Math.PI * 2
        const radius = ring1Radius + ring1Wobble * Math.sin(angle * 6 + t * 0.005)
        const x = cx + Math.cos(angle) * radius
        const y = cy + Math.sin(angle) * radius
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.closePath()
      ctx.stroke()

      // Anel médio - reativo aos médios com distorção
      const ring2Radius = r * (1.7 + 0.6 * mid + 0.4 * Math.sin(t * 0.007))
      ctx.strokeStyle = `${currentColors.glow}${Math.floor((0.3 + mid * 0.5) * 255).toString(16).padStart(2, '0')}`
      ctx.lineWidth = 4 + 18 * mid
      ctx.beginPath()
      ctx.arc(cx, cy, ring2Radius, 0, Math.PI * 2)
      ctx.stroke()

      // Anel externo - reativo aos agudos
      const ring3Radius = r * (2.2 + 0.8 * high + 0.5 * Math.sin(t * 0.005))
      ctx.strokeStyle = `${currentColors.secondary}${Math.floor((0.25 + high * 0.4) * 255).toString(16).padStart(2, '0')}`
      ctx.lineWidth = 2 + 12 * high
      ctx.beginPath()
      ctx.arc(cx, cy, ring3Radius, 0, Math.PI * 2)
      ctx.stroke()

      // Scanner ultra-rápido quando ativo
      const sweepR = r * (2.0 + 0.3 * mid)
      const sweepSpeed = isActive ? (0.025 + amp * 0.03) : 0.005
      const sweepAngle = (t * sweepSpeed) % (Math.PI * 2)
      const sweepLength = isActive ? (Math.PI * 1.2 + amp * Math.PI * 0.5) : Math.PI * 0.6
      
      const sweepGrad = ctx.createLinearGradient(
        cx + Math.cos(sweepAngle) * sweepR * 0.8,
        cy + Math.sin(sweepAngle) * sweepR * 0.8,
        cx + Math.cos(sweepAngle + sweepLength) * sweepR * 0.8,
        cy + Math.sin(sweepAngle + sweepLength) * sweepR * 0.8
      )
      sweepGrad.addColorStop(0, 'transparent')
      sweepGrad.addColorStop(0.5, `${currentColors.primary}${Math.floor((0.6 + amp * 0.4) * 255).toString(16).padStart(2, '0')}`)
      sweepGrad.addColorStop(1, 'transparent')
      
      ctx.strokeStyle = sweepGrad
      ctx.lineWidth = 4 + 15 * amp
      ctx.beginPath()
      ctx.arc(cx, cy, sweepR, sweepAngle, sweepAngle + sweepLength)
      ctx.stroke()

      // Partículas orbitais ultra dinâmicas
      ctx.globalCompositeOperation = 'source-over'
      
      for (const p of particles) {
        // Movimento muito mais rápido quando ativo
        const speedMultiplier = isActive ? (3 + amp * 4 + high * 2) : 1.2
        p.angle += p.speed * speedMultiplier
        p.pulsePhase += 0.08 + high * 0.1
        p.life += 0.02
        
        // Movimento espiral adicional
        const spiralOffset = p.spiralRadius * Math.sin(p.angle * 3 + t * p.spiralSpeed)
        
        // Raio varia MUITO com frequências
        const radiusVariation = isActive ? 
          (1 + high * 1.5 * Math.sin(t * 0.03 + p.phase) + 
           mid * 0.8 * Math.sin(p.pulsePhase) + 
           low * 0.6 * Math.sin(t * 0.01)) :
          (1 + 0.2 * Math.sin(t * 0.02 + p.phase))
        
        const currentRadius = (p.baseRadius + spiralOffset) * radiusVariation
        
        // Jitter ultra intenso durante fala
        const jitterIntensity = isActive ? (high * 15 + amp * 8) : 3
        const jitterX = (Math.random() - 0.5) * jitterIntensity
        const jitterY = (Math.random() - 0.5) * jitterIntensity
        
        const x = cx + Math.cos(p.angle) * currentRadius + jitterX
        const y = cy + Math.sin(p.angle) * currentRadius + jitterY
        
        // Tamanho varia drasticamente
        const sizeMultiplier = isActive ? 
          (1.5 + amp * 3 + high * 2.5 + mid * 1.5) : 
          (0.6 + 0.4 * Math.sin(p.life))
        const s = p.size * sizeMultiplier * (0.3 + 0.7 * Math.sin(p.pulsePhase))

        // Cor ultra intensa com múltiplas camadas
        const baseAlpha = isActive ? 
          (0.7 + 0.3 * Math.sin(p.pulsePhase) * (0.5 + 0.5 * high)) : 
          (0.4 + 0.3 * Math.sin(p.life))

        // Halo da partícula
        if (s > 1) {
          const haloGrad = ctx.createRadialGradient(x, y, 0, x, y, s * 4)
          haloGrad.addColorStop(0, `${currentColors.primary}${Math.floor(baseAlpha * 0.6 * 255).toString(16).padStart(2, '0')}`)
          haloGrad.addColorStop(1, 'transparent')
          ctx.fillStyle = haloGrad
          ctx.beginPath()
          ctx.arc(x, y, s * 4, 0, Math.PI * 2)
          ctx.fill()
        }

        // Núcleo da partícula
        ctx.fillStyle = `${currentColors.core}${Math.floor(baseAlpha * 255).toString(16).padStart(2, '0')}`
        ctx.shadowColor = currentColors.glow
        ctx.shadowBlur = isActive ? (8 + high * 20) : 3
        
        ctx.beginPath()
        ctx.arc(x, y, Math.max(0.5, s), 0, Math.PI * 2)
        ctx.fill()
        
        ctx.shadowBlur = 0

        // Rastro das partículas quando super ativo
        if (isSuperActive && s > 2) {
          const trailLength = 5
          for (let i = 1; i <= trailLength; i++) {
            const trailAngle = p.angle - p.speed * speedMultiplier * i * 3
            const trailRadius = currentRadius * (1 - i * 0.02)
            const tx = cx + Math.cos(trailAngle) * trailRadius
            const ty = cy + Math.sin(trailAngle) * trailRadius
            const trailAlpha = baseAlpha * (1 - i / trailLength) * 0.5
            
            ctx.fillStyle = `${currentColors.primary}${Math.floor(trailAlpha * 255).toString(16).padStart(2, '0')}`
            ctx.beginPath()
            ctx.arc(tx, ty, s * (1 - i / trailLength) * 0.5, 0, Math.PI * 2)
            ctx.fill()
          }
        }
      }

      // Efeito de centro ultra brilhante quando muito ativo
      if (isSuperActive) {
        const coreFlash = 0.5 + 0.5 * Math.sin(t * 0.05)
        const flashGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 0.4)
        flashGrad.addColorStop(0, `rgba(255, 255, 255, ${amp * coreFlash * 0.7})`)
        flashGrad.addColorStop(0.5, `${currentColors.primary}${Math.floor(amp * coreFlash * 0.5 * 255).toString(16).padStart(2, '0')}`)
        flashGrad.addColorStop(1, 'transparent')
        
        ctx.fillStyle = flashGrad
        ctx.beginPath()
        ctx.arc(cx, cy, r * 0.4 * (0.8 + 0.4 * Math.sin(t * 0.02)), 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.globalCompositeOperation = 'source-over'
      t += 16.666
      raf = requestAnimationFrame(draw)
    }

    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [ready, level, bands, currentColors])

  return (
    <div
      className={className}
      onMouseDown={() => resumeAudio()}
      onTouchStart={() => resumeAudio()}
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  )
}