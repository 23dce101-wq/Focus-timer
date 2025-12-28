"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
const token_service_1 = require("../services/token.service");
function requireAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const payload = (0, token_service_1.verifyAccessToken)(token);
        req.userId = payload.userId;
        next();
    }
    catch (e) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
}
//# sourceMappingURL=auth.middleware.js.map