"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signup = signup;
exports.login = login;
exports.refresh = refresh;
exports.me = me;
exports.googleLogin = googleLogin;
const google_auth_library_1 = require("google-auth-library");
const User_model_1 = require("../models/User.model");
const token_service_1 = require("../services/token.service");
const googleClient = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
async function signup(req, res) {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        const existing = await User_model_1.User.findOne({ email });
        if (existing)
            return res.status(409).json({ message: 'Email already in use' });
        const user = await User_model_1.User.create({ name, email, password, provider: 'email' });
        const accessToken = (0, token_service_1.signAccessToken)({ userId: user._id.toString() });
        const refreshToken = (0, token_service_1.signRefreshToken)({ userId: user._id.toString() });
        return res.status(201).json({
            user: { id: user._id, name: user.name, email: user.email },
            tokens: { accessToken, refreshToken },
        });
    }
    catch (err) {
        return res.status(500).json({ message: 'Signup failed' });
    }
}
async function login(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Missing email or password' });
        }
        const user = await User_model_1.User.findOne({ email });
        if (!user)
            return res.status(401).json({ message: 'Invalid credentials' });
        const ok = await user.comparePassword(password);
        if (!ok)
            return res.status(401).json({ message: 'Invalid credentials' });
        const accessToken = (0, token_service_1.signAccessToken)({ userId: user._id.toString() });
        const refreshToken = (0, token_service_1.signRefreshToken)({ userId: user._id.toString() });
        return res.status(200).json({
            user: { id: user._id, name: user.name, email: user.email },
            tokens: { accessToken, refreshToken },
        });
    }
    catch (err) {
        return res.status(500).json({ message: 'Login failed' });
    }
}
async function refresh(req, res) {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken)
            return res.status(400).json({ message: 'Missing refresh token' });
        const payload = (0, token_service_1.verifyRefreshToken)(refreshToken);
        const accessToken = (0, token_service_1.signAccessToken)({ userId: payload.userId });
        const newRefreshToken = (0, token_service_1.signRefreshToken)({ userId: payload.userId });
        return res.status(200).json({ tokens: { accessToken, refreshToken: newRefreshToken } });
    }
    catch (err) {
        return res.status(401).json({ message: 'Invalid refresh token' });
    }
}
async function me(req, res) {
    try {
        const userId = req.userId;
        const user = await User_model_1.User.findById(userId).select('name email');
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        return res.status(200).json({ user: { id: user._id, name: user.name, email: user.email } });
    }
    catch (err) {
        return res.status(500).json({ message: 'Failed to load profile' });
    }
}
async function googleLogin(req, res) {
    try {
        const { token } = req.body;
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
        let user = await User_model_1.User.findOne({ email });
        if (!user) {
            user = await User_model_1.User.create({
                email,
                name,
                avatar,
                provider: 'google',
                googleId,
            });
        }
        else {
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
        const accessToken = (0, token_service_1.signAccessToken)({ userId: user._id.toString() });
        const refreshToken = (0, token_service_1.signRefreshToken)({ userId: user._id.toString() });
        return res.status(200).json({
            user: { id: user._id, name: user.name, email: user.email },
            tokens: { accessToken, refreshToken },
        });
    }
    catch (err) {
        console.error('Google login error:', err);
        return res.status(500).json({ message: 'Google login failed' });
    }
}
//# sourceMappingURL=auth.controller.js.map