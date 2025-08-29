import { useState } from 'react';

interface InteractiveTextAnimationProps {
  text: string;
  className?: string;
  specialWords?: Array<{
    word: string;
    className: string;
  }>;
}

export default function InteractiveTextAnimation({ 
  text, 
  className = '', 
  specialWords = [] 
}: InteractiveTextAnimationProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const words = text.split(' ');
  
  const getWordClassName = (word: string) => {
    const specialWord = specialWords.find(sw => sw.word.toLowerCase() === word.toLowerCase());
    return specialWord ? specialWord.className : 'text-white';
  };

  return (
    <div className={`relative ${className}`}>
      {/* Background particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-purple/30 rounded-full animate-particle-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
      </div>

      {/* Interactive text */}
      <div className="relative z-10">
        {words.map((word, wordIndex) => (
          <span key={wordIndex} className="inline-block">
            {word.split('').map((char, charIndex) => {
              const globalIndex = wordIndex * 100 + charIndex;
              return (
                <span
                  key={globalIndex}
                  className={`
                    inline-block transition-all duration-300 cursor-default
                    ${getWordClassName(word)}
                    ${hoveredIndex === globalIndex ? 'scale-125 drop-shadow-lg' : ''}
                  `}
                  style={{
                    animationDelay: `${(wordIndex * 0.1) + (charIndex * 0.05)}s`,
                  }}
                  onMouseEnter={() => setHoveredIndex(globalIndex)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {char}
                </span>
              );
            })}
            {wordIndex < words.length - 1 && <span className="text-white">&nbsp;</span>}
          </span>
        ))}
      </div>

      {/* Glow effect on hover */}
      {hoveredIndex !== null && (
        <div className="absolute inset-0 bg-gradient-to-r from-purple/10 via-spring/10 to-purple/10 rounded-lg blur-xl animate-pulse pointer-events-none" />
      )}
    </div>
  );
}