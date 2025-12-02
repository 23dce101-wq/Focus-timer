import { Lightbulb, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const tips = [
  'Start with shorter focus sessions (15-20 min) if 25 minutes feels too long.',
  'Use breaks to stretch, hydrate, and rest your eyes from screens.',
  'Track completed pomodoros to visualize your daily productivity.',
  'Batch similar tasks together for more efficient work sessions.',
  'Remove phone and notifications during focus time for best results.',
  'Review what you accomplished after each session to stay motivated.',
];

export function TipsSection() {
  return (
    <section id="tips" className="py-12 md:py-16 lg:py-20 bg-gradient-to-b from-muted/30 to-transparent">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Study <span className="gradient-text">Tips</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Maximize your productivity with these evidence-based focus strategies.
          </p>
        </div>

        <Card className="timer-card max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-accent" />
              Pro Tips for Better Focus
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {tips.map((tip, index) => (
                <li key={index} className="flex gap-3">
                  <CheckCircle className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{tip}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
