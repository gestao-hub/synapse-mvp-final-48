import React from 'react';

interface ExcluviaCircuitAnimationProps {
  compact?: boolean;
  interactive?: boolean;
  className?: string;
}

const ExcluviaCircuitAnimation: React.FC<ExcluviaCircuitAnimationProps> = ({ 
  compact = false, 
  interactive = false,
  className = ""
}) => {
  return (
    <div 
      className={`circuit-animation-excluvia ${compact ? 'compact' : ''} ${interactive ? 'interactive' : ''} ${className}`}
      role="img" 
      aria-label="Animação de circuito eletrônico da Excluv.ia"
    >
      <svg className="circuit-svg" viewBox="0 0 800 600">
        {/* Caminhos do circuito - Chip de IA com padrão geométrico preciso */}
        <g className="circuit-paths">
          {/* Trilhas horizontais principais - cobrindo toda a largura */}
          <path d="M 0 150 L 320 150" stroke="#1a1a2e" strokeWidth="2" fill="none"/>
          <path d="M 480 150 L 800 150" stroke="#1a1a2e" strokeWidth="2" fill="none"/>
          <path d="M 0 200 L 320 200" stroke="#1a1a2e" strokeWidth="2" fill="none"/>
          <path d="M 480 200 L 800 200" stroke="#1a1a2e" strokeWidth="2" fill="none"/>
          <path d="M 0 250 L 320 250" stroke="#1a1a2e" strokeWidth="2" fill="none"/>
          <path d="M 480 250 L 800 250" stroke="#1a1a2e" strokeWidth="2" fill="none"/>
          <path d="M 0 300 L 320 300" stroke="#1a1a2e" strokeWidth="2" fill="none"/>
          <path d="M 480 300 L 800 300" stroke="#1a1a2e" strokeWidth="2" fill="none"/>
          <path d="M 0 350 L 320 350" stroke="#1a1a2e" strokeWidth="2" fill="none"/>
          <path d="M 480 350 L 800 350" stroke="#1a1a2e" strokeWidth="2" fill="none"/>
          <path d="M 0 400 L 320 400" stroke="#1a1a2e" strokeWidth="2" fill="none"/>
          <path d="M 480 400 L 800 400" stroke="#1a1a2e" strokeWidth="2" fill="none"/>
          <path d="M 0 450 L 320 450" stroke="#1a1a2e" strokeWidth="2" fill="none"/>
          <path d="M 480 450 L 800 450" stroke="#1a1a2e" strokeWidth="2" fill="none"/>
          
          {/* Trilhas verticais principais - cobrindo toda a altura */}
          <path d="M 100 0 L 100 220" stroke="#1a1a2e" strokeWidth="2" fill="none"/>
          <path d="M 100 380 L 100 600" stroke="#1a1a2e" strokeWidth="2" fill="none"/>
          <path d="M 150 0 L 150 220" stroke="#1a1a2e" strokeWidth="2" fill="none"/>
          <path d="M 150 380 L 150 600" stroke="#1a1a2e" strokeWidth="2" fill="none"/>
          <path d="M 200 0 L 200 220" stroke="#1a1a2e" strokeWidth="2" fill="none"/>
          <path d="M 200 380 L 200 600" stroke="#1a1a2e" strokeWidth="2" fill="none"/>
          <path d="M 250 0 L 250 220" stroke="#1a1a2e" strokeWidth="2" fill="none"/>
          <path d="M 250 380 L 250 600" stroke="#1a1a2e" strokeWidth="2" fill="none"/>
          <path d="M 350 0 L 350 220" stroke="#1a1a2e" strokeWidth="2" fill="none"/>
          <path d="M 350 380 L 350 600" stroke="#1a1a2e" strokeWidth="2" fill="none"/>
          <path d="M 400 0 L 400 220" stroke="#1a1a2e" strokeWidth="2" fill="none"/>
          <path d="M 400 380 L 400 600" stroke="#1a1a2e" strokeWidth="2" fill="none"/>
          <path d="M 450 0 L 450 220" stroke="#1a1a2e" strokeWidth="2" fill="none"/>
          <path d="M 450 380 L 450 600" stroke="#1a1a2e" strokeWidth="2" fill="none"/>
          <path d="M 550 0 L 550 220" stroke="#1a1a2e" strokeWidth="2" fill="none"/>
          <path d="M 550 380 L 550 600" stroke="#1a1a2e" strokeWidth="2" fill="none"/>
          <path d="M 600 0 L 600 220" stroke="#1a1a2e" strokeWidth="2" fill="none"/>
          <path d="M 600 380 L 600 600" stroke="#1a1a2e" strokeWidth="2" fill="none"/>
          <path d="M 650 0 L 650 220" stroke="#1a1a2e" strokeWidth="2" fill="none"/>
          <path d="M 650 380 L 650 600" stroke="#1a1a2e" strokeWidth="2" fill="none"/>
          <path d="M 700 0 L 700 220" stroke="#1a1a2e" strokeWidth="2" fill="none"/>
          <path d="M 700 380 L 700 600" stroke="#1a1a2e" strokeWidth="2" fill="none"/>
          
          {/* Conexões em 90° - lado esquerdo */}
          <path d="M 100 150 L 150 150 L 150 200 L 200 200" stroke="#1a1a2e" strokeWidth="1.5" fill="none"/>
          <path d="M 100 200 L 150 200 L 150 250 L 200 250" stroke="#1a1a2e" strokeWidth="1.5" fill="none"/>
          <path d="M 100 250 L 150 250 L 150 300 L 200 300" stroke="#1a1a2e" strokeWidth="1.5" fill="none"/>
          <path d="M 100 300 L 150 300 L 150 350 L 200 350" stroke="#1a1a2e" strokeWidth="1.5" fill="none"/>
          <path d="M 100 350 L 150 350 L 150 400 L 200 400" stroke="#1a1a2e" strokeWidth="1.5" fill="none"/>
          <path d="M 100 400 L 150 400 L 150 450 L 200 450" stroke="#1a1a2e" strokeWidth="1.5" fill="none"/>
          
          {/* Conexões em 90° - lado direito */}
          <path d="M 700 150 L 650 150 L 650 200 L 600 200" stroke="#1a1a2e" strokeWidth="1.5" fill="none"/>
          <path d="M 700 200 L 650 200 L 650 250 L 600 250" stroke="#1a1a2e" strokeWidth="1.5" fill="none"/>
          <path d="M 700 250 L 650 250 L 650 300 L 600 300" stroke="#1a1a2e" strokeWidth="1.5" fill="none"/>
          <path d="M 700 300 L 650 300 L 650 350 L 600 350" stroke="#1a1a2e" strokeWidth="1.5" fill="none"/>
          <path d="M 700 350 L 650 350 L 650 400 L 600 400" stroke="#1a1a2e" strokeWidth="1.5" fill="none"/>
          <path d="M 700 400 L 650 400 L 650 450 L 600 450" stroke="#1a1a2e" strokeWidth="1.5" fill="none"/>
          
          {/* Conexões em 90° - superiores */}
          <path d="M 200 100 L 200 150 L 250 150 L 250 100" stroke="#1a1a2e" strokeWidth="1.5" fill="none"/>
          <path d="M 350 100 L 350 150 L 400 150 L 400 100" stroke="#1a1a2e" strokeWidth="1.5" fill="none"/>
          <path d="M 450 100 L 450 150 L 550 150 L 550 100" stroke="#1a1a2e" strokeWidth="1.5" fill="none"/>
          <path d="M 600 100 L 600 150 L 650 150 L 650 100" stroke="#1a1a2e" strokeWidth="1.5" fill="none"/>
          
          {/* Conexões em 90° - inferiores */}
          <path d="M 200 500 L 200 450 L 250 450 L 250 500" stroke="#1a1a2e" strokeWidth="1.5" fill="none"/>
          <path d="M 350 500 L 350 450 L 400 450 L 400 500" stroke="#1a1a2e" strokeWidth="1.5" fill="none"/>
          <path d="M 450 500 L 450 450 L 550 450 L 550 500" stroke="#1a1a2e" strokeWidth="1.5" fill="none"/>
          <path d="M 600 500 L 600 450 L 650 450 L 650 500" stroke="#1a1a2e" strokeWidth="1.5" fill="none"/>
          
          {/* Trilhas diagonais 45° - cantos superiores */}
          <path d="M 50 50 L 100 100 L 150 50" stroke="#1a1a2e" strokeWidth="1" fill="none"/>
          <path d="M 650 50 L 700 100 L 750 50" stroke="#1a1a2e" strokeWidth="1" fill="none"/>
          <path d="M 200 50 L 250 100 L 300 50" stroke="#1a1a2e" strokeWidth="1" fill="none"/>
          <path d="M 500 50 L 550 100 L 600 50" stroke="#1a1a2e" strokeWidth="1" fill="none"/>
          
          {/* Trilhas diagonais 45° - cantos inferiores */}
          <path d="M 50 550 L 100 500 L 150 550" stroke="#1a1a2e" strokeWidth="1" fill="none"/>
          <path d="M 650 550 L 700 500 L 750 550" stroke="#1a1a2e" strokeWidth="1" fill="none"/>
          <path d="M 200 550 L 250 500 L 300 550" stroke="#1a1a2e" strokeWidth="1" fill="none"/>
          <path d="M 500 550 L 550 500 L 600 550" stroke="#1a1a2e" strokeWidth="1" fill="none"/>
          
          {/* Trilhas em zigue-zague - padrão de escape de sinais */}
          <path d="M 50 250 L 80 250 L 80 280 L 110 280 L 110 250" stroke="#1a1a2e" strokeWidth="1" fill="none"/>
          <path d="M 750 250 L 720 250 L 720 280 L 690 280 L 690 250" stroke="#1a1a2e" strokeWidth="1" fill="none"/>
          <path d="M 50 350 L 80 350 L 80 320 L 110 320 L 110 350" stroke="#1a1a2e" strokeWidth="1" fill="none"/>
          <path d="M 750 350 L 720 350 L 720 320 L 690 320 L 690 350" stroke="#1a1a2e" strokeWidth="1" fill="none"/>
          
          {/* Microprocessadores/chips menores */}
          <rect x="80" y="180" width="40" height="40" stroke="#2a2a3e" strokeWidth="1.5" fill="none"/>
          <rect x="680" y="180" width="40" height="40" stroke="#2a2a3e" strokeWidth="1.5" fill="none"/>
          <rect x="80" y="380" width="40" height="40" stroke="#2a2a3e" strokeWidth="1.5" fill="none"/>
          <rect x="680" y="380" width="40" height="40" stroke="#2a2a3e" strokeWidth="1.5" fill="none"/>
          <rect x="180" y="80" width="40" height="40" stroke="#2a2a3e" strokeWidth="1.5" fill="none"/>
          <rect x="580" y="80" width="40" height="40" stroke="#2a2a3e" strokeWidth="1.5" fill="none"/>
          <rect x="180" y="480" width="40" height="40" stroke="#2a2a3e" strokeWidth="1.5" fill="none"/>
          <rect x="580" y="480" width="40" height="40" stroke="#2a2a3e" strokeWidth="1.5" fill="none"/>
          
          {/* Conectores principais nas junções */}
          <circle cx="150" cy="150" r="4" fill="#2a2a3e"/>
          <circle cx="200" cy="200" r="4" fill="#2a2a3e"/>
          <circle cx="250" cy="250" r="4" fill="#2a2a3e"/>
          <circle cx="350" cy="150" r="4" fill="#2a2a3e"/>
          <circle cx="400" cy="200" r="4" fill="#2a2a3e"/>
          <circle cx="450" cy="250" r="4" fill="#2a2a3e"/>
          <circle cx="550" cy="350" r="4" fill="#2a2a3e"/>
          <circle cx="600" cy="400" r="4" fill="#2a2a3e"/>
          <circle cx="650" cy="450" r="4" fill="#2a2a3e"/>
          
          {/* Conectores secundários */}
          <circle cx="100" cy="200" r="3" fill="#1a1a2e"/>
          <circle cx="150" cy="250" r="3" fill="#1a1a2e"/>
          <circle cx="200" cy="300" r="3" fill="#1a1a2e"/>
          <circle cx="250" cy="350" r="3" fill="#1a1a2e"/>
          <circle cx="350" cy="250" r="3" fill="#1a1a2e"/>
          <circle cx="400" cy="300" r="3" fill="#1a1a2e"/>
          <circle cx="450" cy="350" r="3" fill="#1a1a2e"/>
          <circle cx="550" cy="150" r="3" fill="#1a1a2e"/>
          <circle cx="600" cy="200" r="3" fill="#1a1a2e"/>
          <circle cx="650" cy="250" r="3" fill="#1a1a2e"/>
          <circle cx="700" cy="300" r="3" fill="#1a1a2e"/>
          
          {/* Pontos de teste/debug - pequenos */}
          <circle cx="100" cy="100" r="2" fill="#1a1a2e"/>
          <circle cx="200" cy="100" r="2" fill="#1a1a2e"/>
          <circle cx="300" cy="100" r="2" fill="#1a1a2e"/>
          <circle cx="500" cy="100" r="2" fill="#1a1a2e"/>
          <circle cx="600" cy="100" r="2" fill="#1a1a2e"/>
          <circle cx="700" cy="100" r="2" fill="#1a1a2e"/>
          <circle cx="100" cy="500" r="2" fill="#1a1a2e"/>
          <circle cx="200" cy="500" r="2" fill="#1a1a2e"/>
          <circle cx="300" cy="500" r="2" fill="#1a1a2e"/>
          <circle cx="500" cy="500" r="2" fill="#1a1a2e"/>
          <circle cx="600" cy="500" r="2" fill="#1a1a2e"/>
          <circle cx="700" cy="500" r="2" fill="#1a1a2e"/>
        </g>
        
        {/* Luzes animadas - Sinais elétricos seguindo trilhas precisas */}
        <g className="animated-lights">
          {/* Sinais horizontais principais */}
          <circle className="light light-green" r="6" fill="url(#greenLightGradient)">
            <animateMotion dur="4s" repeatCount="indefinite">
              <mpath href="#horizontal-main-1"/>
            </animateMotion>
          </circle>
          
          <circle className="light light-purple" r="6" fill="url(#purpleLightGradient)">
            <animateMotion dur="5s" repeatCount="indefinite" begin="1s">
              <mpath href="#horizontal-main-2"/>
            </animateMotion>
          </circle>
          
          <circle className="light light-green-2" r="5" fill="url(#greenLightGradient)">
            <animateMotion dur="6s" repeatCount="indefinite" begin="2s">
              <mpath href="#horizontal-main-3"/>
            </animateMotion>
          </circle>
          
          {/* Sinais verticais principais */}
          <circle className="light light-purple-2" r="5" fill="url(#purpleLightGradient)">
            <animateMotion dur="4.5s" repeatCount="indefinite" begin="0.5s">
              <mpath href="#vertical-main-1"/>
            </animateMotion>
          </circle>
          
          <circle className="light light-green-3" r="4" fill="url(#greenLightGradient)">
            <animateMotion dur="5.5s" repeatCount="indefinite" begin="1.5s">
              <mpath href="#vertical-main-2"/>
            </animateMotion>
          </circle>
          
          <circle className="light light-purple-3" r="4" fill="url(#purpleLightGradient)">
            <animateMotion dur="6.5s" repeatCount="indefinite" begin="2.5s">
              <mpath href="#vertical-main-3"/>
            </animateMotion>
          </circle>
          
          {/* Sinais em L (90°) - lado esquerdo */}
          <circle className="light light-green-4" r="4" fill="url(#greenLightGradient)">
            <animateMotion dur="3.5s" repeatCount="indefinite" begin="3s">
              <mpath href="#l-shape-left-1"/>
            </animateMotion>
          </circle>
          
          <circle className="light light-purple-4" r="4" fill="url(#purpleLightGradient)">
            <animateMotion dur="4s" repeatCount="indefinite" begin="0.8s">
              <mpath href="#l-shape-left-2"/>
            </animateMotion>
          </circle>
          
          {/* Sinais em L (90°) - lado direito */}
          <circle className="light light-green-5" r="4" fill="url(#greenLightGradient)">
            <animateMotion dur="4.5s" repeatCount="indefinite" begin="2.2s">
              <mpath href="#l-shape-right-1"/>
            </animateMotion>
          </circle>
          
          <circle className="light light-purple-5" r="4" fill="url(#purpleLightGradient)">
            <animateMotion dur="5s" repeatCount="indefinite" begin="3.8s">
              <mpath href="#l-shape-right-2"/>
            </animateMotion>
          </circle>
          
          {/* Sinais diagonais 45° */}
          <circle className="light light-green-6" r="3" fill="url(#greenLightGradient)">
            <animateMotion dur="3s" repeatCount="indefinite" begin="1.2s">
              <mpath href="#diagonal-top-left"/>
            </animateMotion>
          </circle>
          
          <circle className="light light-purple-6" r="3" fill="url(#purpleLightGradient)">
            <animateMotion dur="3.5s" repeatCount="indefinite" begin="4.2s">
              <mpath href="#diagonal-top-right"/>
            </animateMotion>
          </circle>
          
          <circle className="light light-green-7" r="3" fill="url(#greenLightGradient)">
            <animateMotion dur="4s" repeatCount="indefinite" begin="0.3s">
              <mpath href="#diagonal-bottom-left"/>
            </animateMotion>
          </circle>
          
          <circle className="light light-purple-7" r="3" fill="url(#purpleLightGradient)">
            <animateMotion dur="4.5s" repeatCount="indefinite" begin="2.8s">
              <mpath href="#diagonal-bottom-right"/>
            </animateMotion>
          </circle>
          
          {/* Sinais em zigue-zague */}
          <circle className="light light-green-8" r="2" fill="url(#greenLightGradient)">
            <animateMotion dur="2.5s" repeatCount="indefinite" begin="1.8s">
              <mpath href="#zigzag-left"/>
            </animateMotion>
          </circle>
          
          <circle className="light light-purple-8" r="2" fill="url(#purpleLightGradient)">
            <animateMotion dur="3s" repeatCount="indefinite" begin="3.5s">
              <mpath href="#zigzag-right"/>
            </animateMotion>
          </circle>
        </g>
        
        {/* Gradientes para as luzes */}
        <defs>
          <radialGradient id="greenLightGradient">
            <stop offset="0%" stopColor="#00FF99" stopOpacity="1"/>
            <stop offset="50%" stopColor="#00FF99" stopOpacity="0.6"/>
            <stop offset="100%" stopColor="#00FF99" stopOpacity="0"/>
          </radialGradient>
          
          <radialGradient id="purpleLightGradient">
            <stop offset="0%" stopColor="#8601F8" stopOpacity="1"/>
            <stop offset="50%" stopColor="#8601F8" stopOpacity="0.6"/>
            <stop offset="100%" stopColor="#8601F8" stopOpacity="0"/>
          </radialGradient>
          
          {/* Caminhos de trilhas para animação - Seguindo padrões geométricos precisos */}
          <path id="horizontal-main-1" d="M 0 200 L 320 200"/>
          <path id="horizontal-main-2" d="M 480 300 L 800 300"/>
          <path id="horizontal-main-3" d="M 0 400 L 320 400"/>
          
          <path id="vertical-main-1" d="M 200 0 L 200 220"/>
          <path id="vertical-main-2" d="M 400 380 L 400 600"/>
          <path id="vertical-main-3" d="M 600 0 L 600 220"/>
          
          <path id="l-shape-left-1" d="M 100 150 L 150 150 L 150 200 L 200 200"/>
          <path id="l-shape-left-2" d="M 100 300 L 150 300 L 150 350 L 200 350"/>
          
          <path id="l-shape-right-1" d="M 700 250 L 650 250 L 650 300 L 600 300"/>
          <path id="l-shape-right-2" d="M 700 400 L 650 400 L 650 450 L 600 450"/>
          
          <path id="diagonal-top-left" d="M 50 50 L 100 100 L 150 50"/>
          <path id="diagonal-top-right" d="M 650 50 L 700 100 L 750 50"/>
          <path id="diagonal-bottom-left" d="M 50 550 L 100 500 L 150 550"/>
          <path id="diagonal-bottom-right" d="M 650 550 L 700 500 L 750 550"/>
          
          <path id="zigzag-left" d="M 50 250 L 80 250 L 80 280 L 110 280 L 110 250"/>
          <path id="zigzag-right" d="M 750 350 L 720 350 L 720 320 L 690 320 L 690 350"/>
        </defs>
      </svg>
      
      {/* Elemento central "Powered By Excluv.ia" */}
      <div className="powered-by-chip-excluvia">
        <span className="powered-text">Powered By</span>
        <span className="brand-name">Excluv.ia</span>
      </div>
    </div>
  );
};

export default ExcluviaCircuitAnimation;