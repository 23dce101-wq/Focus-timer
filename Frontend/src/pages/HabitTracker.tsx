import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Award, Target, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/hooks/useTheme';
import { Footer } from '@/components/layout/Footer';
import { BottomNavbar } from '@/components/layout/BottomNavbar';
import { PageTransition, staggerContainer, staggerItem } from '@/components/layout/PageTransition';
import type { Habit } from '@/lib/habitUtils';
import {
  loadHabits,
  saveHabits,
  createHabit,
  updateDayStatus,
  updateMultipleDays,
  exportHabitsJSON,
  importHabitsJSON,
  calculateHabitStats
} from '@/lib/habitUtils';
import { HabitCard } from '@/components/habits/HabitCard';
import { Timeline } from '@/components/habits/Timeline';
import { ChartsPanel } from '@/components/habits/ChartsPanel';
import { AddHabitModal } from '@/components/habits/AddHabitModal';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import confetti from 'canvas-confetti';

export function HabitTracker() {
  const { theme, setTheme } = useTheme();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const { toast } = useToast();
  
  const handleMonthChange = (year: number, month: number) => {
    setSelectedMonth(new Date(year, month, 1));
  };
  
  // Load habits on mount from backend
  useEffect(() => {
    const fetchHabits = async () => {
      const loaded = await loadHabits();
      setHabits(loaded);
      if (loaded.length > 0) {
        setSelectedHabit(loaded[0]);
      }
    };

    void fetchHabits();
  }, []);
  
  // Save habits to backend whenever they change
  useEffect(() => {
    if (habits.length > 0) {
      void saveHabits(habits);
    }
  }, [habits]);
  
  // Check for milestone streaks and trigger confetti
  const checkStreakMilestone = (habit: Habit) => {
    const stats = calculateHabitStats(habit);
    const milestones = [7, 14, 30];
    
    if (milestones.includes(stats.currentStreak)) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#16BDCA', '#3B82F6', '#10b981']
      });
      
      toast({
        title: `🎉 ${stats.currentStreak}-Day Streak!`,
        description: `Amazing work on "${habit.name}"! Keep it going!`,
      });
    }
  };
  
  const handleAddHabit = (
    name: string,
    icon: string,
    category: string,
    dailyTarget: number,
    reminderEnabled: boolean
  ) => {
    if (editingHabit) {
      // Update existing habit
      setHabits(prev =>
        prev.map(h =>
          h.id === editingHabit.id
            ? { ...h, name, icon, category, dailyTarget, reminderEnabled }
            : h
        )
      );
      
      if (selectedHabit?.id === editingHabit.id) {
        setSelectedHabit(prev => 
          prev ? { ...prev, name, icon, category, dailyTarget, reminderEnabled } : null
        );
      }
      
      setEditingHabit(null);
      toast({
        title: 'Habit updated',
        description: 'Your habit has been updated successfully.',
      });
    } else {
      // Create new habit
      const newHabit = createHabit(name, icon, category, dailyTarget, reminderEnabled);
      setHabits(prev => [...prev, newHabit]);
      setSelectedHabit(newHabit);
      
      toast({
        title: 'Habit created',
        description: 'Your new habit has been added successfully.',
      });
    }
  };
  
  const handleEditHabit = (habit: Habit) => {
    setEditingHabit(habit);
    setIsAddModalOpen(true);
  };
  
  const handleDeleteHabit = (habitId: string) => {
    setHabits(prev => prev.filter(h => h.id !== habitId));
    
    if (selectedHabit?.id === habitId) {
      const remaining = habits.filter(h => h.id !== habitId);
      setSelectedHabit(remaining.length > 0 ? remaining[0] : null);
    }
    
    setDeleteConfirmId(null);
    toast({
      title: 'Habit deleted',
      description: 'The habit has been removed.',
    });
  };
  
  const handleDayClick = (date: string, status: 'done' | 'missed' | 'pending') => {
    if (!selectedHabit) return;
    
    const updated = updateDayStatus(selectedHabit, date, status);
    
    setHabits(prev =>
      prev.map(h => (h.id === selectedHabit.id ? updated : h))
    );
    setSelectedHabit(updated);
    
    if (status === 'done') {
      checkStreakMilestone(updated);
    }
  };
  
  const handleMultipleDaysUpdate = (
    dates: string[],
    status: 'done' | 'missed' | 'pending'
  ) => {
    if (!selectedHabit) return;
    
    const updated = updateMultipleDays(selectedHabit, dates, status);
    
    setHabits(prev =>
      prev.map(h => (h.id === selectedHabit.id ? updated : h))
    );
    setSelectedHabit(updated);
  };
  
  const handleExport = () => {
    const json = exportHabitsJSON(habits);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `habits-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: 'Export successful',
      description: 'Your habits have been exported to a JSON file.',
    });
  };
  
  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const json = event.target?.result as string;
          const imported = importHabitsJSON(json);
          setHabits(imported);
          setSelectedHabit(imported.length > 0 ? imported[0] : null);
          
          toast({
            title: 'Import successful',
            description: `Imported ${imported.length} habit(s) successfully.`,
          });
        } catch (error) {
          toast({
            title: 'Import failed',
            description: 'Invalid file format. Please check your JSON file.',
            variant: 'destructive',
          });
        }
      };
      reader.readAsText(file);
    };
    
    input.click();
  };
  
  const totalStats = habits.reduce(
    (acc, habit) => {
      const stats = calculateHabitStats(habit);
      return {
        totalDone: acc.totalDone + stats.totalDone,
        currentStreaks: acc.currentStreaks + stats.currentStreak,
        habits: acc.habits + 1,
      };
    },
    { totalDone: 0, currentStreaks: 0, habits: 0 }
  );
  
  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col pb-24 md:pb-28">
        <div className="floating-gradient" />
        
        <main className="flex-1 py-8 md:py-12">
          <div className="container mx-auto px-4 space-y-8">
            {/* Header */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
              <div className="text-center md:text-left">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-4"
                >
                  <Sparkles className="h-4 w-4 text-accent" />
                  <span className="text-sm font-medium text-accent">Build Better Habits</span>
                </motion.div>
                
                <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">
                  Habit <span className="gradient-text">Tracker</span>
                </h1>
                <p className="text-muted-foreground">
                  Build better habits, one day at a time
                </p>
              </div>
              
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap gap-2 justify-center md:justify-end"
              >
                <Button onClick={() => setIsAddModalOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Habit
                </Button>
              </motion.div>
            </motion.div>
          
          {/* Stats Overview */}
          {habits.length > 0 && (
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-3 gap-4"
            >
              <motion.div variants={staggerItem} className="timer-card p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <Target className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{totalStats.habits}</p>
                    <p className="text-xs text-muted-foreground">Active Habits</p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div variants={staggerItem} className="timer-card p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                    <Award className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{totalStats.totalDone}</p>
                    <p className="text-xs text-muted-foreground">Days Completed</p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div variants={staggerItem} className="timer-card p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
                    <span className="text-xl">🔥</span>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{totalStats.currentStreaks}</p>
                    <p className="text-xs text-muted-foreground">Total Streaks</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
          
          {habits.length === 0 ? (
            /* Empty State */
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="timer-card p-12 text-center"
            >
              <div className="text-6xl mb-4">🎯</div>
              <h2 className="text-2xl font-semibold mb-2">No habits yet</h2>
              <p className="text-muted-foreground mb-6">
                Start building better habits by creating your first habit tracker
              </p>
              <Button onClick={() => setIsAddModalOpen(true)} size="lg">
                <Plus className="h-5 w-5 mr-2" />
                Create Your First Habit
              </Button>
            </motion.div>
          ) : (
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              {/* Left Column - Habit Cards */}
              <motion.div variants={staggerItem} className="lg:col-span-2 space-y-6">
                {/* Habit Selection Tabs */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                  {habits.map((habit) => (
                    <button
                      key={habit.id}
                      onClick={() => setSelectedHabit(habit)}
                      className={`
                        flex items-center gap-2 px-4 py-2 rounded-lg border-2 
                        transition-all whitespace-nowrap
                        ${selectedHabit?.id === habit.id
                          ? 'border-primary bg-primary/10 shadow-md'
                          : 'border-border hover:border-primary/50'
                        }
                      `}
                    >
                      <span className="text-xl">{habit.icon}</span>
                      <span className="font-medium">{habit.name}</span>
                    </button>
                  ))}
                </div>
                
                {/* Selected Habit Detail */}
                {selectedHabit && (
                  <div className="space-y-6">
                    <HabitCard
                      habit={selectedHabit}
                      onEdit={handleEditHabit}
                      onDelete={(id) => setDeleteConfirmId(id)}
                    />
                    
                    <div className="timer-card p-6">
                      <Timeline
                        days={selectedHabit.days}
                        onDayClick={handleDayClick}
                        onMultipleDaysUpdate={handleMultipleDaysUpdate}
                        selectedMonth={selectedMonth}
                      />
                    </div>
                  </div>
                )}
              </motion.div>
              
              {/* Right Column - Charts */}
              <motion.div variants={staggerItem} className="lg:col-span-1">
                <ChartsPanel habits={habits} onMonthChange={handleMonthChange} />
              </motion.div>
            </motion.div>
          )}
        </div>
      </main>
      
      {/* Modals */}
      <AddHabitModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingHabit(null);
        }}
        onSave={handleAddHabit}
        editingHabit={editingHabit}
      />
      
      {/* Delete Confirmation */}
      <AlertDialog 
        open={deleteConfirmId !== null} 
        onOpenChange={(open) => !open && setDeleteConfirmId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Habit?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. All progress for this habit will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteConfirmId && handleDeleteHabit(deleteConfirmId)}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <Footer />
      
      {/* Bottom Navigation */}
      <BottomNavbar />
    </div>
    </PageTransition>
  );
}
