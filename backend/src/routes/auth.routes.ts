import { Router } from 'express';
import { login, signup, refresh, me, googleLogin } from '../controllers/auth.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/google', googleLogin);
router.get('/me', requireAuth, me);

export default router;
