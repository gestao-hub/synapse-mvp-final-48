import { RealSimulationEngine } from './RealSimulationEngine'

interface Scenario {
  id: string
  area: string
  title: string
  description: string
  criteria: Array<{
    key: string
    label: string
    weight: number
  }>
  persona: string
  context: string
}

interface SimulationEngineProps {
  scenario: Scenario
  userRole: string
  onComplete: (results: any) => void
}

export function SimulationEngine({ scenario, userRole, onComplete }: SimulationEngineProps) {
  const handleSimulationEnd = (data: any) => {
    onComplete(data);
  };

  return (
    <RealSimulationEngine
      onSimulationEnd={handleSimulationEnd}
    />
  )
}