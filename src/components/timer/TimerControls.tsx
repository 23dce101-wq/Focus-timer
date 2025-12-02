import { Play, Pause, RotateCcw, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TimerControlsProps {
  isRunning: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onFullscreen?: () => void;
  disabled?: boolean;
}

export function TimerControls({
  isRunning,
  onStart,
  onPause,
  onReset,
  onFullscreen,
  disabled = false,
}: TimerControlsProps) {
  return (
    <div className="flex items-center justify-center gap-4">
      <Button
        variant="outline"
        size="icon"
        onClick={onReset}
        className="h-14 w-14 rounded-full border-2 transition-all duration-300 hover:scale-105"
        aria-label="Reset timer"
      >
        <RotateCcw className="h-6 w-6" />
      </Button>

      <Button
        onClick={isRunning ? onPause : onStart}
        disabled={disabled}
        className={cn(
          'h-20 w-20 rounded-full text-lg font-semibold transition-all duration-300 hover:scale-105',
          'bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-lg',
          isRunning && 'animate-pulse-glow'
        )}
        aria-label={isRunning ? 'Pause timer' : 'Start timer'}
      >
        {isRunning ? (
          <Pause className="h-8 w-8" />
        ) : (
          <Play className="h-8 w-8 ml-1" />
        )}
      </Button>

      {onFullscreen && (
        <Button
          variant="outline"
          size="icon"
          onClick={onFullscreen}
          className="h-14 w-14 rounded-full border-2 transition-all duration-300 hover:scale-105"
          aria-label="Toggle fullscreen"
        >
          <Maximize2 className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
}
