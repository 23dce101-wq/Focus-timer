"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signAccessToken = signAccessToken;
exports.signRefreshToken = signRefreshToken;
exports.verifyAccessToken = verifyAccessToken;
exports.verifyRefreshToken = verifyRefreshToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ACCESS_TOKEN_EXPIRES_IN = '15m';
const REFRESH_TOKEN_EXPIRES_IN = '7d';
function signAccessToken(payload) {
    const secret = process.env.JWT_ACCESS_SECRET;
    return jsonwebtoken_1.default.sign(payload, secret, { expiresIn: ACCESS_TOKEN_EXPIRES_IN });
}
function signRefreshToken(payload) {
    const secret = process.env.JWT_REFRESH_SECRET;
    return jsonwebtoken_1.default.sign(payload, secret, { expiresIn: REFRESH_TOKEN_EXPIRES_IN });
}
function verifyAccessToken(token) {
    const secret = process.env.JWT_ACCESS_SECRET;
    return jsonwebtoken_1.default.verify(token, secret);
}
function verifyRefreshToken(token) {
    const secret = process.env.JWT_REFRESH_SECRET;
    return jsonwebtoken_1.default.verify(token, secret);
}
//# sourceMappingURL=token.service.js.map