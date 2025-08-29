import { Link } from 'react-router-dom'
import EnergyOrbAnimation from '../components/EnergyOrbAnimation'
import ExcluviaCircuitAnimation from '../components/ExcluviaCircuitAnimation'
import AuroraBackground from '../components/landing/AuroraBackground'

const Index = () => {
  console.log('Index page carregando com cores hardcoded')
  
  return (
    <div style={{ backgroundColor: '#000131', minHeight: '100vh', padding: '10px 20px' }}>
      {/* SEÇÃO HERO PRINCIPAL COM FUNDO AURORA */}
      <AuroraBackground className="rounded-3xl">
        <section 
          style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 'clamp(20px, 5vw, 40px)',
            alignItems: 'center',
            minHeight: '80vh',
            maxWidth: '1200px',
            margin: '0 auto',
            padding: 'clamp(20px, 8vw, 60px) clamp(20px, 5vw, 40px)',
            background: 'rgba(0, 1, 49, 0.3)', // Fundo semi-transparente para legibilidade
            borderRadius: '24px'
          }}
        >
        {/* LADO ESQUERDO - TEXTO */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(16px, 4vw, 32px)' }}>
          {/* Badge MVP */}
          <div 
            style={{ 
              display: 'inline-block',
              alignSelf: 'flex-start',
              backgroundColor: 'rgba(0, 255, 153, 0.1)',
              border: '2px solid #00FF99',
              color: '#00FF99',
              padding: '6px 14px',
              borderRadius: '50px',
              fontSize: 'clamp(12px, 2.5vw, 14px)',
              fontWeight: '600',
              fontFamily: 'Cal Sans, Inter, sans-serif'
            }}
          >
            MVP
          </div>

          {/* Logo SYNAPSE com animações */}
          <div 
            style={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              margin: '0',
              padding: '0'
            }}
          >
            <img 
              src="/lovable-uploads/e7407fe5-43c6-46ea-b46f-6ddcccd728d3.png"
              alt="Synapse" 
              style={{ 
                height: 'clamp(60px, 12vw, 200px)',
                width: 'auto',
                maxWidth: '100%',
                objectFit: 'contain',
                transition: 'all 0.3s ease',
                filter: 'drop-shadow(0 10px 30px rgba(134, 1, 248, 0.3))',
                animation: 'pulse 3s ease-in-out infinite'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.filter = 'drop-shadow(0 15px 40px rgba(134, 1, 248, 0.5))';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.filter = 'drop-shadow(0 10px 30px rgba(134, 1, 248, 0.3))';
              }}
            />
          </div>


          {/* Botões */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link 
              to="/dashboard" 
              style={{ 
                display: 'inline-block',
                padding: 'clamp(12px, 3vw, 16px) clamp(20px, 6vw, 32px)',
                borderRadius: '16px',
                background: 'linear-gradient(90deg, #8601F8 0%, #00FF99 100%)',
                color: '#FFFFFF',
                textDecoration: 'none',
                fontSize: 'clamp(14px, 3vw, 16px)',
                fontWeight: '600',
                fontFamily: 'Cal Sans, Inter, sans-serif',
                boxShadow: '0 10px 30px rgba(134, 1, 248, 0.3)',
                transition: 'all 0.3s ease'
              }}
            >
              Ir ao Dashboard
            </Link>
            <Link 
              to="/login" 
              style={{ 
                display: 'inline-block',
                padding: 'clamp(12px, 3vw, 16px) clamp(20px, 6vw, 32px)',
                borderRadius: '16px',
                border: '2px solid #00FF99',
                color: '#00FF99',
                backgroundColor: 'rgba(0, 255, 153, 0.05)',
                textDecoration: 'none',
                fontSize: 'clamp(14px, 3vw, 16px)',
                fontWeight: '600',
                fontFamily: 'Cal Sans, Inter, sans-serif',
                transition: 'all 0.3s ease'
              }}
            >
              Entrar
            </Link>
          </div>
        </div>

        {/* LADO DIREITO - CARD COM ANIMAÇÃO */}
        <div 
          style={{ 
            background: 'linear-gradient(135deg, #000131 0%, #0C0C0D 100%)',
            border: '2px solid rgba(0, 255, 153, 0.3)',
            borderRadius: '24px',
            padding: 'clamp(20px, 5vw, 40px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            boxShadow: '0 25px 50px rgba(134, 1, 248, 0.15)'
          }}
        >
          <EnergyOrbAnimation size={Math.min(300, window.innerWidth * 0.6)} />
          
          <p 
            style={{ 
              textAlign: 'center',
              fontSize: 'clamp(14px, 3.5vw, 18px)',
              lineHeight: '1.6',
              color: 'rgba(255, 255, 255, 0.9)',
              fontFamily: 'Cal Sans, Inter, sans-serif',
              marginTop: 'clamp(16px, 4vw, 32px)',
              margin: 'clamp(16px, 4vw, 32px) 0 0 0'
            }}
          >
            Comece com simulações guiadas por IA e leve sua equipe ao próximo nível 
            com a tecnologia conversacional mais avançada do mercado.
          </p>
        </div>
        </section>
      </AuroraBackground>

      {/* SEÇÃO EXCLUVIA SHOWCASE */}
      <section style={{ padding: 'clamp(40px, 10vw, 80px) 0', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 'clamp(24px, 6vw, 48px)' }}>
          <h2 
            style={{ 
              fontSize: 'clamp(1.5rem, 5vw, 3rem)',
              fontWeight: 'bold',
              marginBottom: '16px',
              background: 'linear-gradient(90deg, #8601F8 0%, #00FF99 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontFamily: 'Cal Sans, Inter, sans-serif',
              margin: '0 0 16px 0'
            }}
          >
            Tecnologia Excluv.ia
          </h2>
          <p 
            style={{ 
              fontSize: 'clamp(14px, 3.5vw, 18px)',
              color: 'rgba(255, 255, 255, 0.8)',
              fontFamily: 'Cal Sans, Inter, sans-serif',
              maxWidth: '800px',
              margin: '0 auto',
              lineHeight: '1.6',
              padding: '0 20px'
            }}
          >
            Nossa plataforma é alimentada pela tecnologia avançada da Excluv.ia, 
            proporcionando conversação natural e análise inteligente em tempo real.
          </p>
        </div>
        
        <ExcluviaCircuitAnimation />
      </section>
    </div>
  )
}

export default Index