import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { useSessionScoring } from '@/hooks/useSessionScoring'
import { useRealMetrics } from '@/hooks/useRealMetrics'
import { supabase } from '@/integrations/supabase/client'
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

export function MetricsTestComponent() {
  const [testResults, setTestResults] = useState<any>({})
  const [isRunning, setIsRunning] = useState(false)
  const { toast } = useToast()
  const { analyzeSession, batchAnalyzeSessions } = useSessionScoring()
  const { metrics: realMetrics, loading: metricsLoading, refreshMetrics } = useRealMetrics('comercial')

  const runTest = async (testName: string, testFn: () => Promise<any>) => {
    setIsRunning(true)
    try {
      const result = await testFn()
      setTestResults(prev => ({
        ...prev,
        [testName]: { success: true, result }
      }))
      toast({
        title: "Teste passou ✅",
        description: `${testName} executado com sucesso`
      })
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        [testName]: { success: false, error: error.message }
      }))
      toast({
        title: "Teste falhou ❌",
        description: `${testName}: ${error.message}`,
        variant: "destructive"
      })
    } finally {
      setIsRunning(false)
    }
  }

  const testDatabaseConnection = async () => {
    const { data, error } = await supabase
      .from('sessions_live')
      .select('count')
      .limit(1)
    
    if (error) throw error
    return { message: 'Conexão com banco OK', data }
  }

  const testSessionScoring = async () => {
    const mockTranscript = "Olá, eu gostaria de conversar sobre as opções de produto que vocês oferecem. Tenho interesse em saber mais sobre preços e condições."
    
    const result = await analyzeSession(
      'test-session-' + Date.now(),
      mockTranscript,
      'comercial'
    )
    
    if (!result.success) {
      throw new Error(result.reason || result.error || 'Falha na análise')
    }
    
    return result
  }

  const testEdgeFunctions = async () => {
    const { data, error } = await supabase.functions.invoke('score-session-by-area', {
      body: {
        transcript: "Esta é uma conversa teste para verificar se a função edge está funcionando corretamente.",
        area: 'comercial'
      }
    })
    
    if (error) throw error
    return data
  }

  const testRealMetrics = async () => {
    await refreshMetrics()
    if (metricsLoading) {
      throw new Error('Métricas ainda carregando')
    }
    return realMetrics
  }

  const testBatchAnalysis = async () => {
    const result = await batchAnalyzeSessions(3)
    return result
  }

  const tests = [
    {
      name: 'Database Connection',
      description: 'Testa conexão com Supabase',
      testFn: testDatabaseConnection
    },
    {
      name: 'Edge Functions',
      description: 'Testa função de análise de sessão',
      testFn: testEdgeFunctions
    },
    {
      name: 'Session Scoring',
      description: 'Testa análise completa de sessão',
      testFn: testSessionScoring
    },
    {
      name: 'Real Metrics',
      description: 'Testa carregamento de métricas reais',
      testFn: testRealMetrics
    },
    {
      name: 'Batch Analysis',
      description: 'Testa análise em lote',
      testFn: testBatchAnalysis
    }
  ]

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🧪 Teste do Sistema de Métricas
          {isRunning && <Loader2 className="h-5 w-5 animate-spin" />}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          {tests.map((test) => (
            <Card key={test.name} className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">{test.name}</h3>
                {testResults[test.name] ? (
                  testResults[test.name].success ? (
                    <CheckCircle className="h-5 w-5 text-success" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-destructive" />
                  )
                ) : (
                  <Badge variant="outline">Pendente</Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground mb-3">{test.description}</p>
              <Button 
                onClick={() => runTest(test.name, test.testFn)}
                disabled={isRunning}
                variant="outline"
                size="sm"
                className="w-full"
              >
                {isRunning ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Executar Teste
              </Button>
              
              {testResults[test.name] && (
                <div className="mt-3 p-2 bg-muted rounded text-xs">
                  {testResults[test.name].success ? (
                    <pre className="text-success">
                      {JSON.stringify(testResults[test.name].result, null, 2)}
                    </pre>
                  ) : (
                    <div className="text-destructive">
                      ❌ {testResults[test.name].error}
                    </div>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={async () => {
              for (const test of tests) {
                await runTest(test.name, test.testFn)
                await new Promise(resolve => setTimeout(resolve, 1000))
              }
            }}
            disabled={isRunning}
            className="flex-1"
          >
            Executar Todos os Testes
          </Button>
          
          <Button 
            onClick={() => {
              setTestResults({})
              toast({ title: "Resultados limpos" })
            }}
            variant="outline"
          >
            Limpar Resultados
          </Button>
        </div>

        {realMetrics && (
          <Card className="p-4 bg-muted/50">
            <h3 className="font-semibold mb-2">📊 Métricas Atuais (Comercial)</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground">Seu Score</div>
                <div className="font-bold">{realMetrics.yourScore}/10</div>
              </div>
              <div>
                <div className="text-muted-foreground">Média Indústria</div>
                <div className="font-bold">{realMetrics.industryAverage}/10</div>
              </div>
              <div>
                <div className="text-muted-foreground">Percentil</div>
                <div className="font-bold">{realMetrics.percentile}º</div>
              </div>
              <div>
                <div className="text-muted-foreground">Sessões</div>
                <div className="font-bold">{realMetrics.totalSessions}</div>
              </div>
            </div>
          </Card>
        )}
      </CardContent>
    </Card>
  )
}