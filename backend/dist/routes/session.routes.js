"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const TimerSession_model_1 = require("../models/TimerSession.model");
const router = (0, express_1.Router)();
// Get all timer sessions for the authenticated user (optionally filtered by date range)
router.get('/', auth_middleware_1.requireAuth, async (req, res) => {
    try {
        const userId = req.userId;
        const { from, to } = req.query;
        const query = { userId };
        if (from || to) {
            query.timestamp = {};
            if (from)
                query.timestamp.$gte = new Date(from);
            if (to)
                query.timestamp.$lte = new Date(to);
        }
        const sessions = await TimerSession_model_1.TimerSession.find(query).sort({ timestamp: -1 }).lean();
        return res.json({ sessions });
    }
    catch (error) {
        console.error('Failed to load timer sessions:', error);
        return res.status(500).json({ message: 'Failed to load timer sessions' });
    }
});
// Create a new timer session for the authenticated user
router.post('/', auth_middleware_1.requireAuth, async (req, res) => {
    try {
        const userId = req.userId;
        const { mode, duration, timestamp } = req.body;
        if (!mode || !['countdown', 'pomodoro', 'stopwatch'].includes(mode)) {
            return res.status(400).json({ message: 'Invalid or missing mode' });
        }
        if (typeof duration !== 'number' || duration < 0) {
            return res.status(400).json({ message: 'Invalid or missing duration' });
        }
        const session = await TimerSession_model_1.TimerSession.create({
            userId,
            mode,
            duration,
            timestamp: timestamp ? new Date(timestamp) : new Date(),
        });
        return res.status(201).json({ session });
    }
    catch (error) {
        console.error('Failed to create timer session:', error);
        return res.status(500).json({ message: 'Failed to create timer session' });
    }
});
exports.default = router;
//# sourceMappingURL=session.routes.js.map