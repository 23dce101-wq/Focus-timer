import { Keyboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface Shortcut {
  key: string;
  description: string;
  category: string;
}

const SHORTCUTS: Shortcut[] = [
  { key: 'S', description: 'Start the timer', category: 'Timer Controls' },
  { key: 'P', description: 'Pause the timer', category: 'Timer Controls' },
  { key: 'R', description: 'Reset the timer', category: 'Timer Controls' },
  { key: 'F', description: 'Toggle fullscreen mode', category: 'Display' },
  { key: 'Space', description: 'Start/Pause (alternative)', category: 'Timer Controls' },
  { key: 'Esc', description: 'Exit fullscreen', category: 'Display' },
];

const categories = Array.from(new Set(SHORTCUTS.map((s) => s.category)));

export function KeyboardShortcutsDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full">
          <Keyboard className="h-5 w-5" />
          <span className="sr-only">Keyboard shortcuts</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="h-5 w-5" />
            Keyboard Shortcuts
          </DialogTitle>
          <DialogDescription>
            Use these keyboard shortcuts to control the timer without using your mouse.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {categories.map((category) => (
            <div key={category}>
              <h3 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wide">
                {category}
              </h3>
              <div className="space-y-2">
                {SHORTCUTS.filter((s) => s.category === category).map((shortcut) => (
                  <div
                    key={shortcut.key}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <span className="text-sm">{shortcut.description}</span>
                    <kbd className="px-3 py-1.5 text-sm font-semibold bg-background border border-border rounded shadow-sm min-w-[3rem] text-center">
                      {shortcut.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              <strong>Tip:</strong> Keyboard shortcuts work when the timer is focused and no input field is active.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
