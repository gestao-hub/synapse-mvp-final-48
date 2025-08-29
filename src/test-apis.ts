import { testApiConnections } from './lib/apiKeySetup'

// Função para testar todas as APIs
async function runApiTest() {
  console.log('🔍 Testando conectividade das APIs...')
  
  const results = await testApiConnections()
  
  console.log('📊 Resultados dos testes:')
  console.log('🤖 OpenAI:', results.openai ? '✅ Funcional' : '❌ Não funcional')
  console.log('🎤 ElevenLabs:', results.elevenlabs ? '✅ Funcional' : '❌ Não funcional') 
  console.log('🗄️ Database:', results.database ? '✅ Funcional' : '❌ Não funcional')
  
  return results
}

// Executar teste
runApiTest().then(results => {
  const allWorking = Object.values(results).every(Boolean)
  console.log('\n🎯 Status Geral:', allWorking ? '✅ Todas as APIs funcionais' : '⚠️ Algumas APIs com problemas')
}).catch(error => {
  console.error('❌ Erro ao testar APIs:', error)
})

export { runApiTest }