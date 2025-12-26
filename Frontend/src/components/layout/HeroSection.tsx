import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Timer, Target, ArrowRight, Sparkles, Clock, TrendingUp, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const floatingVariants = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

const glowVariants = {
  animate: {
    opacity: [0.5, 1, 0.5],
    scale: [1, 1.05, 1],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
  gradient: string;
  delay?: number;
}

function FeatureCard({ icon, title, description, link, gradient, delay = 0 }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group"
    >
      <Link to={link}>
        <div className="hero-feature-card relative p-6 md:p-8 rounded-2xl md:rounded-3xl bg-card/60 backdrop-blur-xl border border-border/50 overflow-hidden transition-all duration-500 hover:border-primary/30 hover:shadow-2xl">
          {/* Gradient Glow Background */}
          <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${gradient}`} />
          
          {/* Content */}
          <div className="relative z-10">
            <div className="mb-4 w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center group-hover:from-primary/20 group-hover:to-accent/20 transition-colors duration-500">
              {icon}
            </div>
            
            <h3 className="text-xl md:text-2xl font-display font-bold mb-2 group-hover:gradient-text transition-all duration-500">
              {title}
            </h3>
            
            <p className="text-muted-foreground mb-4 text-sm md:text-base">
              {description}
            </p>
            
            <div className="flex items-center gap-2 text-primary font-medium text-sm md:text-base">
              <span>Explore</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-2" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center py-12 md:py-20 lg:py-24 overflow-hidden">
      {/* Premium Background Effects */}
      <div className="absolute inset-0 -z-10">
        {/* Animated Gradient Orbs */}
        <motion.div
          variants={glowVariants}
          animate="animate"
          className="absolute top-1/4 left-1/4 w-72 h-72 md:w-96 md:h-96 bg-primary/20 rounded-full blur-3xl"
        />
        <motion.div
          variants={glowVariants}
          animate="animate"
          style={{ animationDelay: '1s' }}
          className="absolute bottom-1/4 right-1/4 w-64 h-64 md:w-80 md:h-80 bg-accent/20 rounded-full blur-3xl"
        />
        <motion.div
          variants={glowVariants}
          animate="animate"
          style={{ animationDelay: '2s' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 md:w-[500px] md:h-[500px] bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-3xl"
        />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.1)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.1)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      <div className="container mx-auto px-4 max-w-7xl">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center mb-16 md:mb-20"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 md:mb-8">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Boost Your Productivity</span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1 
            variants={itemVariants}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold mb-6 leading-tight"
          >
            Master Your Time with{' '}
            <span className="relative">
              <span className="gradient-text">TimerFlow</span>
              <motion.span
                className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent rounded-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              />
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p 
            variants={itemVariants}
            className="text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8 md:mb-10"
          >
            The ultimate productivity suite combining powerful timers, Pomodoro technique, 
            and habit tracking to help you achieve your goals.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button asChild size="lg" className="hero-cta-primary text-base md:text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <Link to="/timer">
                <Timer className="h-5 w-5 mr-2" />
                Start Timer
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="hero-cta-secondary text-base md:text-lg px-8 py-6 rounded-xl border-2 hover:bg-accent/5 transition-all duration-300">
              <Link to="/habits">
                <Target className="h-5 w-5 mr-2" />
                Track Habits
              </Link>
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-wrap items-center justify-center gap-6 md:gap-12 mt-12 md:mt-16"
          >
            {[
              { icon: Clock, label: 'Countdown Timer', value: 'Precision' },
              { icon: Timer, label: 'Pomodoro Sessions', value: 'Focus' },
              { icon: TrendingUp, label: 'Habit Tracking', value: 'Growth' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                variants={floatingVariants}
                animate="animate"
                style={{ animationDelay: `${index * 0.2}s` }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-card/50 backdrop-blur-sm border border-border/30"
              >
                <stat.icon className="h-5 w-5 text-primary" />
                <div className="text-left">
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="font-semibold text-sm">{stat.value}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Feature Cards */}
        <div className="grid gap-6 md:gap-8 md:grid-cols-2 max-w-4xl mx-auto">
          <FeatureCard
            icon={<Timer className="h-7 w-7 md:h-8 md:w-8 text-primary" />}
            title="Smart Timer"
            description="Countdown timer, Pomodoro technique, and stopwatch - all in one beautiful interface with customizable alerts."
            link="/timer"
            gradient="bg-gradient-to-br from-primary/5 via-primary/10 to-transparent"
            delay={0.4}
          />
          <FeatureCard
            icon={<Target className="h-7 w-7 md:h-8 md:w-8 text-accent" />}
            title="Habit Tracker"
            description="Build lasting habits with visual tracking, streak counters, and insightful analytics to keep you motivated."
            link="/habits"
            gradient="bg-gradient-to-br from-accent/5 via-accent/10 to-transparent"
            delay={0.5}
          />
        </div>

        {/* Bottom Floating Elements */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-16 md:mt-24 flex items-center justify-center gap-4"
        >
          <div className="flex -space-x-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent border-2 border-background flex items-center justify-center"
              >
                <Zap className="h-4 w-4 text-white" />
              </div>
            ))}
          </div>
          <div className="text-left">
            <p className="font-semibold text-sm md:text-base">Trusted by Thousands</p>
            <p className="text-xs md:text-sm text-muted-foreground">Join the productivity revolution</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
