import { useState, useEffect, useCallback, useRef } from 'react';
import { useSoundSettings } from '@/components/SoundSelector';
import { saveTimerSession, TimerSession } from '@/lib/timerStorage';

export type TimerMode = 'countdown' | 'stopwatch' | 'pomodoro';
export type PomodoroPhase = 'work' | 'break' | 'longBreak';

interface TimerState {
  time: number;
  isRunning: boolean;
  mode: TimerMode;
  pomodoroPhase: PomodoroPhase;
  pomodoroCount: number;
  initialTime: number;
  sessionStartTime: number | null;
  // Total duration (in seconds) already recorded for the current logical session
  sessionAccumulated: number;
}

export type { TimerSession };

interface PomodoroSettings {
  workDuration: number;
  breakDuration: number;
  longBreakDuration: number;
  cyclesBeforeLongBreak: number;
}

const DEFAULT_POMODORO: PomodoroSettings = {
  workDuration: 25 * 60,
  breakDuration: 5 * 60,
  longBreakDuration: 15 * 60,
  cyclesBeforeLongBreak: 4,
};

function getTimerStateKey(mode: TimerMode): string {
  return `timerflow_timer_state_${mode}`;
}

interface PersistedTimerState extends TimerState {
  lastUpdateTime: number;
}

// Load timer state from localStorage
function loadTimerState(mode: TimerMode): TimerState | null {
  try {
    const key = getTimerStateKey(mode);
    const saved = localStorage.getItem(key);
    if (!saved) return null;
    
    const persisted: PersistedTimerState = JSON.parse(saved);

    // Backwards compatibility: older saved states may not have this field
    if (persisted.sessionAccumulated == null) {
      persisted.sessionAccumulated = 0;
    }
    
    // If timer was running, calculate elapsed time since last update
    if (persisted.isRunning && persisted.lastUpdateTime) {
      const elapsed = Math.floor((Date.now() - persisted.lastUpdateTime) / 1000);
      
      if (persisted.mode === 'stopwatch') {
        persisted.time += elapsed;
      } else {
        // For countdown and pomodoro, subtract elapsed time
        persisted.time = Math.max(0, persisted.time - elapsed);
      }
    }
    
    return persisted;
  } catch (error) {
    console.error('Failed to load timer state:', error);
    return null;
  }
}

// Save timer state to localStorage
function saveTimerState(state: TimerState): void {
  try {
    const key = getTimerStateKey(state.mode);
    const persisted: PersistedTimerState = {
      ...state,
      lastUpdateTime: Date.now(),
    };
    localStorage.setItem(key, JSON.stringify(persisted));
  } catch (error) {
    console.error('Failed to save timer state:', error);
  }
}

// Clear timer state from localStorage
function clearPersistedTimerState(mode: TimerMode): void {
  try {
    const key = getTimerStateKey(mode);
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Failed to clear timer state:', error);
  }
}

export function useTimer(initialMode: TimerMode = 'countdown', onComplete?: () => void) {
  const [state, setState] = useState<TimerState>(() => {
    // Try to load saved state on initial mount
    const savedState = loadTimerState(initialMode);
    if (savedState) {
      return savedState;
    }
    // Return default state if no saved state
    const isPomodoro = initialMode === 'pomodoro';
    const defaultTime = isPomodoro ? DEFAULT_POMODORO.workDuration : 0;

    return {
      time: defaultTime,
      isRunning: false,
      mode: initialMode,
      pomodoroPhase: 'work',
      pomodoroCount: 0,
      initialTime: defaultTime,
      sessionStartTime: null,
      sessionAccumulated: 0,
    };
  });

  const [pomodoroSettings, setPomodoroSettings] = useState<PomodoroSettings>(DEFAULT_POMODORO);
  const intervalRef = useRef<number | null>(null);
  const { playSound } = useSoundSettings();
  const onCompleteRef = useRef(onComplete);

  // Update ref when callback changes
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Save timer state to localStorage whenever it changes
  useEffect(() => {
    if (state.isRunning || state.time > 0) {
      saveTimerState(state);
    } else if (state.time === 0 && !state.isRunning) {
      // Clear persisted state when timer is reset and not running
      clearPersistedTimerState(state.mode);
    }
  }, [state]);

  // Handle page visibility changes (switching tabs)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && state.isRunning) {
        // Page became visible again, sync timer with elapsed time
        const savedState = loadTimerState(initialMode);
        if (savedState && savedState.isRunning) {
          setState(savedState);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [state.isRunning]);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    setState((prev) => ({ 
      ...prev, 
      isRunning: true,
      sessionStartTime: prev.sessionStartTime || Date.now()
    }));
  }, []);

  const pause = useCallback(() => {
    setState((prev) => {
      let newAccumulated = prev.sessionAccumulated ?? 0;

      // Save partial session when pausing if there's meaningful progress
      if (prev.sessionStartTime && prev.isRunning) {
        const totalSoFar = prev.mode === 'stopwatch'
          ? prev.time
          : (prev.initialTime - prev.time);

        const segment = totalSoFar - newAccumulated;

        // Only save if at least 1 second of new work was done
        if (segment > 0) {
          saveTimerSession({
            mode: prev.mode,
            duration: segment,
            timestamp: Date.now(),
          });
          newAccumulated = totalSoFar;
        }
      }
      
      return { 
        ...prev, 
        isRunning: false,
        sessionStartTime: null, // Reset session start on pause
        sessionAccumulated: newAccumulated,
      };
    });
  }, []);

  const reset = useCallback(() => {
    clearTimer();
    setState((prev) => {
      // Save session on reset if there was meaningful work done
      if (prev.sessionStartTime) {
        const totalSoFar = prev.mode === 'stopwatch'
          ? prev.time
          : (prev.initialTime - prev.time);

        const segment = totalSoFar - (prev.sessionAccumulated ?? 0);

        if (segment > 0) {
          saveTimerSession({
            mode: prev.mode,
            duration: segment,
            timestamp: Date.now(),
          });
        }
      }
      
      return {
        ...prev,
        time: prev.mode === 'stopwatch' ? 0 : prev.initialTime,
        isRunning: false,
        sessionStartTime: null,
        sessionAccumulated: 0,
      };
    });
  }, [clearTimer]);

  const setTime = useCallback((seconds: number) => {
    setState((prev) => ({
      ...prev,
      time: seconds,
      initialTime: seconds,
      isRunning: false,
      sessionStartTime: null,
      sessionAccumulated: 0,
    }));
  }, []);

  const setMode = useCallback((mode: TimerMode) => {
    clearTimer();
    let newTime = 0;
    if (mode === 'pomodoro') {
      newTime = pomodoroSettings.workDuration;
    }
    setState({
      time: newTime,
      isRunning: false,
      mode,
      pomodoroPhase: 'work',
      pomodoroCount: 0,
      initialTime: newTime,
      sessionStartTime: null,
      sessionAccumulated: 0,
    });
  }, [clearTimer, pomodoroSettings.workDuration]);

  const nextPomodoroPhase = useCallback(() => {
    setState((prev) => {
      let newPhase: PomodoroPhase;
      let newCount = prev.pomodoroCount;
      let newTime: number;

      if (prev.pomodoroPhase === 'work') {
        newCount += 1;
        if (newCount >= pomodoroSettings.cyclesBeforeLongBreak) {
          newPhase = 'longBreak';
          newTime = pomodoroSettings.longBreakDuration;
        } else {
          newPhase = 'break';
          newTime = pomodoroSettings.breakDuration;
        }
      } else {
        newPhase = 'work';
        newTime = pomodoroSettings.workDuration;
        if (prev.pomodoroPhase === 'longBreak') {
          newCount = 0;
        }
      }

      return {
        ...prev,
        pomodoroPhase: newPhase,
        pomodoroCount: newCount,
        time: newTime,
        initialTime: newTime,
        isRunning: false,
      };
    });
    playSound();
  }, [pomodoroSettings, playSound]);

  useEffect(() => {
    if (state.isRunning) {
      intervalRef.current = window.setInterval(() => {
        setState((prev) => {
          // Stopwatch increases time
          if (prev.mode === 'stopwatch') {
            return { ...prev, time: prev.time + 1 };
          }

          // Countdown and Pomodoro decrease time
          if (prev.time <= 1) {
            // Timer has reached zero
            console.log('Timer completed! Playing sound...');

            // Save session if we have a start time
            if (prev.sessionStartTime) {
              let segment = 0;

              if (prev.mode === 'stopwatch') {
                const totalSoFar = prev.time;
                segment = totalSoFar - (prev.sessionAccumulated ?? 0);
              } else {
                // For countdown/pomodoro, a completed session should count the full
                // configured duration, regardless of the internal tick timing.
                const totalDuration = prev.initialTime;
                segment = totalDuration - (prev.sessionAccumulated ?? 0);
              }

              if (segment > 0) {
                saveTimerSession({
                  mode: prev.mode,
                  duration: segment,
                  timestamp: Date.now(),
                });
              }
            }

            // Trigger alert overlay callback
            if (onCompleteRef.current) {
              onCompleteRef.current();
            }

            if (prev.mode === 'pomodoro') {
              // Play sound before transitioning to next phase
              playSound();
              // Delay phase transition slightly to ensure sound plays
              setTimeout(() => {
                nextPomodoroPhase();
              }, 100);
              return { ...prev, time: 0, isRunning: false, sessionStartTime: null, sessionAccumulated: 0 };
            }

            // Regular countdown timer
            playSound();
            return { ...prev, time: 0, isRunning: false, sessionStartTime: null, sessionAccumulated: 0 };
          }

          return { ...prev, time: prev.time - 1 };
        });
      }, 1000);
    } else {
      clearTimer();
    }

    return clearTimer;
  }, [state.isRunning, state.mode, clearTimer, nextPomodoroPhase, playSound]);

  const progress = state.initialTime > 0 
    ? ((state.initialTime - state.time) / state.initialTime) * 100 
    : 0;

  return {
    time: state.time,
    isRunning: state.isRunning,
    mode: state.mode,
    pomodoroPhase: state.pomodoroPhase,
    pomodoroCount: state.pomodoroCount,
    progress,
    start,
    pause,
    reset,
    setTime,
    setMode,
    pomodoroSettings,
    setPomodoroSettings,
    nextPomodoroPhase,
  };
}
