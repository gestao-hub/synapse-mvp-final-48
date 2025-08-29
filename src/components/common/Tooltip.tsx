import React from 'react'
import { Tooltip as TooltipPrimitive, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { HelpCircle } from 'lucide-react'

interface TooltipProps {
  content: string
  children?: React.ReactNode
  showIcon?: boolean
  side?: 'top' | 'right' | 'bottom' | 'left'
  className?: string
}

export function Tooltip({ content, children, showIcon = true, side = 'top', className }: TooltipProps) {
  return (
    <TooltipProvider>
      <TooltipPrimitive>
        <TooltipTrigger asChild>
          {children || (
            <button className={`inline-flex items-center text-muted-foreground hover:text-foreground transition-colors ${className}`}>
              {showIcon && <HelpCircle className="w-4 h-4" />}
            </button>
          )}
        </TooltipTrigger>
        <TooltipContent side={side} className="max-w-xs">
          <p className="text-sm">{content}</p>
        </TooltipContent>
      </TooltipPrimitive>
    </TooltipProvider>
  )
}

// Componentes específicos para métricas
export function ScoreTooltip() {
  return (
    <Tooltip
      content="Score calculado baseado em critérios específicos da área, incluindo comunicação, conhecimento técnico e capacidade de resolução de problemas. Escala de 0 a 10."
      side="right"
    />
  )
}

export function PercentileTooltip() {
  return (
    <Tooltip
      content="Sua posição relativa comparada a outros usuários da mesma área. Um percentil 80 significa que você performou melhor que 80% dos usuários."
      side="right"
    />
  )
}

export function TrendTooltip() {
  return (
    <Tooltip
      content="Variação percentual da sua performance nos últimos 7 dias comparado aos 7 dias anteriores. Valores positivos indicam melhoria."
      side="right"
    />
  )
}

export function CompletionRateTooltip() {
  return (
    <Tooltip
      content="Porcentagem de simulações que você completou até o final, sem interrupções. Uma alta taxa indica consistência no treinamento."
      side="right"
    />
  )
}

export function StreakTooltip() {
  return (
    <Tooltip
      content="Número consecutivo de dias em que você realizou pelo menos uma simulação. Manter uma sequência regular é fundamental para o aprendizado."
      side="right"
    />
  )
}