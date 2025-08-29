import { Link } from 'react-router-dom';

export default function Precos() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gradient">
            Planos e Preços
          </h1>
          <p className="text-xl text-white/70">
            Escolha o plano ideal para sua empresa
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* MVP */}
          <div className="card p-8 space-y-6 border-spring/30">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="text-2xl font-bold text-white">MVP</h3>
                <span className="px-2 py-1 text-xs bg-spring/20 text-spring rounded border border-spring/30">
                  Atual
                </span>
              </div>
              <p className="text-white/60">Versão de demonstração</p>
            </div>

            <div className="space-y-4">
              <div className="text-3xl font-bold text-white">Gratuito</div>
              <ul className="space-y-2 text-white/70">
                <li>• Acesso limitado às simulações</li>
                <li>• Dashboard básico</li>
                <li>• Feedback da IA</li>
                <li>• Suporte por email</li>
              </ul>
            </div>

          </div>

          {/* Professional */}
          <div className="card p-8 space-y-6 border-purple/30 relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="px-3 py-1 bg-purple text-white text-sm rounded-full">
                Mais Popular
              </span>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-white">Professional</h3>
              <p className="text-white/60">Para equipes pequenas</p>
            </div>

            <div className="space-y-4">
              <div className="text-3xl font-bold text-white">R$ 299<span className="text-lg text-white/60">/mês</span></div>
              <ul className="space-y-2 text-white/70">
                <li>• Simulações ilimitadas</li>
                <li>• Analytics avançado</li>
                <li>• Até 50 usuários</li>
                <li>• Cenários personalizados</li>
                <li>• Suporte prioritário</li>
              </ul>
            </div>

            <button className="btn-primary w-full">
              Em Breve
            </button>
          </div>

          {/* Enterprise */}
          <div className="card p-8 space-y-6">
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-white">Enterprise</h3>
              <p className="text-white/60">Para grandes empresas</p>
            </div>

            <div className="space-y-4">
              <div className="text-3xl font-bold text-white">Customizado</div>
              <ul className="space-y-2 text-white/70">
                <li>• Usuários ilimitados</li>
                <li>• API personalizada</li>
                <li>• Integração SSO</li>
                <li>• Treinamento dedicado</li>
                <li>• Suporte 24/7</li>
              </ul>
            </div>

            <button className="btn-secondary w-full">
              Falar com Vendas
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}