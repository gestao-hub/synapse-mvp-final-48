import React from 'react';

interface AuroraBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

const AuroraBackground: React.FC<AuroraBackgroundProps> = ({ children, className = '' }) => {
  console.log('AuroraBackground component renderizando');
  
  return (
    <div className={`relative overflow-hidden min-h-[600px] ${className}`} style={{ backgroundColor: '#000131' }}>
      
      {/* Aurora background exatamente como especificado */}
      <div className="aurora-bg">
        <i />
      </div>
      
      {/* Content */}
      <div style={{ position: 'relative', zIndex: 20 }}>
        {children}
      </div>
    </div>
  );
};

export default AuroraBackground;