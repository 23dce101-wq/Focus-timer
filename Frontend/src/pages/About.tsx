import { motion } from 'framer-motion';
import { Footer } from '@/components/layout/Footer';
import { BottomNavbar } from '@/components/layout/BottomNavbar';
import { PageTransition, staggerContainer, staggerItem } from '@/components/layout/PageTransition';
import { useTheme } from '@/hooks/useTheme';
import { Info, Target, Users, Zap, Award, Sparkles } from 'lucide-react';

export default function About() {
  const { theme, setTheme } = useTheme();

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col pb-24 md:pb-28">
        <div className="floating-gradient" />

        <main className="flex-1">
          <div className="container mx-auto px-4 py-12 max-w-4xl">
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8 text-center md:text-left"
            >
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4"
              >
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">Learn More</span>
              </motion.div>
              
              <div className="flex flex-col md:flex-row items-center gap-4 justify-center md:justify-start">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent">
                  <Info className="h-6 w-6 text-primary-foreground" />
                </div>
                <h1 className="text-4xl font-display font-bold">About <span className="gradient-text">TimerFlow</span></h1>
              </div>
            </motion.div>

            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="space-y-12"
            >
              <motion.section variants={staggerItem}>
                <h2 className="text-3xl font-bold mb-4 gradient-text">Our Mission</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  TimerFlow was created with a simple yet powerful mission: to help people boost their productivity and achieve their goals through effective time management. We believe that with the right tools and techniques, anyone can enhance their focus, reduce procrastination, and accomplish more in less time.
                </p>
              </motion.section>

              <motion.section variants={staggerItem}>
                <h2 className="text-3xl font-bold mb-6">What We Offer</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="glass-card p-6 rounded-xl">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Zap className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold">Versatile Timer Modes</h3>
                    </div>
                    <p className="text-muted-foreground">
                      Choose from countdown timers, Pomodoro technique sessions, or stopwatch mode to suit your workflow and productivity style.
                    </p>
                  </div>

                  <div className="glass-card p-6 rounded-xl">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Target className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold">Beautiful Design</h3>
                    </div>
                    <p className="text-muted-foreground">
                      A clean, modern interface with smooth animations, light/dark modes, and customizable themes that make time tracking enjoyable.
                    </p>
                  </div>

                  <div className="glass-card p-6 rounded-xl">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold">User-Friendly</h3>
                    </div>
                    <p className="text-muted-foreground">
                      No registration required. Start using immediately with keyboard shortcuts, sound alerts, and preset configurations.
                    </p>
                  </div>

                  <div className="glass-card p-6 rounded-xl">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Award className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold">Always Free</h3>
                    </div>
                    <p className="text-muted-foreground">
                      TimerFlow is completely free to use. We're supported by non-intrusive ads that help us keep the service running.
                    </p>
                  </div>
                </div>
              </motion.section>

            <motion.section variants={staggerItem}>
              <h2 className="text-3xl font-bold mb-4">The Pomodoro Technique</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The Pomodoro Technique is a time management method developed by Francesco Cirillo in the late 1980s. It uses a timer to break work into intervals, traditionally 25 minutes in length, separated by short breaks. This technique has helped millions of people improve their focus and productivity.
              </p>
              <div className="bg-muted/50 p-6 rounded-xl border">
                <h3 className="text-xl font-semibold mb-3">How It Works:</h3>
                <ol className="list-decimal pl-6 space-y-2 text-muted-foreground">
                  <li>Choose a task to work on</li>
                  <li>Set the timer for 25 minutes (one "Pomodoro")</li>
                  <li>Work on the task until the timer rings</li>
                  <li>Take a short 5-minute break</li>
                  <li>After four Pomodoros, take a longer 15-30 minute break</li>
                </ol>
              </div>
            </motion.section>

            <motion.section variants={staggerItem}>
              <h2 className="text-3xl font-bold mb-4">Why TimerFlow?</h2>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">No Distractions</h3>
                    <p className="text-muted-foreground">
                      Clean interface focused solely on helping you manage time effectively without unnecessary features.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Works Everywhere</h3>
                    <p className="text-muted-foreground">
                      Fully responsive design works seamlessly on desktop, tablet, and mobile devices.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Privacy Focused</h3>
                    <p className="text-muted-foreground">
                      Your timer settings stay on your device. We don't collect or store your usage data.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    4
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Keyboard Shortcuts</h3>
                    <p className="text-muted-foreground">
                      Power users can control the timer without touching the mouse using intuitive keyboard shortcuts.
                    </p>
                  </div>
                </div>
              </div>
            </motion.section>

            <motion.section variants={staggerItem}>
              <h2 className="text-3xl font-bold mb-4">Perfect For</h2>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-6 glass-card rounded-xl">
                  <div className="text-4xl mb-3">📚</div>
                  <h3 className="font-semibold mb-2">Students</h3>
                  <p className="text-sm text-muted-foreground">
                    Study sessions, exam prep, and focused learning time
                  </p>
                </div>

                <div className="text-center p-6 glass-card rounded-xl">
                  <div className="text-4xl mb-3">💼</div>
                  <h3 className="font-semibold mb-2">Professionals</h3>
                  <p className="text-sm text-muted-foreground">
                    Project work, meetings, and deadline management
                  </p>
                </div>

                <div className="text-center p-6 glass-card rounded-xl">
                  <div className="text-4xl mb-3">🎨</div>
                  <h3 className="font-semibold mb-2">Creatives</h3>
                  <p className="text-sm text-muted-foreground">
                    Design work, writing, and creative flow sessions
                  </p>
                </div>

                <div className="text-center p-6 glass-card rounded-xl">
                  <div className="text-4xl mb-3">💪</div>
                  <h3 className="font-semibold mb-2">Fitness</h3>
                  <p className="text-sm text-muted-foreground">
                    Workout intervals, yoga sessions, and rest periods
                  </p>
                </div>

                <div className="text-center p-6 glass-card rounded-xl">
                  <div className="text-4xl mb-3">🍳</div>
                  <h3 className="font-semibold mb-2">Cooking</h3>
                  <p className="text-sm text-muted-foreground">
                    Timing recipes, meal prep, and baking
                  </p>
                </div>

                <div className="text-center p-6 glass-card rounded-xl">
                  <div className="text-4xl mb-3">🧘</div>
                  <h3 className="font-semibold mb-2">Meditation</h3>
                  <p className="text-sm text-muted-foreground">
                    Mindfulness practice and breathing exercises
                  </p>
                </div>
              </div>
            </motion.section>

            <motion.section variants={staggerItem}>
              <h2 className="text-3xl font-bold mb-4">Our Commitment</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We are committed to continuously improving TimerFlow based on user feedback and emerging productivity research. Our goal is to remain the most elegant and effective online timer available, while always respecting your privacy and maintaining a clean, ad-supported model that keeps the service free for everyone.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Thank you for choosing TimerFlow as your productivity companion. We hope it helps you achieve your goals and make the most of your time!
              </p>
            </motion.section>

            <motion.section 
              variants={staggerItem}
              className="bg-gradient-to-r from-primary/10 to-accent/10 p-8 rounded-xl border"
            >
              <h2 className="text-2xl font-bold mb-4 text-center">Get Started Today</h2>
              <p className="text-center text-muted-foreground mb-6">
                Ready to boost your productivity? Start using TimerFlow now—no signup required!
              </p>
              <div className="flex justify-center">
                <a
                  href="/timer"
                  className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold hover:shadow-lg transition-all"
                >
                  Launch Timer
                </a>
              </div>
            </motion.section>
          </motion.div>
        </div>
      </main>

      <Footer />
      
      {/* Bottom Navigation */}
      <BottomNavbar />
    </div>
    </PageTransition>
  );
}
