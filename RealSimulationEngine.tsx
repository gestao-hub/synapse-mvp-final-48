import { MetricsCalculator } from './MetricsCalculator';

export class RealSimulationEngine {
  private metricsCalculator: MetricsCalculator;

  constructor() {
    this.metricsCalculator = MetricsCalculator.getInstance();
  }

  async processSimulation(input: any) {
    try {
      const startTime = performance.now();
      
      // Log início da simulação
      console.log('Iniciando simulação:', {
        timestamp: new Date().toISOString(),
        input: input
      });

      // Processar simulação
      const result = await this.executeSimulation(input);

      // Calcular tempo de resposta
      const responseTime = performance.now() - startTime;
      
      // Atualizar métricas
      this.metricsCalculator.incrementTurns();
      this.metricsCalculator.updateResponseTime(responseTime);

      // Log sucesso
      console.log('Simulação completada:', {
        timestamp: new Date().toISOString(),
        responseTime: responseTime,
        result: result
      });

      return result;

    } catch (error) {
      // Log erro e atualizar métricas
      this.metricsCalculator.logError(error as Error);
      
      console.error('Erro na simulação:', {
        timestamp: new Date().toISOString(),
        error: error,
        input: input
      });

      throw error;
    }
  }

  private async executeSimulation(input: any) {
    // Implementação existente da simulação
    // ...
  }

  public getMetrics() {
    return this.metricsCalculator.getMetrics();
  }

  public resetMetrics() {
    this.metricsCalculator.resetMetrics();
  }
}