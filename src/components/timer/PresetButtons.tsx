import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PresetButtonsProps {
  onSelect: (seconds: number) => void;
  activeTime?: number;
}

const PRESETS = [
  { label: '1 min', seconds: 60 },
  { label: '5 min', seconds: 300 },
  { label: '10 min', seconds: 600 },
  { label: '15 min', seconds: 900 },
  { label: '30 min', seconds: 1800 },
  { label: '1 hour', seconds: 3600 },
];

export function PresetButtons({ onSelect, activeTime }: PresetButtonsProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2 md:gap-3 px-2">
      {PRESETS.map((preset) => (
        <Button
          key={preset.seconds}
          variant="outline"
          size="sm"
          onClick={() => onSelect(preset.seconds)}
          className={cn(
            'rounded-full px-4 md:px-5 py-2 md:py-2.5 text-xs md:text-sm transition-all duration-300 hover:scale-105 hover:shadow-md',
            activeTime === preset.seconds && 'bg-primary text-primary-foreground border-primary shadow-md'
          )}
        >
          {preset.label}
        </Button>
      ))}
    </div>
  );
}
