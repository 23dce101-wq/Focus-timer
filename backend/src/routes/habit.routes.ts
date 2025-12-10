import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import { Habit } from '../models/Habit.model';

const router = Router();

// Get all habits for the authenticated user
router.get('/', requireAuth, async (req, res) => {
  try {
    const userId = (req as any).userId as string;
    const habits = await Habit.find({ userId }).sort({ createdAt: 1 }).lean();
    return res.json({ habits });
  } catch (error) {
    console.error('Failed to load habits:', error);
    return res.status(500).json({ message: 'Failed to load habits' });
  }
});

// Replace all habits for the authenticated user (bulk save)
router.put('/', requireAuth, async (req, res) => {
  try {
    const userId = (req as any).userId as string;
    const { habits } = req.body as { habits?: any[] };

    if (!Array.isArray(habits)) {
      return res.status(400).json({ message: 'Invalid habits payload' });
    }

    // Remove existing habits for this user
    await Habit.deleteMany({ userId });

    if (habits.length > 0) {
      // Insert new habits. If an id/habitId is missing, generate one so validation succeeds.
      const docs = habits.map((h) => ({
        userId,
        habitId:
          (h as any).id || (h as any).habitId || `habit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: h.name,
        icon: h.icon,
        category: h.category,
        dailyTarget: h.dailyTarget,
        reminderEnabled: h.reminderEnabled,
        days: h.days,
      }));

      await Habit.insertMany(docs);
    }

    return res.status(200).json({ message: 'Habits saved' });
  } catch (error) {
    console.error('Failed to save habits:', error);
    return res.status(500).json({ message: 'Failed to save habits' });
  }
});

export default router;
