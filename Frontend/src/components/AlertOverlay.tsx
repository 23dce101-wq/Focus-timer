import { useEffect, useState } from 'react';
import { Bell, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AlertOverlayProps {
  isVisible: boolean;
  onDismiss: () => void;
}

export function AlertOverlay({ isVisible, onDismiss }: AlertOverlayProps) {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (!isVisible) {
      setCountdown(5);
      return;
    }

    // Start countdown from 5
    setCountdown(5);
    
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          // Auto-dismiss when countdown reaches 0
          setTimeout(onDismiss, 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isVisible, onDismiss]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative bg-gradient-to-br from-background via-background to-muted border-2 border-primary/50 rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 animate-in zoom-in duration-300">
        {/* Close button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 rounded-full hover:bg-destructive/10"
          onClick={onDismiss}
        >
          <X className="h-5 w-5" />
          <span className="sr-only">Dismiss alert</span>
        </Button>

        {/* Alert icon with pulse animation */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
            <div className="relative bg-primary/10 p-6 rounded-full">
              <Bell className="h-16 w-16 text-primary animate-pulse" />
            </div>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Timer Complete!
        </h2>

        {/* Countdown circle */}
        <div className="flex flex-col items-center justify-center py-8">
          <div className="relative w-32 h-32">
            {/* Background circle */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-muted"
              />
              {/* Progress circle */}
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                className="text-primary transition-all duration-1000 ease-linear"
                style={{
                  strokeDasharray: '352',
                  strokeDashoffset: `${352 - (countdown / 5) * 352}`,
                }}
              />
            </svg>
            {/* Countdown number */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-6xl font-bold bg-gradient-to-br from-primary to-primary/70 bg-clip-text text-transparent animate-pulse">
                {countdown}
              </span>
            </div>
          </div>
          
          {/* Alert message */}
          <p className="text-muted-foreground text-center mt-6 text-lg">
            Alert ringing for <span className="font-semibold text-primary">{countdown}</span> second{countdown !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Dismiss button */}
        <Button
          onClick={onDismiss}
          className="w-full text-lg py-6 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
        >
          Dismiss Alert
        </Button>

        {/* Hint text */}
        <p className="text-center text-sm text-muted-foreground mt-4">
          Press <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Esc</kbd> or click anywhere to dismiss
        </p>
      </div>
    </div>
  );
}
