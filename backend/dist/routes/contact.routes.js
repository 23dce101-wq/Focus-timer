"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const zod_1 = require("zod");
const validator_1 = __importDefault(require("validator"));
const mail_service_1 = require("../services/mail.service");
const router = (0, express_1.Router)();
const contactLimiter = (0, express_rate_limit_1.default)({
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 60000,
    max: Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 6,
    standardHeaders: true,
    legacyHeaders: false,
});
const contactSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Name is required').max(200, 'Name is too long'),
    email: zod_1.z.string().email('A valid email is required'),
    subject: zod_1.z
        .string()
        .max(200, 'Subject is too long')
        .optional()
        .or(zod_1.z.literal('')),
    message: zod_1.z.string().min(5, 'Message must be at least 5 characters').max(5000, 'Message is too long'),
});
router.post('/contact', contactLimiter, async (req, res) => {
    try {
        const parseResult = contactSchema.safeParse(req.body);
        if (!parseResult.success) {
            const errors = parseResult.error.issues.map((issue) => ({
                field: issue.path.join('.') || 'form',
                message: issue.message,
            }));
            return res.status(400).json({ ok: false, errors });
        }
        const { name, email, subject, message } = parseResult.data;
        if (!validator_1.default.isEmail(email)) {
            return res.status(400).json({
                ok: false,
                errors: [{ field: 'email', message: 'Please provide a valid email address' }],
            });
        }
        await (0, mail_service_1.sendContactEmail)({ name, email, subject: subject || undefined, message });
        return res.status(201).json({ ok: true, message: 'Message delivered' });
    }
    catch (error) {
        console.error('Error handling contact form submission:', error);
        return res.status(500).json({ ok: false, message: 'Server error' });
    }
});
exports.default = router;
//# sourceMappingURL=contact.routes.js.map