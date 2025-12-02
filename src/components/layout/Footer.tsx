import { Timer, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-card/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
                <Timer className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-display text-lg font-bold">TimerFlow</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Your productivity companion for focused work sessions and mindful breaks.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Features</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Countdown Timer</li>
              <li>Pomodoro Technique</li>
              <li>Stopwatch</li>
              <li>Preset Timers</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/#how-to-use" className="hover:text-foreground transition-colors">How to Use</a></li>
              <li><a href="/#faq" className="hover:text-foreground transition-colors">FAQ</a></li>
              <li><a href="/#tips" className="hover:text-foreground transition-colors">Study Tips</a></li>
              <li><a href="/about" className="hover:text-foreground transition-colors">About</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/privacy-policy" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
              <li><a href="/terms-of-service" className="hover:text-foreground transition-colors">Terms of Service</a></li>
              <li><a href="/contact" className="hover:text-foreground transition-colors">Contact Us</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} TimerFlow. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            Made with <Heart className="h-4 w-4 text-destructive" /> for productivity
          </p>
        </div>
      </div>
    </footer>
  );
}
