import { Clock, Play, Settings, Repeat } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const steps = [
  {
    icon: Settings,
    title: 'Set Your Time',
    description: 'Choose from preset durations or enter a custom time using hours, minutes, and seconds.',
  },
  {
    icon: Play,
    title: 'Start the Timer',
    description: 'Click the play button or press "S" to start. Watch your progress with the animated ring.',
  },
  {
    icon: Clock,
    title: 'Stay Focused',
    description: 'The timer counts down with visual and audio alerts when complete. Perfect for focus sessions.',
  },
  {
    icon: Repeat,
    title: 'Try Pomodoro',
    description: 'Use the Pomodoro technique with 25-minute work sessions and 5-minute breaks for optimal productivity.',
  },
];

export function HowToUseSection() {
  return (
    <section id="how-to-use" className="py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            How to Use <span className="gradient-text">TimerFlow</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Get started in seconds with our intuitive timer interface designed for maximum productivity.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <Card key={index} className="timer-card group hover:scale-105 transition-transform duration-300">
              <CardContent className="p-6 text-center">
                <div className="mb-4 mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center group-hover:from-primary/20 group-hover:to-accent/20 transition-colors">
                  <step.icon className="h-7 w-7 text-primary" />
                </div>
                <div className="text-sm font-medium text-primary mb-2">Step {index + 1}</div>
                <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
