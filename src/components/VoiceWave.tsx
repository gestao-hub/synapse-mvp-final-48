import React, { useState, useEffect } from 'react';
interface VoiceWaveProps {
  isActive?: boolean;
  className?: string;
}
const VoiceWave: React.FC<VoiceWaveProps> = ({
  isActive = false,
  className = ""
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [time, setTime] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(prev => prev + 0.1);
    }, 100);
    return () => clearInterval(interval);
  }, []);
  return <div className={`relative w-40 h-40 mx-auto cursor-pointer ${className}`} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      {/* X Logo Background */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* First bar of X */}
        <div className="absolute w-20 h-4 rounded-lg opacity-20" style={{
        background: 'linear-gradient(45deg, #8601F8 0%, #00FF99 100%)',
        transform: 'rotate(45deg)'
      }} />
        {/* Second bar of X */}
        <div className="absolute w-20 h-4 rounded-lg opacity-20" style={{
        background: 'linear-gradient(135deg, #8601F8 0%, #00FF99 100%)',
        transform: 'rotate(-45deg)'
      }} />
      </div>
      
      {/* Main pulsing circle with glow */}
      <div className={`absolute inset-4 rounded-full border-2 border-brand-purple/60 bg-brand-purple/10 animate-glow-pulse ${isHovered ? 'border-brand-purple animate-[glow-pulse_1s_ease-in-out_infinite]' : ''}`}>
        
      {/* Brain-like neural network */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Central brain core */}
        <div className="absolute w-8 h-8 rounded-full bg-brand-purple/60 animate-brain-pulse shadow-[0_0_20px_rgba(134,1,248,0.4)]" />
        
        {/* Neural pathways with tracer lines */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 160 160">
          {[...Array(8)].map((_, i) => {
            const angle = i * 45 * (Math.PI / 180);
            const startRadius = 25;
            const endRadius = 65;
            const startX = 80 + Math.cos(angle) * startRadius;
            const startY = 80 + Math.sin(angle) * startRadius;
            const endX = 80 + Math.cos(angle) * endRadius;
            const endY = 80 + Math.sin(angle) * endRadius;
            return <g key={`neural-path-${i}`}>
                {/* Base neural pathway */}
                <line x1={startX} y1={startY} x2={endX} y2={endY} stroke="rgba(134, 1, 248, 0.3)" strokeWidth="1" />
                {/* Animated tracer line */}
                <line x1={startX} y1={startY} x2={endX} y2={endY} stroke="url(#gradient)" strokeWidth="2" className="animate-tracer-line" style={{
                animationDelay: `${i * 0.3}s`
              }} />
              </g>;
          })}
          
          {/* Gradient definition for tracer lines */}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(134, 1, 248, 0)" />
              <stop offset="50%" stopColor="rgba(134, 1, 248, 1)" />
              <stop offset="100%" stopColor="rgba(0, 255, 153, 0.8)" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Neural firing impulses */}
        {[...Array(8)].map((_, i) => {
          const angle = i * 45 * (Math.PI / 180);
          return <div key={`neural-impulse-${i}`} className="absolute w-2 h-2 rounded-full bg-brand-green animate-neural-fire" style={{
            left: '50%',
            top: '50%',
            transformOrigin: '0 0',
            transform: `rotate(${i * 45}deg) translateX(-1px) translateY(-1px)`,
            animationDelay: `${i * 0.3}s`
          }} />;
        })}
      </div>
      </div>
      
      
      {/* Hover enhancement effects */}
      {isHovered && <>
          {/* Extra intense ripples */}
          {[...Array(5)].map((_, i) => {})}
          
          {/* Floating energy orbs */}
          {[...Array(8)].map((_, i) => {})}
        </>}
    </div>;
};
export default VoiceWave;