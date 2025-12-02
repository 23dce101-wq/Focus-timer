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

  // Timer with completion callback
  const timer = useTimer('countdown', () => {
    setShowAlertOverlay(true);
  });

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
    timer.setMode(value as TimerMode);
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
          if (timer.isRunning) {
            timer.pause();
          } else {
            timer.start();
          }
          break;
        case 's':
          timer.start();
          break;
        case 'p':
          timer.pause();
          break;
        case 'r':
          timer.reset();
          break;
        case 'f':
          toggleFullscreen();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [timer, toggleFullscreen, showAlertOverlay, handleDismissAlert]);

  // Update document title with timer
  useEffect(() => {
    if (timer.isRunning) {
      const hours = Math.floor(timer.time / 3600);
      const minutes = Math.floor((timer.time % 3600) / 60);
      const seconds = timer.time % 60;
      const timeStr = hours > 0 
        ? `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        : `${minutes}:${seconds.toString().padStart(2, '0')}`;
      document.title = `${timeStr} - TimerFlow`;
    } else {
      document.title = 'TimerFlow - Online Timer & Pomodoro';
    }
  }, [timer.time, timer.isRunning]);

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
                <Tabs defaultValue="countdown" onValueChange={handleModeChange} className="space-y-8">
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
                      time={timer.time} 
                      isRunning={timer.isRunning} 
                      progress={timer.progress}
                    />
                    <TimerControls
                      isRunning={timer.isRunning}
                      onStart={timer.start}
                      onPause={timer.pause}
                      onReset={timer.reset}
                      onFullscreen={toggleFullscreen}
                      disabled={timer.time === 0 && !timer.isRunning}
                    />
                    <div className="space-y-4">
                      <TimeInput onSet={timer.setTime} />
                      <PresetButtons onSelect={timer.setTime} activeTime={timer.time} />
                    </div>
                  </TabsContent>

                  <TabsContent value="pomodoro" className="space-y-8">
                    <PomodoroIndicator
                      phase={timer.pomodoroPhase}
                      count={timer.pomodoroCount}
                      totalCycles={timer.pomodoroSettings.cyclesBeforeLongBreak}
                    />
                    <TimerDisplay 
                      time={timer.time} 
                      isRunning={timer.isRunning}
                      progress={timer.progress}
                    />
                    <TimerControls
                      isRunning={timer.isRunning}
                      onStart={timer.start}
                      onPause={timer.pause}
                      onReset={timer.reset}
                      onFullscreen={toggleFullscreen}
                    />
                  </TabsContent>

                  <TabsContent value="stopwatch" className="space-y-6 md:space-y-8 mt-6 md:mt-10">
                    <div className="py-4 md:py-6">
                      <TimerDisplay 
                        time={timer.time} 
                        isRunning={timer.isRunning}
                      />
                    </div>
                    <TimerControls
                      isRunning={timer.isRunning}
                      onStart={timer.start}
                      onPause={timer.pause}
                      onReset={timer.reset}
                      onFullscreen={toggleFullscreen}
                    />
                  </TabsContent>
                </Tabs>
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
