/**
 * Habit Tracker Utilities
 * Date helpers, streak calculations, and data management
 */

/**
 * Format date to YYYY-MM-DD in local timezone (not UTC)
 * This prevents off-by-one errors when converting dates
 */
export function formatDateLocal(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export interface HabitDay {
  date: string; // YYYY-MM-DD
  status: 'done' | 'missed' | 'pending';
}

export interface Habit {
  id: string;
  name: string;
  icon: string;
  category: string;
  dailyTarget: number;
  reminderEnabled: boolean;
  createdAt: string;
  days: HabitDay[];
}

export interface HabitStats {
  totalDone: number;
  totalMissed: number;
  currentStreak: number;
  longestStreak: number;
  completionRate: number;
  weeklyData: { week: string; done: number }[];
}

/**
 * Generate array of last 30 days
 */
export function generate30DayRange(): HabitDay[] {
  const days: HabitDay[] = [];
  const today = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    days.push({
      date: formatDateLocal(date),
      status: 'pending'
    });
  }
  
  return days;
}

/**
 * Calculate current and longest streak
 */
export function calculateStreaks(days: HabitDay[]): { current: number; longest: number } {
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  
  // Sort days by date descending (newest first)
  const sortedDays = [...days].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  // Calculate current streak (from today backwards)
  for (const day of sortedDays) {
    if (day.status === 'done') {
      currentStreak++;
    } else if (day.status === 'missed') {
      break;
    }
    // Skip 'pending' without breaking
  }
  
  // Calculate longest streak
  for (const day of days) {
    if (day.status === 'done') {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else if (day.status === 'missed') {
      tempStreak = 0;
    }
  }
  
  return { current: currentStreak, longest: longestStreak };
}

/**
 * Calculate comprehensive stats for a habit
 */
export function calculateHabitStats(habit: Habit): HabitStats {
  const { current, longest } = calculateStreaks(habit.days);
  
  const totalDone = habit.days.filter(d => d.status === 'done').length;
  const totalMissed = habit.days.filter(d => d.status === 'missed').length;
  const totalTracked = totalDone + totalMissed;
  
  const completionRate = totalTracked > 0 ? (totalDone / totalTracked) * 100 : 0;
  
  // Calculate weekly data (4 weeks)
  const weeklyData = [];
  for (let week = 0; week < 4; week++) {
    const weekStart = 29 - (week * 7) - 6;
    const weekEnd = 29 - (week * 7);
    const weekDays = habit.days.slice(weekStart, weekEnd + 1);
    const weekDone = weekDays.filter(d => d.status === 'done').length;
    weeklyData.unshift({
      week: `W${4 - week}`,
      done: weekDone
    });
  }
  
  return {
    totalDone,
    totalMissed,
    currentStreak: current,
    longestStreak: longest,
    completionRate,
    weeklyData
  };
}

/**
 * Update habit day status
 */
export function updateDayStatus(
  habit: Habit,
  date: string,
  status: HabitDay['status']
): Habit {
  return {
    ...habit,
    days: habit.days.map(day =>
      day.date === date ? { ...day, status } : day
    )
  };
}

/**
 * Update multiple days at once (for drag selection)
 */
export function updateMultipleDays(
  habit: Habit,
  dates: string[],
  status: HabitDay['status']
): Habit {
  const dateSet = new Set(dates);
  return {
    ...habit,
    days: habit.days.map(day =>
      dateSet.has(day.date) ? { ...day, status } : day
    )
  };
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

function getAuthToken(): string | null {
  try {
    return localStorage.getItem('accessToken');
  } catch (error) {
    console.error('Error accessing auth token for habits:', error);
    return null;
  }
}

/**
 * Load habits from the backend for the authenticated user
 */
export async function loadHabits(): Promise<Habit[]> {
  try {
    const token = getAuthToken();
    if (!token) return [];

    const response = await fetch(`${API_URL}/habits`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    });

    if (!response.ok) {
      console.error('Failed to load habits from server:', await response.text());
      return [];
    }

    const data = (await response.json()) as { habits?: Habit[] };
    const habits = data.habits ?? [];

    // Ensure all habits have an up-to-date 30-day window
    return habits.map((habit) => {
      const currentDays = habit.days || [];
      const requiredDays = generate30DayRange();

      const mergedDays = requiredDays.map((reqDay) => {
        const existing = currentDays.find((d) => d.date === reqDay.date);
        return existing || reqDay;
      });

      return { ...habit, days: mergedDays };
    });
  } catch (error) {
    console.error('Error loading habits from server:', error);
    return [];
  }
}

/**
 * Save habits to the backend
 */
export async function saveHabits(habits: Habit[]): Promise<void> {
  try {
    const token = getAuthToken();
    if (!token) return;

    const response = await fetch(`${API_URL}/habits`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
      body: JSON.stringify({ habits }),
    });

    if (!response.ok) {
      console.error('Failed to save habits to server:', await response.text());
    }
  } catch (error) {
    console.error('Error saving habits to server:', error);
  }
}

/**
 * Create new habit
 */
export function createHabit(
  name: string,
  icon: string,
  category: string,
  dailyTarget: number = 1,
  reminderEnabled: boolean = false
): Habit {
  return {
    id: `habit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name,
    icon,
    category,
    dailyTarget,
    reminderEnabled,
    createdAt: new Date().toISOString(),
    days: generate30DayRange()
  };
}

/**
 * Export habits as JSON
 */
export function exportHabitsJSON(habits: Habit[]): string {
  return JSON.stringify(habits, null, 2);
}

/**
 * Import and validate habits from JSON
 */
export function importHabitsJSON(json: string): Habit[] {
  try {
    const parsed = JSON.parse(json);
    
    if (!Array.isArray(parsed)) {
      throw new Error('Invalid format: expected array');
    }
    
    // Validate and sanitize
    const validated: Habit[] = parsed.map((item: any) => {
      if (!item.id || !item.name || !Array.isArray(item.days)) {
        throw new Error('Invalid habit structure');
      }
      
      return {
        id: String(item.id),
        name: String(item.name),
        icon: String(item.icon || '🎯'),
        category: String(item.category || 'General'),
        dailyTarget: Number(item.dailyTarget) || 1,
        reminderEnabled: Boolean(item.reminderEnabled),
        createdAt: item.createdAt || new Date().toISOString(),
        days: item.days.map((day: any) => ({
          date: String(day.date),
          status: ['done', 'skipped', 'missed', 'pending'].includes(day.status)
            ? day.status
            : 'pending'
        }))
      };
    });
    
    return validated;
  } catch (error) {
    console.error('Error importing habits:', error);
    throw new Error('Invalid JSON format or structure');
  }
}

/**
 * Format date for display
 */
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/**
 * Get day of week
 */
export function getDayOfWeek(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { weekday: 'short' });
}

/**
 * Check if date is today
 */
export function isToday(dateStr: string): boolean {
  const date = new Date(dateStr);
  const today = new Date();
  return date.toDateString() === today.toDateString();
}
