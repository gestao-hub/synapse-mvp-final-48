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

      {/* SEÇÃO DASHBOARD PREVIEW */}
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
            Conheça o Dashboard
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
            Veja como funciona a interface onde você acompanha seu progresso, 
            métricas detalhadas e histórico de simulações.
          </p>
        </div>
        
        {/* Grid de funcionalidades com imagens mockup */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: 'clamp(20px, 5vw, 40px)', 
          padding: '0 20px' 
        }}>
          
          {/* Card 1 - Analytics */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(134, 1, 248, 0.1) 0%, rgba(0, 255, 153, 0.05) 100%)',
            border: '1px solid rgba(134, 1, 248, 0.2)',
            borderRadius: '16px',
            padding: '24px',
            textAlign: 'center'
          }}>
            <div style={{
              width: '100%',
              height: '200px',
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <div style={{
                background: 'linear-gradient(45deg, #8601F8, #00FF99)',
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px'
              }}>
                📊
              </div>
            </div>
            <h3 style={{ 
              fontSize: '18px', 
              fontWeight: '600', 
              color: '#FFFFFF', 
              marginBottom: '8px',
              fontFamily: 'Cal Sans, Inter, sans-serif'
            }}>
              Métricas Avançadas
            </h3>
            <p style={{ 
              fontSize: '14px', 
              color: 'rgba(255, 255, 255, 0.7)', 
              lineHeight: '1.4',
              fontFamily: 'Cal Sans, Inter, sans-serif'
            }}>
              Acompanhe seu desempenho com gráficos detalhados e análises em tempo real
            </p>
          </div>

          {/* Card 2 - Sessions */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(134, 1, 248, 0.1) 0%, rgba(0, 255, 153, 0.05) 100%)',
            border: '1px solid rgba(134, 1, 248, 0.2)',
            borderRadius: '16px',
            padding: '24px',
            textAlign: 'center'
          }}>
            <div style={{
              width: '100%',
              height: '200px',
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <div style={{
                background: 'linear-gradient(45deg, #00FF99, #8601F8)',
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px'
              }}>
                🎯
              </div>
            </div>
            <h3 style={{ 
              fontSize: '18px', 
              fontWeight: '600', 
              color: '#FFFFFF', 
              marginBottom: '8px',
              fontFamily: 'Cal Sans, Inter, sans-serif'
            }}>
              Histórico de Sessões
            </h3>
            <p style={{ 
              fontSize: '14px', 
              color: 'rgba(255, 255, 255, 0.7)', 
              lineHeight: '1.4',
              fontFamily: 'Cal Sans, Inter, sans-serif'
            }}>
              Revise todas suas simulações com feedback detalhado e pontuações
            </p>
          </div>

          {/* Card 3 - Reports */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(134, 1, 248, 0.1) 0%, rgba(0, 255, 153, 0.05) 100%)',
            border: '1px solid rgba(134, 1, 248, 0.2)',
            borderRadius: '16px',
            padding: '24px',
            textAlign: 'center'
          }}>
            <div style={{
              width: '100%',
              height: '200px',
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <div style={{
                background: 'linear-gradient(45deg, #8601F8, #00FF99)',
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px'
              }}>
                📈
              </div>
            </div>
            <h3 style={{ 
              fontSize: '18px', 
              fontWeight: '600', 
              color: '#FFFFFF', 
              marginBottom: '8px',
              fontFamily: 'Cal Sans, Inter, sans-serif'
            }}>
              Relatórios Personalizados
            </h3>
            <p style={{ 
              fontSize: '14px', 
              color: 'rgba(255, 255, 255, 0.7)', 
              lineHeight: '1.4',
              fontFamily: 'Cal Sans, Inter, sans-serif'
            }}>
              Exporte relatórios em PDF com análises completas do seu progresso
            </p>
          </div>
        </div>

        {/* Call to action para o dashboard */}
        <div style={{ textAlign: 'center', marginTop: 'clamp(32px, 8vw, 64px)' }}>
          <Link 
            to="/dashboard" 
            style={{ 
              display: 'inline-block',
              padding: 'clamp(14px, 3.5vw, 18px) clamp(28px, 7vw, 40px)',
              borderRadius: '16px',
              background: 'linear-gradient(90deg, #8601F8 0%, #00FF99 100%)',
              color: '#FFFFFF',
              textDecoration: 'none',
              fontSize: 'clamp(16px, 3.5vw, 18px)',
              fontWeight: '600',
              fontFamily: 'Cal Sans, Inter, sans-serif',
              boxShadow: '0 15px 35px rgba(134, 1, 248, 0.4)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(134, 1, 248, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 15px 35px rgba(134, 1, 248, 0.4)';
            }}
          >
            Explore o Dashboard Agora
          </Link>
        </div>
      </section>

      {/* TUTORIAL COMPLETO DA PLATAFORMA */}
      <section style={{ 
        padding: 'clamp(60px, 15vw, 120px) 0', 
        backgroundColor: '#000131',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 20px' }}>
          
          {/* Título da seção */}
          <div style={{ textAlign: 'center', marginBottom: 'clamp(48px, 12vw, 96px)' }}>
            <h2 style={{
              fontSize: 'clamp(2rem, 6vw, 4rem)',
              fontWeight: 'bold',
              background: 'linear-gradient(90deg, #8601F8 0%, #00FF99 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontFamily: 'Cal Sans, Inter, sans-serif',
              margin: '0 0 24px 0'
            }}>
              Como Funciona a Plataforma
            </h2>
            <p style={{
              fontSize: 'clamp(16px, 4vw, 20px)',
              color: 'rgba(255, 255, 255, 0.8)',
              fontFamily: 'Cal Sans, Inter, sans-serif',
              maxWidth: '800px',
              margin: '0 auto',
              lineHeight: '1.6'
            }}>
              Conheça cada funcionalidade do Synapse através deste guia visual completo
            </p>
          </div>

          {/* Tutorial Steps */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(60px, 15vw, 100px)' }}>
            
            {/* Step 1 - Dashboard Principal */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
              gap: 'clamp(32px, 8vw, 64px)',
              alignItems: 'center'
            }}>
              <div>
                <div style={{
                  background: 'linear-gradient(45deg, #8601F8, #d946ef)',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '24px',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: 'white'
                }}>
                  01
                </div>
                <h3 style={{
                  fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                  fontWeight: 'bold',
                  color: '#FFFFFF',
                  marginBottom: '16px',
                  fontFamily: 'Cal Sans, Inter, sans-serif'
                }}>
                  Dashboard Principal
                </h3>
                <p style={{
                  fontSize: 'clamp(14px, 3.5vw, 18px)',
                  color: 'rgba(255, 255, 255, 0.8)',
                  lineHeight: '1.6',
                  fontFamily: 'Cal Sans, Inter, sans-serif',
                  marginBottom: '24px'
                }}>
                  Acompanhe sua evolução com métricas em tempo real: total de sessões, duração das práticas, 
                  trilhas ativas e gráficos de performance. O sistema inclui um tour guiado para novos usuários.
                </p>
                <ul style={{ 
                  listStyle: 'none', 
                  padding: '0', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '12px' 
                }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#00FF99' }} />
                    <span style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}>KPIs de performance</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#00FF99' }} />
                    <span style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}>Gráficos de tendência</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#00FF99' }} />
                    <span style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}>Tour interativo</span>
                  </li>
                </ul>
              </div>
              <div style={{
                background: 'linear-gradient(135deg, rgba(134, 1, 248, 0.1) 0%, rgba(212, 70, 239, 0.1) 100%)',
                border: '1px solid rgba(134, 1, 248, 0.2)',
                borderRadius: '16px',
                padding: '24px',
                textAlign: 'center'
              }}>
                <img 
                  src="/lovable-uploads/612e013c-7325-4f24-8a5f-da8da49d3d34.png" 
                  alt="Dashboard Principal"
                  style={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: '8px',
                    maxHeight: '300px',
                    objectFit: 'contain'
                  }}
                />
              </div>
            </div>

            {/* Step 2 - Análise de Performance */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
              gap: 'clamp(32px, 8vw, 64px)',
              alignItems: 'center'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, rgba(134, 1, 248, 0.1) 0%, rgba(212, 70, 239, 0.1) 100%)',
                border: '1px solid rgba(134, 1, 248, 0.2)',
                borderRadius: '16px',
                padding: '24px',
                textAlign: 'center'
              }}>
                <img 
                  src="/lovable-uploads/3e308eb1-4c99-4836-9bac-61167506235c.png" 
                  alt="Análise de Performance"
                  style={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: '8px',
                    maxHeight: '300px',
                    objectFit: 'contain'
                  }}
                />
              </div>
              <div>
                <div style={{
                  background: 'linear-gradient(45deg, #8601F8, #d946ef)',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '24px',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: 'white'
                }}>
                  02
                </div>
                <h3 style={{
                  fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                  fontWeight: 'bold',
                  color: '#FFFFFF',
                  marginBottom: '16px',
                  fontFamily: 'Cal Sans, Inter, sans-serif'
                }}>
                  Análise de Performance
                </h3>
                <p style={{
                  fontSize: 'clamp(14px, 3.5vw, 18px)',
                  color: 'rgba(255, 255, 255, 0.8)',
                  lineHeight: '1.6',
                  fontFamily: 'Cal Sans, Inter, sans-serif',
                  marginBottom: '24px'
                }}>
                  Compare seu desempenho com benchmarks da indústria. Veja sua posição no percentil, 
                  identifique pontos fortes e áreas para melhoria com métricas detalhadas.
                </p>
                <ul style={{ 
                  listStyle: 'none', 
                  padding: '0', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '12px' 
                }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#00FF99' }} />
                    <span style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}>Benchmarks da indústria</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#00FF99' }} />
                    <span style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}>Posição no percentil</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#00FF99' }} />
                    <span style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}>Recomendações personalizadas</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Step 3 - Cenários por Área */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
              gap: 'clamp(32px, 8vw, 64px)',
              alignItems: 'center'
            }}>
              <div>
                <div style={{
                  background: 'linear-gradient(45deg, #8601F8, #d946ef)',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '24px',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: 'white'
                }}>
                  03
                </div>
                <h3 style={{
                  fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                  fontWeight: 'bold',
                  color: '#FFFFFF',
                  marginBottom: '16px',
                  fontFamily: 'Cal Sans, Inter, sans-serif'
                }}>
                  Cenários Especializados
                </h3>
                <p style={{
                  fontSize: 'clamp(14px, 3.5vw, 18px)',
                  color: 'rgba(255, 255, 255, 0.8)',
                  lineHeight: '1.6',
                  fontFamily: 'Cal Sans, Inter, sans-serif',
                  marginBottom: '24px'
                }}>
                  Pratique com cenários específicos para cada área: Comercial, RH, Educacional e Gestão. 
                  Cada simulação possui níveis de dificuldade e critérios de avaliação únicos.
                </p>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                  gap: '12px',
                  marginTop: '24px'
                }}>
                  <div style={{
                    background: 'rgba(134, 1, 248, 0.1)',
                    border: '1px solid rgba(134, 1, 248, 0.3)',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    textAlign: 'center',
                    fontSize: '12px',
                    color: '#FFFFFF'
                  }}>
                    Comercial
                  </div>
                  <div style={{
                    background: 'rgba(0, 255, 153, 0.1)',
                    border: '1px solid rgba(0, 255, 153, 0.3)',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    textAlign: 'center',
                    fontSize: '12px',
                    color: '#FFFFFF'
                  }}>
                    RH
                  </div>
                  <div style={{
                    background: 'rgba(212, 70, 239, 0.1)',
                    border: '1px solid rgba(212, 70, 239, 0.3)',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    textAlign: 'center',
                    fontSize: '12px',
                    color: '#FFFFFF'
                  }}>
                    Educacional
                  </div>
                  <div style={{
                    background: 'rgba(46, 208, 255, 0.1)',
                    border: '1px solid rgba(46, 208, 255, 0.3)',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    textAlign: 'center',
                    fontSize: '12px',
                    color: '#FFFFFF'
                  }}>
                    Gestão
                  </div>
                </div>
              </div>
              <div style={{
                background: 'linear-gradient(135deg, rgba(134, 1, 248, 0.1) 0%, rgba(212, 70, 239, 0.1) 100%)',
                border: '1px solid rgba(134, 1, 248, 0.2)',
                borderRadius: '16px',
                padding: '24px',
                textAlign: 'center'
              }}>
                <img 
                  src="/lovable-uploads/8a2f712b-e8aa-4a91-801f-d74b7abd3440.png" 
                  alt="Cenários Comerciais"
                  style={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: '8px',
                    maxHeight: '300px',
                    objectFit: 'contain'
                  }}
                />
              </div>
            </div>

            {/* Step 4 - Simulação em Tempo Real */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
              gap: 'clamp(32px, 8vw, 64px)',
              alignItems: 'center'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, rgba(134, 1, 248, 0.1) 0%, rgba(212, 70, 239, 0.1) 100%)',
                border: '1px solid rgba(134, 1, 248, 0.2)',
                borderRadius: '16px',
                padding: '24px',
                textAlign: 'center'
              }}>
                <img 
                  src="/lovable-uploads/1571c1f9-11dd-41e8-b238-504594c32b5c.png" 
                  alt="Simulação em Tempo Real"
                  style={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: '8px',
                    maxHeight: '300px',
                    objectFit: 'contain'
                  }}
                />
              </div>
              <div>
                <div style={{
                  background: 'linear-gradient(45deg, #8601F8, #d946ef)',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '24px',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: 'white'
                }}>
                  04
                </div>
                <h3 style={{
                  fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                  fontWeight: 'bold',
                  color: '#FFFFFF',
                  marginBottom: '16px',
                  fontFamily: 'Cal Sans, Inter, sans-serif'
                }}>
                  Simulação Interativa
                </h3>
                <p style={{
                  fontSize: 'clamp(14px, 3.5vw, 18px)',
                  color: 'rgba(255, 255, 255, 0.8)',
                  lineHeight: '1.6',
                  fontFamily: 'Cal Sans, Inter, sans-serif',
                  marginBottom: '24px'
                }}>
                  Interface imersiva com IA conversacional em tempo real. Visualize a interação através de orbs 
                  dinâmicos que respondem à sua voz e receba feedback instantâneo durante a prática.
                </p>
                <ul style={{ 
                  listStyle: 'none', 
                  padding: '0', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '12px' 
                }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#00FF99' }} />
                    <span style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}>IA conversacional avançada</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#00FF99' }} />
                    <span style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}>Visualização em tempo real</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#00FF99' }} />
                    <span style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}>Feedback instantâneo</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Step 5 - Análise Detalhada */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
              gap: 'clamp(32px, 8vw, 64px)',
              alignItems: 'center'
            }}>
              <div>
                <div style={{
                  background: 'linear-gradient(45deg, #8601F8, #d946ef)',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '24px',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: 'white'
                }}>
                  05
                </div>
                <h3 style={{
                  fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                  fontWeight: 'bold',
                  color: '#FFFFFF',
                  marginBottom: '16px',
                  fontFamily: 'Cal Sans, Inter, sans-serif'
                }}>
                  Relatórios Detalhados
                </h3>
                <p style={{
                  fontSize: 'clamp(14px, 3.5vw, 18px)',
                  color: 'rgba(255, 255, 255, 0.8)',
                  lineHeight: '1.6',
                  fontFamily: 'Cal Sans, Inter, sans-serif',
                  marginBottom: '24px'
                }}>
                  Após cada simulação, receba análises completas com score por critério, análise da conversa, 
                  indicadores de qualidade e recomendações específicas para melhoria.
                </p>
                <ul style={{ 
                  listStyle: 'none', 
                  padding: '0', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '12px' 
                }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#00FF99' }} />
                    <span style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}>Avaliação por critérios</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#00FF99' }} />
                    <span style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}>Análise conversacional</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#00FF99' }} />
                    <span style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}>Próximos passos</span>
                  </li>
                </ul>
              </div>
              <div style={{
                background: 'linear-gradient(135deg, rgba(134, 1, 248, 0.1) 0%, rgba(212, 70, 239, 0.1) 100%)',
                border: '1px solid rgba(134, 1, 248, 0.2)',
                borderRadius: '16px',
                padding: '24px',
                textAlign: 'center'
              }}>
                <img 
                  src="/lovable-uploads/cfea5e97-5961-42b4-bc33-fa02002e06f0.png" 
                  alt="Análise Detalhada"
                  style={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: '8px',
                    maxHeight: '300px',
                    objectFit: 'contain'
                  }}
                />
              </div>
            </div>

            {/* Step 6 - Upload RAG */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
              gap: 'clamp(32px, 8vw, 64px)',
              alignItems: 'center'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, rgba(134, 1, 248, 0.1) 0%, rgba(212, 70, 239, 0.1) 100%)',
                border: '1px solid rgba(134, 1, 248, 0.2)',
                borderRadius: '16px',
                padding: '24px',
                textAlign: 'center'
              }}>
                <img 
                  src="/lovable-uploads/eabe0726-ca65-4889-9aeb-518beff1bd7d.png" 
                  alt="Upload RAG"
                  style={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: '8px',
                    maxHeight: '300px',
                    objectFit: 'contain'
                  }}
                />
              </div>
              <div>
                <div style={{
                  background: 'linear-gradient(45deg, #8601F8, #d946ef)',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '24px',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: 'white'
                }}>
                  06
                </div>
                <h3 style={{
                  fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                  fontWeight: 'bold',
                  color: '#FFFFFF',
                  marginBottom: '16px',
                  fontFamily: 'Cal Sans, Inter, sans-serif'
                }}>
                  Upload de Documentos RAG
                </h3>
                <p style={{
                  fontSize: 'clamp(14px, 3.5vw, 18px)',
                  color: 'rgba(255, 255, 255, 0.8)',
                  lineHeight: '1.6',
                  fontFamily: 'Cal Sans, Inter, sans-serif',
                  marginBottom: '24px'
                }}>
                  Personalize suas simulações com documentos próprios. A IA utilizará o conteúdo como contexto 
                  adicional, criando cenários mais precisos e relevantes para sua realidade empresarial.
                </p>
                <ul style={{ 
                  listStyle: 'none', 
                  padding: '0', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '12px' 
                }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#00FF99' }} />
                    <span style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}>Suporte TXT, PDF, DOCX</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#00FF99' }} />
                    <span style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}>Contexto personalizado</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#00FF99' }} />
                    <span style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}>Até 10MB por arquivo</span>
                  </li>
                </ul>
              </div>
            </div>

          </div>

          {/* Call to Action Final */}
          <div style={{ 
            textAlign: 'center', 
            marginTop: 'clamp(80px, 20vw, 120px)',
            padding: 'clamp(40px, 10vw, 60px)',
            background: 'linear-gradient(135deg, rgba(134, 1, 248, 0.1) 0%, rgba(212, 70, 239, 0.05) 100%)',
            border: '1px solid rgba(134, 1, 248, 0.2)',
            borderRadius: '24px'
          }}>
            <h3 style={{
              fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
              fontWeight: 'bold',
              color: '#FFFFFF',
              marginBottom: '16px',
              fontFamily: 'Cal Sans, Inter, sans-serif'
            }}>
              Pronto para Começar?
            </h3>
            <p style={{
              fontSize: 'clamp(16px, 4vw, 18px)',
              color: 'rgba(255, 255, 255, 0.8)',
              marginBottom: '32px',
              maxWidth: '600px',
              margin: '0 auto 32px auto',
              fontFamily: 'Cal Sans, Inter, sans-serif'
            }}>
              Experimente todas essas funcionalidades e transforme o treinamento da sua equipe com IA conversacional
            </p>
            <Link 
              to="/dashboard" 
              style={{ 
                display: 'inline-block',
                padding: 'clamp(16px, 4vw, 20px) clamp(32px, 8vw, 48px)',
                borderRadius: '16px',
                background: 'linear-gradient(90deg, #8601F8 0%, #00FF99 100%)',
                color: '#FFFFFF',
                textDecoration: 'none',
                fontSize: 'clamp(16px, 4vw, 20px)',
                fontWeight: '600',
                fontFamily: 'Cal Sans, Inter, sans-serif',
                boxShadow: '0 20px 40px rgba(134, 1, 248, 0.4)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 25px 50px rgba(134, 1, 248, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(134, 1, 248, 0.4)';
              }}
            >
              Acessar Plataforma →
            </Link>
          </div>

        </div>
      </section>
    </div>
  )
}

export default Index