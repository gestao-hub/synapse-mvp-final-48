import { Link } from 'react-router-dom'
import EnergyOrbAnimation from './EnergyOrbAnimation'

const HeroSection = () => {
  console.log('HeroSection renderizando com cores da marca')
  return (
    <section className="grid lg:grid-cols-2 gap-10 items-center min-h-[80vh]" style={{ backgroundColor: '#000131' }}>
      <div className="space-y-8">
        {/* Badge MVP com cores da marca */}
        <div 
          className="inline-block rounded-full px-4 py-2 text-sm font-semibold border-2"
          style={{ 
            backgroundColor: 'rgba(0, 255, 153, 0.1)',
            borderColor: '#00FF99',
            color: '#00FF99',
            fontFamily: 'Cal Sans, Inter, sans-serif'
          }}
        >
          MVP
        </div>

        {/* Título Synapse com gradiente da marca */}
        <h1 
          style={{ 
            fontSize: 'clamp(3rem, 8vw, 6rem)',
            fontWeight: 'bold',
            lineHeight: '1.1',
            background: 'linear-gradient(90deg, #8601F8 0%, #00FF99 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontFamily: 'Cal Sans, Inter, sans-serif',
            color: 'transparent',
            margin: '0',
            padding: '0'
          }}
        >
          Synapse
        </h1>

        {/* Subtítulo principal */}
        <div className="space-y-2">
          <h2 
            style={{ 
              fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
              fontWeight: '600',
              lineHeight: '1.2',
              color: '#8601F8',
              fontFamily: 'Cal Sans, Inter, sans-serif',
              margin: '0',
              padding: '0'
            }}
          >
            Revolucione
          </h2>
          <h2 
            style={{ 
              fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
              fontWeight: '400',
              lineHeight: '1.2',
              color: '#FFFFFF',
              fontFamily: 'Cal Sans, Inter, sans-serif',
              margin: '0',
              padding: '0'
            }}
          >
            sua empresa com
          </h2>
          <h2 
            style={{ 
              fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
              fontWeight: '600',
              lineHeight: '1.2',
              background: 'linear-gradient(90deg, #00FF99 0%, #8601F8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontFamily: 'Cal Sans, Inter, sans-serif',
              color: 'transparent',
              margin: '0',
              padding: '0'
            }}
          >
            Inteligência Artificial
          </h2>
        </div>

        {/* Descrição */}
        <p 
          className="text-lg leading-relaxed max-w-xl"
          style={{ 
            color: 'rgba(255, 255, 255, 0.9)',
            fontFamily: 'Cal Sans, Inter, sans-serif'
          }}
        >
          A Excluv.ia Corporate desenvolve soluções de IA conversacional para transformar 
          treinamentos, atendimento e processos empresariais com tecnologia de ponta.
        </p>

        {/* Botões de ação */}
        <div className="flex gap-4 pt-4">
          <Link 
            to="/dashboard" 
            className="px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105"
            style={{ 
              background: 'linear-gradient(90deg, #8601F8 0%, #00FF99 100%)',
              color: '#FFFFFF',
              fontFamily: 'Cal Sans, Inter, sans-serif',
              boxShadow: '0 10px 30px rgba(134, 1, 248, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 15px 40px rgba(134, 1, 248, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(134, 1, 248, 0.3)';
            }}
          >
            Ir ao Dashboard
          </Link>
          <Link 
            to="/login" 
            className="px-8 py-4 rounded-2xl font-semibold border-2 transition-all duration-300"
            style={{ 
              borderColor: '#00FF99',
              color: '#00FF99',
              backgroundColor: 'rgba(0, 255, 153, 0.05)',
              fontFamily: 'Cal Sans, Inter, sans-serif'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(0, 255, 153, 0.15)';
              e.currentTarget.style.borderColor = '#00FF99';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(0, 255, 153, 0.05)';
              e.currentTarget.style.borderColor = '#00FF99';
            }}
          >
            Entrar
          </Link>
        </div>
      </div>

      {/* Card lateral com animação */}
      <div 
        className="rounded-3xl p-10 flex flex-col items-center border-2"
        style={{ 
          background: 'linear-gradient(135deg, #000131 0%, #0C0C0D 100%)',
          borderColor: 'rgba(0, 255, 153, 0.3)',
          boxShadow: '0 25px 50px rgba(134, 1, 248, 0.15)'
        }}
      >
        <EnergyOrbAnimation className="mb-8" size={300} />
        
        <p 
          className="text-center text-lg leading-relaxed"
          style={{ 
            color: 'rgba(255, 255, 255, 0.9)',
            fontFamily: 'Cal Sans, Inter, sans-serif'
          }}
        >
          Comece com simulações guiadas por IA e leve sua equipe ao próximo nível 
          com a tecnologia conversacional mais avançada do mercado.
        </p>
      </div>
    </section>
  )
}

export default HeroSection