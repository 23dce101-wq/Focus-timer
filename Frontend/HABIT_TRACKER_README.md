# Habit Tracker - Feature Documentation

## 🎯 Overview

The Habit Tracker is a fully interactive, production-ready feature for tracking daily habits with visual analytics, streak tracking, and milestone celebrations.

## ✨ Features

### Core Functionality
- ✅ **30-Day Rolling View** - Always displays the latest 30 days
- ✅ **Add/Edit/Delete Habits** - Full CRUD operations
- ✅ **Multi-Status Tracking** - Done, Skipped, Missed, Pending
- ✅ **Drag Selection** - Update multiple days at once
- ✅ **Streak Calculation** - Current and longest streak tracking
- ✅ **Milestone Celebrations** - Confetti at 7, 14, 30-day streaks
- ✅ **Data Persistence** - localStorage with automatic sync
- ✅ **Import/Export** - Backup and restore as JSON

### Visual Components

#### 1. Progress Ring
- Animated circular progress (0-100%)
- Gradient colors matching TimerFlow brand
- Smooth easing animations

#### 2. 30-Day Timeline
- Interactive day chips with status colors:
  - 🟢 Green gradient = Done
  - ⚪ Gray = Skipped
  - 🔴 Light red = Missed
  - ⚫ Muted = Pending
- Click to cycle through statuses
- Drag across multiple days to batch update
- Today is highlighted with a ring

#### 3. Habit Cards
- Icon + Name + Category
- Progress ring showing completion %
- Current streak with flame icon 🔥
- Best streak tracking
- Total completed days
- Mini sparkline (last 7 days)
- Edit/Delete dropdown menu

#### 4. Charts Panel
- **Weekly Bar Chart** - 4 bars representing each week's completions
- **Donut Chart** - Done vs Skipped vs Missed distribution
- **Intensity Heatmap** - 30-day grid showing activity intensity

### Data Structure

```typescript
interface Habit {
  id: string;
  name: string;
  icon: string; // Emoji
  category: string;
  dailyTarget: number;
  reminderEnabled: boolean;
  createdAt: string;
  days: HabitDay[]; // Array of 30 days
}

interface HabitDay {
  date: string; // YYYY-MM-DD
  status: 'done' | 'skipped' | 'missed' | 'pending';
}
```

## 📁 File Structure

```
src/
├── lib/
│   └── habitUtils.ts          # Core utilities, calculations, storage
├── components/
│   └── habits/
│       ├── ProgressRing.tsx   # Animated circular progress
│       ├── Timeline.tsx       # 30-day interactive calendar
│       ├── HabitCard.tsx      # Individual habit display
│       ├── ChartsPanel.tsx    # Analytics charts
│       └── AddHabitModal.tsx  # Create/edit modal
└── pages/
    └── HabitTracker.tsx       # Main page component
```

## 🚀 Integration

### 1. Routes
Already integrated in `App.tsx`:
```tsx
<Route path="/habits" element={<HabitTracker />} />
```

### 2. Navigation
Added to Header nav:
```tsx
<a href="/habits">Habits</a>
```

### 3. Storage
Data stored in localStorage:
```
Key: focus_timer_habit_data_v1
```

## 🎨 Styling

- Uses **Tailwind CSS** for all styling
- Matches **TimerFlow brand** colors:
  - Primary: `#3B82F6` (blue)
  - Accent: `#16BDCA` (cyan)
  - Gradients throughout
- Responsive design:
  - Mobile: Timeline scrolls horizontally
  - Desktop: 2-column layout with charts sidebar
  - Cards adapt to grid layout

## 🧪 Key Functions

### Utils (`habitUtils.ts`)

```typescript
// Generate 30-day date range
generate30DayRange(): HabitDay[]

// Calculate streaks
calculateStreaks(days: HabitDay[]): { current, longest }

// Get comprehensive stats
calculateHabitStats(habit: Habit): HabitStats

// Update single/multiple days
updateDayStatus(habit, date, status): Habit
updateMultipleDays(habit, dates, status): Habit

// Storage operations
loadHabits(): Habit[]
saveHabits(habits): void

// Import/Export
exportHabitsJSON(habits): string
importHabitsJSON(json): Habit[]
```

## 🎉 Milestone Celebrations

Confetti triggers at:
- 🎊 **7-day streak** - "Keep it going!"
- 🎊 **14-day streak** - "You're on fire!"
- 🎊 **30-day streak** - "Amazing consistency!"

## 📱 Responsive Behavior

### Mobile (< 768px)
- Timeline becomes horizontal scroll
- Single column layout
- Touch-friendly day chips (32px)
- Compact stats cards

### Desktop (>= 768px)
- 2-column grid (habits left, charts right)
- Larger timeline with better spacing
- Hover effects on all interactive elements

## 🔧 Dependencies

```json
{
  "recharts": "^2.x",           // Charts
  "canvas-confetti": "^1.x",    // Celebrations
  "@types/canvas-confetti": "^1.x"
}
```

## 📋 Sample Data Export

See `habit-sample-export.json` for an example backup file structure.

## 🧑‍💻 Usage Instructions

### Adding a Habit
1. Click "Add Habit" button
2. Enter name (e.g., "Morning Exercise")
3. Choose icon emoji
4. Select category
5. Set daily target (default: 1)
6. Toggle reminder (optional)
7. Click "Create Habit"

### Tracking Progress
1. Select habit from tabs
2. Click day chip to cycle: Pending → Done → Skipped → Missed
3. Or drag across multiple days to batch update
4. Progress updates instantly
5. Streak calculated automatically

### Viewing Analytics
- Check progress ring for completion %
- View current streak with flame icon
- Check weekly bar chart for trends
- See donut chart for status distribution
- Examine heatmap for activity patterns

### Export/Import
- Export: Downloads JSON backup file
- Import: Select JSON file to restore habits

## ⚠️ Important Notes

1. **Data is local** - Stored in browser localStorage only
2. **30-day rolling window** - Older data is automatically trimmed
3. **No backend required** - Fully client-side
4. **Browser-specific** - Data doesn't sync across devices
5. **Clear cache warning** - Clearing browser data will erase habits

## 🎯 Future Enhancements (Optional)

- [ ] Add backend sync for cross-device access
- [ ] Weekly/monthly goal setting
- [ ] Habit templates library
- [ ] Social sharing of achievements
- [ ] Custom reminder notifications
- [ ] Dark mode optimized charts
- [ ] CSV export option
- [ ] Habit categories filtering
- [ ] Custom date range selection
- [ ] Achievement badges system

## 📞 Support

For issues or questions:
1. Check console for error logs
2. Verify localStorage is enabled
3. Try export/import to backup data
4. Clear cache and re-import if corrupted

---

**Built with ❤️ for TimerFlow**
