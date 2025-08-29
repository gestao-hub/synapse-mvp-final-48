import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  Target, 
  BarChart, 
  Award,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

export default function SynapseComercial() {
  return (
    <div className="min-h-screen bg-midnight text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-screen flex items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-[#2a1b4f] via-[#4a3b8a] to-[#6b5cb8]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        
        <div className="relative container mx-auto px-6 py-32 text-center">
          {/* Animated background elements for sales context */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Floating sales metrics */}
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
                  <div className="w-8 h-8 bg-gradient-to-r from-[#00d9ff]/30 to-[#00a8cc]/30 rounded-lg flex items-center justify-center">
                    <span className="text-[#00d9ff] text-xs font-bold">📈</span>
                  </div>
                )}
                {i % 4 === 1 && (
                  <div className="w-10 h-6 bg-gradient-to-r from-[#00FF99]/20 to-[#00d9ff]/20 rounded-md flex items-center justify-center">
                    <span className="text-[#00FF99] text-xs">+{20 + (i * 5)}%</span>
                  </div>
                )}
                {i % 4 === 2 && (
                  <div className="w-6 h-6 bg-[#8601F8]/30 rounded-full animate-pulse" />
                )}
                {i % 4 === 3 && (
                  <div className="w-12 h-4 bg-gradient-to-r from-[#ffd700]/30 to-[#ffb347]/30 rounded-full flex items-center justify-center">
                    <span className="text-[#ffd700] text-xs">💰</span>
                  </div>
                )}
              </div>
            ))}
            
            {/* Floating connection lines */}
            <svg className="absolute inset-0 w-full h-full" style={{ zIndex: -1 }}>
              <defs>
                <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00d9ff" stopOpacity="0.2" />
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
                  stroke="url(#connectionGradient)"
                  strokeWidth="1"
                  className="animate-pulse"
                  style={{ animationDelay: `${i * 0.8}s` }}
                />
              ))}
            </svg>
            
            {/* Rising success indicators */}
            <div className="absolute bottom-10 left-10 opacity-30">
              <div className="flex items-end space-x-1">
                {[0.4, 0.6, 0.8, 1.0, 0.9].map((height, i) => (
                  <div
                    key={i}
                    className="bg-gradient-to-t from-[#00FF99] to-[#00d9ff] w-2 animate-pulse"
                    style={{
                      height: `${height * 40}px`,
                      animationDelay: `${i * 0.2}s`,
                    }}
                  />
                ))}
              </div>
            </div>
            
            {/* Target/goal circles */}
            <div className="absolute top-16 right-16 opacity-20">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 border-2 border-[#00d9ff] rounded-full animate-ping" />
                <div className="absolute inset-2 border border-[#8601F8] rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
                <div className="absolute inset-4 bg-[#00FF99] rounded-full animate-bounce" style={{ animationDelay: '1s' }} />
              </div>
            </div>
          </div>
          <h1 className="text-6xl md:text-8xl font-bold mb-8 animate-fade-in">
            <span className="text-white">Vendas </span>
            <span className="bg-gradient-to-r from-[#00d9ff] to-[#00a8cc] bg-clip-text text-transparent">Inteligentes</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-5xl mx-auto leading-relaxed">
            Treine sua equipe comercial com simulações realistas de vendas com uma IA 
            conversacional especializada em técnicas de negociação.
          </p>
          
        </div>
      </section>

      {/* Funcionalidades Section */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <p className="text-sm text-black/60 mb-4 uppercase tracking-wider">Funcionalidades Comerciais</p>
            <h2 className="text-4xl md:text-6xl font-bold text-black mb-8">
              Tecnologia para <span className="bg-gradient-to-r from-[#00d9ff] to-[#00a8cc] bg-clip-text text-transparent">Vendedores de Elite</span>
            </h2>
            <p className="text-xl md:text-2xl text-black/70 max-w-4xl mx-auto">
              Transforme sua equipe comercial com simulações realistas, métricas avançadas e IA especializada em vendas.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {/* Simulação */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur rounded-2xl p-8 text-center space-y-6 hover:scale-105 hover:shadow-2xl transition-all duration-300 border border-black/10">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-[#00d9ff]/30 to-[#00a8cc]/20 flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-[#00d9ff]" />
              </div>
              <h3 className="text-xl font-bold text-black">Simulações de Vendas</h3>
              <p className="text-black/70">
                Treine técnicas de vendas com cenários realistas de objeções, pitch de produtos e fechamento de vendas
              </p>
            </div>

            {/* Analytics */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur rounded-2xl p-8 text-center space-y-6 hover:scale-105 hover:shadow-2xl transition-all duration-300 border border-black/10">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-[#8601F8]/30 to-[#d946ef]/20 flex items-center justify-center">
                <BarChart className="w-8 h-8 text-[#8601F8]" />
              </div>
              <h3 className="text-xl font-bold text-black">Métricas de Performance</h3>
              <p className="text-black/70">
                Dashboard com taxa de conversão, tempo médio de venda, score de habilidades e ROI de treinamento
              </p>
            </div>

            {/* Negociação */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur rounded-2xl p-8 text-center space-y-6 hover:scale-105 hover:shadow-2xl transition-all duration-300 border border-black/10">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-[#00FF99]/30 to-[#00d9ff]/20 flex items-center justify-center">
                <Target className="w-8 h-8 text-[#00FF99]" />
              </div>
              <h3 className="text-xl font-bold text-black">Negociação Avançada</h3>
              <p className="text-black/70">
                IA especializada em técnicas de negociação, objeções complexas e estratégias de fechamento
              </p>
            </div>

            {/* Gamificação */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur rounded-2xl p-8 text-center space-y-6 hover:scale-105 hover:shadow-2xl transition-all duration-300 border border-black/10">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-[#d946ef]/30 to-[#8b5cf6]/20 flex items-center justify-center">
                <Award className="w-8 h-8 text-[#d946ef]" />
              </div>
              <h3 className="text-xl font-bold text-black">Gamificação de Vendas</h3>
              <p className="text-black/70">
                Sistema de rankings, pontuação, recompensas virtuais e desafios mensais para motivar equipes
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
              Impacto no seu Comercial
            </h2>
            <p className="text-xl md:text-2xl text-white/70 max-w-4xl mx-auto">
              Empresas que usam o Synapse Comercial relatam melhorias significativas em performance de vendas
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Aumento de Conversão */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur rounded-2xl p-8 text-center space-y-6 hover:scale-105 hover:shadow-2xl transition-all duration-300 border border-white/20">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-[#00FF99]/30 to-[#00d9ff]/20 flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-[#00FF99]" />
              </div>
              <h3 className="text-xl font-bold text-white">Aumento de Conversão</h3>
              <p className="text-white/70">
                Melhore suas taxas de conversão com treinamentos focados em técnicas de vendas comprovadas
              </p>
            </div>

            {/* Ciclo de Vendas Otimizado */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur rounded-2xl p-8 text-center space-y-6 hover:scale-105 hover:shadow-2xl transition-all duration-300 border border-white/20">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-[#8601F8]/30 to-[#d946ef]/20 flex items-center justify-center">
                <Target className="w-8 h-8 text-[#8601F8]" />
              </div>
              <h3 className="text-xl font-bold text-white">Ciclo de Vendas Otimizado</h3>
              <p className="text-white/70">
                Reduza o tempo do ciclo de vendas através de simulações práticas e feedback personalizado
              </p>
            </div>

            {/* ROI Comprovado */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur rounded-2xl p-8 text-center space-y-6 hover:scale-105 hover:shadow-2xl transition-all duration-300 border border-white/20">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-[#00d9ff]/30 to-[#00a8cc]/20 flex items-center justify-center">
                <BarChart className="w-8 h-8 text-[#00d9ff]" />
              </div>
              <h3 className="text-xl font-bold text-white">ROI Comprovado</h3>
              <p className="text-white/70">
                Meça o retorno sobre investimento em treinamentos com métricas detalhadas e comparativos
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
            Experimente o poder da IA conversacional para transformar sua equipe comercial em vendedores de elite.
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