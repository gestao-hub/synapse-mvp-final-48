import React, { Suspense } from 'react'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'
import { LoadingCard } from '@/components/common/LoadingSpinner'
import { DashboardKPIs } from '@/components/dashboard/DashboardKPIs'
import { SessionsChart } from '@/components/dashboard/SessionsChart'
import { RecentSessionsTable } from '@/components/dashboard/RecentSessionsTable'
import { SessionAnalyzer } from '@/components/analytics/SessionAnalyzer'
import { TrendAnalysis } from '@/components/analytics/TrendAnalysis'
import { DataExporter } from '@/components/export/DataExporter'
import { OnboardingTour, useOnboarding } from '@/components/onboarding/OnboardingTour'
import { useDashboardData } from '@/hooks/useDashboardData'


export default function DashboardPage() {
  const { kpis, chartData, recentSessions, isLoading } = useDashboardData()
  const { showOnboarding, closeOnboarding } = useOnboarding()

  if (isLoading) {
    return <LoadingCard message="Carregando dashboard..." />
  }

  return (
    <ErrorBoundary>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-gradient">Dashboard</h1>
          <p className="text-muted-foreground">
            Acompanhe o desempenho das suas sessões de treinamento
          </p>
        </div>

        <Suspense fallback={<LoadingCard message="Carregando KPIs..." />}>
          <DashboardKPIs kpis={kpis} />
        </Suspense>

        <div className="grid gap-6 lg:grid-cols-2">
          <ErrorBoundary>
            <Suspense fallback={<LoadingCard message="Carregando gráfico..." />}>
              <SessionsChart data={chartData} />
            </Suspense>
          </ErrorBoundary>
          
          <ErrorBoundary>
            <Suspense fallback={<LoadingCard message="Carregando tendências..." />}>
              <TrendAnalysis sessions={recentSessions} />
            </Suspense>
          </ErrorBoundary>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ErrorBoundary>
              <Suspense fallback={<LoadingCard message="Carregando sessões..." />}>
                <RecentSessionsTable sessions={recentSessions} />
              </Suspense>
            </ErrorBoundary>
          </div>
          
          <div className="space-y-6">
            <ErrorBoundary>
              <DataExporter />
            </ErrorBoundary>
            
            <ErrorBoundary>
              <SessionAnalyzer />
            </ErrorBoundary>
          </div>
        </div>

      </div>
      
      <OnboardingTour isOpen={showOnboarding} onClose={closeOnboarding} />
    </ErrorBoundary>
  )
}