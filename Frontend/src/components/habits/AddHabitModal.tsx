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

export function AddHabitModal({ isOpen, onClose, onSave, editingHabit }: AddHabitModalProps) {
  const [name, setName] = useState(editingHabit?.name || '');
  const [icon, setIcon] = useState(editingHabit?.icon || '🎯');
  const [category, setCategory] = useState(editingHabit?.category || 'General');
  const [dailyTarget, setDailyTarget] = useState(editingHabit?.dailyTarget || 1);
  const [reminderEnabled, setReminderEnabled] = useState(editingHabit?.reminderEnabled || false);
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
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[65vh] overflow-y-auto"
          style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgb(148 163 184) transparent' }}
        >
          {/* HABIT DETAILS */}
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
              
              {/* Category */}
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
            </div>
          
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
