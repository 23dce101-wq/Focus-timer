import { useState, useEffect, useCallback, useRef } from 'react';
import { useSoundSettings } from '@/components/SoundSelector';

export type TimerMode = 'countdown' | 'stopwatch' | 'pomodoro';
export type PomodoroPhase = 'work' | 'break' | 'longBreak';

interface TimerState {
  time: number;
  isRunning: boolean;
  mode: TimerMode;
  pomodoroPhase: PomodoroPhase;
  pomodoroCount: number;
  initialTime: number;
}

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

export function useTimer(initialMode: TimerMode = 'countdown', onComplete?: () => void) {
  const [state, setState] = useState<TimerState>({
    time: 0,
    isRunning: false,
    mode: initialMode,
    pomodoroPhase: 'work',
    pomodoroCount: 0,
    initialTime: 0,
  });

  const [pomodoroSettings, setPomodoroSettings] = useState<PomodoroSettings>(DEFAULT_POMODORO);
  const intervalRef = useRef<number | null>(null);
  const { playSound } = useSoundSettings();
  const onCompleteRef = useRef(onComplete);

  // Update ref when callback changes
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    setState((prev) => ({ ...prev, isRunning: true }));
  }, []);

  const pause = useCallback(() => {
    setState((prev) => ({ ...prev, isRunning: false }));
  }, []);

  const reset = useCallback(() => {
    clearTimer();
    setState((prev) => ({
      ...prev,
      time: prev.mode === 'stopwatch' ? 0 : prev.initialTime,
      isRunning: false,
    }));
  }, [clearTimer]);

  const setTime = useCallback((seconds: number) => {
    setState((prev) => ({
      ...prev,
      time: seconds,
      initialTime: seconds,
      isRunning: false,
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
              return { ...prev, time: 0, isRunning: false };
            }

            // Regular countdown timer
            playSound();
            return { ...prev, time: 0, isRunning: false };
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
