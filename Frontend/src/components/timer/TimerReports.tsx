import { useState, useMemo, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, TrendingUp, Clock, ChevronDown, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
  getWeeklyData,
  getMonthlyData,
  getYearlyData,
  getCalendarData,
  getTotalDurationByMode,
  getSessionsForWeek,
  getSessionsForMonth,
  getSessionsForYear,
} from '@/lib/timerStorage';

interface TimerReportsProps {
  // Props removed - we'll get data directly from storage
}

export function TimerReports(_props: TimerReportsProps = {}) {
  const [view, setView] = useState<'daily' | 'monthly' | 'yearly'>('daily');
  const [mode, setMode] = useState<'countdown' | 'pomodoro' | 'stopwatch'>('countdown');
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [refreshIndex, setRefreshIndex] = useState(0);

  // Listen for timer session saves so insights update in real time
  useEffect(() => {
    const handler = () => setRefreshIndex((v) => v + 1);
    window.addEventListener('timer-session-saved', handler);
    return () => window.removeEventListener('timer-session-saved', handler);
  }, []);

  // Get real data from localStorage based on view
  const chartData = useMemo(() => {
    switch (view) {
      case 'daily':
        return getWeeklyData(mode, calendarDate);
      case 'monthly':
        return getMonthlyData(mode, calendarDate);
      case 'yearly':
        return getYearlyData(mode, calendarDate);
      default:
        return [];
    }
  }, [view, mode, calendarDate, refreshIndex]);

  const maxValue = useMemo(() => {
    const values = chartData.map(d => d.value);
    return values.length > 0 ? Math.max(...values, 1) : 60; // Default to 60 if no data
  }, [chartData]);

  const totalTime = useMemo(() => {
    let sessions;
    switch (view) {
      case 'daily':
        sessions = getSessionsForWeek(calendarDate);
        break;
      case 'monthly':
        sessions = getSessionsForMonth(calendarDate);
        break;
      case 'yearly':
        sessions = getSessionsForYear(calendarDate);
        break;
      default:
        sessions = [];
    }
    const durationInSeconds = getTotalDurationByMode(sessions, mode);
    return durationInSeconds / 60; // minutes (can be fractional)
  }, [view, mode, calendarDate, refreshIndex]);

  const modeConfig = {
    countdown: { color: 'cyan', label: 'Countdown', icon: Clock },
    pomodoro: { color: 'emerald', label: 'Pomodoro', icon: TrendingUp },
    stopwatch: { color: 'purple', label: 'Stopwatch', icon: Clock },
  };

  const formatTime = (minutes: number) => {
    const totalSeconds = Math.round(minutes * 60);
    const hours = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    if (hours > 0) return `${hours}h ${mins}m`;
    if (mins > 0) {
      return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
    }
    return `${secs}s`;
  };

  const ModeIcon = modeConfig[mode].icon;
  const modeColor = modeConfig[mode].color;

  // Calendar helper functions
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const changeMonth = (direction: number) => {
    const newDate = new Date(calendarDate);
    if (view === 'yearly') {
      newDate.setFullYear(newDate.getFullYear() + direction);
    } else {
      newDate.setMonth(newDate.getMonth() + direction);
    }
    setCalendarDate(newDate);
  };

  // Get real calendar data from storage
  const calendarData = useMemo(() => {
    return getCalendarData(mode, calendarDate);
  }, [mode, calendarDate]);
  
  const maxCalendarValue = useMemo(() => {
    const values = calendarData.map(d => d.value);
    return values.length > 0 ? Math.max(...values, 1) : 60;
  }, [calendarData]);

  return (
    <div className="timer-card p-6 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-display font-bold flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-primary" />
            Timer Insights
          </h2>
          <p className="text-sm text-muted-foreground">
            Track your productivity across timer modes
          </p>
        </div>
      </div>

      {/* Controls Row */}
      <div className="flex items-center justify-between gap-4">
        {/* Mode Selector Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-48 justify-between">
              <div className="flex items-center gap-2">
                <ModeIcon className="h-4 w-4" />
                <span>{modeConfig[mode].label}</span>
              </div>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuItem onClick={() => setMode('countdown')}>
              <Clock className="h-4 w-4 mr-2" />
              Countdown
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setMode('pomodoro')}>
              <TrendingUp className="h-4 w-4 mr-2" />
              Pomodoro
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setMode('stopwatch')}>
              <Calendar className="h-4 w-4 mr-2" />
              Stopwatch
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Total Time Display */}
        <div className="report-stat-card px-6 py-3">
          <div className="flex items-center gap-3">
            <div 
              className="h-3 w-3 rounded-full"
              style={{
                backgroundColor: modeColor === 'cyan' ? '#06b6d4' : 
                               modeColor === 'emerald' ? '#10b981' : '#a855f7'
              }}
            />
            <div>
              <p className="text-xs text-muted-foreground">Total Time</p>
              <p className="text-xl font-bold">{formatTime(totalTime)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* View Toggle */}
      <Tabs value={view} onValueChange={(v) => setView(v as any)} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 h-auto p-1 bg-muted/50">
          <TabsTrigger value="daily" className="flex items-center gap-2 py-2.5 data-[state=active]:bg-background">
            <Clock className="h-4 w-4" />
            <span className="text-sm">Daily</span>
          </TabsTrigger>
          <TabsTrigger value="monthly" className="flex items-center gap-2 py-2.5 data-[state=active]:bg-background">
            <Calendar className="h-4 w-4" />
            <span className="text-sm">Monthly</span>
          </TabsTrigger>
          <TabsTrigger value="yearly" className="flex items-center gap-2 py-2.5 data-[state=active]:bg-background">
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm">Yearly</span>
          </TabsTrigger>
        </TabsList>

        {/* Bar Chart */}
        <TabsContent value={view} className="mt-6 space-y-4">
          {totalTime === 0 ? (
            <div className="report-chart-container min-h-[300px] flex items-center justify-center">
              <div className="text-center space-y-2 text-muted-foreground">
                <Clock className="h-12 w-12 mx-auto opacity-50" />
                <p className="text-sm">No timer sessions recorded yet</p>
                <p className="text-xs">Start using the timer to see your productivity insights</p>
              </div>
            </div>
          ) : (
            <div className="report-chart-container">
              {/* Y-axis and Chart Container */}
              <div className="flex gap-4">
              {/* Y-axis Labels */}
              <div className="flex flex-col justify-between h-64 py-2">
                <span className="text-xs text-muted-foreground">{formatTime(maxValue)}</span>
                <span className="text-xs text-muted-foreground">{formatTime(Math.floor(maxValue * 0.75))}</span>
                <span className="text-xs text-muted-foreground">{formatTime(Math.floor(maxValue * 0.5))}</span>
                <span className="text-xs text-muted-foreground">{formatTime(Math.floor(maxValue * 0.25))}</span>
                <span className="text-xs text-muted-foreground">0m</span>
              </div>

              {/* Chart Area */}
              <div className="flex-1 relative">
                {/* Horizontal Grid Lines */}
                <div className="absolute inset-0 flex flex-col justify-between py-2">
                  <div className="h-px bg-border/30" />
                  <div className="h-px bg-border/30" />
                  <div className="h-px bg-border/30" />
                  <div className="h-px bg-border/30" />
                  <div className="h-px bg-border/40" />
                </div>

                {/* Bars */}
                <div className="flex items-end justify-around h-64 relative z-10">
                  {chartData.map((item, index) => {
                    const value = item.value;
                    const barHeight = maxValue > 0 ? (value / maxValue) * 100 : 0;

                    return (
                      <div key={index} className="flex flex-col items-center gap-2 group">
                        {/* Thin Bar */}
                        <div className="relative flex items-end" style={{ height: '240px' }}>
                          {/* Tooltip on hover */}
                          <div className="absolute -top-16 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20 pointer-events-none">
                            <div className="report-tooltip whitespace-nowrap">
                              <p className="text-xs font-semibold mb-1">{item.label}</p>
                              <div className="flex items-center justify-between gap-3">
                                <span className="text-xs text-muted-foreground">{modeConfig[mode].label}:</span>
                                <span className="text-xs font-medium">{formatTime(value)}</span>
                              </div>
                            </div>
                          </div>

                          {/* Thin Solid Bar */}
                          {barHeight > 0 && (
                            <div
                              className={`report-bar-thin report-bar-solid-${modeColor}`}
                              style={{ height: `${barHeight}%` }}
                            />
                          )}
                        </div>

                        {/* Label */}
                        <span className="text-xs font-medium text-muted-foreground">
                          {item.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Date Navigation */}
      <div className="flex items-center justify-center gap-2 mt-8">
        <Button
          variant="outline"
          size="icon"
          onClick={() => changeMonth(-1)}
          className="h-8 w-8"
          title={view === 'daily' ? 'Previous week' : view === 'monthly' ? 'Previous month' : 'Previous year'}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium min-w-[160px] text-center">
            {view === 'daily' && (() => {
              const startOfWeek = new Date(calendarDate);
              const day = startOfWeek.getDay();
              const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
              startOfWeek.setDate(diff);
              const endOfWeek = new Date(startOfWeek);
              endOfWeek.setDate(startOfWeek.getDate() + 6);
              return `${startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
            })()}
            {view === 'monthly' && calendarDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            {view === 'yearly' && calendarDate.getFullYear()}
          </span>
          {(() => {
            const today = new Date();
            const isCurrentPeriod = view === 'daily' 
              ? Math.abs(calendarDate.getTime() - today.getTime()) < 7 * 24 * 60 * 60 * 1000
              : view === 'monthly'
              ? calendarDate.getMonth() === today.getMonth() && calendarDate.getFullYear() === today.getFullYear()
              : calendarDate.getFullYear() === today.getFullYear();
            
            return !isCurrentPeriod && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCalendarDate(new Date())}
                className="h-7 px-2 text-xs"
              >
                Today
              </Button>
            );
          })()}
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => changeMonth(1)}
          className="h-8 w-8"
          title={view === 'daily' ? 'Next week' : view === 'monthly' ? 'Next month' : 'Next year'}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
