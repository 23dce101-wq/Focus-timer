import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

interface TimeInputProps {
  onSet: (seconds: number) => void;
}

export function TimeInput({ onSet }: TimeInputProps) {
  const [hours, setHours] = useState('0');
  const [minutes, setMinutes] = useState('5');
  const [seconds, setSeconds] = useState('0');

  const handleSet = () => {
    const totalSeconds = 
      parseInt(hours || '0') * 3600 + 
      parseInt(minutes || '0') * 60 + 
      parseInt(seconds || '0');
    
    if (totalSeconds > 0) {
      onSet(totalSeconds);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSet();
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 px-2">
      <div className="flex items-center gap-1.5">
        <Input
          type="number"
          min="0"
          max="99"
          value={hours}
          onChange={(e) => setHours(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-14 md:w-16 h-11 md:h-12 text-center font-display text-base md:text-lg rounded-lg"
          aria-label="Hours"
        />
        <span className="text-muted-foreground text-xs md:text-sm font-medium">h</span>
      </div>
      <span className="text-xl md:text-2xl font-bold text-muted-foreground">:</span>
      <div className="flex items-center gap-1.5">
        <Input
          type="number"
          min="0"
          max="59"
          value={minutes}
          onChange={(e) => setMinutes(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-14 md:w-16 h-11 md:h-12 text-center font-display text-base md:text-lg rounded-lg"
          aria-label="Minutes"
        />
        <span className="text-muted-foreground text-xs md:text-sm font-medium">m</span>
      </div>
      <span className="text-xl md:text-2xl font-bold text-muted-foreground">:</span>
      <div className="flex items-center gap-1.5">
        <Input
          type="number"
          min="0"
          max="59"
          value={seconds}
          onChange={(e) => setSeconds(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-14 md:w-16 h-11 md:h-12 text-center font-display text-base md:text-lg rounded-lg"
          aria-label="Seconds"
        />
        <span className="text-muted-foreground text-xs md:text-sm font-medium">s</span>
      </div>
      <Button
        onClick={handleSet}
        size="icon"
        className="ml-1 md:ml-2 h-11 w-11 md:h-12 md:w-12 rounded-full bg-gradient-to-br from-primary to-accent hover:scale-105 transition-transform"
        aria-label="Set time"
      >
        <Check className="h-4 w-4 md:h-5 md:w-5" />
      </Button>
    </div>
  );
}
