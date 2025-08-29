import { Play } from 'lucide-react';

export default function ProductFlowAnimation() {
  return (
    <section className="relative py-32 bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f0f23] overflow-hidden">
      {/* Background animated elements */}
      <div className="absolute inset-0">
        {/* Energy lines */}
        <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple/30 to-transparent animate-energy-flow" />
        <div className="absolute top-2/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-spring/30 to-transparent animate-energy-flow" style={{ animationDelay: '1s' }} />
        
        {/* Floating orbs */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-purple/20 rounded-full animate-particle-float"
            style={{
              left: `${10 + (i * 12)}%`,
              top: `${20 + (i % 3) * 20}%`,
              animationDelay: `${i * 0.7}s`,
            }}
          />
        ))}
      </div>

      <div className="relative container mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">
          Como Potencializamos Sua Equipe
        </h2>
        
        <p className="text-xl md:text-2xl text-white/70 mb-16 max-w-4xl mx-auto">
          Descubra o processo revolucionário que transforma capacitação empresarial em resultados mensuráveis
        </p>

        {/* Central Play Button */}
        <div className="relative group cursor-pointer">
          {/* Ripple effects */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple/20 to-spring/20 animate-ping" />
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple/10 to-spring/10 animate-pulse" style={{ animationDelay: '0.5s' }} />
          
          {/* Main button */}
          <div className="relative w-24 h-24 md:w-32 md:h-32 mx-auto rounded-full bg-gradient-to-r from-purple to-spring flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-2xl">
            <Play className="w-8 h-8 md:w-12 md:h-12 text-white ml-1 group-hover:scale-125 transition-transform duration-300" fill="currentColor" />
          </div>

          {/* Glow effect */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple to-spring opacity-30 blur-xl group-hover:opacity-50 transition-opacity duration-300" />
        </div>

        {/* Flow steps indicators */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            { number: '01', title: 'Análise', desc: 'Identificamos necessidades específicas' },
            { number: '02', title: 'Implementação', desc: 'Configuramos IA personalizada' },
            { number: '03', title: 'Resultados', desc: 'Medimos impacto e evolução' }
          ].map((step, index) => (
            <div key={index} className="text-center space-y-4">
              <div className="text-4xl font-bold bg-gradient-to-r from-purple to-spring bg-clip-text text-transparent">
                {step.number}
              </div>
              <h3 className="text-xl font-semibold text-white">{step.title}</h3>
              <p className="text-white/70">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}