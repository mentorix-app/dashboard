/**
 * @jest-environment node
 */
jest.mock('server-only', () => ({}));
jest.mock('next/headers', () => ({ cookies: jest.fn() }));
jest.mock('../signIn', () => ({ signInWithProvider: jest.fn() }));
jest.mock('../deleteAccount', () => ({ deleteAccount: jest.fn() }));

import { cookies } from 'next/headers';
import {
  acceptAppleDeletionProof,
  completeAppleAccountDeletion,
  completeAppleSignIn,
  readAppleName,
  resolveAppOrigin,
  startAppleSignIn,
  takeAppleIntent,
} from '../apple';
import { deleteAccount } from '../deleteAccount';
import { hashNonce } from '../nonce.utils';
import { signInWithProvider } from '../signIn';

const mockedCookies = cookies as jest.Mock;
const mockedSignIn = signInWithProvider as jest.MockedFunction<typeof signInWithProvider>;
const mockedDeleteAccount = deleteAccount as jest.MockedFunction<typeof deleteAccount>;

const originalEnv = { ...process.env };

/** In-memory stand-in for the request cookie store. */
const createStore = (initial: Record<string, string> = {}) => {
  const values = new Map(Object.entries(initial));
  return {
    values,
    get: jest.fn((name: string) => (values.has(name) ? { name, value: values.get(name) } : undefined)),
    set: jest.fn((name: string, value: string) => {
      values.set(name, value);
    }),
  };
};

const form = (fields: Record<string, string>): FormData => {
  const data = new FormData();
  for (const [key, value] of Object.entries(fields)) data.set(key, value);
  return data;
};

beforeEach(() => {
  jest.resetAllMocks();
  process.env.NEXT_PUBLIC_APP_URL = 'https://dashboard.example.com/';
  delete process.env.APPLE_SERVICE_ID;
});

afterAll(() => {
  process.env = originalEnv;
});

describe('resolveAppOrigin', () => {
  it('uses the configured public URL without a trailing slash', () => {
    expect(resolveAppOrigin('http://localhost:10000')).toBe('https://dashboard.example.com');
  });

  it('falls back to the request origin when no public URL is configured', () => {
    delete process.env.NEXT_PUBLIC_APP_URL;

    expect(resolveAppOrigin('http://localhost:3000')).toBe('http://localhost:3000');
  });
});

describe('startAppleSignIn', () => {
  it('stores state and the raw nonce in cross-site cookies and builds the authorization URL', async () => {
    const store = createStore();
    mockedCookies.mockResolvedValue(store);

    const url = new URL(await startAppleSignIn('http://localhost:3000'));

    expect(`${url.origin}${url.pathname}`).toBe('https://appleid.apple.com/auth/authorize');
    expect(url.searchParams.get('client_id')).toBe('com.mentorix.dashboard');
    expect(url.searchParams.get('redirect_uri')).toBe('https://dashboard.example.com/api/auth/apple/callback');
    expect(url.searchParams.get('response_type')).toBe('code id_token');
    expect(url.searchParams.get('response_mode')).toBe('form_post');
    expect(url.searchParams.get('scope')).toBe('name email');

    const state = store.values.get('apple_state');
    const rawNonce = store.values.get('apple_nonce');
    expect(url.searchParams.get('state')).toBe(state);
    expect(url.searchParams.get('nonce')).toBe(hashNonce(rawNonce ?? ''));
    expect(url.searchParams.get('nonce')).not.toBe(rawNonce);

    expect(store.set).toHaveBeenCalledWith(
      'apple_state',
      state,
      expect.objectContaining({ httpOnly: true, secure: true, sameSite: 'none', path: '/api/auth/apple', maxAge: 600 })
    );
  });

  it('spells the space of response_type and scope as %20', async () => {
    mockedCookies.mockResolvedValue(createStore());

    const url = await startAppleSignIn('http://localhost:3000');

    expect(url).toContain('response_type=code%20id_token');
    expect(url).toContain('scope=name%20email');
    expect(url).not.toContain('+');
  });

  it('lets APPLE_SERVICE_ID override the Services ID', async () => {
    process.env.APPLE_SERVICE_ID = 'com.example.web';
    mockedCookies.mockResolvedValue(createStore());

    const url = new URL(await startAppleSignIn('http://localhost:3000'));

    expect(url.searchParams.get('client_id')).toBe('com.example.web');
  });

  it('remembers what the round trip is for, signing in by default', async () => {
    const store = createStore();
    mockedCookies.mockResolvedValue(store);

    await startAppleSignIn('http://localhost:3000');
    expect(store.values.get('apple_intent')).toBe('signin');

    await startAppleSignIn('http://localhost:3000', 'delete');
    expect(store.values.get('apple_intent')).toBe('delete');
    expect(store.set).toHaveBeenCalledWith(
      'apple_intent',
      'delete',
      expect.objectContaining({ httpOnly: true, sameSite: 'none', path: '/api/auth/apple' })
    );
  });
});

describe('takeAppleIntent', () => {
  it.each([
    ['delete', 'delete'],
    ['signin', 'signin'],
    ['something else', 'signin'],
  ])('reads %p as %p and spends the cookie', async (stored, expected) => {
    const store = createStore({ apple_intent: stored });
    mockedCookies.mockResolvedValue(store);

    await expect(takeAppleIntent()).resolves.toBe(expected);
    expect(store.set).toHaveBeenCalledWith('apple_intent', '', expect.objectContaining({ maxAge: 0 }));
  });

  it('is a sign-in when there is no cookie', async () => {
    mockedCookies.mockResolvedValue(createStore());

    await expect(takeAppleIntent()).resolves.toBe('signin');
  });
});

describe('readAppleName', () => {
  it('joins the first and last name', () => {
    expect(
      readAppleName(JSON.stringify({ name: { firstName: ' Ada ', lastName: 'Lovelace' }, email: 'a@b.com' }))
    ).toBe('Ada Lovelace');
  });

  it('accepts a single name part', () => {
    expect(readAppleName(JSON.stringify({ name: { firstName: 'Ada' } }))).toBe('Ada');
  });

  it.each([null, '', 'not json', '{}', '{"name":"Ada"}', '{"name":{"firstName":" ","lastName":""}}', '[]'])(
    'returns undefined for %p',
    (value) => {
      expect(readAppleName(value)).toBeUndefined();
    }
  );
});

describe('completeAppleSignIn', () => {
  const valid = () => createStore({ apple_state: 'state-1', apple_nonce: 'raw-nonce' });

  it('signs in with the token, the raw nonce and the name from the first authorization', async () => {
    const store = valid();
    mockedCookies.mockResolvedValue(store);
    mockedSignIn.mockResolvedValue({ ok: true });

    const result = await completeAppleSignIn(
      form({
        state: 'state-1',
        id_token: 'idt',
        user: JSON.stringify({ name: { firstName: 'Ada', lastName: 'Lovelace' } }),
      })
    );

    expect(result).toEqual({ ok: true });
    expect(mockedSignIn).toHaveBeenCalledWith('apple', { id_token: 'idt', nonce: 'raw-nonce', name: 'Ada Lovelace' });
  });

  it('omits the name when Apple did not send one', async () => {
    mockedCookies.mockResolvedValue(valid());
    mockedSignIn.mockResolvedValue({ ok: true });

    await completeAppleSignIn(form({ state: 'state-1', id_token: 'idt' }));

    expect(mockedSignIn).toHaveBeenCalledWith('apple', { id_token: 'idt', nonce: 'raw-nonce' });
  });

  it('spends state and nonce whatever the outcome', async () => {
    const store = valid();
    mockedCookies.mockResolvedValue(store);
    mockedSignIn.mockResolvedValue({ ok: false, errorCode: 'invalid_token' });

    await completeAppleSignIn(form({ state: 'state-1', id_token: 'idt' }));

    expect(store.set).toHaveBeenCalledWith(
      'apple_state',
      '',
      expect.objectContaining({ maxAge: 0, path: '/api/auth/apple' })
    );
    expect(store.set).toHaveBeenCalledWith(
      'apple_nonce',
      '',
      expect.objectContaining({ maxAge: 0, path: '/api/auth/apple' })
    );
  });

  it('passes a failure of the sign-in on unchanged', async () => {
    mockedCookies.mockResolvedValue(valid());
    mockedSignIn.mockResolvedValue({ ok: false, errorCode: 'rate_limited', retryAfterSeconds: 30 });

    await expect(completeAppleSignIn(form({ state: 'state-1', id_token: 'idt' }))).resolves.toEqual({
      ok: false,
      errorCode: 'rate_limited',
      retryAfterSeconds: 30,
    });
  });

  it('refuses a state that does not match the cookie', async () => {
    mockedCookies.mockResolvedValue(valid());

    await expect(completeAppleSignIn(form({ state: 'other', id_token: 'idt' }))).resolves.toEqual({
      ok: false,
      errorCode: 'apple_failed',
    });
    expect(mockedSignIn).not.toHaveBeenCalled();
  });

  it('refuses a request without the cookies (expired or never started)', async () => {
    mockedCookies.mockResolvedValue(createStore());

    await expect(completeAppleSignIn(form({ state: 'state-1', id_token: 'idt' }))).resolves.toMatchObject({
      ok: false,
      errorCode: 'apple_failed',
    });
    expect(mockedSignIn).not.toHaveBeenCalled();
  });

  it('refuses a callback without an ID token', async () => {
    mockedCookies.mockResolvedValue(valid());

    await expect(completeAppleSignIn(form({ state: 'state-1' }))).resolves.toMatchObject({
      ok: false,
      errorCode: 'apple_failed',
    });
  });

  it('reports a cancelled authorization', async () => {
    mockedCookies.mockResolvedValue(valid());

    await expect(completeAppleSignIn(form({ state: 'state-1', error: 'user_cancelled_authorize' }))).resolves.toEqual({
      ok: false,
      errorCode: 'apple_cancelled',
    });
  });

  it('reports any other error from Apple as a failure', async () => {
    mockedCookies.mockResolvedValue(valid());

    await expect(completeAppleSignIn(form({ state: 'state-1', error: 'invalid_request' }))).resolves.toEqual({
      ok: false,
      errorCode: 'apple_failed',
    });
  });
});

describe('acceptAppleDeletionProof', () => {
  const valid = () => createStore({ apple_state: 'state-1', apple_nonce: 'raw-nonce' });

  it('keeps the ID token and the authorization code in a short-lived cookie for the deleting route', async () => {
    const store = valid();
    mockedCookies.mockResolvedValue(store);

    await expect(acceptAppleDeletionProof(form({ state: 'state-1', id_token: 'idt', code: 'c1' }))).resolves.toEqual({
      ok: true,
    });

    expect(JSON.parse(store.values.get('apple_deletion_proof') ?? '{}')).toEqual({ idToken: 'idt', code: 'c1' });
    expect(store.set).toHaveBeenCalledWith(
      'apple_deletion_proof',
      expect.any(String),
      expect.objectContaining({ httpOnly: true, sameSite: 'lax', path: '/api/auth/apple/delete', maxAge: 300 })
    );
    expect(mockedSignIn).not.toHaveBeenCalled();
  });

  it('refuses an answer without an authorization code', async () => {
    const store = valid();
    mockedCookies.mockResolvedValue(store);

    await expect(acceptAppleDeletionProof(form({ state: 'state-1', id_token: 'idt' }))).resolves.toEqual({
      ok: false,
      errorCode: 'apple_failed',
    });
    expect(store.values.has('apple_deletion_proof')).toBe(false);
  });

  it('refuses a state that does not match the cookie', async () => {
    const store = valid();
    mockedCookies.mockResolvedValue(store);

    await expect(
      acceptAppleDeletionProof(form({ state: 'other', id_token: 'idt', code: 'c1' }))
    ).resolves.toMatchObject({ ok: false, errorCode: 'apple_failed' });
    expect(store.values.has('apple_deletion_proof')).toBe(false);
  });

  it('reports a cancelled authorization', async () => {
    mockedCookies.mockResolvedValue(valid());

    await expect(
      acceptAppleDeletionProof(form({ state: 'state-1', error: 'user_cancelled_authorize' }))
    ).resolves.toEqual({ ok: false, errorCode: 'apple_cancelled' });
  });
});

describe('completeAppleAccountDeletion', () => {
  const proofCookie = JSON.stringify({ idToken: 'idt', code: 'c1' });

  it('deletes the account with the proof and the redirect address of the authorization request', async () => {
    const store = createStore({ apple_deletion_proof: proofCookie });
    mockedCookies.mockResolvedValue(store);
    mockedDeleteAccount.mockResolvedValue({ ok: true });

    await expect(completeAppleAccountDeletion('http://localhost:3000')).resolves.toEqual({ ok: true });

    expect(mockedDeleteAccount).toHaveBeenCalledWith({
      apple_id_token: 'idt',
      apple_authorization_code: 'c1',
      apple_redirect_uri: 'https://dashboard.example.com/api/auth/apple/callback',
    });
  });

  it('spends the proof whatever the outcome', async () => {
    const store = createStore({ apple_deletion_proof: proofCookie });
    mockedCookies.mockResolvedValue(store);
    mockedDeleteAccount.mockResolvedValue({ ok: false, errorCode: 'apple_mismatch' });

    await expect(completeAppleAccountDeletion('http://localhost:3000')).resolves.toEqual({
      ok: false,
      errorCode: 'apple_mismatch',
    });

    expect(store.set).toHaveBeenCalledWith(
      'apple_deletion_proof',
      '',
      expect.objectContaining({ maxAge: 0, path: '/api/auth/apple/delete' })
    );
  });

  it.each([undefined, '', 'not json', '{}', '{"idToken":"x"}', '{"idToken":"","code":"c"}', '[]'])(
    'fails without calling the API when the proof is %p',
    async (value) => {
      mockedCookies.mockResolvedValue(createStore(value === undefined ? {} : { apple_deletion_proof: value }));

      await expect(completeAppleAccountDeletion('http://localhost:3000')).resolves.toEqual({
        ok: false,
        errorCode: 'apple_failed',
      });
      expect(mockedDeleteAccount).not.toHaveBeenCalled();
    }
  );
});
