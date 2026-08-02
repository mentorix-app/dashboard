/**
 * @jest-environment node
 *
 * Transitively imports `jose` via `./session.crypto` (module-scope `TextEncoder`
 * usage), which jsdom's realm doesn't provide. See session.crypto.test.ts.
 */

process.env.SESSION_SECRET ??= 'test-session-secret';

jest.mock('server-only', () => ({}));
jest.mock('next/headers', () => ({ cookies: jest.fn() }));
jest.mock('next/navigation', () => ({ redirect: jest.fn() }));

import * as dal from '../dal';

describe('dal barrel', () => {
  it('re-exports the session server API', () => {
    expect(typeof dal.getSession).toBe('function');
    expect(typeof dal.requireSession).toBe('function');
    expect(typeof dal.deleteSessionCookie).toBe('function');
    expect(typeof dal.forceRefresh).toBe('function');
    expect(typeof dal.refreshSessionIfNeeded).toBe('function');
  });
});
