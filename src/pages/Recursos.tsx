export default function Recursos() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gradient">
            Recursos do Synapse
          </h1>
          <p className="text-xl text-white/70">
            Descubra as funcionalidades que transformarão seus treinamentos
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="card p-8 space-y-4">
            <h3 className="text-2xl font-bold text-white">Simulações em Tempo Real</h3>
            <p className="text-white/70">
              Treinamentos de voz full-duplex com IA avançada para experiências realistas e imersivas.
            </p>
          </div>

          <div className="card p-8 space-y-4">
            <h3 className="text-2xl font-bold text-white">Múltiplas Trilhas</h3>
            <p className="text-white/70">
              Comercial, RH, Educacional e Gestão - cada área com cenários específicos e personalizados.
            </p>
          </div>

          <div className="card p-8 space-y-4">
            <h3 className="text-2xl font-bold text-white">Analytics Avançado</h3>
            <p className="text-white/70">
              Dashboard completo com métricas de performance e evolução do aprendizado.
            </p>
          </div>

          <div className="card p-8 space-y-4">
            <h3 className="text-2xl font-bold text-white">Feedback Inteligente</h3>
            <p className="text-white/70">
              IA analisa conversas e fornece feedback construtivo para melhoria contínua.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}