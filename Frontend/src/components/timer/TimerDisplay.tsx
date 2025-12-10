import { cn } from '@/lib/utils';

interface TimerDisplayProps {
  time: number;
  isRunning: boolean;
  progress?: number;
  size?: 'sm' | 'md' | 'lg';
}

export function TimerDisplay({ time, isRunning, progress = 0, size = 'lg' }: TimerDisplayProps) {
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = time % 60;

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  const displayTime = hours > 0 
    ? `${formatNumber(hours)}:${formatNumber(minutes)}:${formatNumber(seconds)}`
    : `${formatNumber(minutes)}:${formatNumber(seconds)}`;

  const sizeClasses = {
    sm: 'text-3xl md:text-4xl',
    md: 'text-4xl md:text-6xl',
    lg: 'text-5xl md:text-7xl lg:text-8xl',
  };

  const ringSize = {
    sm: 180,
    md: 240,
    lg: 320,
  };

  const strokeWidth = size === 'lg' ? 6 : 4;
  const radius = (ringSize[size] - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center min-h-[280px] md:min-h-[340px]">
      <svg
        width={ringSize[size]}
        height={ringSize[size]}
        className="absolute progress-ring"
      >
        {/* Background ring */}
        <circle
          cx={ringSize[size] / 2}
          cy={ringSize[size] / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth={strokeWidth}
        />
        {/* Progress ring */}
        <circle
          cx={ringSize[size] / 2}
          cy={ringSize[size] / 2}
          r={radius}
          fill="none"
          stroke="url(#gradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000 ease-linear"
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="hsl(var(--accent))" />
          </linearGradient>
        </defs>
      </svg>
      
      <div className="relative z-10 flex flex-col items-center">
        <span 
          className={cn(
            'font-display font-bold tracking-tight transition-all duration-300',
            sizeClasses[size],
            isRunning && 'animate-pulse-glow'
          )}
          style={{
            textShadow: isRunning 
              ? '0 0 40px hsl(var(--primary) / 0.4)' 
              : 'none',
          }}
        >
          {displayTime}
        </span>
      </div>
    </div>
  );
}
