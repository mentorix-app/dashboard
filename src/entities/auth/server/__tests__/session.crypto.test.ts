/**
 * @jest-environment node
 *
 * jsdom's global realm doesn't share Node's Web Crypto ArrayBuffer/Uint8Array
 * identity, which breaks `jose`'s `instanceof Uint8Array` checks. This module
 * is pure Node crypto logic with no DOM dependency, so run it under the real
 * Node test environment instead.
 */

process.env.SESSION_SECRET = 'test-session-secret';

jest.mock('server-only', () => ({}));

import { EncryptJWT } from 'jose';
import { decryptSession, encryptSession } from '../session.crypto';
import type { AuthSession } from '../session.types';

const session: AuthSession = {
  accessToken: 'access-1',
  accessExpiresAt: new Date(Date.now() + 900_000).toISOString(),
  refreshToken: 'refresh-1',
  refreshExpiresAt: new Date(Date.now() + 3_600_000).toISOString(),
  userId: 'u1',
  email: 'a@b.com',
};

const getKey = async (): Promise<Uint8Array> =>
  new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(process.env.SESSION_SECRET)));

describe('encryptSession / decryptSession', () => {
  it('round-trips a session through JWE encryption', async () => {
    const token = await encryptSession(session);
    expect(typeof token).toBe('string');

    await expect(decryptSession(token)).resolves.toEqual(session);
  });

  it('returns null for a malformed token', async () => {
    await expect(decryptSession('not-a-jwe')).resolves.toBeNull();
  });

  it('returns null when the decrypted payload is missing required fields', async () => {
    const key = await getKey();
    const token = await new EncryptJWT({ accessToken: 'only-this-field' })
      .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
      .setIssuedAt()
      .setExpirationTime(Math.floor(Date.now() / 1_000) + 3_600)
      .encrypt(key);

    await expect(decryptSession(token)).resolves.toBeNull();
  });

  it('returns null for an expired token', async () => {
    const expired: AuthSession = { ...session, refreshExpiresAt: new Date(Date.now() - 1_000).toISOString() };
    const token = await encryptSession(expired);

    await expect(decryptSession(token)).resolves.toBeNull();
  });
});
