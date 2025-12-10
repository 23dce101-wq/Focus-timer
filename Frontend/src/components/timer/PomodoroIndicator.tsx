import { cn } from '@/lib/utils';
import type { PomodoroPhase } from '@/hooks/useTimer';
import { Coffee, Brain, Sparkles } from 'lucide-react';

interface PomodoroIndicatorProps {
  phase: PomodoroPhase;
  count: number;
  totalCycles: number;
}

export function PomodoroIndicator({ phase, count, totalCycles }: PomodoroIndicatorProps) {
  const phaseConfig = {
    work: {
      label: 'Focus Time',
      icon: Brain,
      className: 'text-primary',
    },
    break: {
      label: 'Short Break',
      icon: Coffee,
      className: 'text-accent',
    },
    longBreak: {
      label: 'Long Break',
      icon: Sparkles,
      className: 'text-accent',
    },
  };

  const config = phaseConfig[phase];
  const Icon = config.icon;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className={cn('flex items-center gap-2 text-lg font-medium', config.className)}>
        <Icon className="h-5 w-5" />
        <span>{config.label}</span>
      </div>
      
      <div className="flex gap-2">
        {Array.from({ length: totalCycles }).map((_, i) => (
          <div
            key={i}
            className={cn(
              'h-2 w-8 rounded-full transition-all duration-300',
              i < count 
                ? 'bg-gradient-to-r from-primary to-accent' 
                : 'bg-border'
            )}
          />
        ))}
      </div>
      
      <p className="text-sm text-muted-foreground">
        Cycle {count} of {totalCycles}
      </p>
    </div>
  );
}
