import { Link } from 'react-router-dom';
import { 
  GraduationCap, 
  BookOpen, 
  Users, 
  Award,
  CheckCircle,
  ArrowRight,
  UserCheck,
  TrendingUp,
  BarChart,
  Presentation
} from 'lucide-react';

export default function SynapseEducacional() {
  return (
    <div className="min-h-screen bg-midnight text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-screen flex items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-[#2a1b4f] via-[#4a3b8a] to-[#6b5cb8]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        
        <div className="relative container mx-auto px-6 py-32 text-center">
          {/* Animated background elements for education context */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Floating educational metrics */}
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
                  <div className="w-8 h-8 bg-gradient-to-r from-[#3b82f6]/30 to-[#1d4ed8]/30 rounded-lg flex items-center justify-center">
                    <span className="text-[#3b82f6] text-xs font-bold">📚</span>
                  </div>
                )}
                {i % 4 === 1 && (
                  <div className="w-10 h-6 bg-gradient-to-r from-[#00FF99]/20 to-[#00d9ff]/20 rounded-md flex items-center justify-center">
                    <span className="text-[#00FF99] text-xs">+{85 + (i * 2)}% eng</span>
                  </div>
                )}
                {i % 4 === 2 && (
                  <div className="w-6 h-6 bg-[#8601F8]/30 rounded-full animate-pulse" />
                )}
                {i % 4 === 3 && (
                  <div className="w-12 h-4 bg-gradient-to-r from-[#3b82f6]/30 to-[#1d4ed8]/30 rounded-full flex items-center justify-center">
                    <span className="text-[#3b82f6] text-xs">🎓</span>
                  </div>
                )}
              </div>
            ))}
            
            {/* Knowledge network connections */}
            <svg className="absolute inset-0 w-full h-full" style={{ zIndex: -1 }}>
              <defs>
                <linearGradient id="eduConnectionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
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
                  stroke="url(#eduConnectionGradient)"
                  strokeWidth="1"
                  className="animate-pulse"
                  style={{ animationDelay: `${i * 0.8}s` }}
                />
              ))}
            </svg>
            
            {/* Learning progress indicators */}
            <div className="absolute bottom-10 left-10 opacity-30">
              <div className="space-y-2">
                {['Retenção', 'Engajamento', 'Certificações'].map((metric, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <span className="text-[#3b82f6] text-xs w-20">{metric}</span>
                    <div className="flex space-x-1">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <div 
                          key={j}
                          className="w-2 h-4 bg-gradient-to-t from-[#3b82f6] to-[#00d9ff] animate-pulse"
                          style={{ 
                            height: j <= (2 + i) ? '16px' : '8px',
                            animationDelay: `${j * 0.2 + i * 0.3}s` 
                          }}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Academic achievement badge */}
            <div className="absolute top-16 right-16 opacity-20">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 border-2 border-[#3b82f6] rounded-full animate-ping" />
                <div className="absolute inset-2 border border-[#8601F8] rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
                <div className="absolute inset-4 bg-[#00FF99] rounded-full animate-bounce" style={{ animationDelay: '1s' }} />
                {/* Academic elements floating around */}
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 text-xs animate-bounce" style={{ animationDelay: '0.2s' }}>🏆</div>
                <div className="absolute top-1/2 -right-3 transform -translate-y-1/2 text-xs animate-bounce" style={{ animationDelay: '0.4s' }}>📖</div>
                <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 text-xs animate-bounce" style={{ animationDelay: '0.6s' }}>💡</div>
              </div>
            </div>
          </div>
          <h1 className="text-6xl md:text-8xl font-bold mb-8 animate-fade-in">
            <span className="text-white">Educação </span>
            <span className="bg-gradient-to-r from-[#3b82f6] to-[#1d4ed8] bg-clip-text text-transparent">Inteligente</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-5xl mx-auto leading-relaxed">
            Revolucione o ensino com IA conversacional para práticas de apresentação, debates 
            acadêmicos e preparação profissional.
          </p>
          
        </div>
      </section>

      {/* Funcionalidades Section */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <p className="text-sm text-black/60 mb-4 uppercase tracking-wider">Funcionalidades Educacionais</p>
            <h2 className="text-4xl md:text-6xl font-bold text-black mb-8">
              Tecnologia para <span className="bg-gradient-to-r from-[#3b82f6] to-[#1d4ed8] bg-clip-text text-transparent">Educadores Inovadores</span>
            </h2>
            <p className="text-xl md:text-2xl text-black/70 max-w-4xl mx-auto">
              Transforme o ensino com IA conversacional, simulações acadêmicas e avaliação automatizada.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {/* Apresentações */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur rounded-2xl p-8 text-center space-y-6 hover:scale-105 hover:shadow-2xl transition-all duration-300 border border-black/10">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-[#3b82f6]/30 to-[#1d4ed8]/20 flex items-center justify-center">
                <Presentation className="w-8 h-8 text-[#3b82f6]" />
              </div>
              <h3 className="text-xl font-bold text-black">Apresentações Simuladas</h3>
              <p className="text-black/70">
                Simulações de apresentações acadêmicas, defesas de tese e pitch de projetos com feedback em tempo real
              </p>
            </div>

            {/* Debates */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur rounded-2xl p-8 text-center space-y-6 hover:scale-105 hover:shadow-2xl transition-all duration-300 border border-black/10">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-[#8601F8]/30 to-[#d946ef]/20 flex items-center justify-center">
                <Users className="w-8 h-8 text-[#8601F8]" />
              </div>
              <h3 className="text-xl font-bold text-black">Debates Interativos</h3>
              <p className="text-black/70">
                Discussões acadêmicas estruturadas, argumentação científica e desenvolvimento de pensamento crítico
              </p>
            </div>

            {/* Avaliação */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur rounded-2xl p-8 text-center space-y-6 hover:scale-105 hover:shadow-2xl transition-all duration-300 border border-black/10">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-[#00FF99]/30 to-[#00d9ff]/20 flex items-center justify-center">
                <BarChart className="w-8 h-8 text-[#00FF99]" />
              </div>
              <h3 className="text-xl font-bold text-black">Avaliação Automática</h3>
              <p className="text-black/70">
                Sistema de avaliação inteligente com feedback personalizado e métricas de progresso acadêmico
              </p>
            </div>

            {/* Certificação */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur rounded-2xl p-8 text-center space-y-6 hover:scale-105 hover:shadow-2xl transition-all duration-300 border border-black/10">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-[#d946ef]/30 to-[#8b5cf6]/20 flex items-center justify-center">
                <Award className="w-8 h-8 text-[#d946ef]" />
              </div>
              <h3 className="text-xl font-bold text-black">Certificação Digital</h3>
              <p className="text-black/70">
                Emissão automática de certificados e badges digitais com validação blockchain para competências
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
              Impacto na sua Instituição
            </h2>
            <p className="text-xl md:text-2xl text-white/70 max-w-4xl mx-auto">
              Instituições que usam o Synapse Educacional transformam o aprendizado e engajamento dos estudantes
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Engajamento Estudantil */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur rounded-2xl p-8 text-center space-y-6 hover:scale-105 hover:shadow-2xl transition-all duration-300 border border-white/20">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-[#3b82f6]/30 to-[#1d4ed8]/20 flex items-center justify-center">
                <GraduationCap className="w-8 h-8 text-[#3b82f6]" />
              </div>
              <h3 className="text-xl font-bold text-white">Engajamento Estudantil</h3>
              <p className="text-white/70">
                Aumente a participação e interesse dos alunos com experiências de aprendizado interativas e personalizadas
              </p>
            </div>

            {/* Aprendizado Eficaz */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur rounded-2xl p-8 text-center space-y-6 hover:scale-105 hover:shadow-2xl transition-all duration-300 border border-white/20">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-[#8601F8]/30 to-[#d946ef]/20 flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-[#8601F8]" />
              </div>
              <h3 className="text-xl font-bold text-white">Aprendizado Eficaz</h3>
              <p className="text-white/70">
                Melhore a retenção de conhecimento com técnicas de aprendizagem ativa e feedback contínuo
              </p>
            </div>

            {/* Preparação Profissional */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur rounded-2xl p-8 text-center space-y-6 hover:scale-105 hover:shadow-2xl transition-all duration-300 border border-white/20">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-[#00FF99]/30 to-[#00d9ff]/20 flex items-center justify-center">
                <UserCheck className="w-8 h-8 text-[#00FF99]" />
              </div>
              <h3 className="text-xl font-bold text-white">Preparação Profissional</h3>
              <p className="text-white/70">
                Desenvolva habilidades essenciais para o mercado de trabalho através de simulações práticas
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-32 bg-gradient-to-br from-white/5 to-transparent">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">
            Pronto para Revolucionar a Educação?
          </h2>
          <p className="text-xl md:text-2xl text-white/70 mb-12 max-w-4xl mx-auto">
            Transforme sua instituição com IA conversacional que engaja estudantes e otimiza o aprendizado.
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