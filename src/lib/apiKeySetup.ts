import { supabase } from '@/integrations/supabase/client'

export async function checkAndSetupApiKeys() {
  try {
    // Verificar se as Edge Functions estão funcionando
    const { data: testData, error: testError } = await supabase.functions.invoke('setup-database')
    
    if (testError) {
      console.log('Edge Functions não estão completamente configuradas:', testError)
      return false
    }
    
    console.log('Sistema configurado com sucesso:', testData)
    return true
    
  } catch (error) {
    console.error('Erro ao verificar configuração:', error)
    return false
  }
}

export async function ensureDatabaseTables() {
  try {
    // Chamar a função de setup do banco de dados
    const { data, error } = await supabase.functions.invoke('setup-database')
    
    if (error) {
      console.error('Erro ao configurar banco:', error)
      return false
    }
    
    console.log('Banco de dados configurado:', data)
    return true
    
  } catch (error) {
    console.error('Erro ao setup database:', error)
    return false
  }
}

export async function testApiConnections() {
  const results = {
    openai: false,
    database: false
  }
  
  try {
    // Testar OpenAI (token realtime que usa chat)
    const { error: tokenError } = await supabase.functions.invoke('realtime-token', {
      body: { track: 'rh', scenario: 'teste' }
    })
    
    if (!tokenError) {
      // Testar também o TTS da OpenAI
      const { error: ttsError } = await supabase.functions.invoke('openai-tts', {
        body: { text: 'teste' }
      })
      
      if (!ttsError) {
        results.openai = true
      }
    }
  } catch (error) {
    console.log('OpenAI não configurado ainda')
  }
  
  try {
    // Testar Database - verificar se existe a tabela scenarios
    const { data, error } = await supabase.from('scenarios').select('count').limit(1)
    
    if (!error) {
      results.database = true
    }
  } catch (error) {
    console.log('Database não configurado ainda')
  }
  
  return results
}