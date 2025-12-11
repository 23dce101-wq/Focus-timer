import { Router, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import validator from 'validator';
import { sendContactEmail } from '../services/mail.service';

const router = Router();

const contactLimiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 60_000,
  max: Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 6,
  standardHeaders: true,
  legacyHeaders: false,
});

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200, 'Name is too long'),
  email: z.string().email('A valid email is required'),
  subject: z
    .string()
    .max(200, 'Subject is too long')
    .optional()
    .or(z.literal('')),
  message: z.string().min(5, 'Message must be at least 5 characters').max(5000, 'Message is too long'),
});

router.post('/contact', contactLimiter, async (req: Request, res: Response) => {
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

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        ok: false,
        errors: [{ field: 'email', message: 'Please provide a valid email address' }],
      });
    }

    await sendContactEmail({ name, email, subject: subject || undefined, message });

    return res.status(201).json({ ok: true, message: 'Message delivered' });
  } catch (error) {
    console.error('Error handling contact form submission:', error);
    return res.status(500).json({ ok: false, message: 'Server error' });
  }
});

export default router;
