import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { testApiConnections } from '@/lib/apiKeySetup'

export function SystemStatusChecker() {
  const [status, setStatus] = useState({
    openai: false,
    database: false
  })
  const [loading, setLoading] = useState(false)
  const [lastCheck, setLastCheck] = useState<Date | null>(null)

  const checkSystem = async () => {
    setLoading(true)
    try {
      const results = await testApiConnections()
      setStatus(results)
      setLastCheck(new Date())
    } catch (error) {
      console.error('Erro ao verificar sistema:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkSystem()
  }, [])

  const getStatusIcon = (isWorking: boolean) => {
    return isWorking ? (
      <CheckCircle className="h-5 w-5 text-green-500" />
    ) : (
      <XCircle className="h-5 w-5 text-red-500" />
    )
  }

  const allWorking = status.openai && status.database

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Status do Sistema
          {allWorking ? (
            <Badge variant="default" className="bg-green-600">Operacional</Badge>
          ) : (
            <Badge variant="destructive">Necessita Configuração</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span>OpenAI (Chat + Voz)</span>
          {getStatusIcon(status.openai)}
        </div>
        
        <div className="flex items-center justify-between">
          <span>Banco de Dados</span>
          {getStatusIcon(status.database)}
        </div>

        <div className="pt-4 border-t">
          <Button 
            onClick={checkSystem} 
            disabled={loading}
            className="w-full"
            variant="outline"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Verificando...
              </>
            ) : (
              'Verificar Sistema'
            )}
          </Button>
          
          {lastCheck && (
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Última verificação: {lastCheck.toLocaleTimeString()}
            </p>
          )}
        </div>

        {!allWorking && (
          <div className="p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
            <p className="text-sm text-orange-600 dark:text-orange-400">
              Algumas funcionalidades podem não estar disponíveis. 
              Configure as API Keys através do botão verde "Supabase" no topo da página.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}