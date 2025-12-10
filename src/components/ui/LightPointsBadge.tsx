import { cn } from '@/lib/utils';
import { Sparkles } from 'lucide-react';

interface LightPointsBadgeProps {
  points: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LightPointsBadge({ points, size = 'md', className }: LightPointsBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-1 gap-1',
    md: 'text-sm px-3 py-1.5 gap-1.5',
    lg: 'text-base px-4 py-2 gap-2',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <div className={cn(
      "inline-flex items-center rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 font-medium text-primary-foreground",
      sizeClasses[size],
      className
    )}>
      <Sparkles className={cn(iconSizes[size], "text-primary animate-glow-pulse")} />
      <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-bold">
        {points.toLocaleString()}
      </span>
      <span className="text-muted-foreground">Light Points</span>
    </div>
  );
}
