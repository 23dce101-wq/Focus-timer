import type { Habit } from '@/lib/habitUtils';
import { calculateHabitStats } from '@/lib/habitUtils';
import { ProgressRing } from './ProgressRing';
import { Pencil, Trash2, TrendingUp, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical } from 'lucide-react';

interface HabitCardProps {
  habit: Habit;
  onEdit: (habit: Habit) => void;
  onDelete: (habitId: string) => void;
}

export function HabitCard({ habit, onEdit, onDelete }: HabitCardProps) {
  const stats = calculateHabitStats(habit);
  
  return (
    <div className="timer-card p-6 space-y-4 hover:shadow-lg transition-all duration-300 group">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="text-3xl">{habit.icon}</div>
          <div>
            <h3 className="font-semibold text-lg">{habit.name}</h3>
            <span className="text-xs text-muted-foreground capitalize">
              {habit.category}
            </span>
          </div>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(habit)}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onDelete(habit.id)}
              className="text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {/* Progress Ring and Stats */}
      <div className="flex items-center justify-between">
        <ProgressRing 
          progress={stats.completionRate} 
          size={70}
          strokeWidth={5}
        />
        
        <div className="flex-1 grid grid-cols-2 gap-3 ml-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-orange-500">
              <Flame className="h-4 w-4" />
              <span className="text-xs font-medium">Streak</span>
            </div>
            <p className="text-2xl font-bold">{stats.currentStreak}</p>
            <p className="text-xs text-muted-foreground">
              Best: {stats.longestStreak}
            </p>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-green-500">
              <TrendingUp className="h-4 w-4" />
              <span className="text-xs font-medium">Done</span>
            </div>
            <p className="text-2xl font-bold">{stats.totalDone}</p>
            <p className="text-xs text-muted-foreground">
              / 30 days
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
