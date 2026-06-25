import 'server-only';

import { EncryptJWT, jwtDecrypt } from 'jose';

import type { AuthSession } from './session.types';

const SECRET = process.env.SESSION_SECRET;
if (!SECRET) {
  throw new Error('SESSION_SECRET env var is required');
}

/** Direct symmetric encryption (JWE): the derived key encrypts the payload itself. */
const ALG = 'dir';
const ENC = 'A256GCM';

/**
 * Derives a 32-byte (256-bit) key from SESSION_SECRET via SHA-256 so the secret
 * can be any length. Uses Web Crypto so the same derivation works in the Node
 * and Edge runtimes. Memoised after the first call.
 */
let keyPromise: Promise<Uint8Array> | null = null;
const getKey = (): Promise<Uint8Array> => {
  if (!keyPromise) {
    keyPromise = crypto.subtle
      .digest('SHA-256', new TextEncoder().encode(SECRET))
      .then((buffer) => new Uint8Array(buffer));
  }
  return keyPromise;
};

export const encryptSession = async (session: AuthSession): Promise<string> => {
  const key = await getKey();
  const expSeconds = Math.floor(new Date(session.refreshExpiresAt).getTime() / 1000);
  return new EncryptJWT({ ...session })
    .setProtectedHeader({ alg: ALG, enc: ENC })
    .setIssuedAt()
    .setExpirationTime(expSeconds)
    .encrypt(key);
};

export const decryptSession = async (token: string): Promise<AuthSession | null> => {
  try {
    const key = await getKey();
    const { payload } = await jwtDecrypt(token, key, {
      contentEncryptionAlgorithms: [ENC],
      keyManagementAlgorithms: [ALG],
    });
    if (
      typeof payload.accessToken === 'string' &&
      typeof payload.accessExpiresAt === 'string' &&
      typeof payload.refreshToken === 'string' &&
      typeof payload.refreshExpiresAt === 'string' &&
      typeof payload.userId === 'string' &&
      typeof payload.email === 'string'
    ) {
      return {
        accessToken: payload.accessToken,
        accessExpiresAt: payload.accessExpiresAt,
        refreshToken: payload.refreshToken,
        refreshExpiresAt: payload.refreshExpiresAt,
        userId: payload.userId,
        email: payload.email,
      };
    }
    return null;
  } catch {
    return null;
  }
};
