interface ExcluviaLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  variant?: 'dark' | 'light';
}

export default function ExcluviaLogo({ 
  size = 'md', 
  className = '',
  variant = 'light' 
}: ExcluviaLogoProps) {
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-12',
    lg: 'h-16'
  };

  const textClasses = variant === 'light' 
    ? 'text-white' 
    : 'text-foreground';

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <img 
        src="/public/logo-excluvia.png" 
        alt="Excluv.ia" 
        className={sizeClasses[size]}
      />
      <span className={`font-bold bg-gradient-to-r from-purple to-spring bg-clip-text text-transparent ${sizeClasses[size] === 'h-8' ? 'text-lg' : sizeClasses[size] === 'h-12' ? 'text-xl' : 'text-2xl'}`}>
        Excluv.ia
      </span>
    </div>
  );
}