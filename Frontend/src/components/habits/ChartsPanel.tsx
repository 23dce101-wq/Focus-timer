import { useMemo, useState } from 'react';
import type { Habit } from '@/lib/habitUtils';
import { calculateHabitStats, formatDateLocal } from '@/lib/habitUtils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';

interface ChartsPanelProps {
  habits: Habit[];
  onMonthChange?: (year: number, month: number) => void;
}

export function ChartsPanel({ habits, onMonthChange }: ChartsPanelProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const changeMonth = (direction: number) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setSelectedDate(newDate);
    if (onMonthChange) {
      onMonthChange(newDate.getFullYear(), newDate.getMonth());
    }
  };
  
  const aggregatedData = useMemo(() => {
    if (habits.length === 0) return null;
    
    // Aggregate stats from all habits
    let totalDone = 0;
    let totalMissed = 0;
    const weeklyTotals = [0, 0, 0, 0];
    
    habits.forEach(habit => {
      const stats = calculateHabitStats(habit);
      totalDone += stats.totalDone;
      totalMissed += stats.totalMissed;
      
      stats.weeklyData.forEach((week, index) => {
        weeklyTotals[index] += week.done;
      });
    });
    
    const weeklyData = weeklyTotals.map((count, index) => ({
      week: `Week ${index + 1}`,
      completed: count
    }));
    
    const statusData = [
      { name: 'Done', value: totalDone, color: '#10b981' },
      { name: 'Missed', value: totalMissed, color: '#f87171' }
    ];
    
    // Calculate month data based on selected date
    const heatmapData: number[] = Array(30).fill(0);
    habits.forEach(habit => {
      habit.days.forEach((day, index) => {
        if (day.status === 'done') heatmapData[index]++;
      });
    });
    
    return { weeklyData, statusData, heatmapData };
  }, [habits]);
  
  if (!aggregatedData) {
    return (
      <div className="timer-card p-8 flex items-center justify-center">
        <p className="text-muted-foreground">
          Add habits to see charts
        </p>
      </div>
    );
  }
  
  const { weeklyData, statusData, heatmapData } = aggregatedData;
  const maxHeatValue = Math.max(...heatmapData, 1);
  
  return (
    <div className="space-y-6">
      {/* Donut Chart */}
      <div className="timer-card p-6">
        <h3 className="text-lg font-semibold mb-4">Status Distribution</h3>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={statusData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={70}
              paddingAngle={5}
              dataKey="value"
            >
              {statusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
            />
            <Legend 
              verticalAlign="bottom"
              height={36}
              iconType="circle"
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      {/* Interactive Calendar */}
      <div className="timer-card p-6">
        {/* Header with Month Navigation */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold">Activity Calendar</h3>
            <p className="text-sm text-muted-foreground">Track your consistency</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() => changeMonth(-1)}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-semibold min-w-[140px] text-center">
              {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => changeMonth(1)}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Calendar Grid */}
        <div className="space-y-2">
          {/* Day Labels */}
          <div className="grid grid-cols-7 gap-2 text-xs text-muted-foreground font-medium text-center mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day}>{day}</div>
            ))}
          </div>
          
          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-2">
            {(() => {
              const year = selectedDate.getFullYear();
              const month = selectedDate.getMonth();
              
              // Get first day of selected month
              const firstDay = new Date(year, month, 1);
              const startingDayOfWeek = firstDay.getDay();
              
              // Get last day of selected month
              const lastDay = new Date(year, month + 1, 0);
              const daysInMonth = lastDay.getDate();
              
              const calendarDays = [];
              const today = new Date();
              const todayStr = formatDateLocal(today);
              
              // Add empty cells for days before the month starts
              for (let i = 0; i < startingDayOfWeek; i++) {
                calendarDays.push(
                  <div key={`empty-start-${i}`} className="aspect-square" />
                );
              }
              
              // Add all days of the month
              for (let day = 1; day <= daysInMonth; day++) {
                const currentDate = new Date(year, month, day);
                const dateStr = formatDateLocal(currentDate);
                
                // Find habit activity for this date
                let completedCount = 0;
                let missedCount = 0;
                habits.forEach(habit => {
                  const dayData = habit.days.find(d => d.date === dateStr);
                  if (dayData) {
                    if (dayData.status === 'done') completedCount++;
                    if (dayData.status === 'missed') missedCount++;
                  }
                });
                
                const isToday = dateStr === todayStr;
                const hasActivity = completedCount > 0 || missedCount > 0;
                
                // Determine colors
                let bgColor = 'bg-muted/10 dark:bg-slate-800/50';
                let borderColor = 'border-border/30';
                let textColor = 'text-slate-700 dark:text-slate-300';
                
                if (completedCount > 0) {
                  const intensity = Math.min(completedCount / habits.length, 1);
                  const opacity = 0.5 + (intensity * 0.5);
                  bgColor = '';
                  borderColor = 'border-green-500/30';
                  textColor = 'text-white dark:text-white';
                }
                
                if (missedCount > 0 && completedCount === 0) {
                  bgColor = 'bg-red-500/20 dark:bg-red-500/30';
                  borderColor = 'border-red-500/30';
                  textColor = 'text-slate-700 dark:text-slate-300';
                }
                
                if (isToday) {
                  borderColor = 'border-blue-500 dark:border-blue-400 ring-2 ring-blue-500/30';
                }
                
                calendarDays.push(
                  <div
                    key={dateStr}
                    className={`aspect-square rounded-lg border-2 flex items-center justify-center text-sm font-medium transition-all hover:scale-105 cursor-pointer ${bgColor} ${borderColor} ${textColor} relative group`}
                    style={completedCount > 0 ? {
                      backgroundColor: `rgba(34, 197, 94, ${0.5 + (Math.min(completedCount / habits.length, 1) * 0.5)})`,
                    } : undefined}
                    title={`${dateStr}: ${completedCount} completed, ${missedCount} missed`}
                  >
                    <span className="relative z-10">{day}</span>
                    
                    {/* Hover tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-popover text-popover-foreground text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20 border border-border">
                      <div className="font-semibold mb-1">
                        {currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                      <div className="space-y-0.5">
                        {completedCount > 0 && (
                          <div className="text-green-600 dark:text-green-400">✓ {completedCount} completed</div>
                        )}
                        {missedCount > 0 && (
                          <div className="text-red-600 dark:text-red-400">✗ {missedCount} missed</div>
                        )}
                        {!hasActivity && (
                          <div className="text-muted-foreground">No activity</div>
                        )}
                      </div>
                    </div>
                    
                    {/* Indicator dots */}
                    {completedCount > 0 && (
                      <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-green-400" />
                    )}
                    {missedCount > 0 && completedCount === 0 && (
                      <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-red-400" />
                    )}
                  </div>
                );
              }
              
              return calendarDays;
            })()}
          </div>
        </div>
        
        {/* Legend */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
          <div className="flex items-center gap-4 text-xs flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-green-500/80 border border-green-500" />
              <span className="text-muted-foreground">Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-red-500/20 border border-red-500/30" />
              <span className="text-muted-foreground">Missed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-muted/20 border border-border/30" />
              <span className="text-muted-foreground">No Activity</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md border-2 border-primary ring-2 ring-primary/50" />
              <span className="text-muted-foreground">Today</span>
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            Last 30 days
          </div>
        </div>
      </div>
    </div>
  );
}
