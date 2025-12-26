import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Pause, RotateCcw, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FocusModeProps {
  isOpen: boolean;
  onClose: () => void;
  time: number;
  isRunning: boolean;
  progress?: number;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  mode: 'countdown' | 'pomodoro' | 'stopwatch';
  pomodoroPhase?: 'work' | 'break' | 'longBreak';
}

export function FocusMode({
  isOpen,
  onClose,
  time,
  isRunning,
  progress = 0,
  onStart,
  onPause,
  onReset,
  mode,
  pomodoroPhase,
}: FocusModeProps) {
  // Format time display
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = time % 60;

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  const displayTime = hours > 0 
    ? `${formatNumber(hours)}:${formatNumber(minutes)}:${formatNumber(seconds)}`
    : `${formatNumber(minutes)}:${formatNumber(seconds)}`;

  // Progress ring calculations - responsive sizes
  const getRingSize = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 640) return 280;
      if (window.innerWidth < 768) return 340;
      return 420;
    }
    return 420;
  };
  
  const ringSize = getRingSize();
  const strokeWidth = ringSize < 300 ? 6 : 8;
  const radius = (ringSize - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  // Handle escape key to close
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === ' ') {
      e.preventDefault();
      if (isRunning) {
        onPause();
      } else {
        onStart();
      }
    } else if (e.key.toLowerCase() === 'r') {
      onReset();
    }
  }, [onClose, isRunning, onPause, onStart, onReset]);

  useEffect(() => {
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      // Prevent body scroll when focus mode is open
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  // Get phase label for Pomodoro
  const getPhaseLabel = () => {
    if (mode !== 'pomodoro') return null;
    switch (pomodoroPhase) {
      case 'work':
        return 'Focus Time';
      case 'break':
        return 'Short Break';
      case 'longBreak':
        return 'Long Break';
      default:
        return 'Pomodoro';
    }
  };

  // Get mode label
  const getModeLabel = () => {
    switch (mode) {
      case 'countdown':
        return 'Countdown';
      case 'pomodoro':
        return getPhaseLabel();
      case 'stopwatch':
        return 'Stopwatch';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] focus-mode-overlay"
        >
          {/* Background with gradient */}
          <div className="absolute inset-0 bg-background">
            <div className="focus-mode-gradient" />
          </div>

          {/* Close button */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="absolute top-6 right-6 z-10"
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-12 w-12 rounded-full bg-muted/20 hover:bg-muted/40 backdrop-blur-sm border border-border/20"
              aria-label="Exit focus mode"
            >
              <X className="h-6 w-6" />
            </Button>
          </motion.div>

          {/* Main content - centered */}
          <div className="relative h-full flex flex-col items-center justify-center px-4 py-16">
            {/* Mode label */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-6 sm:mb-8"
            >
              <span className={cn(
                "px-5 py-2.5 rounded-full text-sm font-semibold backdrop-blur-md border shadow-lg",
                mode === 'pomodoro' && pomodoroPhase === 'work' && "bg-primary/20 border-primary/40 text-primary shadow-primary/20",
                mode === 'pomodoro' && pomodoroPhase === 'break' && "bg-emerald-500/20 border-emerald-500/40 text-emerald-400 shadow-emerald-500/20",
                mode === 'pomodoro' && pomodoroPhase === 'longBreak' && "bg-blue-500/20 border-blue-500/40 text-blue-400 shadow-blue-500/20",
                mode === 'countdown' && "bg-accent/20 border-accent/40 text-accent shadow-accent/20",
                mode === 'stopwatch' && "bg-orange-500/20 border-orange-500/40 text-orange-400 shadow-orange-500/20"
              )}>
                {getModeLabel()}
              </span>
            </motion.div>

            {/* Timer display with ring */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="relative flex items-center justify-center w-[280px] h-[280px] sm:w-[340px] sm:h-[340px] md:w-[420px] md:h-[420px]"
            >
              {/* Progress ring - only show for countdown and pomodoro */}
              {mode !== 'stopwatch' && (
                <svg
                  className="absolute inset-0 w-full h-full focus-mode-ring -rotate-90"
                  viewBox={`0 0 ${ringSize} ${ringSize}`}
                >
                  {/* Background ring */}
                  <circle
                    cx={ringSize / 2}
                    cy={ringSize / 2}
                    r={radius}
                    fill="none"
                    stroke="hsl(var(--border))"
                    strokeWidth={strokeWidth}
                    opacity="0.3"
                  />
                  {/* Progress ring */}
                  <circle
                    cx={ringSize / 2}
                    cy={ringSize / 2}
                    r={radius}
                    fill="none"
                    stroke="url(#focusGradient)"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-1000 ease-linear"
                  />
                  <defs>
                    <linearGradient id="focusGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="hsl(var(--primary))" />
                      <stop offset="100%" stopColor="hsl(var(--accent))" />
                    </linearGradient>
                  </defs>
                </svg>
              )}

              {/* Stopwatch decorative ring */}
              {mode === 'stopwatch' && (
                <svg
                  className="absolute inset-0 w-full h-full focus-mode-ring"
                  viewBox={`0 0 ${ringSize} ${ringSize}`}
                >
                  <circle
                    cx={ringSize / 2}
                    cy={ringSize / 2}
                    r={radius}
                    fill="none"
                    stroke="url(#stopwatchGradient)"
                    strokeWidth={strokeWidth}
                    opacity="0.4"
                  />
                  <defs>
                    <linearGradient id="stopwatchGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="hsl(var(--primary))" />
                      <stop offset="100%" stopColor="hsl(var(--accent))" />
                    </linearGradient>
                  </defs>
                </svg>
              )}

              {/* Time display */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span 
                  className={cn(
                    'font-display font-bold tracking-tight transition-all duration-300',
                    'text-5xl sm:text-6xl md:text-7xl lg:text-8xl',
                    isRunning && 'focus-mode-pulse'
                  )}
                >
                  {displayTime}
                </span>
                
                {/* Running indicator */}
                {isRunning && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-3 flex items-center gap-2"
                  >
                    <span className="h-2.5 w-2.5 rounded-full bg-primary animate-pulse" />
                    <span className="text-xs sm:text-sm text-muted-foreground">Running</span>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Controls */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-8 sm:mt-10 md:mt-12 flex items-center gap-4 sm:gap-6"
            >
              <Button
                variant="outline"
                size="icon"
                onClick={onReset}
                className="h-14 w-14 sm:h-16 sm:w-16 rounded-full border-2 bg-muted/20 hover:bg-muted/40 backdrop-blur-sm transition-all duration-300 hover:scale-110 focus-mode-button"
                aria-label="Reset timer"
              >
                <RotateCcw className="h-6 w-6 sm:h-7 sm:w-7" />
              </Button>

              <Button
                onClick={isRunning ? onPause : onStart}
                className={cn(
                  'h-20 w-20 sm:h-24 sm:w-24 rounded-full text-lg font-semibold transition-all duration-300 hover:scale-110',
                  'bg-gradient-to-br from-primary to-accent text-primary-foreground',
                  'shadow-[0_0_40px_rgba(22,189,202,0.3)] hover:shadow-[0_0_60px_rgba(22,189,202,0.5)]',
                  isRunning && 'animate-pulse-glow'
                )}
                aria-label={isRunning ? 'Pause timer' : 'Start timer'}
              >
                {isRunning ? (
                  <Pause className="h-8 w-8 sm:h-10 sm:w-10" />
                ) : (
                  <Play className="h-8 w-8 sm:h-10 sm:w-10 ml-1" />
                )}
              </Button>

              <Button
                variant="outline"
                size="icon"
                onClick={onClose}
                className="h-14 w-14 sm:h-16 sm:w-16 rounded-full border-2 bg-muted/20 hover:bg-muted/40 backdrop-blur-sm transition-all duration-300 hover:scale-110 focus-mode-button"
                aria-label="Exit focus mode"
              >
                <Minimize2 className="h-6 w-6 sm:h-7 sm:w-7" />
              </Button>
            </motion.div>

            {/* Keyboard shortcuts hint */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2"
            >
              <div className="flex items-center gap-3 sm:gap-4 text-xs text-muted-foreground/50">
                <span className="hidden sm:flex items-center gap-1.5">
                  <kbd className="px-2 py-1 rounded bg-muted/20 backdrop-blur-sm border border-border/20 font-mono text-[10px]">Space</kbd>
                  <span>Play/Pause</span>
                </span>
                <span className="hidden sm:flex items-center gap-1.5">
                  <kbd className="px-2 py-1 rounded bg-muted/20 backdrop-blur-sm border border-border/20 font-mono text-[10px]">R</kbd>
                  <span>Reset</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <kbd className="px-2 py-1 rounded bg-muted/20 backdrop-blur-sm border border-border/20 font-mono text-[10px]">Esc</kbd>
                  <span>Exit</span>
                </span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
