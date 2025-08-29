import { Link } from 'react-router-dom';
import { 
  Target,
  Users,
  Award,
  Globe,
  Zap,
  Shield
} from 'lucide-react';

export default function Sobre() {
  return (
    <div className="min-h-screen bg-midnight text-white">
      <main className="container mx-auto px-6 py-16">
        {/* Hero Section */}
        <section className="text-center mb-20">
          <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-[#d946ef] via-[#3b82f6] to-[#00d9ff] bg-clip-text text-transparent">
            Sobre a Excluv.ia
          </h1>
          <p className="text-xl text-white/70 max-w-4xl mx-auto leading-relaxed">
            Somos pioneiros em soluções de IA conversacional para o mundo corporativo, 
            transformando a maneira como empresas treinam e desenvolvem seus talentos.
          </p>
        </section>

        {/* Nossa Missão */}
        <section className="mb-20">
          <div className="card p-12 text-center">
            <Target className="w-16 h-16 mx-auto mb-6 text-purple" />
            <h2 className="text-3xl font-bold text-white mb-6">Nossa Missão</h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
              Democratizar o acesso a treinamentos de alta qualidade através da inteligência artificial, 
              permitindo que empresas de todos os tamanhos desenvolvam seus profissionais com 
              eficiência, personalização e resultados mensuráveis.
            </p>
          </div>
        </section>

        {/* Nossos Valores */}
        <section className="mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">
            Nossos Valores
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card p-8 text-center space-y-4">
              <Zap className="w-12 h-12 mx-auto text-purple" />
              <h3 className="text-xl font-bold text-white">Inovação</h3>
              <p className="text-white/70">
                Estamos sempre na vanguarda da tecnologia, desenvolvendo soluções que 
                antecipam as necessidades do mercado.
              </p>
            </div>
            <div className="card p-8 text-center space-y-4">
              <Users className="w-12 h-12 mx-auto text-spring" />
              <h3 className="text-xl font-bold text-white">Pessoas Primeiro</h3>
              <p className="text-white/70">
                Acreditamos que o desenvolvimento humano é o maior ativo de qualquer organização. 
                Nossa tecnologia serve às pessoas.
              </p>
            </div>
            <div className="card p-8 text-center space-y-4">
              <Shield className="w-12 h-12 mx-auto text-purple" />
              <h3 className="text-xl font-bold text-white">Confiança</h3>
              <p className="text-white/70">
                Construímos relações duradouras baseadas na transparência, segurança 
                e entrega consistente de resultados.
              </p>
            </div>
          </div>
        </section>

        {/* Nossa História */}
        <section className="mb-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Nossa História
              </h2>
              <p className="text-lg text-white/70 leading-relaxed">
                Fundada em 2023, a Excluv.ia nasceu da visão de que a inteligência artificial 
                poderia revolucionar o treinamento corporativo. Nossos fundadores, especialistas 
                em IA e desenvolvimento organizacional, identificaram uma lacuna no mercado: 
                a necessidade de soluções de treinamento escaláveis, personalizadas e eficazes.
              </p>
              <p className="text-lg text-white/70 leading-relaxed">
                Desde então, desenvolvemos o Synapse, nossa plataforma revolucionária que 
                combina IA conversacional de última geração com metodologias pedagógicas 
                comprovadas, já impactando milhares de profissionais em diferentes setores.
              </p>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="card p-6 text-center">
                  <div className="text-3xl font-bold text-gradient mb-2">500+</div>
                  <div className="text-white/70">Empresas Atendidas</div>
                </div>
                <div className="card p-6 text-center">
                  <div className="text-3xl font-bold text-gradient mb-2">50k+</div>
                  <div className="text-white/70">Profissionais Treinados</div>
                </div>
                <div className="card p-6 text-center">
                  <div className="text-3xl font-bold text-gradient mb-2">95%</div>
                  <div className="text-white/70">Satisfação Cliente</div>
                </div>
                <div className="card p-6 text-center">
                  <div className="text-3xl font-bold text-gradient mb-2">24/7</div>
                  <div className="text-white/70">Disponibilidade</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Nossa Tecnologia */}
        <section className="mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">
            Nossa Tecnologia
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="card p-8 space-y-4">
              <Globe className="w-12 h-12 text-purple" />
              <h3 className="text-xl font-bold text-white">IA Conversacional Avançada</h3>
              <p className="text-white/70">
                Utilizamos modelos de linguagem de última geração, treinados especificamente 
                para cenários empresariais, garantindo interações naturais e contextualizadas.
              </p>
            </div>
            <div className="card p-8 space-y-4">
              <Award className="w-12 h-12 text-spring" />
              <h3 className="text-xl font-bold text-white">Análise Preditiva</h3>
              <p className="text-white/70">
                Nossa plataforma analisa padrões de comportamento e performance para 
                personalizar experiências de aprendizado e predizer resultados.
              </p>
            </div>
          </div>
        </section>

        {/* Equipe */}
        <section className="mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">
            Nossa Equipe
          </h2>
          <div className="card p-12 text-center">
            <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
              Nossa equipe multidisciplinar combina décadas de experiência em inteligência artificial, 
              desenvolvimento organizacional, pedagogia e inovação tecnológica. Juntos, trabalhamos 
              incansavelmente para criar soluções que transformam vidas e organizações.
            </p>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <div className="card p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Faça Parte da Revolução
            </h2>
            <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
              Junte-se às empresas líderes que já estão transformando seu treinamento com nossa IA.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/login" 
                className="btn-primary text-lg px-8 py-4"
              >
                Começar Agora
              </Link>
              <Link 
                to="/contato" 
                className="btn-secondary text-lg px-8 py-4"
              >
                Falar com Especialista
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}