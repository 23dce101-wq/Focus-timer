import { Brain, Target, Zap, TrendingUp } from 'lucide-react';

const benefits = [
  {
    icon: Brain,
    title: 'Improved Focus',
    description: 'Time-boxing creates urgency and helps eliminate distractions during work sessions.',
  },
  {
    icon: Target,
    title: 'Better Time Estimation',
    description: 'Track how long tasks actually take to improve your planning and estimation skills.',
  },
  {
    icon: Zap,
    title: 'Reduced Burnout',
    description: 'Regular breaks prevent mental fatigue and keep your energy levels sustainable.',
  },
  {
    icon: TrendingUp,
    title: 'Increased Productivity',
    description: 'Studies show the Pomodoro technique can boost productivity by up to 25%.',
  },
];

export function BenefitsSection() {
  return (
    <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-b from-transparent to-muted/30">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Benefits of <span className="gradient-text">Timed Work Sessions</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover why millions of people use timers to enhance their productivity and well-being.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex gap-4 p-6 rounded-2xl bg-card/50 border border-border/50 hover:bg-card/80 transition-colors">
              <div className="shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <benefit.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
