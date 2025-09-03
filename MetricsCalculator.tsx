import { useState, useEffect } from 'react';

interface Metrics {
  totalTurns: number;
  averageResponseTime: number;
  errorCount: number;
  successRate: number;
  lastUpdated: string;
}

export class MetricsCalculator {
  private static instance: MetricsCalculator;
  private metrics: Metrics;
  private responseTimes: number[];
  private subscribers: ((metrics: Metrics) => void)[];

  private constructor() {
    this.metrics = {
      totalTurns: 0,
      averageResponseTime: 0,
      errorCount: 0,
      successRate: 100,
      lastUpdated: new Date().toISOString()
    };
    this.responseTimes = [];
    this.subscribers = [];
  }

  public static getInstance(): MetricsCalculator {
    if (!MetricsCalculator.instance) {
      MetricsCalculator.instance = new MetricsCalculator();
    }
    return MetricsCalculator.instance;
  }

  public incrementTurns(): void {
    this.metrics.totalTurns++;
    this.updateMetrics();
  }

  public updateResponseTime(time: number): void {
    this.responseTimes.push(time);
    this.calculateAverageResponseTime();
    this.updateMetrics();
  }

  public logError(error: Error): void {
    this.metrics.errorCount++;
    this.calculateSuccessRate();
    this.updateMetrics();
    
    // Log detalhado do erro
    console.error('Erro registrado:', {
      timestamp: new Date().toISOString(),
      error: error,
      errorCount: this.metrics.errorCount
    });
  }

  private calculateAverageResponseTime(): void {
    if (this.responseTimes.length === 0) return;
    
    const sum = this.responseTimes.reduce((a, b) => a + b, 0);
    this.metrics.averageResponseTime = sum / this.responseTimes.length;
  }

  private calculateSuccessRate(): void {
    if (this.metrics.totalTurns === 0) return;
    
    this.metrics.successRate = ((this.metrics.totalTurns - this.metrics.errorCount) / this.metrics.totalTurns) * 100;
  }

  private updateMetrics(): void {
    this.metrics.lastUpdated = new Date().toISOString();
    this.notifySubscribers();
  }

  public getMetrics(): Metrics {
    return { ...this.metrics };
  }

  public resetMetrics(): void {
    this.metrics = {
      totalTurns: 0,
      averageResponseTime: 0,
      errorCount: 0,
      successRate: 100,
      lastUpdated: new Date().toISOString()
    };
    this.responseTimes = [];
    this.notifySubscribers();
  }

  public subscribe(callback: (metrics: Metrics) => void): () => void {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  private notifySubscribers(): void {
    this.subscribers.forEach(callback => callback(this.getMetrics()));
  }
}

// Hook para uso fácil em componentes React
export function useMetrics() {
  const [metrics, setMetrics] = useState<Metrics>(MetricsCalculator.getInstance().getMetrics());

  useEffect(() => {
    const unsubscribe = MetricsCalculator.getInstance().subscribe(setMetrics);
    return () => unsubscribe();
  }, []);

  return metrics;
}