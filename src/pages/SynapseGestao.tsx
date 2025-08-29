import { Link } from 'react-router-dom';
import { 
  Crown, 
  Target, 
  MessageSquare, 
  Shield,
  CheckCircle,
  ArrowRight,
  Users,
  TrendingUp,
  BarChart,
  Briefcase
} from 'lucide-react';

export default function SynapseGestao() {
  return (
    <div className="min-h-screen bg-midnight text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-screen flex items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-[#2a1b4f] via-[#4a3b8a] to-[#6b5cb8]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        
        <div className="relative container mx-auto px-6 py-32 text-center">
          {/* Animated background elements for management context */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Floating leadership metrics */}
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="absolute opacity-20 animate-bounce"
                style={{
                  left: `${10 + (i * 12)}%`,
                  top: `${20 + (i % 3) * 25}%`,
                  animationDelay: `${i * 0.5}s`,
                  animationDuration: `${3 + (i % 2)}s`,
                }}
              >
                {i % 4 === 0 && (
                  <div className="w-8 h-8 bg-gradient-to-r from-[#ffd700]/30 to-[#ffb347]/30 rounded-lg flex items-center justify-center">
                    <span className="text-[#ffd700] text-xs font-bold">👑</span>
                  </div>
                )}
                {i % 4 === 1 && (
                  <div className="w-10 h-6 bg-gradient-to-r from-[#00FF99]/20 to-[#00d9ff]/20 rounded-md flex items-center justify-center">
                    <span className="text-[#00FF99] text-xs">+{25 + (i * 5)}% ROI</span>
                  </div>
                )}
                {i % 4 === 2 && (
                  <div className="w-6 h-6 bg-[#8601F8]/30 rounded-full animate-pulse" />
                )}
                {i % 4 === 3 && (
                  <div className="w-12 h-4 bg-gradient-to-r from-[#ffd700]/30 to-[#ffb347]/30 rounded-full flex items-center justify-center">
                    <span className="text-[#ffd700] text-xs">⚡</span>
                  </div>
                )}
              </div>
            ))}
            
            {/* Strategic connections */}
            <svg className="absolute inset-0 w-full h-full" style={{ zIndex: -1 }}>
              <defs>
                <linearGradient id="mgmtConnectionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffd700" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#8601F8" stopOpacity="0.1" />
                </linearGradient>
              </defs>
              {Array.from({ length: 4 }).map((_, i) => (
                <line
                  key={i}
                  x1={`${20 + (i * 20)}%`}
                  y1={`${30 + (i * 15)}%`}
                  x2={`${40 + (i * 15)}%`}
                  y2={`${45 + (i * 10)}%`}
                  stroke="url(#mgmtConnectionGradient)"
                  strokeWidth="1"
                  className="animate-pulse"
                  style={{ animationDelay: `${i * 0.8}s` }}
                />
              ))}
            </svg>
            
            {/* Leadership competency radar */}
            <div className="absolute bottom-10 left-10 opacity-30">
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 border border-[#ffd700]/30 rounded-full" />
                <div className="absolute inset-2 border border-[#8601F8]/30 rounded-full" />
                <div className="absolute inset-4 border border-[#00FF99]/30 rounded-full" />
                {/* Leadership metrics points */}
                {['Visão', 'Decisão', 'Comunicação', 'Influência'].map((skill, i) => (
                  <div 
                    key={i}
                    className="absolute w-2 h-2 bg-[#ffd700] rounded-full animate-pulse"
                    style={{
                      top: `${50 + 30 * Math.cos(i * Math.PI / 2)}%`,
                      left: `${50 + 30 * Math.sin(i * Math.PI / 2)}%`,
                      animationDelay: `${i * 0.3}s`
                    }}
                  />
                ))}
              </div>
            </div>
            
            {/* Executive command center */}
            <div className="absolute top-16 right-16 opacity-20">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 border-2 border-[#ffd700] rounded-full animate-ping" />
                <div className="absolute inset-2 border border-[#8601F8] rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
                <div className="absolute inset-4 bg-[#00FF99] rounded-full animate-bounce" style={{ animationDelay: '1s' }} />
                {/* Strategic elements orbiting */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-[#ffd700] rounded-full animate-spin" style={{ animationDuration: '4s' }} />
                <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-[#8601F8] rounded-full animate-spin" style={{ animationDuration: '3s', animationDelay: '1s' }} />
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-3 h-3 bg-[#00FF99] rounded-full animate-spin" style={{ animationDuration: '5s', animationDelay: '0.5s' }} />
                <div className="absolute top-1/2 left-0 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-[#00d9ff] rounded-full animate-spin" style={{ animationDuration: '3.5s', animationDelay: '1.5s' }} />
              </div>
            </div>
          </div>
          <h1 className="text-6xl md:text-8xl font-bold mb-8 animate-fade-in">
            <span className="text-white">Liderança </span>
            <span className="bg-gradient-to-r from-[#ffd700] to-[#ffb347] bg-clip-text text-transparent">Estratégica</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-5xl mx-auto leading-relaxed">
            Desenvolva líderes excepcionais com simulações executivas e IA conversacional 
            especializada em gestão estratégica e tomada de decisão.
          </p>
          
        </div>
      </section>

      {/* Funcionalidades Section */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <p className="text-sm text-black/60 mb-4 uppercase tracking-wider">Funcionalidades Executivas</p>
            <h2 className="text-4xl md:text-6xl font-bold text-black mb-8">
              Tecnologia para <span className="bg-gradient-to-r from-[#ffd700] to-[#ffb347] bg-clip-text text-transparent">Líderes de Elite</span>
            </h2>
            <p className="text-xl md:text-2xl text-black/70 max-w-4xl mx-auto">
              Forme líderes estratégicos com simulações executivas, decisões complexas e IA especializada em gestão corporativa.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {/* Liderança Estratégica */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur rounded-2xl p-8 text-center space-y-6 hover:scale-105 hover:shadow-2xl transition-all duration-300 border border-black/10">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-[#ffd700]/30 to-[#ffb347]/20 flex items-center justify-center">
                <Crown className="w-8 h-8 text-[#ffd700]" />
              </div>
              <h3 className="text-xl font-bold text-black">Liderança Estratégica</h3>
              <p className="text-black/70">
                Simulações de reuniões executivas, apresentações para board e tomada de decisões estratégicas críticas
              </p>
            </div>

            {/* Comunicação Executiva */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur rounded-2xl p-8 text-center space-y-6 hover:scale-105 hover:shadow-2xl transition-all duration-300 border border-black/10">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-[#8601F8]/30 to-[#d946ef]/20 flex items-center justify-center">
                <MessageSquare className="w-8 h-8 text-[#8601F8]" />
              </div>
              <h3 className="text-xl font-bold text-black">Comunicação Executiva</h3>
              <p className="text-black/70">
                Desenvolva habilidades de comunicação para stakeholders, investidores e equipes multidisciplinares
              </p>
            </div>

            {/* Gestão de Crises */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur rounded-2xl p-8 text-center space-y-6 hover:scale-105 hover:shadow-2xl transition-all duration-300 border border-black/10">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-[#dc2626]/30 to-[#ef4444]/20 flex items-center justify-center">
                <Shield className="w-8 h-8 text-[#dc2626]" />
              </div>
              <h3 className="text-xl font-bold text-black">Gestão de Crises</h3>
              <p className="text-black/70">
                Simulações de cenários críticos, tomada de decisão sob pressão e comunicação em situações de crise
              </p>
            </div>

            {/* Negociação Empresarial */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur rounded-2xl p-8 text-center space-y-6 hover:scale-105 hover:shadow-2xl transition-all duration-300 border border-black/10">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-[#00FF99]/30 to-[#00d9ff]/20 flex items-center justify-center">
                <Briefcase className="w-8 h-8 text-[#00FF99]" />
              </div>
              <h3 className="text-xl font-bold text-black">Negociação Empresarial</h3>
              <p className="text-black/70">
                IA especializada em negociações complexas, fusões, aquisições e parcerias estratégicas
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Impacto Section */}
      <section className="py-32 bg-midnight">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">
              Impacto na sua Liderança
            </h2>
            <p className="text-xl md:text-2xl text-white/70 max-w-4xl mx-auto">
              Empresas que usam o Synapse Gestão desenvolvem líderes mais preparados e estratégicos
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Decisões Mais Assertivas */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur rounded-2xl p-8 text-center space-y-6 hover:scale-105 hover:shadow-2xl transition-all duration-300 border border-white/20">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-[#ffd700]/30 to-[#ffb347]/20 flex items-center justify-center">
                <Target className="w-8 h-8 text-[#ffd700]" />
              </div>
              <h3 className="text-xl font-bold text-white">Decisões Mais Assertivas</h3>
              <p className="text-white/70">
                Melhore a qualidade das decisões estratégicas com simulações de cenários complexos e feedback em tempo real
              </p>
            </div>

            {/* Comunicação Eficaz */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur rounded-2xl p-8 text-center space-y-6 hover:scale-105 hover:shadow-2xl transition-all duration-300 border border-white/20">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-[#8601F8]/30 to-[#d946ef]/20 flex items-center justify-center">
                <MessageSquare className="w-8 h-8 text-[#8601F8]" />
              </div>
              <h3 className="text-xl font-bold text-white">Comunicação Eficaz</h3>
              <p className="text-white/70">
                Desenvolva habilidades de comunicação executiva para influenciar stakeholders e motivar equipes
              </p>
            </div>

            {/* Liderança Transformacional */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur rounded-2xl p-8 text-center space-y-6 hover:scale-105 hover:shadow-2xl transition-all duration-300 border border-white/20">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-[#00FF99]/30 to-[#00d9ff]/20 flex items-center justify-center">
                <Crown className="w-8 h-8 text-[#00FF99]" />
              </div>
              <h3 className="text-xl font-bold text-white">Liderança Transformacional</h3>
              <p className="text-white/70">
                Forme líderes capazes de conduzir mudanças organizacionais e inspirar equipes de alta performance
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-32 bg-gradient-to-br from-white/5 to-transparent">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">
            Pronto para Formar Líderes Excepcionais?
          </h2>
          <p className="text-xl md:text-2xl text-white/70 mb-12 max-w-4xl mx-auto">
            Transforme sua organização com líderes estratégicos formados pela melhor IA conversacional do mercado.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/contato" 
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-xl border border-white/20 backdrop-blur transition-all duration-300"
            >
              Falar com Especialista
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}