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
  Crown
} from 'lucide-react';

export default function Produtos() {
  return (
    <div className="min-h-screen bg-midnight text-white">
      <main className="container mx-auto px-6 py-16">
        {/* Hero Section */}
        <section className="text-center mb-20">
          <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-[#d946ef] via-[#3b82f6] to-[#00d9ff] bg-clip-text text-transparent">
            Nossos Produtos
          </h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Descubra nossas soluções de IA conversacional para treinamento empresarial
          </p>
        </section>

        {/* Produtos Grid */}
        <section className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Simulação Comercial */}
          <div className="card p-8 space-y-6 hover:scale-105 transition-all duration-300">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple/20 to-spring/20 flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-purple" />
            </div>
            <h3 className="text-2xl font-bold text-white">Simulação Comercial</h3>
            <p className="text-white/70 text-lg">
              Treine sua equipe de vendas com simulações realistas de negociação, objeções e fechamento. 
              Desenvolva habilidades comerciais com feedback instantâneo e análise detalhada de performance.
            </p>
            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-white">Funcionalidades:</h4>
              <ul className="space-y-2 text-white/70">
                <li>• Simulações de vendas com IA conversacional</li>
                <li>• Cenários de objeções e negociação</li>
                <li>• Análise de técnicas de fechamento</li>
                <li>• Feedback em tempo real</li>
                <li>• Métricas de performance</li>
              </ul>
            </div>
            <Link 
              to="/comercial" 
              className="btn-primary inline-block text-center w-full py-3"
            >
              Acessar Simulação Comercial
            </Link>
          </div>

          {/* Simulação RH */}
          <div className="card p-8 space-y-6 hover:scale-105 transition-all duration-300">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-spring/20 to-purple/20 flex items-center justify-center">
              <Users className="w-8 h-8 text-spring" />
            </div>
            <h3 className="text-2xl font-bold text-white">Simulação RH</h3>
            <p className="text-white/70 text-lg">
              Capacite profissionais de RH em processos seletivos, entrevistas comportamentais e 
              gestão de conflitos com simulações interativas e avaliações detalhadas.
            </p>
            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-white">Funcionalidades:</h4>
              <ul className="space-y-2 text-white/70">
                <li>• Simulações de entrevistas de emprego</li>
                <li>• Cenários de feedback construtivo</li>
                <li>• Treinamento em gestão de conflitos</li>
                <li>• Avaliação comportamental</li>
                <li>• Desenvolvimento de soft skills</li>
              </ul>
            </div>
            <Link 
              to="/rh" 
              className="btn-primary inline-block text-center w-full py-3"
            >
              Acessar Simulação RH
            </Link>
          </div>

          {/* Simulação Educacional */}
          <div className="card p-8 space-y-6 hover:scale-105 transition-all duration-300">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple/20 to-spring/20 flex items-center justify-center">
              <GraduationCap className="w-8 h-8 text-purple" />
            </div>
            <h3 className="text-2xl font-bold text-white">Simulação Educacional</h3>
            <p className="text-white/70 text-lg">
              Revolucione o ensino com IA conversacional para práticas de apresentação, debates 
              acadêmicos e preparação profissional. Engaje estudantes com aprendizado interativo.
            </p>
            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-white">Funcionalidades:</h4>
              <ul className="space-y-2 text-white/70">
                <li>• Simulações de apresentações acadêmicas</li>
                <li>• Debates e discussões interativas</li>
                <li>• Preparação para defesas de tese</li>
                <li>• Treinamento em comunicação</li>
                <li>• Avaliação pedagógica</li>
              </ul>
            </div>
            <Link 
              to="/educacional" 
              className="btn-primary inline-block text-center w-full py-3"
            >
              Acessar Simulação Educacional
            </Link>
          </div>

          {/* Simulação Gestão */}
          <div className="card p-8 space-y-6 hover:scale-105 transition-all duration-300">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-spring/20 to-purple/20 flex items-center justify-center">
              <Crown className="w-8 h-8 text-yellow-500" />
            </div>
            <h3 className="text-2xl font-bold text-white">Simulação Gestão</h3>
            <p className="text-white/70 text-lg">
              Desenvolva líderes estratégicos com simulações executivas, tomada de decisão sob pressão e 
              comunicação corporativa. Forme gestores capazes de conduzir mudanças organizacionais.
            </p>
            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-white">Funcionalidades:</h4>
              <ul className="space-y-2 text-white/70">
                <li>• Simulações de liderança estratégica</li>
                <li>• Cenários de gestão de crise</li>
                <li>• Comunicação executiva</li>
                <li>• Negociação empresarial</li>
                <li>• Tomada de decisão complexa</li>
              </ul>
            </div>
            <Link 
              to="/synapse-gestao" 
              className="btn-primary inline-block text-center w-full py-3"
            >
              Conheça o Synapse Gestão
            </Link>
          </div>
        </section>

        {/* CTA Section */}
        <section className="mt-20 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Pronto para revolucionar seu treinamento?
            </h2>
            <p className="text-xl text-white/70">
              Experimente nossas soluções de IA conversacional e transforme a capacitação da sua equipe.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/precos" 
                className="btn-secondary text-lg px-8 py-4"
              >
                Ver Preços
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}