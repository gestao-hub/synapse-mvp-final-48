import { Link } from 'react-router-dom';
import { 
  Users, 
  Target, 
  Shield, 
  Award,
  CheckCircle,
  ArrowRight,
  UserCheck,
  TrendingUp,
  BarChart
} from 'lucide-react';

export default function SynapseRH() {
  return (
    <div className="min-h-screen bg-midnight text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-screen flex items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-[#2a1b4f] via-[#4a3b8a] to-[#6b5cb8]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        
        <div className="relative container mx-auto px-6 py-32 text-center">
          {/* Animated background elements for HR context */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Floating HR metrics */}
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
                  <div className="w-8 h-8 bg-gradient-to-r from-[#d946ef]/30 to-[#8b5cf6]/30 rounded-lg flex items-center justify-center">
                    <span className="text-[#d946ef] text-xs font-bold">👥</span>
                  </div>
                )}
                {i % 4 === 1 && (
                  <div className="w-10 h-6 bg-gradient-to-r from-[#00FF99]/20 to-[#00d9ff]/20 rounded-md flex items-center justify-center">
                    <span className="text-[#00FF99] text-xs">-{15 + (i * 3)}% turn</span>
                  </div>
                )}
                {i % 4 === 2 && (
                  <div className="w-6 h-6 bg-[#8601F8]/30 rounded-full animate-pulse" />
                )}
                {i % 4 === 3 && (
                  <div className="w-12 h-4 bg-gradient-to-r from-[#d946ef]/30 to-[#8b5cf6]/30 rounded-full flex items-center justify-center">
                    <span className="text-[#d946ef] text-xs">🎯</span>
                  </div>
                )}
              </div>
            ))}
            
            {/* Organization chart connections */}
            <svg className="absolute inset-0 w-full h-full" style={{ zIndex: -1 }}>
              <defs>
                <linearGradient id="hrConnectionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#d946ef" stopOpacity="0.2" />
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
                  stroke="url(#hrConnectionGradient)"
                  strokeWidth="1"
                  className="animate-pulse"
                  style={{ animationDelay: `${i * 0.8}s` }}
                />
              ))}
            </svg>
            
            {/* Skills development bars */}
            <div className="absolute bottom-10 left-10 opacity-30">
              <div className="space-y-1">
                {['Comunicação', 'Liderança', 'Soft Skills'].map((skill, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <span className="text-[#d946ef] text-xs w-16">{skill}</span>
                    <div className="bg-white/20 h-1 w-12 rounded-full">
                      <div 
                        className="bg-gradient-to-r from-[#d946ef] to-[#8b5cf6] h-1 rounded-full animate-pulse"
                        style={{ 
                          width: `${60 + (i * 15)}%`,
                          animationDelay: `${i * 0.3}s` 
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Team network */}
            <div className="absolute top-16 right-16 opacity-20">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 border-2 border-[#d946ef] rounded-full animate-ping" />
                <div className="absolute inset-2 border border-[#8601F8] rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
                <div className="absolute inset-4 bg-[#00FF99] rounded-full animate-bounce" style={{ animationDelay: '1s' }} />
                {/* Mini team icons around */}
                <div className="absolute -top-2 -left-2 w-3 h-3 bg-[#d946ef] rounded-full animate-pulse" />
                <div className="absolute -top-2 -right-2 w-3 h-3 bg-[#8b5cf6] rounded-full animate-pulse" style={{ animationDelay: '0.3s' }} />
                <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-[#00FF99] rounded-full animate-pulse" style={{ animationDelay: '0.6s' }} />
              </div>
            </div>
          </div>
          <h1 className="text-6xl md:text-8xl font-bold mb-8 animate-fade-in">
            <span className="text-white">Pessoas </span>
            <span className="bg-gradient-to-r from-[#d946ef] to-[#8b5cf6] bg-clip-text text-transparent">Inteligentes</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-5xl mx-auto leading-relaxed">
            Desenvolva talentos com entrevistas simuladas e desenvolvimento personalizado 
            por IA conversacional especializada em RH.
          </p>
          
        </div>
      </section>

      {/* Funcionalidades Section */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <p className="text-sm text-black/60 mb-4 uppercase tracking-wider">Funcionalidades de RH</p>
            <h2 className="text-4xl md:text-6xl font-bold text-black mb-8">
              Tecnologia para <span className="bg-gradient-to-r from-[#d946ef] to-[#8b5cf6] bg-clip-text text-transparent">Gestão de Pessoas</span>
            </h2>
            <p className="text-xl md:text-2xl text-black/70 max-w-4xl mx-auto">
              Revolucione seus processos de RH com IA conversacional, desenvolvimento personalizado e compliance automatizado.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {/* Recrutamento */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur rounded-2xl p-8 text-center space-y-6 hover:scale-105 hover:shadow-2xl transition-all duration-300 border border-black/10">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-[#d946ef]/30 to-[#8b5cf6]/20 flex items-center justify-center">
                <Users className="w-8 h-8 text-[#d946ef]" />
              </div>
              <h3 className="text-xl font-bold text-black">Entrevistas Simuladas</h3>
              <p className="text-black/70">
                Prepare candidatos e recrutadores com simulações de perguntas comportamentais e técnicas
              </p>
            </div>

            {/* Desenvolvimento */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur rounded-2xl p-8 text-center space-y-6 hover:scale-105 hover:shadow-2xl transition-all duration-300 border border-black/10">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-[#00FF99]/30 to-[#00d9ff]/20 flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-[#00FF99]" />
              </div>
              <h3 className="text-xl font-bold text-black">Planos de Desenvolvimento</h3>
              <p className="text-black/70">
                Mapeamento de competências, trilhas de aprendizado, mentoria virtual e avaliação 360°
              </p>
            </div>

            {/* Compliance */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur rounded-2xl p-8 text-center space-y-6 hover:scale-105 hover:shadow-2xl transition-all duration-300 border border-black/10">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-[#8601F8]/30 to-[#d946ef]/20 flex items-center justify-center">
                <Shield className="w-8 h-8 text-[#8601F8]" />
              </div>
              <h3 className="text-xl font-bold text-black">Treinamentos de Compliance</h3>
              <p className="text-black/70">
                LGPD, código de ética, segurança do trabalho com certificações automáticas
              </p>
            </div>

            {/* Soft Skills */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur rounded-2xl p-8 text-center space-y-6 hover:scale-105 hover:shadow-2xl transition-all duration-300 border border-black/10">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-[#8b5cf6]/30 to-[#d946ef]/20 flex items-center justify-center">
                <Award className="w-8 h-8 text-[#8b5cf6]" />
              </div>
              <h3 className="text-xl font-bold text-black">Avaliação de Soft Skills</h3>
              <p className="text-black/70">
                IA especializada em identificar e desenvolver habilidades comportamentais essenciais
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
              Impacto na sua Gestão de Pessoas
            </h2>
            <p className="text-xl md:text-2xl text-white/70 max-w-4xl mx-auto">
              Empresas que usam o Synapse RH melhoram significativamente seus processos de recrutamento e desenvolvimento
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Recrutamento Eficiente */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur rounded-2xl p-8 text-center space-y-6 hover:scale-105 hover:shadow-2xl transition-all duration-300 border border-white/20">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-[#d946ef]/30 to-[#8b5cf6]/20 flex items-center justify-center">
                <Users className="w-8 h-8 text-[#d946ef]" />
              </div>
              <h3 className="text-xl font-bold text-white">Recrutamento Eficiente</h3>
              <p className="text-white/70">
                Reduza o tempo de contratação com simulações que preparam tanto candidatos quanto recrutadores
              </p>
            </div>

            {/* Desenvolvimento Contínuo */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur rounded-2xl p-8 text-center space-y-6 hover:scale-105 hover:shadow-2xl transition-all duration-300 border border-white/20">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-[#8601F8]/30 to-[#d946ef]/20 flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-[#8601F8]" />
              </div>
              <h3 className="text-xl font-bold text-white">Desenvolvimento Contínuo</h3>
              <p className="text-white/70">
                Crie planos de carreira personalizados baseados em competências e objetivos individuais
              </p>
            </div>

            {/* Compliance Garantido */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur rounded-2xl p-8 text-center space-y-6 hover:scale-105 hover:shadow-2xl transition-all duration-300 border border-white/20">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-[#00FF99]/30 to-[#00d9ff]/20 flex items-center justify-center">
                <Shield className="w-8 h-8 text-[#00FF99]" />
              </div>
              <h3 className="text-xl font-bold text-white">Compliance Garantido</h3>
              <p className="text-white/70">
                Mantenha sua empresa sempre em conformidade com treinamentos obrigatórios automatizados
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-32 bg-gradient-to-br from-white/5 to-transparent">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">
            Pronto para Revolucionar Seus Treinamentos?
          </h2>
          <p className="text-xl md:text-2xl text-white/70 mb-12 max-w-4xl mx-auto">
            Transforme sua gestão de pessoas com IA conversacional que desenvolve talentos e otimiza processos.
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