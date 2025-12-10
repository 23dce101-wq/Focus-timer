import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Sparkles, Target, Calendar, Zap, TrendingUp, Clock, Search } from 'lucide-react';
import type { Habit } from '@/lib/habitUtils';
import { cn } from '@/lib/utils';

interface AddHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, icon: string, category: string, dailyTarget: number, reminderEnabled: boolean) => void;
  editingHabit?: Habit | null;
}

const EMOJI_CATEGORIES = {
  'Popular': ['🎯', '💪', '🔥', '⚡', '⭐', '✨', '🚀', '💎'],
  'Health': ['🏃', '🧘', '💧', '🥗', '😴', '🧠', '❤️', '🩺'],
  'Learning': ['📚', '✍️', '🎓', '📝', '🧑‍💻', '📖', '🔬', '🎯'],
  'Lifestyle': ['🎨', '🎵', '🎮', '📱', '☕', '🌅', '🌙', '🎬'],
  'Fitness': ['💪', '🏋️', '🤸', '⚽', '🏊', '🚴', '🥊', '🧗'],
  'Mindfulness': ['🧘', '🕉️', '🌸', '🍃', '🌺', '🦋', '🌈', '☮️']
};

const CATEGORY_OPTIONS = [
  'Health',
  'Fitness',
  'Learning',
  'Productivity',
  'Mindfulness',
  'Creativity',
  'Social',
  'Finance',
  'General'
];

const HABIT_TYPES = [
  { value: 'daily', label: 'Daily', icon: '📅' },
  { value: 'weekly', label: 'Weekly', icon: '📆' },
  { value: 'custom', label: 'Custom', icon: '⚙️' }
];

const COLOR_THEMES = [
  { name: 'Emerald', gradient: 'from-green-400 to-emerald-500', hex: '#10b981' },
  { name: 'Blue', gradient: 'from-blue-400 to-blue-600', hex: '#3b82f6' },
  { name: 'Purple', gradient: 'from-purple-400 to-purple-600', hex: '#a855f7' },
  { name: 'Pink', gradient: 'from-pink-400 to-pink-600', hex: '#ec4899' },
  { name: 'Orange', gradient: 'from-orange-400 to-orange-600', hex: '#f97316' },
  { name: 'Teal', gradient: 'from-teal-400 to-cyan-500', hex: '#14b8a6' }
];

const DIFFICULTY_LEVELS = [
  { value: 'easy', label: 'Easy', emoji: '🌱', color: 'text-green-400' },
  { value: 'medium', label: 'Medium', emoji: '🎯', color: 'text-yellow-400' },
  { value: 'hard', label: 'Hard', emoji: '🔥', color: 'text-red-400' }
];

export function AddHabitModal({ isOpen, onClose, onSave, editingHabit }: AddHabitModalProps) {
  const [step, setStep] = useState<'details' | 'goals'>('details');
  const [name, setName] = useState(editingHabit?.name || '');
  const [icon, setIcon] = useState(editingHabit?.icon || '🎯');
  const [category, setCategory] = useState(editingHabit?.category || 'General');
  const [dailyTarget, setDailyTarget] = useState(editingHabit?.dailyTarget || 1);
  const [reminderEnabled, setReminderEnabled] = useState(editingHabit?.reminderEnabled || false);
  const [habitType, setHabitType] = useState('daily');
  const [colorTheme, setColorTheme] = useState(COLOR_THEMES[0]);
  const [difficulty, setDifficulty] = useState('medium');
  const [iconSearch, setIconSearch] = useState('');
  const [selectedEmojiCategory, setSelectedEmojiCategory] = useState('Popular');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) return;
    
    onSave(name.trim(), icon, category, dailyTarget, reminderEnabled);
    
    // Reset form
    setName('');
    setIcon('🎯');
    setCategory('General');
    setDailyTarget(1);
    setReminderEnabled(false);
    onClose();
  };
  
  const handleClose = () => {
    setName(editingHabit?.name || '');
    setIcon(editingHabit?.icon || '🎯');
    setCategory(editingHabit?.category || 'General');
    setDailyTarget(editingHabit?.dailyTarget || 1);
    setReminderEnabled(editingHabit?.reminderEnabled || false);
    onClose();
  };
  
  const filteredIcons = EMOJI_CATEGORIES[selectedEmojiCategory as keyof typeof EMOJI_CATEGORIES].filter(() => true);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl p-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        {/* Clean Professional Header */}
        <div className="border-b border-slate-200 dark:border-slate-800">
          <div className="px-6 py-5">
            <DialogTitle className="text-xl font-semibold text-slate-900 dark:text-slate-100">
              {editingHabit ? 'Edit Habit' : 'Create New Habit'}
            </DialogTitle>
            <DialogDescription className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {editingHabit 
                ? 'Update your habit information below'
                : 'Set up a new habit to track your progress'
              }
            </DialogDescription>
          </div>
          
          {/* Minimal Step Tabs */}
          <div className="flex border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setStep('details')}
              className={cn(
                'flex-1 py-3 px-4 text-sm font-medium transition-colors relative',
                step === 'details'
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              )}
            >
              <span className="flex items-center justify-center gap-2">
                <Target className="w-4 h-4" />
                Details
              </span>
              {step === 'details' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setStep('goals')}
              className={cn(
                'flex-1 py-3 px-4 text-sm font-medium transition-colors relative border-l border-slate-200 dark:border-slate-800',
                step === 'goals'
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              )}
            >
              <span className="flex items-center justify-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Settings
              </span>
              {step === 'goals' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400" />
              )}
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[65vh] overflow-y-auto"
          style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgb(148 163 184) transparent' }}
        >
          {/* STEP 1: HABIT DETAILS */}
          {step === 'details' && (
            <div className="space-y-5">
              {/* Habit Name - Clean Input */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Habit Name
                </Label>
                <Input
                  id="habit-name"
                  placeholder="e.g., Morning workout, Read for 30 minutes"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoFocus
                  className="h-11 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 
                  focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400"
                />
              </div>
              
              {/* Icon Picker - Minimal */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Choose Icon
                </Label>
                
                {/* Icon Categories - Subtle Tabs */}
                <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto" style={{ scrollbarWidth: 'thin' }}>
                  {Object.keys(EMOJI_CATEGORIES).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedEmojiCategory(cat)}
                      className={cn(
                        'px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors',
                        selectedEmojiCategory === cat
                          ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                
                {/* Icon Grid - Clean Design */}
                <div className="grid grid-cols-8 gap-2 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                  {filteredIcons.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setIcon(emoji)}
                      className={cn(
                        'p-2 text-2xl rounded-lg transition-all',
                        'hover:bg-slate-200 dark:hover:bg-slate-700',
                        icon === emoji 
                          ? 'bg-blue-100 dark:bg-blue-900/30 ring-2 ring-blue-500 dark:ring-blue-400' 
                          : 'bg-white dark:bg-slate-800'
                      )}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Category & Color - Grid Layout */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="h-11 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                      {CATEGORY_OPTIONS.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">Color</Label>
                  <div className="flex gap-2 items-center h-11">
                    {COLOR_THEMES.map((theme) => (
                      <button
                        key={theme.name}
                        type="button"
                        onClick={() => setColorTheme(theme)}
                        className={cn(
                          'w-8 h-8 rounded-md transition-all',
                          colorTheme.name === theme.name && 'ring-2 ring-offset-2 ring-slate-400 dark:ring-slate-500'
                        )}
                        style={{ backgroundColor: theme.hex }}
                        title={theme.name}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* STEP 2: GOALS & SETTINGS */}
          {step === 'goals' && (
            <div className="space-y-5">
              {/* Habit Type - Clean Cards */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Habit Type
                </Label>
                <div className="grid grid-cols-3 gap-3">
                  {HABIT_TYPES.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setHabitType(type.value)}
                      className={cn(
                        'p-3 rounded-lg border transition-colors',
                        habitType === type.value
                          ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600'
                      )}
                    >
                      <div className="text-2xl mb-1">{type.icon}</div>
                      <div className="text-sm font-medium text-slate-700 dark:text-slate-300">{type.label}</div>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Difficulty Level - Simple Pills */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Difficulty Level
                </Label>
                <div className="grid grid-cols-3 gap-3">
                  {DIFFICULTY_LEVELS.map((level) => (
                    <button
                      key={level.value}
                      type="button"
                      onClick={() => setDifficulty(level.value)}
                      className={cn(
                        'p-3 rounded-lg border transition-colors',
                        difficulty === level.value
                          ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600'
                      )}
                    >
                      <div className="text-xl mb-1">{level.emoji}</div>
                      <div className="text-sm font-medium text-slate-700 dark:text-slate-300">{level.label}</div>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Daily Target - Clean Input */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Daily Target
                </Label>
                <Input
                  id="daily-target"
                  type="number"
                  min="1"
                  max="10"
                  value={dailyTarget}
                  onChange={(e) => setDailyTarget(parseInt(e.target.value) || 1)}
                  className="h-11 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 
                  focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400"
                />
              </div>
              
              {/* Reminder Toggle - Clean Card */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="reminder" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Daily Reminder
                    </Label>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Get notified to complete this habit
                    </p>
                  </div>
                  <Switch
                    id="reminder"
                    checked={reminderEnabled}
                    onCheckedChange={setReminderEnabled}
                  />
                </div>
              </div>
            </div>
          )}
        </form>
        
        {/* Clean Footer */}
        <DialogFooter className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <div className="flex gap-3 w-full sm:w-auto">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
              className="flex-1 sm:flex-initial h-10 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              onClick={handleSubmit}
              className="flex-1 sm:flex-initial h-10 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white"
            >
              {editingHabit ? 'Update' : 'Create'} Habit
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
