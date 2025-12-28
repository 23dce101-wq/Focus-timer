"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const Habit_model_1 = require("../models/Habit.model");
const router = (0, express_1.Router)();
// Get all habits for the authenticated user
router.get('/', auth_middleware_1.requireAuth, async (req, res) => {
    try {
        const userId = req.userId;
        // Do not use .lean() so the Habit schema's toJSON transform runs
        const docs = await Habit_model_1.Habit.find({ userId }).sort({ createdAt: 1 });
        const habits = docs.map((doc) => doc.toJSON());
        return res.json({ habits });
    }
    catch (error) {
        console.error('Failed to load habits:', error);
        return res.status(500).json({ message: 'Failed to load habits' });
    }
});
// Replace all habits for the authenticated user (bulk save)
router.put('/', auth_middleware_1.requireAuth, async (req, res) => {
    try {
        const userId = req.userId;
        const { habits } = req.body;
        if (!Array.isArray(habits)) {
            return res.status(400).json({ message: 'Invalid habits payload' });
        }
        // Remove existing habits for this user
        await Habit_model_1.Habit.deleteMany({ userId });
        if (habits.length > 0) {
            // Insert new habits. If an id/habitId is missing, generate one so validation succeeds.
            const docs = habits.map((h) => ({
                userId,
                habitId: h.id || h.habitId || `habit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                name: h.name,
                icon: h.icon,
                category: h.category,
                dailyTarget: h.dailyTarget,
                reminderEnabled: h.reminderEnabled,
                days: h.days,
            }));
            await Habit_model_1.Habit.insertMany(docs);
        }
        return res.status(200).json({ message: 'Habits saved' });
    }
    catch (error) {
        console.error('Failed to save habits:', error);
        return res.status(500).json({ message: 'Failed to save habits' });
    }
});
exports.default = router;
//# sourceMappingURL=habit.routes.js.map