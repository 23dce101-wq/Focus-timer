import { motion } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';
import { HeroSection } from '@/components/layout/HeroSection';
import { BottomNavbar } from '@/components/layout/BottomNavbar';
import { Footer } from '@/components/layout/Footer';
import { PageTransition, staggerContainer, staggerItem } from '@/components/layout/PageTransition';
import { BenefitsSection } from '@/components/sections/BenefitsSection';
import { FAQSection } from '@/components/sections/FAQSection';
import { Brain, Zap, Shield, Globe, Clock, Target, TrendingUp, Award } from 'lucide-react';
import { useEffect } from 'react';

const features = [
  {
    icon: Clock,
    title: 'Precision Timer',
    description: 'Countdown, stopwatch, and Pomodoro technique all in one beautiful interface.',
  },
  {
    icon: Target,
    title: 'Habit Tracking',
    description: 'Build lasting habits with visual streak tracking and daily reminders.',
  },
  {
    icon: TrendingUp,
    title: 'Analytics',
    description: 'Track your progress with detailed charts and insights.',
  },
  {
    icon: Award,
    title: 'Achievements',
    description: 'Celebrate milestones with streak rewards and accomplishments.',
  },
  {
    icon: Brain,
    title: 'Focus Mode',
    description: 'Eliminate distractions with immersive full-screen timers.',
  },
  {
    icon: Zap,
    title: 'Quick Start',
    description: 'Preset timers for instant productivity boosts.',
  },
  {
    icon: Shield,
    title: 'Privacy First',
    description: 'Your data stays secure with industry-standard encryption.',
  },
  {
    icon: Globe,
    title: 'Works Anywhere',
    description: 'Access your timers and habits from any device, anytime.',
  },
];

const testimonials = [
  {
    quote: "TimerFlow has completely transformed how I manage my study sessions. The Pomodoro timer is incredibly intuitive!",
    author: "Sarah K.",
    role: "Graduate Student",
  },
  {
    quote: "The habit tracker keeps me accountable every day. I've maintained a 60-day meditation streak!",
    author: "Michael R.",
    role: "Entrepreneur",
  },
  {
    quote: "Beautiful design and powerful features. It's the perfect productivity companion.",
    author: "Emily C.",
    role: "Designer",
  },
];

const Home = () => {
  const { theme } = useTheme();

  // Update document title
  useEffect(() => {
    document.title = 'TimerFlow - Master Your Time & Habits';
  }, []);

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col pb-24 md:pb-28">
        <div className="floating-gradient" />

        <main className="flex-1">
          {/* Hero Section */}
          <HeroSection />

          {/* Features Section */}
          <section className="py-16 md:py-24 bg-gradient-to-b from-transparent via-muted/20 to-transparent">
            <div className="container mx-auto px-4 max-w-7xl">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className="text-center mb-12 md:mb-16"
              >
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-4">
                  <Zap className="h-4 w-4 text-accent" />
                  <span className="text-sm font-medium text-accent">Powerful Features</span>
                </span>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4">
                  Everything You Need to <span className="gradient-text">Succeed</span>
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  A complete productivity suite designed to help you focus, build habits, and achieve your goals.
                </p>
              </motion.div>

              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className="grid gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-4"
              >
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    variants={staggerItem}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="group p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/30 hover:shadow-xl transition-all duration-300"
                  >
                    <div className="mb-4 w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center group-hover:from-primary/20 group-hover:to-accent/20 transition-colors">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>

          {/* Benefits Section */}
          <BenefitsSection />

          {/* Testimonials Section */}
          <section className="py-16 md:py-24">
            <div className="container mx-auto px-4 max-w-6xl">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className="text-center mb-12"
              >
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
                  <Award className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-primary">Testimonials</span>
                </span>
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                  Loved by <span className="gradient-text">Thousands</span>
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  See what our users have to say about their productivity journey.
                </p>
              </motion.div>

              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className="grid gap-6 md:grid-cols-3"
              >
                {testimonials.map((testimonial, index) => (
                  <motion.div
                    key={index}
                    variants={staggerItem}
                    whileHover={{ y: -5 }}
                    className="p-6 rounded-2xl bg-card/60 backdrop-blur-sm border border-border/50 hover:border-primary/20 transition-all duration-300"
                  >
                    <div className="flex gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-yellow-400">★</span>
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-4 italic">"{testimonial.quote}"</p>
                    <div>
                      <p className="font-semibold">{testimonial.author}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>

          {/* FAQ Section */}
          <FAQSection />

          {/* CTA Section */}
          <section className="py-16 md:py-24">
            <div className="container mx-auto px-4 max-w-4xl">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-accent/10 to-primary/10 p-8 md:p-12 text-center border border-border/50"
              >
                {/* Background glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-accent/20 blur-3xl opacity-50" />
                
                <div className="relative z-10">
                  <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                    Ready to Boost Your <span className="gradient-text">Productivity</span>?
                  </h2>
                  <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                    Join thousands of users who have transformed their work habits with TimerFlow.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <motion.a
                      href="/timer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                      className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold shadow-lg hover:shadow-xl transition-all"
                    >
                      <Clock className="h-5 w-5" />
                      Start Timer Now
                    </motion.a>
                    <motion.a
                      href="/habits"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                      className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border-2 border-border font-semibold hover:bg-accent/5 transition-all"
                    >
                      <Target className="h-5 w-5" />
                      Track Habits
                    </motion.a>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>
        </main>

        <Footer />

        {/* Bottom Navigation */}
        <BottomNavbar />
      </div>
    </PageTransition>
  );
};

export default Home;
