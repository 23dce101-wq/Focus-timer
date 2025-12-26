import { useEffect, useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTimer, TimerMode } from '@/hooks/useTimer';
import { useTheme } from '@/hooks/useTheme';
import { TimerDisplay } from '@/components/timer/TimerDisplay';
import { TimerControls } from '@/components/timer/TimerControls';
import { PresetButtons } from '@/components/timer/PresetButtons';
import { TimeInput } from '@/components/timer/TimeInput';
import { PomodoroIndicator } from '@/components/timer/PomodoroIndicator';
import { TimerReports } from '@/components/timer/TimerReports';
import { AlertOverlay } from '@/components/AlertOverlay';
import { FocusMode } from '@/components/timer/FocusMode';
import { HowToUseSection } from '@/components/sections/HowToUseSection';
import { BenefitsSection } from '@/components/sections/BenefitsSection';
import { FAQSection } from '@/components/sections/FAQSection';
import { TipsSection } from '@/components/sections/TipsSection';
import { AdBanner } from '@/components/AdBanner';
import { BottomNavbar } from '@/components/layout/BottomNavbar';
import { Footer } from '@/components/layout/Footer';
import { PageTransition, staggerContainer, staggerItem } from '@/components/layout/PageTransition';
import { Clock, Timer, Watch, Sparkles } from 'lucide-react';

const TimerPage = () => {
  const { theme } = useTheme();
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [showAlertOverlay, setShowAlertOverlay] = useState(false);
  const [sessionsVersion, setSessionsVersion] = useState(0);
  const [activeMode, setActiveMode] = useState<TimerMode>('countdown');

  const handleTimerComplete = useCallback(() => {
    setShowAlertOverlay(true);
    setSessionsVersion((v) => v + 1);
  }, []);

  // Separate timers for each mode so they don't share state
  const countdownTimer = useTimer('countdown', handleTimerComplete);
  const pomodoroTimer = useTimer('pomodoro', handleTimerComplete);
  const stopwatchTimer = useTimer('stopwatch', handleTimerComplete);

  const currentTimer =
    activeMode === 'pomodoro'
      ? pomodoroTimer
      : activeMode === 'stopwatch'
        ? stopwatchTimer
        : countdownTimer;

  const toggleFocusMode = useCallback(() => {
    setIsFocusMode(prev => !prev);
  }, []);

  const handleModeChange = (value: string) => {
    setActiveMode(value as TimerMode);
  };

  // Handle alert dismissal
  const handleDismissAlert = useCallback(() => {
    setShowAlertOverlay(false);
    // Stop the sound when dismissed
    if (typeof window !== 'undefined' && (window as any).stopTimerAlert) {
      (window as any).stopTimerAlert();
    }
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't handle shortcuts when in focus mode (it has its own handlers)
      if (isFocusMode) return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      
      // Esc dismisses alert overlay
      if (e.key === 'Escape' && showAlertOverlay) {
        handleDismissAlert();
        return;
      }
      
      switch (e.key.toLowerCase()) {
        case ' ':
          e.preventDefault();
          if (currentTimer.isRunning) {
            currentTimer.pause();
          } else {
            currentTimer.start();
          }
          break;
        case 's':
          currentTimer.start();
          break;
        case 'p':
          currentTimer.pause();
          break;
        case 'r':
          currentTimer.reset();
          break;
        case 'f':
          toggleFocusMode();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentTimer, toggleFocusMode, showAlertOverlay, handleDismissAlert, isFocusMode]);

  // Update document title with timer
  useEffect(() => {
    if (currentTimer.isRunning) {
      const hours = Math.floor(currentTimer.time / 3600);
      const minutes = Math.floor((currentTimer.time % 3600) / 60);
      const seconds = currentTimer.time % 60;
      const timeStr = hours > 0 
        ? `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        : `${minutes}:${seconds.toString().padStart(2, '0')}`;
      document.title = `${timeStr} - TimerFlow`;
    } else {
      document.title = 'Timer - TimerFlow';
    }
  }, [currentTimer.time, currentTimer.isRunning]);

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col pb-24 md:pb-28">
        <div className="floating-gradient" />

        <main className="flex-1">
          {/* Hero Header */}
          <motion.section 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="pt-8 md:pt-12 pb-4"
          >
            <div className="container mx-auto px-4 max-w-6xl">
              <div className="text-center">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4"
                >
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-primary">Focus Mode</span>
                </motion.div>
                
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4"
                >
                  Smart <span className="gradient-text">Timer</span>
                </motion.h1>
                
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto"
                >
                  Boost your productivity with our beautiful countdown timer, Pomodoro tracker, and stopwatch.
                </motion.p>
              </div>
            </div>
          </motion.section>

          {/* Ad Banner - Header */}
          <div className="container mx-auto px-4 pb-2">
            <AdBanner position="header" />
          </div>

          {/* Timer Section */}
          <motion.section 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="py-6 md:py-10"
          >
            <div className="container mx-auto px-4 max-w-6xl">
              <motion.div variants={staggerItem} className="max-w-4xl mx-auto">
                <div className="timer-card p-6 md:p-10 lg:p-12">
                  <Tabs value={activeMode} onValueChange={handleModeChange} className="space-y-8">
                    <TabsList className="grid w-full grid-cols-3 h-auto p-1 bg-muted/50">
                      <TabsTrigger value="countdown" className="flex items-center gap-2 py-3 data-[state=active]:bg-background">
                        <Clock className="h-4 w-4" />
                        <span className="hidden sm:inline">Countdown</span>
                      </TabsTrigger>
                      <TabsTrigger value="pomodoro" className="flex items-center gap-2 py-3 data-[state=active]:bg-background">
                        <Timer className="h-4 w-4" />
                        <span className="hidden sm:inline">Pomodoro</span>
                      </TabsTrigger>
                      <TabsTrigger value="stopwatch" className="flex items-center gap-2 py-3 data-[state=active]:bg-background">
                        <Watch className="h-4 w-4" />
                        <span className="hidden sm:inline">Stopwatch</span>
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="countdown" className="space-y-8">
                      <TimerDisplay 
                        time={countdownTimer.time} 
                        isRunning={countdownTimer.isRunning} 
                        progress={countdownTimer.progress}
                      />
                      <TimerControls
                        isRunning={countdownTimer.isRunning}
                        onStart={countdownTimer.start}
                        onPause={countdownTimer.pause}
                        onReset={countdownTimer.reset}
                        onFullscreen={toggleFocusMode}
                        disabled={countdownTimer.time === 0 && !countdownTimer.isRunning}
                      />
                      <div className="space-y-4">
                        <TimeInput onSet={countdownTimer.setTime} />
                        <PresetButtons onSelect={countdownTimer.setTime} activeTime={countdownTimer.time} />
                      </div>
                    </TabsContent>

                    <TabsContent value="pomodoro" className="space-y-8">
                      <PomodoroIndicator
                        phase={pomodoroTimer.pomodoroPhase}
                        count={pomodoroTimer.pomodoroCount}
                        totalCycles={pomodoroTimer.pomodoroSettings.cyclesBeforeLongBreak}
                      />
                      <TimerDisplay 
                        time={pomodoroTimer.time} 
                        isRunning={pomodoroTimer.isRunning}
                        progress={pomodoroTimer.progress}
                      />
                      <TimerControls
                        isRunning={pomodoroTimer.isRunning}
                        onStart={pomodoroTimer.start}
                        onPause={pomodoroTimer.pause}
                        onReset={pomodoroTimer.reset}
                        onFullscreen={toggleFocusMode}
                      />
                    </TabsContent>

                    <TabsContent value="stopwatch" className="space-y-6 md:space-y-8 mt-6 md:mt-10">
                      <div className="py-4 md:py-6">
                        <TimerDisplay 
                          time={stopwatchTimer.time} 
                          isRunning={stopwatchTimer.isRunning}
                        />
                      </div>
                      <TimerControls
                        isRunning={stopwatchTimer.isRunning}
                        onStart={stopwatchTimer.start}
                        onPause={stopwatchTimer.pause}
                        onReset={stopwatchTimer.reset}
                        onFullscreen={toggleFocusMode}
                      />
                    </TabsContent>
                  </Tabs>
                </div>

                {/* Timer Reports Section */}
                <motion.div variants={staggerItem} className="mt-8">
                  <TimerReports key={sessionsVersion} />
                </motion.div>
              </motion.div>
            </div>
          </motion.section>

          {/* Ad Banner - Middle */}
          <div className="container mx-auto px-4 py-6 md:py-8">
            <AdBanner position="middle" />
          </div>

          <HowToUseSection />
          <BenefitsSection />
          <TipsSection />
          <FAQSection />

          {/* Ad Banner - Footer */}
          <div className="container mx-auto px-4 py-6 md:py-8">
            <AdBanner position="footer" />
          </div>
        </main>

        <Footer />

        {/* Bottom Navigation */}
        <BottomNavbar />

        {/* Alert Overlay with 5-second countdown */}
        <AlertOverlay 
          isVisible={showAlertOverlay} 
          onDismiss={handleDismissAlert}
        />

        {/* Focus Mode Overlay */}
        <FocusMode
          isOpen={isFocusMode}
          onClose={() => setIsFocusMode(false)}
          time={currentTimer.time}
          isRunning={currentTimer.isRunning}
          progress={currentTimer.progress}
          onStart={currentTimer.start}
          onPause={currentTimer.pause}
          onReset={currentTimer.reset}
          mode={activeMode}
          pomodoroPhase={activeMode === 'pomodoro' ? pomodoroTimer.pomodoroPhase : undefined}
        />
      </div>
    </PageTransition>
  );
};

export default TimerPage;
