import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { X, ChevronLeft, ChevronRight, Play, BarChart3, FileText, Settings } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface OnboardingStep {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  target?: string
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Bem-vindo à Plataforma!',
    description: 'Vamos te guiar pelos principais recursos para maximizar seu aprendizado.',
    icon: <Play className="w-6 h-6" />
  },
  {
    id: 'simulation',
    title: 'Simulações Interativas',
    description: 'Pratique conversas realistas com IA e receba feedback instantâneo sobre sua performance.',
    icon: <Play className="w-6 h-6" />
  },
  {
    id: 'analytics',
    title: 'Analytics e Métricas',
    description: 'Acompanhe seu progresso com gráficos detalhados e métricas de performance em tempo real.',
    icon: <BarChart3 className="w-6 h-6" />
  },
  {
    id: 'history',
    title: 'Histórico de Sessões',
    description: 'Revise sessões anteriores, analise seu desenvolvimento e identifique áreas de melhoria.',
    icon: <FileText className="w-6 h-6" />
  },
  {
    id: 'tips',
    title: 'Dicas para Maximizar seu Aprendizado',
    description: '• Pratique regularmente (ideal: 2-3 sessões por semana)\n• Revise os feedbacks detalhados\n• Foque nos critérios com menor pontuação\n• Use as simulações como preparação para situações reais',
    icon: <Settings className="w-6 h-6" />
  }
]

interface OnboardingTourProps {
  isOpen: boolean
  onClose: () => void
}

export function OnboardingTour({ isOpen, onClose }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0)

  const nextStep = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const skipTour = () => {
    localStorage.setItem('onboarding_completed', 'true')
    onClose()
  }

  const completeTour = () => {
    localStorage.setItem('onboarding_completed', 'true')
    onClose()
  }

  const step = onboardingSteps[currentStep]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                {step.icon}
              </div>
              <div>
                <DialogTitle>{step.title}</DialogTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary">
                    {currentStep + 1} de {onboardingSteps.length}
                  </Badge>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={skipTour}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <CardContent className="px-0">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground whitespace-pre-line">
              {step.description}
            </p>

            {/* Progress bar */}
            <div className="w-full bg-secondary rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / onboardingSteps.length) * 100}%` }}
              />
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={prevStep}
                disabled={currentStep === 0}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Anterior
              </Button>

              <Button variant="ghost" size="sm" onClick={skipTour}>
                Pular tour
              </Button>

              {currentStep === onboardingSteps.length - 1 ? (
                <Button size="sm" onClick={completeTour}>
                  Começar!
                </Button>
              ) : (
                <Button size="sm" onClick={nextStep}>
                  Próximo
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </DialogContent>
    </Dialog>
  )
}

// Hook para controlar o onboarding
export function useOnboarding() {
  const [showOnboarding, setShowOnboarding] = useState(false)

  useEffect(() => {
    const completed = localStorage.getItem('onboarding_completed')
    if (!completed) {
      // Delay para não aparecer imediatamente
      const timer = setTimeout(() => {
        setShowOnboarding(true)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  const closeOnboarding = () => {
    setShowOnboarding(false)
  }

  const restartOnboarding = () => {
    localStorage.removeItem('onboarding_completed')
    setShowOnboarding(true)
  }

  return {
    showOnboarding,
    closeOnboarding,
    restartOnboarding
  }
}