import { useState, useRef, useEffect } from 'react';
import type { HabitDay } from '@/lib/habitUtils';
import { isToday, getDayOfWeek, formatDate, formatDateLocal } from '@/lib/habitUtils';
import { cn } from '@/lib/utils';
import { Check, X } from 'lucide-react';

interface TimelineProps {
  days: HabitDay[];
  onDayClick: (date: string, status: HabitDay['status']) => void;
  onMultipleDaysUpdate: (dates: string[], status: HabitDay['status']) => void;
  selectedMonth: Date;
}

export function Timeline({ days, onDayClick, onMultipleDaysUpdate, selectedMonth }: TimelineProps) {
  const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set());
  const [isDragging, setIsDragging] = useState(false);
  const [dragStatus, setDragStatus] = useState<HabitDay['status'] | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  
  // Calculate month info
  const year = selectedMonth.getFullYear();
  const month = selectedMonth.getMonth();
  const monthName = selectedMonth.toLocaleString('default', { month: 'long', year: 'numeric' });
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  // Generate all days of the month (1 to 28/30/31)
  const monthDays: HabitDay[] = Array.from({ length: daysInMonth }, (_, i) => {
    const dayNumber = i + 1;
    const dateObj = new Date(year, month, dayNumber);
    const dateString = formatDateLocal(dateObj);
    
    // Find existing day data or create pending day
    const existingDay = days.find(day => day.date === dateString);
    return existingDay || {
      date: dateString,
      status: 'pending' as const,
      count: 0
    };
  });
  
  const getNextStatus = (current: HabitDay['status']): HabitDay['status'] => {
    const cycle: HabitDay['status'][] = ['pending', 'done', 'missed'];
    const currentIndex = cycle.indexOf(current);
    return cycle[(currentIndex + 1) % cycle.length];
  };
  
  const handleMouseDown = (date: string, currentStatus: HabitDay['status']) => {
    const nextStatus = getNextStatus(currentStatus);
    setIsDragging(true);
    setDragStatus(nextStatus);
    setSelectedDates(new Set([date]));
    onDayClick(date, nextStatus);
  };
  
  const handleMouseEnter = (date: string) => {
    if (isDragging && dragStatus) {
      setSelectedDates(prev => new Set([...prev, date]));
    }
  };
  
  const handleMouseUp = () => {
    if (isDragging && dragStatus && selectedDates.size > 1) {
      onMultipleDaysUpdate(Array.from(selectedDates), dragStatus);
    }
    setIsDragging(false);
    setDragStatus(null);
    setSelectedDates(new Set());
  };
  
  useEffect(() => {
    const handleGlobalMouseUp = () => handleMouseUp();
    document.addEventListener('mouseup', handleGlobalMouseUp);
    return () => document.removeEventListener('mouseup', handleGlobalMouseUp);
  }, [isDragging, dragStatus, selectedDates]);
  
  const getStatusColor = (status: HabitDay['status']) => {
    switch (status) {
      case 'done':
        return 'bg-gradient-to-br from-green-400 to-emerald-500 border-green-500';
      case 'missed':
        return 'bg-gradient-to-br from-red-300 to-red-400 border-red-400';
      default:
        return 'bg-muted/30 border-border';
    }
  };
  
  const getStatusIcon = (status: HabitDay['status']) => {
    switch (status) {
      case 'done':
        return <Check className="h-3 w-3 text-white" />;
      case 'missed':
        return <X className="h-3 w-3 text-white" />;
      default:
        return null;
    }
  };
  
  // Calculate completion percentage for line graph
  const getCompletionData = () => {
    return monthDays.map((day, index) => ({
      x: index,
      y: day.status === 'done' ? 100 : day.status === 'missed' ? 0 : 50,
      date: day.date
    }));
  };
  
  const completionData = getCompletionData();
  
  // Generate ultra-smooth SVG path with professional curves (no spikes, no flat lines)
  const generateSmoothLinePath = () => {
    const width = 100;
    const height = 100;
    
    // Map data points with proper scaling (avoid extremes at 0% and 100%)
    const points = completionData.map((point, index) => {
      let yValue = point.y;
      // Normalize values to avoid flat top/bottom lines
      if (yValue === 100) yValue = 95; // Done
      if (yValue === 0) yValue = 5;    // Missed
      if (yValue === 50) yValue = 50;  // Pending
      
      return {
        x: (index / Math.max(monthDays.length - 1, 1)) * width,
        y: height - yValue
      };
    });
    
    if (points.length === 0) return '';
    if (points.length === 1) return `M ${points[0].x},${points[0].y}`;
    
    // Monotone cubic interpolation for smooth, natural curves
    let path = `M ${points[0].x},${points[0].y}`;
    
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[Math.max(0, i - 1)];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[Math.min(points.length - 1, i + 2)];
      
      // Calculate smooth control points
      const t = 0.4; // Tension for smooth curves (0.3-0.5 works best)
      
      const cp1x = p1.x + (p2.x - p1.x) / 3;
      const cp1y = p1.y + (p2.y - p0.y) * t;
      
      const cp2x = p2.x - (p2.x - p1.x) / 3;
      const cp2y = p2.y - (p3.y - p1.y) * t;
      
      // Cubic bezier for ultra-smooth curves
      path += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
    }
    
    return path;
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span className="font-medium">{monthName} ({daysInMonth} days)</span>
        <div className="flex gap-4">
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-gradient-to-br from-green-400 to-emerald-500" />
            <span>Done</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-gradient-to-br from-red-300 to-red-400" />
            <span>Missed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-muted" />
            <span>Pending</span>
          </div>
        </div>
      </div>
      
      {/* Premium Line Graph - Smooth Progress Trend */}
      <div className="relative h-40 bg-gradient-to-br from-slate-900/40 to-slate-800/20 rounded-xl border border-border/30 p-6 overflow-hidden backdrop-blur-sm">
        <div className="absolute inset-0 p-6">
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="w-full h-full"
          >
            {/* Subtle grid lines */}
            <line x1="0" y1="20" x2="100" y2="20" stroke="currentColor" strokeWidth="0.15" className="text-muted-foreground/15" strokeDasharray="2,2" />
            <line x1="0" y1="50" x2="100" y2="50" stroke="currentColor" strokeWidth="0.2" className="text-muted-foreground/25" />
            <line x1="0" y1="80" x2="100" y2="80" stroke="currentColor" strokeWidth="0.15" className="text-muted-foreground/15" strokeDasharray="2,2" />
            
            {/* Premium gradient under line */}
            <defs>
              <linearGradient id="premiumLineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#10b981" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.02" />
              </linearGradient>
              <linearGradient id="lineStroke" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="50%" stopColor="#14f195" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            <path
              d={`${generateSmoothLinePath()} L 100,100 L 0,100 Z`}
              fill="url(#premiumLineGradient)"
            />
            
            {/* Ultra-smooth line with glow effect */}
            <path
              d={generateSmoothLinePath()}
              fill="none"
              stroke="url(#lineStroke)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#glow)"
              className="drop-shadow-lg"
            />
            
            {/* Data points */}
            {completionData.map((point, index) => (
              <circle
                key={index}
                cx={(index / Math.max(monthDays.length - 1, 1)) * 100}
                cy={100 - point.y}
                r="1.5"
                fill={point.y === 100 ? "#10b981" : point.y === 0 ? "#f87171" : "#9ca3af"}
                className="drop-shadow-md"
              />
            ))}
          </svg>
        </div>
        
        {/* Y-axis labels */}
        <div className="absolute left-1 top-4 bottom-4 flex flex-col justify-between text-[10px] text-muted-foreground">
          <span>100%</span>
          <span>50%</span>
          <span>0%</span>
        </div>
      </div>
      
      {/* Clickable Day Chips */}
      <div 
        ref={timelineRef}
        className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent"
        style={{ userSelect: 'none' }}
      >
        {monthDays.map((day) => {
          const today = isToday(day.date);
          const isSelected = selectedDates.has(day.date);
          
          return (
            <div
              key={day.date}
              className="flex flex-col items-center gap-1 min-w-fit group"
              onMouseDown={() => handleMouseDown(day.date, day.status)}
              onMouseEnter={() => handleMouseEnter(day.date)}
            >
              <span className="text-[10px] text-muted-foreground font-medium">
                {getDayOfWeek(day.date)}
              </span>
              
              <button
                className={cn(
                  'relative h-10 w-10 rounded-lg border-2 transition-all duration-200',
                  'hover:scale-110 hover:shadow-md active:scale-95',
                  'flex items-center justify-center',
                  getStatusColor(day.status),
                  today && 'ring-2 ring-primary ring-offset-2 ring-offset-background',
                  isSelected && 'ring-2 ring-blue-500',
                  isDragging && 'cursor-grabbing'
                )}
                aria-label={`${formatDate(day.date)} - ${day.status}`}
              >
                {getStatusIcon(day.status)}
                
                {/* Checkmark animation on completion */}
                {day.status === 'done' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-ping absolute h-full w-full rounded-lg bg-green-400 opacity-20" />
                  </div>
                )}
              </button>
              
              <span className="text-[10px] text-muted-foreground">
                {new Date(day.date).getDate()}
              </span>
            </div>
          );
        })}
      </div>
      
      <p className="text-xs text-muted-foreground italic mt-2">
        💡 Click to cycle status, or drag across multiple days
      </p>
    </div>
  );
}
