import { Link } from 'react-router-dom';
import { 
  Mic, 
  Brain, 
  Zap, 
  Shield, 
  Users, 
  GraduationCap, 
  TrendingUp, 
  HeadphonesIcon,
  Target,
  DollarSign,
  Briefcase,
  UserCheck,
  ArrowRight,
  Play
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import InteractiveTextAnimation from '@/components/InteractiveTextAnimation';
import ProductFlowAnimation from '@/components/ProductFlowAnimation';
import ChatAssistant from '@/components/ChatAssistant';
import AuroraBackground from '@/components/landing/AuroraBackground';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section - exact replication from reference */}
      <section className="relative overflow-hidden min-h-screen flex items-center">
        {/* Background gradient exactly like reference */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#2a1b4f] via-[#4a3b8a] to-[#6b5cb8]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        
        {/* Animated background elements */}
        <div className="absolute inset-0">
          {/* Floating particles */}
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/10 rounded-full animate-particle-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
          
          {/* Energy orbs */}
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/3 right-1/4 w-40 h-40 bg-spring/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        
        <div className="relative container mx-auto px-4 sm:px-6 py-6 text-center">
          {/* Synapse Title with enhanced hover effects */}
          <div className="relative group mb-8 sm:mb-12">
            {/* Background glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#d946ef] via-[#3b82f6] to-[#00d9ff] opacity-30 blur-3xl group-hover:opacity-50 transition-opacity duration-500" />
            
            {/* Main title */}
            <h1 className="relative text-6xl sm:text-8xl md:text-9xl font-bold bg-gradient-to-r from-[#8601F8] to-[#00FF99] bg-clip-text text-transparent tracking-tight group-hover:scale-105 transition-transform duration-500">
              Synapse
            </h1>
            
            {/* Animated rings around title on hover */}
          </div>
          
          {/* Interactive subtitle */}
          <div className="mb-6 sm:mb-8">
            <InteractiveTextAnimation 
              text="Revolucione sua empresa com Inteligência Artificial"
              className="text-2xl sm:text-4xl md:text-6xl font-bold max-w-6xl mx-auto leading-tight"
              specialWords={[
                { word: 'Revolucione', className: 'text-white' },
                { word: 'Inteligência', className: 'text-[#8601F8]' },
                { word: 'Artificial', className: 'text-[#00FF99]' }
              ]}
            />
          </div>
          
          <p className="text-lg sm:text-xl md:text-2xl text-white/70 mb-16 sm:mb-24 max-w-5xl mx-auto leading-relaxed px-4">
            A Excluv.ia Corporate desenvolve soluções de IA conversacional para transformar treinamentos, atendimento e processos empresariais com tecnologia de ponta.
          </p>

        </div>
      </section>

      {/* Second Section - interação conversacional ao vivo com Aurora Background */}
        <section className="relative py-32 flex items-center justify-center min-h-[600px] overflow-hidden" style={{ backgroundColor: '#000131' }}>
          
          {/* AURORA ANIMADA - IMPLEMENTAÇÃO DIRETA */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1
          }}>
            {/* Nebulosa Rotativa - Múltiplas Camadas */}
            
            {/* Camada 1 - Nebulosa Principal */}
            <div style={{
              position: 'absolute',
              width: '800px',
              height: '800px',
              background: 'conic-gradient(from 0deg, rgba(134,1,248,0.3), rgba(46,208,255,0.2), rgba(0,255,153,0.3), rgba(134,1,248,0.3))',
              borderRadius: '50%',
              filter: 'blur(40px)',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              animation: 'nebula-rotate-slow 15s linear infinite'
            }} />
            
            {/* Camada 2 - Nebulosa Secundária */}
            <div style={{
              position: 'absolute',
              width: '600px',
              height: '600px',
              background: 'conic-gradient(from 180deg, rgba(0,255,153,0.4), rgba(134,1,248,0.2), rgba(46,208,255,0.4), rgba(0,255,153,0.4))',
              borderRadius: '50%',
              filter: 'blur(50px)',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              animation: 'nebula-rotate-medium 12s linear infinite reverse'
            }} />
            
            {/* Camada 3 - Nebulosa Interna */}
            <div style={{
              position: 'absolute',
              width: '400px',
              height: '400px',
              background: 'conic-gradient(from 90deg, rgba(46,208,255,0.5), rgba(0,255,153,0.3), rgba(134,1,248,0.5), rgba(46,208,255,0.5))',
              borderRadius: '50%',
              filter: 'blur(30px)',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              animation: 'nebula-rotate-fast 8s linear infinite'
            }} />
            
            {/* Camada 4 - Núcleo Central */}
            <div style={{
              position: 'absolute',
              width: '200px',
              height: '200px',
              background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(134,1,248,0.6) 40%, transparent 70%)',
              borderRadius: '50%',
              filter: 'blur(20px)',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              animation: 'nebula-pulse 2s ease-in-out infinite'
            }} />
            
            {/* Blob 1 - Roxo (mantido para complementar) */}
            <div style={{
              position: 'absolute',
              width: '300px',
              height: '300px',
              background: 'radial-gradient(circle, rgba(134,1,248,0.4) 0%, transparent 70%)',
              borderRadius: '50%',
              filter: 'blur(60px)',
              left: '10%',
              top: '15%',
              animation: 'auroraFloat1 22s ease-in-out infinite'
            }} />
            
            {/* Blob 2 - Verde (mantido para complementar) */}
            <div style={{
              position: 'absolute',
              width: '280px',
              height: '280px',
              background: 'radial-gradient(circle, rgba(0,255,153,0.3) 0%, transparent 70%)',
              borderRadius: '50%',
              filter: 'blur(60px)',
              right: '8%',
              top: '10%',
              animation: 'auroraFloat2 26s ease-in-out infinite'
            }} />
            
            {/* Blob 3 - Azul (mantido para complementar) */}
            <div style={{
              position: 'absolute',
              width: '320px',
              height: '320px',
              background: 'radial-gradient(circle, rgba(46,208,255,0.3) 0%, transparent 70%)',
              borderRadius: '50%',
              filter: 'blur(60px)',
              left: '35%',
              bottom: '-5%',
              animation: 'auroraFloat3 28s ease-in-out infinite'
            }} />
          </div>
          
          <div className="container mx-auto px-4 sm:px-6 text-center relative z-20">
            <h2 className="text-3xl sm:text-5xl md:text-7xl font-bold mb-8 sm:mb-12 leading-tight">
              <span className="text-white drop-shadow-lg">interação conversacional </span>
              <span className="text-white drop-shadow-lg">ao vivo</span>
              <span className="text-white drop-shadow-lg"> com </span>
              <span className="bg-gradient-to-r from-[#d946ef] to-[#8b5cf6] bg-clip-text text-transparent drop-shadow-lg">I.A</span>
            </h2>
            
            <p className="text-lg sm:text-xl md:text-2xl text-white/95 max-w-5xl mx-auto leading-relaxed drop-shadow-md px-4">
              Experimente o futuro da comunicação empresarial com tecnologia de ponta que transforma cada interação em uma experiência única e inteligente.
            </p>
          </div>
        </section>

      <section className="py-16 sm:py-32 bg-midnight">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-20">
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-4 sm:mb-6">
              Soluções Empresariais Inovadoras
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-white/70 max-w-4xl mx-auto px-4">
              Transformamos desafios empresariais em oportunidades com IA conversacional avançada
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 max-w-7xl mx-auto">
            <div className="bg-gradient-to-br from-purple/20 to-purple/10 backdrop-blur rounded-2xl p-6 sm:p-8 text-center space-y-4 sm:space-y-6 hover:scale-105 hover:shadow-2xl hover:bg-gradient-to-br hover:from-purple/30 hover:to-purple/20 transition-all duration-300 border border-purple/20">
              <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto rounded-full bg-purple/30 flex items-center justify-center">
                <Mic className="w-6 h-6 sm:w-8 sm:h-8 text-purple" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white">IA Conversacional</h3>
              <p className="text-sm sm:text-base text-white/70">
                Interações naturais e inteligentes com tecnologia de ponta
              </p>
            </div>

            <div className="bg-gradient-to-br from-spring/20 to-spring/10 backdrop-blur rounded-2xl p-6 sm:p-8 text-center space-y-4 sm:space-y-6 hover:scale-105 hover:shadow-2xl hover:bg-gradient-to-br hover:from-spring/30 hover:to-spring/20 transition-all duration-300 border border-spring/20">
              <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto rounded-full bg-spring/30 flex items-center justify-center">
                <Target className="w-6 h-6 sm:w-8 sm:h-8 text-spring" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white">Treinamento Personalizado</h3>
              <p className="text-sm sm:text-base text-white/70">
                Soluções adaptadas às necessidades específicas da sua empresa
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple/20 to-purple/10 backdrop-blur rounded-2xl p-6 sm:p-8 text-center space-y-4 sm:space-y-6 hover:scale-105 hover:shadow-2xl hover:bg-gradient-to-br hover:from-purple/30 hover:to-purple/20 transition-all duration-300 border border-purple/20">
              <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto rounded-full bg-purple/30 flex items-center justify-center">
                <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-purple" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white">Resultados Rápidos</h3>
              <p className="text-sm sm:text-base text-white/70">
                Implementação ágil com impacto imediato nos resultados
              </p>
            </div>

            <div className="bg-gradient-to-br from-spring/20 to-spring/10 backdrop-blur rounded-2xl p-6 sm:p-8 text-center space-y-4 sm:space-y-6 hover:scale-105 hover:shadow-2xl hover:bg-gradient-to-br hover:from-spring/30 hover:to-spring/20 transition-all duration-300 border border-spring/20">
              <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto rounded-full bg-spring/30 flex items-center justify-center">
                <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-spring" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white">Segurança Empresarial</h3>
              <p className="text-sm sm:text-base text-white/70">
                Proteção de dados e conformidade com padrões corporativos
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Nichos de Aplicação */}
      <section className="py-16 sm:py-32 bg-white/5">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-20">
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-4 sm:mb-6">
              Nichos de Aplicação
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-white/70 max-w-4xl mx-auto px-4">
              Descubra como o Synapse pode transformar diferentes áreas da sua empresa com soluções personalizadas
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto">
            <div className="card p-6 sm:p-8 space-y-4 sm:space-y-6 hover:scale-105 hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-white/10 to-white/5 border border-white/20">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br from-purple/30 to-purple/20 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-purple" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white">Vendas Corporativas</h3>
              <p className="text-white/70 text-base sm:text-lg leading-relaxed">
                Treine equipes comerciais com simulações realistas de negociação, objeções e fechamento. 
                Melhore conversões e desenvolva habilidades de vendas com feedback instantâneo.
              </p>
            </div>

            <div className="card p-6 sm:p-8 space-y-4 sm:space-y-6 hover:scale-105 hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-white/10 to-white/5 border border-white/20">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br from-spring/30 to-spring/20 flex items-center justify-center">
                <Users className="w-6 h-6 sm:w-8 sm:h-8 text-spring" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white">Treinamento de RH</h3>
              <p className="text-white/70 text-base sm:text-lg leading-relaxed">
                Capacite profissionais de RH em processos seletivos, entrevistas comportamentais e 
                gestão de conflitos com simulações interativas e avaliações detalhadas.
              </p>
            </div>

            <div className="card p-6 sm:p-8 space-y-4 sm:space-y-6 hover:scale-105 hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-white/10 to-white/5 border border-white/20">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br from-purple/30 to-purple/20 flex items-center justify-center">
                <GraduationCap className="w-6 h-6 sm:w-8 sm:h-8 text-purple" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white">Educação/Faculdades</h3>
              <p className="text-white/70 text-base sm:text-lg leading-relaxed">
                Revolucione o ensino com IA conversacional para práticas de apresentação, debates 
                acadêmicos e preparação profissional. Engaje estudantes com aprendizado interativo.
              </p>
            </div>

            <div className="card p-6 sm:p-8 space-y-4 sm:space-y-6 hover:scale-105 hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-white/10 to-white/5 border border-white/20">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br from-spring/30 to-spring/20 flex items-center justify-center">
                <HeadphonesIcon className="w-6 h-6 sm:w-8 sm:h-8 text-spring" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white">Atendimento ao Cliente</h3>
              <p className="text-white/70 text-base sm:text-lg leading-relaxed">
                Aprimore habilidades de atendimento com cenários complexos de suporte, resolução 
                de problemas e gestão de clientes difíceis através de simulações realistas.
              </p>
            </div>

            <div className="card p-6 sm:p-8 space-y-4 sm:space-y-6 hover:scale-105 hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-white/10 to-white/5 border border-white/20">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br from-purple/30 to-purple/20 flex items-center justify-center">
                <Briefcase className="w-6 h-6 sm:w-8 sm:h-8 text-purple" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white">Liderança e Gestão</h3>
              <p className="text-white/70 text-base sm:text-lg leading-relaxed">
                Desenvolva líderes com práticas de comunicação, tomada de decisão e gestão de equipes. 
                Simulações de situações críticas para formar gestores mais preparados.
              </p>
            </div>

            <div className="card p-6 sm:p-8 space-y-4 sm:space-y-6 hover:scale-105 hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-white/10 to-white/5 border border-white/20">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br from-spring/30 to-spring/20 flex items-center justify-center">
                <Brain className="w-6 h-6 sm:w-8 sm:h-8 text-spring" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white">Desenvolvimento Técnico</h3>
              <p className="text-white/70 text-base sm:text-lg leading-relaxed">
                Capacite equipes técnicas com simulações de cenários complexos, resolução de problemas 
                e comunicação técnica eficaz para melhor colaboração interdisciplinar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Metodologias Comerciais */}
      <section className="py-32 bg-midnight">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Metodologias Comerciais
            </h2>
            <p className="text-xl md:text-2xl text-white/70 max-w-4xl mx-auto">
              Treine sua equipe com as principais estratégias de vendas do mercado usando IA conversacional
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-7xl mx-auto">
            {[
              {
                title: "SPIN Selling",
                description: "IA treina vendedores nas 4 etapas: Situação, Problema, Implicação e Necessidade-Payoff com simulações práticas.",
                icon: <Target className="w-6 h-6" />
              },
              {
                title: "Challenger Sale",
                description: "Desenvolve habilidades para desafiar perspectivas do cliente e apresentar insights únicos através da IA.",
                icon: <Brain className="w-6 h-6" />
              },
              {
                title: "Solution Selling",
                description: "Treina identificação de necessidades e apresentação de soluções personalizadas com cenários reais.",
                icon: <Zap className="w-6 h-6" />
              },
              {
                title: "Value Selling",
                description: "IA ensina a quantificar e comunicar valor, ROI e benefícios tangíveis em simulações de negociação.",
                icon: <DollarSign className="w-6 h-6" />
              },
              {
                title: "Sandler System",
                description: "Metodologia estruturada de qualificação e fechamento com role-playing avançado via IA conversacional.",
                icon: <Users className="w-6 h-6" />
              },
              {
                title: "MEDDPICC",
                description: "Checklist completo para vendas B2B: Metrics, Economic Buyer, Decision Process, Pain e Competition.",
                icon: <TrendingUp className="w-6 h-6" />
              },
              {
                title: "Upselling",
                description: "Técnicas de venda adicional com identificação de oportunidades e abordagem no momento ideal.",
                icon: <ArrowRight className="w-6 h-6" />
              },
              {
                title: "Cross-selling",
                description: "Venda cruzada inteligente com análise de perfil do cliente e produtos complementares ideais.",
                icon: <Briefcase className="w-6 h-6" />
              },
              {
                title: "Downselling",
                description: "Estratégias para converter objeções de preço em vendas com alternativas adequadas ao orçamento.",
                icon: <Shield className="w-6 h-6" />
              },
              {
                title: "Bundling",
                description: "Criação de pacotes atraentes combinando produtos/serviços para maximizar valor percebido.",
                icon: <Mic className="w-6 h-6" />
              }
            ].map((method, index) => (
              <div key={index} className="card p-6 space-y-4 hover:scale-105 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white/10 to-white/5 border border-white/20 text-center">
                <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-purple/30 to-spring/20 flex items-center justify-center text-white">
                  {method.icon}
                </div>
                <h3 className="text-lg font-bold text-white">{method.title}</h3>
                <p className="text-white/70 text-sm leading-relaxed">{method.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Insert ProductFlowAnimation */}
      <ProductFlowAnimation />

      {/* Metodologias de Ensino e RH */}
      <section className="py-32 bg-white/5">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Metodologias de Ensino e RH
            </h2>
            <p className="text-xl md:text-2xl text-white/70 max-w-4xl mx-auto">
              Transforme faculdades e departamentos de RH com soluções inteligentes que reduzem custos e maximizam resultados
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {[
              {
                icon: <Users className="w-8 h-8" />,
                title: "Reduza seu turnover e evolua sua equipe",
                description: "Desenvolva competências internas com treinamentos personalizados. Funcionários mais capacitados permanecem mais tempo na empresa, reduzindo custos de contratação e aumentando produtividade."
              },
              {
                icon: <DollarSign className="w-8 h-8" />,
                title: "Elimine custos com treinamentos presenciais desnecessários",
                description: "Substitua workshops caros e demorados por simulações de IA 24/7. Reduza gastos com instrutores, locais e deslocamentos mantendo a qualidade do aprendizado."
              },
              {
                icon: <Brain className="w-8 h-8" />,
                title: "Metodologias pedagógicas avançadas",
                description: "Aplique técnicas de aprendizagem ativa, microlearning e gamificação. IA adapta o conteúdo ao ritmo individual, maximizando retenção e engajamento dos alunos."
              },
              {
                icon: <UserCheck className="w-8 h-8" />,
                title: "Avaliação contínua de competências",
                description: "Monitore o progresso em tempo real com métricas detalhadas. Identifique gaps de conhecimento e ajuste treinamentos automaticamente para cada perfil profissional."
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: "Onboarding automatizado",
                description: "Integre novos funcionários com processos padronizados e interativos. IA guia cada etapa da adaptação, reduzindo tempo de produtividade plena de meses para semanas."
              },
              {
                icon: <Target className="w-8 h-8" />,
                title: "Desenvolvimento de liderança",
                description: "Forme líderes através de simulações de conflitos, tomada de decisão e comunicação assertiva. Scenarios realistas preparam gestores para desafios reais do ambiente corporativo."
              }
            ].map((item, index) => (
              <div key={index} className="relative card p-8 space-y-6 hover:scale-105 hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-white/10 to-white/5 border border-white/20">
                {/* Decorative gradient circle */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple/20 to-spring/10 rounded-full blur-2xl" />
                
                <div className="relative w-16 h-16 rounded-xl bg-gradient-to-br from-purple/30 to-spring/20 flex items-center justify-center text-white">
                  {item.icon}
                </div>
                <h3 className="relative text-xl font-bold text-white leading-tight">{item.title}</h3>
                <p className="relative text-white/70 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seção Synapse - Design da imagem de referência */}
      <section style={{ 
        padding: 'clamp(40px, 10vw, 80px) 0', 
        backgroundColor: '#000131',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: '0 20px'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(13, 20, 42, 0.8) 0%, rgba(20, 25, 55, 0.9) 100%)',
            border: '1px solid rgba(134, 1, 248, 0.2)',
            borderRadius: '24px',
            padding: 'clamp(32px, 8vw, 64px)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 'clamp(32px, 8vw, 64px)',
            alignItems: 'center',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 25px 50px rgba(134, 1, 248, 0.1)'
          }}>
            
            {/* Lado esquerdo - Conteúdo principal */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(16px, 4vw, 32px)' }}>
              
              {/* Título Synapse */}
              <h1 style={{
                fontSize: 'clamp(2rem, 8vw, 4rem)',
                fontWeight: 'bold',
                background: 'linear-gradient(90deg, #8601F8 0%, #d946ef 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontFamily: 'Cal Sans, Inter, sans-serif',
                margin: '0',
                lineHeight: '1.1'
              }}>
                Synapse
              </h1>

              {/* Descrição */}
              <p style={{
                fontSize: 'clamp(16px, 4vw, 20px)',
                color: 'rgba(255, 255, 255, 0.9)',
                fontFamily: 'Cal Sans, Inter, sans-serif',
                lineHeight: '1.6',
                margin: '0'
              }}>
                Plataforma de treinamento empresarial com IA conversacional, métricas avançadas e 
                simulações por voz. Transforme a capacitação da sua equipe.
              </p>

              {/* Lista de funcionalidades */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    background: 'linear-gradient(45deg, #8601F8, #d946ef)',
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    flexShrink: 0
                  }} />
                  <span style={{
                    fontSize: 'clamp(14px, 3.5vw, 18px)',
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontFamily: 'Cal Sans, Inter, sans-serif'
                  }}>
                    Simulações práticas com IA
                  </span>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    background: 'linear-gradient(45deg, #8601F8, #d946ef)',
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    flexShrink: 0
                  }} />
                  <span style={{
                    fontSize: 'clamp(14px, 3.5vw, 18px)',
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontFamily: 'Cal Sans, Inter, sans-serif'
                  }}>
                    Feedback instantâneo personalizado
                  </span>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    background: 'linear-gradient(45deg, #8601F8, #d946ef)',
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    flexShrink: 0
                  }} />
                  <span style={{
                    fontSize: 'clamp(14px, 3.5vw, 18px)',
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontFamily: 'Cal Sans, Inter, sans-serif'
                  }}>
                    Métricas detalhadas de performance
                  </span>
                </div>
              </div>

              {/* Botão Saiba Mais */}
              <div style={{ marginTop: '16px' }}>
                <Link 
                  to="/dashboard" 
                  style={{ 
                    display: 'inline-block',
                    padding: 'clamp(12px, 3vw, 16px) clamp(24px, 6vw, 32px)',
                    borderRadius: '16px',
                    background: 'linear-gradient(90deg, #8601F8 0%, #d946ef 100%)',
                    color: '#FFFFFF',
                    textDecoration: 'none',
                    fontSize: 'clamp(14px, 3.5vw, 16px)',
                    fontWeight: '600',
                    fontFamily: 'Cal Sans, Inter, sans-serif',
                    boxShadow: '0 10px 30px rgba(134, 1, 248, 0.3)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 15px 35px rgba(134, 1, 248, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(134, 1, 248, 0.3)';
                  }}
                >
                  Saiba Mais →
                </Link>
              </div>
            </div>

            {/* Lado direito - Dashboard Preview */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <div style={{
                width: '100%',
                minHeight: '300px',
                background: 'linear-gradient(135deg, rgba(134, 1, 248, 0.1) 0%, rgba(212, 70, 239, 0.1) 50%, rgba(0, 255, 153, 0.05) 100%)',
                border: '1px solid rgba(134, 1, 248, 0.2)',
                borderRadius: '16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '16px',
                padding: '32px',
                backdropFilter: 'blur(5px)'
              }}>
                {/* Ícone do cérebro com gradiente */}
                <div style={{
                  width: '80px',
                  height: '80px',
                  background: 'linear-gradient(45deg, #8601F8, #d946ef)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '32px',
                  animation: 'pulse 2s ease-in-out infinite'
                }}>
                  🧠
                </div>
                
                <p style={{
                  fontSize: 'clamp(14px, 3.5vw, 18px)',
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontFamily: 'Cal Sans, Inter, sans-serif',
                  textAlign: 'center',
                  margin: '0'
                }}>
                  Dashboard Synapse
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Chat Assistant */}
      <ChatAssistant />
    </div>
  );
}