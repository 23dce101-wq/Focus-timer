export interface TimerSession {
  mode: 'countdown' | 'pomodoro' | 'stopwatch';
  duration: number; // in seconds
  timestamp: number; // milliseconds since epoch
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// In-memory cache of sessions loaded from the backend.
let sessionCache: TimerSession[] = [];

function getAuthToken(): string | null {
  try {
    return localStorage.getItem('accessToken');
  } catch (error) {
    console.error('Failed to read auth token from storage:', error);
    return null;
  }
}

async function saveTimerSessionToServer(session: TimerSession): Promise<void> {
  try {
    const token = getAuthToken();
    if (!token) return;

    await fetch(`${API_URL}/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
      body: JSON.stringify(session),
    });
  } catch (error) {
    console.error('Failed to save timer session to server:', error);
  }
}

export async function syncSessionsFromServer(): Promise<void> {
  try {
    const token = getAuthToken();
    if (!token) return;

    const response = await fetch(`${API_URL}/sessions`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    });

    if (!response.ok) {
      return;
    }

    const data = (await response.json()) as { sessions?: any[] };
    const rawSessions = data.sessions ?? [];

    // Normalize timestamps to numbers so the rest of the code can work with them
    sessionCache = rawSessions.map((s) => ({
      mode: s.mode,
      duration: s.duration,
      timestamp: typeof s.timestamp === 'string' ? new Date(s.timestamp).getTime() : s.timestamp,
    }));

    try {
      window.dispatchEvent(new CustomEvent('timer-session-saved'));
    } catch {
      // ignore
    }
  } catch (error) {
    console.error('Failed to sync timer sessions from server:', error);
  }
}

/**
 * Save a timer session to cache + backend
 */
export function saveTimerSession(session: TimerSession): void {
  try {
    // Update in-memory cache immediately so insights feel real-time
    sessionCache.push(session);

    try {
      window.dispatchEvent(new CustomEvent('timer-session-saved'));
    } catch (error) {
      console.error('Failed to dispatch timer-session-saved event:', error);
    }

    void saveTimerSessionToServer(session);
  } catch (error) {
    console.error('Failed to save timer session:', error);
  }
}

/**
 * Get all timer sessions from cache
 */
export function getTimerSessions(): TimerSession[] {
  return sessionCache;
}

/**
 * Get sessions filtered by date range
 */
export function getSessionsByDateRange(startDate: Date, endDate: Date): TimerSession[] {
  const sessions = getTimerSessions();
  const start = startDate.getTime();
  const end = endDate.getTime();
  
  return sessions.filter(session => 
    session.timestamp >= start && session.timestamp <= end
  );
}

/**
 * Get sessions for a specific day
 */
export function getSessionsForDay(date: Date): TimerSession[] {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  
  return getSessionsByDateRange(startOfDay, endOfDay);
}

/**
 * Get sessions for a specific week
 */
export function getSessionsForWeek(date: Date): TimerSession[] {
  const startOfWeek = new Date(date);
  const day = startOfWeek.getDay();
  const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Monday as start
  startOfWeek.setDate(diff);
  startOfWeek.setHours(0, 0, 0, 0);
  
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(endOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);
  
  return getSessionsByDateRange(startOfWeek, endOfWeek);
}

/**
 * Get sessions for a specific month
 */
export function getSessionsForMonth(date: Date): TimerSession[] {
  const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  startOfMonth.setHours(0, 0, 0, 0);
  
  const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  endOfMonth.setHours(23, 59, 59, 999);
  
  return getSessionsByDateRange(startOfMonth, endOfMonth);
}

/**
 * Get sessions for a specific year
 */
export function getSessionsForYear(date: Date): TimerSession[] {
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  startOfYear.setHours(0, 0, 0, 0);
  
  const endOfYear = new Date(date.getFullYear(), 11, 31);
  endOfYear.setHours(23, 59, 59, 999);
  
  return getSessionsByDateRange(startOfYear, endOfYear);
}

/**
 * Calculate total duration for sessions by mode
 */
export function getTotalDurationByMode(
  sessions: TimerSession[],
  mode: 'countdown' | 'pomodoro' | 'stopwatch'
): number {
  return sessions
    .filter(session => session.mode === mode)
    .reduce((total, session) => total + session.duration, 0);
}

/**
 * Group sessions by day of week for specified date's week
 */
export function getWeeklyData(mode: 'countdown' | 'pomodoro' | 'stopwatch', date: Date = new Date()) {
  const startOfWeek = new Date(date);
  const day = startOfWeek.getDay();
  const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
  startOfWeek.setDate(diff);
  startOfWeek.setHours(0, 0, 0, 0);
  
  const weekData = [
    { label: 'Mon', value: 0 },
    { label: 'Tue', value: 0 },
    { label: 'Wed', value: 0 },
    { label: 'Thu', value: 0 },
    { label: 'Fri', value: 0 },
    { label: 'Sat', value: 0 },
    { label: 'Sun', value: 0 },
  ];
  
  for (let i = 0; i < 7; i++) {
    const currentDay = new Date(startOfWeek);
    currentDay.setDate(startOfWeek.getDate() + i);
    const sessions = getSessionsForDay(currentDay);
    const duration = getTotalDurationByMode(sessions, mode);
    weekData[i].value = duration / 60; // minutes (can be fractional)
  }
  
  return weekData;
}

/**
 * Group sessions by week for current month
 */
export function getMonthlyData(mode: 'countdown' | 'pomodoro' | 'stopwatch', date: Date) {
  const monthData = [
    { label: 'Week 1', value: 0 },
    { label: 'Week 2', value: 0 },
    { label: 'Week 3', value: 0 },
    { label: 'Week 4', value: 0 },
  ];
  
  const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  
  for (let week = 0; week < 4; week++) {
    const weekStart = new Date(startOfMonth);
    weekStart.setDate(startOfMonth.getDate() + (week * 7));
    
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);
    
    const sessions = getSessionsByDateRange(weekStart, weekEnd);
    const duration = getTotalDurationByMode(sessions, mode);
    monthData[week].value = duration / 60; // minutes (can be fractional)
  }
  
  return monthData;
}

/**
 * Group sessions by month for current year
 */
export function getYearlyData(mode: 'countdown' | 'pomodoro' | 'stopwatch', date: Date) {
  const yearData = [
    { label: 'Jan', value: 0 },
    { label: 'Feb', value: 0 },
    { label: 'Mar', value: 0 },
    { label: 'Apr', value: 0 },
    { label: 'May', value: 0 },
    { label: 'Jun', value: 0 },
    { label: 'Jul', value: 0 },
    { label: 'Aug', value: 0 },
    { label: 'Sep', value: 0 },
    { label: 'Oct', value: 0 },
    { label: 'Nov', value: 0 },
    { label: 'Dec', value: 0 },
  ];
  
  for (let month = 0; month < 12; month++) {
    const monthDate = new Date(date.getFullYear(), month, 1);
    const sessions = getSessionsForMonth(monthDate);
    const duration = getTotalDurationByMode(sessions, mode);
    yearData[month].value = duration / 60; // minutes (can be fractional)
  }
  
  return yearData;
}

/**
 * Get daily data for calendar view (all days in month)
 */
export function getCalendarData(mode: 'countdown' | 'pomodoro' | 'stopwatch', date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  const calendarData: { day: number; value: number }[] = [];
  
  for (let day = 1; day <= daysInMonth; day++) {
    const currentDate = new Date(year, month, day);
    const sessions = getSessionsForDay(currentDate);
    const duration = getTotalDurationByMode(sessions, mode);
    calendarData.push({
      day,
      value: duration / 60, // minutes (can be fractional)
    });
  }
  
  return calendarData;
}

/**
 * Clear all sessions (for testing or reset)
 */
export function clearAllSessions(): void {
  sessionCache = [];
}
