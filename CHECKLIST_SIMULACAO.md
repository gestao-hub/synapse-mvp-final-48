# Checklist de Robustez da Simulação

- [x] Transcrição (STT) sempre retorna texto válido ou mostra erro claro
- [x] Se STT falhar, usuário pode tentar novamente ou digitar texto
- [x] Não envia transcript vazio para IA
- [x] Se IA retornar erro (OpenAI), mostra feedback claro
- [x] Se TTS falhar, tenta fallback de voz/mostra mensagem clara
- [x] Toda interação (usuário/IA) aparece no histórico local e é salva no banco
- [x] Ao finalizar, transcripts, scores, feedbacks e duração são salvos em `sessions_live`
- [x] Toasts/feedback visual em todos os erros (STT, TTS, IA, Banco)
- [x] Logs detalhados no console para cada etapa crítica
- [x] Scoring/feedback real integrado (quando disponível)
- [x] Comportamento consistente para áudio curto, longo, vazio ou corrompido
- [x] Testes manuais com diferentes perfis de uso e erros forçados

## Observações

- Sempre atualizar este checklist após alterações críticas.
- Sugerido adicionar testes automatizados/mocks para etapas críticas no futuro.