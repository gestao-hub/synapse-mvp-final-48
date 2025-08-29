'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../integrations/supabase/client'
import { useNavigate, Link } from 'react-router-dom'
import { useToast } from '@/hooks/use-toast'

export default function LoginPage(){
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [err,setErr] = useState<string|null>(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { toast } = useToast()

  // Debug logs para verificar variáveis de ambiente do Supabase
  console.log('=== SUPABASE ENV VARIABLES ===')
  console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL)
  console.log('VITE_SUPABASE_ANON_KEY últimos 6 chars:', import.meta.env.VITE_SUPABASE_ANON_KEY?.slice(-6))
  
  // Extrair <ref> da URL
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const ref = supabaseUrl?.replace('https://', '').replace('.supabase.co', '')
  console.log('SUPABASE REF extraído da URL:', ref)
  console.log('Confirme se o REF é o mesmo em: Supabase → Settings → API → Project URL')
  console.log('=== END SUPABASE ENV ===')

  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        navigate('/app/dashboard')
      }
    }
    checkSession()
  }, [navigate])
  

  async function onSubmit(e:React.FormEvent){
    e.preventDefault()
    setLoading(true)
    setErr(null)
    
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      console.log('Login error:', error)
      setErr(error.message)
      toast({
        variant: "destructive",
        title: "Erro no login",
        description: error.message
      })
    } else {
      toast({
        title: "Login realizado!",
        description: "Redirecionando para o dashboard..."
      })
      navigate('/app/dashboard')
    }
    setLoading(false)
  }

  // ⚙️ credenciais de dev padrão - novo usuário com senha conhecida
  const DEV_EMAIL = 'dev-test@lovable.app'
  const DEV_PASS  = 'DevPass123!'

  async function createDevUser() {
    setLoading(true); setErr(null)
    try {
      console.log('[createDevUser] Starting function call...')
      console.log('[createDevUser] Calling supabase.functions.invoke with:', { 
        email: DEV_EMAIL, 
        passwordLength: DEV_PASS.length 
      })
      
      const { data, error } = await supabase.functions.invoke('create-dev-user', {
        body: { email: DEV_EMAIL, password: DEV_PASS }
      })

      console.log('[createDevUser] Response received:', { data, error })

      if (error) {
        console.error('[createDevUser] Supabase function error:', error)
        throw new Error(`Edge Function error: ${error.message}`)
      }

      if (data?.error) {
        console.error('[createDevUser] Function returned error:', data.error)
        throw new Error(data.error)
      }

      console.log('[createDevUser] Success!', data)
      toast({ title: 'Sucesso!', description: 'Usuário dev criado!' })
      
      // Fazer login automaticamente após criar
      await quickLogin()
    } catch (e: any) {
      console.error('createDevUser error:', e)
      setErr(e.message)
      toast({ variant: 'destructive', title: 'Erro', description: e.message })
    } finally {
      setLoading(false)
    }
  }

  // Login rápido simplificado
  async function quickLogin() {
    setLoading(true); setErr(null)
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: DEV_EMAIL,
        password: DEV_PASS,
      })

      if (error) {
        throw error
      }

      toast({ title: 'Login realizado!', description: 'Redirecionando…' })
      navigate('/app/dashboard')
    } catch (e: any) {
      console.error('quickLogin error:', e)
      setErr(e.message)
      toast({ variant: 'destructive', title: 'Erro no login rápido', description: e.message })
      
      // Debug info
      console.log('VITE_SUPABASE_ANON_KEY últimos 6 chars:', import.meta.env.VITE_SUPABASE_ANON_KEY?.slice(-6))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[60vh] grid place-items-center relative">
      {/* Back to Home Link - Refatorado */}
      <div className="absolute top-8 left-8 z-10">
        <button
          onClick={() => window.location.href = '/'}
          className="group relative overflow-hidden inline-block px-6 py-3 rounded-xl text-sm font-medium text-white/70 bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white hover:border-white/20 transition-all duration-300 backdrop-blur cursor-pointer select-none"
        >
          <div className="flex items-center justify-center gap-2 w-full h-full">
            <span className="transition-transform duration-300 group-hover:-translate-x-1">←</span>
            <span>Voltar</span>
          </div>
        </button>
      </div>

      {/* Dev Panel */}
      <div className="w-full max-w-sm mb-4 p-4 border border-orange-500/30 bg-orange-500/10 rounded-xl mt-16">
        <h3 className="text-sm font-semibold text-orange-400 mb-3">🔧 Dev Only</h3>
        <div className="space-y-2">
          <button 
            onClick={createDevUser}
            disabled={loading}
            className="w-full p-2 text-sm bg-orange-500/20 text-orange-300 rounded-lg hover:bg-orange-500/30 disabled:opacity-50"
          >
            {loading ? 'Criando...' : 'Criar usuário de dev'}
          </button>
          <button 
            onClick={quickLogin}
            disabled={loading}
            className="w-full p-2 text-sm bg-green-500/20 text-green-300 rounded-lg hover:bg-green-500/30 disabled:opacity-50"
          >
            {loading ? 'Logando...' : 'Login rápido'}
          </button>
        </div>
      </div>

      <form onSubmit={onSubmit} className="card w-full max-w-sm p-6 space-y-3">
        <h1 className="text-2xl font-cal text-gradient">Entrar</h1>
        <input 
          className="w-full p-3 rounded-xl bg-white/10 text-white placeholder:text-white/60" 
          placeholder="email" 
          value={email} 
          onChange={e=>setEmail(e.target.value)} 
        />
        <input 
          className="w-full p-3 rounded-xl bg-white/10 text-white placeholder:text-white/60" 
          type="password" 
          placeholder="senha" 
          value={password} 
          onChange={e=>setPassword(e.target.value)} 
        />
        {err && <p className="text-red-400 text-sm">{err}</p>}
        <button disabled={loading} className="btn-primary w-full">
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  )
}