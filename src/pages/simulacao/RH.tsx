import { useState } from 'react'
import VoiceReactiveOrb from '../../components/VoiceReactiveOrb'
import VoiceInterfaceRh from '@/components/VoiceInterfaceRh'

export default function SimulacaoRH(){
  const [simulacaoAtiva, setSimulacaoAtiva] = useState(false)

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-cal text-gradient">RH • Feedback Construtivo</h1>
      
      {simulacaoAtiva ? (
         <div className="space-y-4">
           <p className="text-white/80 text-center">
             Clique em "Iniciar" para começar a conversa. O microfone será ativado automaticamente.
           </p>
          
          <div className="card p-8 flex flex-col items-center">
            <VoiceReactiveOrb size={200} />
          </div>
        </div>
      ) : (
        <div className="card p-6">
          <h2 className="text-xl mb-4">Cenário: Feedback Construtivo</h2>
          <p className="text-white/80 mb-4">Colaborador defensivo; use CNV, exemplos e plano de ação.</p>
          <VoiceInterfaceRh />
        </div>
      )}
    </div>
  )
}