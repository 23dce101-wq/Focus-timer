import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import { TimerSession } from '../models/TimerSession.model';

const router = Router();

// Get all timer sessions for the authenticated user (optionally filtered by date range)
router.get('/', requireAuth, async (req, res) => {
  try {
    const userId = (req as any).userId as string;
    const { from, to } = req.query;

    const query: any = { userId };

    if (from || to) {
      query.timestamp = {};
      if (from) query.timestamp.$gte = new Date(from as string);
      if (to) query.timestamp.$lte = new Date(to as string);
    }

    const sessions = await TimerSession.find(query).sort({ timestamp: -1 }).lean();
    return res.json({ sessions });
  } catch (error) {
    console.error('Failed to load timer sessions:', error);
    return res.status(500).json({ message: 'Failed to load timer sessions' });
  }
});

// Create a new timer session for the authenticated user
router.post('/', requireAuth, async (req, res) => {
  try {
    const userId = (req as any).userId as string;
    const { mode, duration, timestamp } = req.body as {
      mode?: 'countdown' | 'pomodoro' | 'stopwatch';
      duration?: number;
      timestamp?: number;
    };

    if (!mode || !['countdown', 'pomodoro', 'stopwatch'].includes(mode)) {
      return res.status(400).json({ message: 'Invalid or missing mode' });
    }

    if (typeof duration !== 'number' || duration < 0) {
      return res.status(400).json({ message: 'Invalid or missing duration' });
    }

    const session = await TimerSession.create({
      userId,
      mode,
      duration,
      timestamp: timestamp ? new Date(timestamp) : new Date(),
    });

    return res.status(201).json({ session });
  } catch (error) {
    console.error('Failed to create timer session:', error);
    return res.status(500).json({ message: 'Failed to create timer session' });
  }
});

export default router;
