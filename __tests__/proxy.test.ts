/**
 * @jest-environment node
 *
 * `proxy.ts` derives its session key via Web Crypto (through `jose`), which
 * needs Node's real realm — see src/entities/auth/server/__tests__/session.crypto.test.ts.
 *
 * Deliberately do NOT override `process.env.SESSION_SECRET` here: `next/jest`
 * auto-loads the repo's `.env` (which already defines it) before this file's
 * own code runs, and `proxy.ts` captures the value once at module-import time
 * (which ESM-to-CJS compilation hoists above plain statements) — an in-file
 * override would race that capture and derive a different key than the one
 * this test's tokens are signed with.
 */

// `@/i18n` is a barrel that also re-exports `next-intl`'s client-navigation
// helpers (`use-intl`, React hooks) — none of which `proxy.ts` needs and
// which pull in a deep ESM-only dependency tree. Stub it down to the plain
// locale config that `proxy.ts` actually reads.
jest.mock('../i18n', () => ({
  i18n: jest.requireActual('../i18n/config').i18n,
}));

// `createMiddleware` is mocked below, so the real routing config's shape is
// irrelevant — avoid loading `next-intl/routing`'s ESM-only dependency tree.
jest.mock('../i18n/routing', () => ({ routing: {} }));

jest.mock('next-intl/middleware', () => ({
  __esModule: true,
  default: () => () => ({ headers: new Headers() }),
}));

import { EncryptJWT } from 'jose';
import { NextRequest } from 'next/server';
import proxy from '../proxy';

const buildRequest = (path: string, opts: { cookie?: string; acceptLanguage?: string } = {}): NextRequest => {
  const headers = new Headers();
  headers.set('accept-language', opts.acceptLanguage ?? 'en');
  if (opts.cookie) headers.set('cookie', opts.cookie);
  return new NextRequest(new URL(path, 'http://localhost'), { headers });
};

const sessionKey = async (): Promise<Uint8Array> =>
  new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(process.env.SESSION_SECRET)));

const validSessionCookie = async (): Promise<string> => {
  const token = await new EncryptJWT({ userId: 'u1' })
    .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
    .setIssuedAt()
    .setExpirationTime('1h')
    .encrypt(await sessionKey());
  return `auth_session=${token}`;
};

describe('proxy — locale redirection', () => {
  it('redirects to the negotiated locale when the pathname is missing one', async () => {
    const res = await proxy(buildRequest('/dashboard', { acceptLanguage: 'en' }));

    expect(res.status).toBe(307);
    expect(new URL(res.headers.get('location') ?? '').pathname).toBe('/en/dashboard');
  });

  it('falls back to the default locale when Accept-Language has no match', async () => {
    const res = await proxy(buildRequest('/dashboard', { acceptLanguage: 'xx' }));

    expect(new URL(res.headers.get('location') ?? '').pathname).toBe('/ru/dashboard');
  });

  it('strips an invalid two/three-letter locale-shaped prefix before redirecting', async () => {
    const res = await proxy(buildRequest('/fr/dashboard', { acceptLanguage: 'en' }));

    expect(new URL(res.headers.get('location') ?? '').pathname).toBe('/en/dashboard');
  });

  it('preserves the query string on the locale redirect', async () => {
    const res = await proxy(buildRequest('/dashboard?tab=x', { acceptLanguage: 'en' }));

    const location = new URL(res.headers.get('location') ?? '');
    expect(location.pathname).toBe('/en/dashboard');
    expect(location.search).toBe('?tab=x');
  });
});

describe('proxy — session gating', () => {
  it('redirects an unauthenticated request for a protected route to /login', async () => {
    const res = await proxy(buildRequest('/en/dashboard'));

    expect(res.status).toBe(307);
    expect(new URL(res.headers.get('location') ?? '').pathname).toBe('/en/login');
  });

  it('redirects a request with a malformed session cookie to /login', async () => {
    const res = await proxy(buildRequest('/en/dashboard', { cookie: 'auth_session=not-a-real-token' }));

    expect(new URL(res.headers.get('location') ?? '').pathname).toBe('/en/login');
  });

  it('lets an unauthenticated request through to a public auth path', async () => {
    const res = await proxy(buildRequest('/en/login'));

    expect(res.status).not.toBe(307);
  });

  it('redirects an authenticated request away from /login to the dashboard', async () => {
    const cookie = await validSessionCookie();
    const res = await proxy(buildRequest('/en/login', { cookie }));

    expect(res.status).toBe(307);
    expect(new URL(res.headers.get('location') ?? '').pathname).toBe('/en/dashboard');
  });

  it('lets an authenticated request through to a protected route', async () => {
    const cookie = await validSessionCookie();
    const res = await proxy(buildRequest('/en/dashboard', { cookie }));

    expect(res.status).not.toBe(307);
    expect(res.headers.get('Content-Language')).toBe('en');
  });
});
