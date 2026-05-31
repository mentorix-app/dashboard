import 'server-only';

import { SignJWT, jwtVerify } from 'jose';

import type { AuthSession } from './session.types';

const SECRET = process.env.SESSION_SECRET;
if (!SECRET) {
  throw new Error('SESSION_SECRET env var is required');
}

const KEY = new TextEncoder().encode(SECRET);
const ALG = 'HS256';

export const encryptSession = async (session: AuthSession): Promise<string> => {
  const expSeconds = Math.floor(new Date(session.expiresAt).getTime() / 1000);
  return new SignJWT({ ...session })
    .setProtectedHeader({ alg: ALG })
    .setIssuedAt()
    .setExpirationTime(expSeconds)
    .sign(KEY);
};

export const decryptSession = async (token: string): Promise<AuthSession | null> => {
  try {
    const { payload } = await jwtVerify(token, KEY, { algorithms: [ALG] });
    if (
      typeof payload.accessToken === 'string' &&
      typeof payload.expiresAt === 'string' &&
      typeof payload.userId === 'string' &&
      typeof payload.email === 'string'
    ) {
      return {
        accessToken: payload.accessToken,
        expiresAt: payload.expiresAt,
        userId: payload.userId,
        email: payload.email,
      };
    }
    return null;
  } catch {
    return null;
  }
};
