import { cn } from '@/lib/utils';

interface AngelLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  animated?: boolean;
}

export function AngelLogo({ size = 'md', className, animated = true }: AngelLogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-20 h-20',
    xl: 'w-32 h-32',
  };

  return (
    <div className={cn('relative', sizeClasses[size], className)}>
      {/* Outer Glow */}
      <div className={cn(
        "absolute inset-0 rounded-full bg-gradient-to-br from-primary/40 to-secondary/30 blur-xl",
        animated && "animate-glow-pulse"
      )} />
      
      {/* Halo Ring */}
      <div className={cn(
        "absolute inset-[-15%] rounded-full border-2 border-primary/30",
        animated && "animate-divine-spin"
      )} />
      
      {/* Inner Circle */}
      <div className="absolute inset-1 rounded-full bg-gradient-to-br from-primary via-primary/80 to-secondary/60 shadow-lg shadow-primary/30">
        {/* Shine Effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/30 to-transparent" />
        
        {/* Angel Symbol */}
        <div className="absolute inset-0 flex items-center justify-center text-primary-foreground">
          <svg 
            viewBox="0 0 24 24" 
            className={cn(
              "fill-current",
              size === 'sm' && 'w-4 h-4',
              size === 'md' && 'w-6 h-6',
              size === 'lg' && 'w-10 h-10',
              size === 'xl' && 'w-16 h-16',
            )}
          >
            {/* Simplified angel/light symbol */}
            <path d="M12 2L15 8L22 9L17 14L18 21L12 18L6 21L7 14L2 9L9 8L12 2Z" />
          </svg>
        </div>
      </div>
      
      {/* Sparkles */}
      {animated && (
        <>
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full animate-glow-pulse" style={{ animationDelay: '0.5s' }} />
          <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-secondary rounded-full animate-glow-pulse" style={{ animationDelay: '1s' }} />
        </>
      )}
    </div>
  );
}
