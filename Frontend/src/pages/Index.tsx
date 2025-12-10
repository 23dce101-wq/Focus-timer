import { useEffect, useCallback, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTimer, TimerMode } from '@/hooks/useTimer';
import { useTheme } from '@/hooks/useTheme';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { TimerDisplay } from '@/components/timer/TimerDisplay';
import { TimerControls } from '@/components/timer/TimerControls';
import { PresetButtons } from '@/components/timer/PresetButtons';
import { TimeInput } from '@/components/timer/TimeInput';
import { PomodoroIndicator } from '@/components/timer/PomodoroIndicator';
import { TimerReports } from '@/components/timer/TimerReports';
import { AlertOverlay } from '@/components/AlertOverlay';
import { HowToUseSection } from '@/components/sections/HowToUseSection';
import { BenefitsSection } from '@/components/sections/BenefitsSection';
import { FAQSection } from '@/components/sections/FAQSection';
import { TipsSection } from '@/components/sections/TipsSection';
import { AdBanner } from '@/components/AdBanner';
import { Clock, Timer, Watch } from 'lucide-react';

const Index = () => {
  const { theme, setTheme } = useTheme();
  const [isFullscreen, setIsFullscreen] = useState(false);
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

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
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
          toggleFullscreen();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentTimer, toggleFullscreen, showAlertOverlay, handleDismissAlert]);

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
      document.title = 'TimerFlow - Online Timer & Pomodoro';
    }
  }, [currentTimer.time, currentTimer.isRunning]);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="floating-gradient" />
      
      <Header theme={theme} onThemeChange={setTheme} />

      <main className="flex-1">
        {/* Ad Banner - Header */}
        <div className="container mx-auto px-4 pt-4 md:pt-6 pb-2">
          <AdBanner position="header" />
        </div>

        {/* Timer Section */}
        <section id="timer" className="py-8 md:py-16">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4">
                Online <span className="gradient-text">Timer</span>
              </h1>
              <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
                Boost your productivity with our beautiful countdown timer, Pomodoro tracker, and stopwatch.
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
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
                      onFullscreen={toggleFullscreen}
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
                      onFullscreen={toggleFullscreen}
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
                      onFullscreen={toggleFullscreen}
                    />
                  </TabsContent>
                </Tabs>
              </div>

              {/* Timer Reports Section */}
              <div className="mt-8">
                <TimerReports key={sessionsVersion} />
              </div>
            </div>
          </div>
        </section>

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

      {/* Alert Overlay with 5-second countdown */}
      <AlertOverlay 
        isVisible={showAlertOverlay} 
        onDismiss={handleDismissAlert}
      />
    </div>
  );
};

export default Index;
