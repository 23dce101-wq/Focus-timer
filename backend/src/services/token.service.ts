import jwt from 'jsonwebtoken';

const ACCESS_TOKEN_EXPIRES_IN = '15m';
const REFRESH_TOKEN_EXPIRES_IN = '7d';

export interface JwtPayload {
  userId: string;
}

export function signAccessToken(payload: JwtPayload) {
  const secret = process.env.JWT_ACCESS_SECRET!;
  return jwt.sign(payload, secret, { expiresIn: ACCESS_TOKEN_EXPIRES_IN });
}

export function signRefreshToken(payload: JwtPayload) {
  const secret = process.env.JWT_REFRESH_SECRET!;
  return jwt.sign(payload, secret, { expiresIn: REFRESH_TOKEN_EXPIRES_IN });
}

export function verifyAccessToken(token: string): JwtPayload {
  const secret = process.env.JWT_ACCESS_SECRET!;
  return jwt.verify(token, secret) as JwtPayload;
}

export function verifyRefreshToken(token: string): JwtPayload {
  const secret = process.env.JWT_REFRESH_SECRET!;
  return jwt.verify(token, secret) as JwtPayload;
}
