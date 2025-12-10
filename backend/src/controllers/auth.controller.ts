import { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import { User } from '../models/User.model';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../services/token.service';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function signup(req: Request, res: Response) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Email already in use' });

    const user = await User.create({ name, email, password, provider: 'email' });
    const accessToken = signAccessToken({ userId: user._id.toString() });
    const refreshToken = signRefreshToken({ userId: user._id.toString() });

    return res.status(201).json({
      user: { id: user._id, name: user.name, email: user.email },
      tokens: { accessToken, refreshToken },
    });
  } catch (err) {
    return res.status(500).json({ message: 'Signup failed' });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Missing email or password' });
    }
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const ok = await user.comparePassword(password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const accessToken = signAccessToken({ userId: user._id.toString() });
    const refreshToken = signRefreshToken({ userId: user._id.toString() });

    return res.status(200).json({
      user: { id: user._id, name: user.name, email: user.email },
      tokens: { accessToken, refreshToken },
    });
  } catch (err) {
    return res.status(500).json({ message: 'Login failed' });
  }
}

export async function refresh(req: Request, res: Response) {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ message: 'Missing refresh token' });
    const payload = verifyRefreshToken(refreshToken);
    const accessToken = signAccessToken({ userId: payload.userId });
    const newRefreshToken = signRefreshToken({ userId: payload.userId });
    return res.status(200).json({ tokens: { accessToken, refreshToken: newRefreshToken } });
  } catch (err) {
    return res.status(401).json({ message: 'Invalid refresh token' });
  }
}

export async function me(req: Request, res: Response) {
  try {
    const userId = (req as any).userId as string;
    const user = await User.findById(userId).select('name email');
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.status(200).json({ user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to load profile' });
  }
}

export async function googleLogin(req: Request, res: Response) {
  try {
    const { token } = req.body as { token?: string };
    if (!token) {
      return res.status(400).json({ message: 'Missing Google token' });
    }

    if (!process.env.GOOGLE_CLIENT_ID) {
      return res.status(500).json({ message: 'Google client ID not configured on server' });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload || !payload.email || !payload.sub) {
      return res.status(400).json({ message: 'Invalid Google token payload' });
    }

    const email = payload.email;
    const googleId = payload.sub;
    const name = payload.name || email.split('@')[0];
    const avatar = payload.picture;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        email,
        name,
        avatar,
        provider: 'google',
        googleId,
      });
    } else {
      if (!user.googleId) {
        user.googleId = googleId;
      }
      if (!user.avatar && avatar) {
        user.avatar = avatar;
      }
      if (user.provider !== 'google') {
        user.provider = 'google';
      }
      await user.save();
    }

    const accessToken = signAccessToken({ userId: user._id.toString() });
    const refreshToken = signRefreshToken({ userId: user._id.toString() });

    return res.status(200).json({
      user: { id: user._id, name: user.name, email: user.email },
      tokens: { accessToken, refreshToken },
    });
  } catch (err) {
    console.error('Google login error:', err);
    return res.status(500).json({ message: 'Google login failed' });
  }
}
