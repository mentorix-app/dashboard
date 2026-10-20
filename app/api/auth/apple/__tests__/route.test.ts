/**
 * @jest-environment node
 *
 * Route handlers need the Fetch API globals (`Request`/`Response`/`FormData`).
 */
jest.mock('../../../../../src/entities/auth/server/apple', () => ({
  startAppleSignIn: jest.fn(),
  completeAppleSignIn: jest.fn(),
  acceptAppleDeletionProof: jest.fn(),
  completeAppleAccountDeletion: jest.fn(),
  takeAppleIntent: jest.fn(),
  resolveAppOrigin: jest.fn((fallback: string) => fallback),
}));
jest.mock('../../../../../src/entities/auth/server/dal', () => ({ getSession: jest.fn() }));

import { NextRequest } from 'next/server';
import {
  acceptAppleDeletionProof,
  completeAppleAccountDeletion,
  completeAppleSignIn,
  resolveAppOrigin,
  startAppleSignIn,
  takeAppleIntent,
} from '../../../../../src/entities/auth/server/apple';
import { getSession } from '../../../../../src/entities/auth/server/dal';
import { POST as callbackRoute } from '../callback/route';
import { GET as deleteRoute } from '../delete/route';
import { GET as startRoute } from '../start/route';

const mockedStart = startAppleSignIn as jest.Mock;
const mockedComplete = completeAppleSignIn as jest.Mock;
const mockedAcceptProof = acceptAppleDeletionProof as jest.Mock;
const mockedCompleteDeletion = completeAppleAccountDeletion as jest.Mock;
const mockedIntent = takeAppleIntent as jest.Mock;
const mockedOrigin = resolveAppOrigin as jest.Mock;
const mockedGetSession = getSession as jest.Mock;

const origin = 'https://dashboard.example.com';

const callbackRequest = (body: string, contentType = 'application/x-www-form-urlencoded'): NextRequest =>
  new NextRequest(`${origin}/api/auth/apple/callback`, {
    method: 'POST',
    headers: { 'content-type': contentType },
    body,
  });

beforeEach(() => {
  jest.resetAllMocks();
  mockedOrigin.mockImplementation((fallback: string) => fallback);
  mockedIntent.mockResolvedValue('signin');
});

describe('GET /api/auth/apple/start', () => {
  it('redirects the browser to the Apple authorization URL', async () => {
    mockedStart.mockResolvedValue('https://appleid.apple.com/auth/authorize?client_id=x');

    const res = await startRoute(new NextRequest(`${origin}/api/auth/apple/start`));

    expect(mockedStart).toHaveBeenCalledWith(origin);
    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toBe('https://appleid.apple.com/auth/authorize?client_id=x');
  });

  it('starts a fresh authorization for deleting the account when somebody is signed in', async () => {
    mockedGetSession.mockResolvedValue({ userId: 'u1' });
    mockedStart.mockResolvedValue('https://appleid.apple.com/auth/authorize?client_id=x');

    const res = await startRoute(new NextRequest(`${origin}/api/auth/apple/start?intent=delete`));

    expect(mockedStart).toHaveBeenCalledWith(origin, 'delete');
    expect(res.headers.get('location')).toBe('https://appleid.apple.com/auth/authorize?client_id=x');
  });

  it('sends a visitor who is not signed in to the login page instead of asking Apple', async () => {
    mockedGetSession.mockResolvedValue(null);

    const res = await startRoute(new NextRequest(`${origin}/api/auth/apple/start?intent=delete`));

    expect(mockedStart).not.toHaveBeenCalled();
    expect(res.status).toBe(303);
    expect(res.headers.get('location')).toBe(`${origin}/login`);
  });

  it('treats any other intent as a sign-in', async () => {
    mockedStart.mockResolvedValue('https://appleid.apple.com/auth/authorize?client_id=x');

    await startRoute(new NextRequest(`${origin}/api/auth/apple/start?intent=whatever`));

    expect(mockedStart).toHaveBeenCalledWith(origin);
    expect(mockedGetSession).not.toHaveBeenCalled();
  });
});

describe('POST /api/auth/apple/callback', () => {
  it('answers a successful sign-in with a 303 to the dashboard', async () => {
    mockedComplete.mockResolvedValue({ ok: true });

    const res = await callbackRoute(callbackRequest('state=s&id_token=t'));

    expect(res.status).toBe(303);
    expect(res.headers.get('location')).toBe(`${origin}/dashboard`);
  });

  it('hands the posted form to the sign-in', async () => {
    mockedComplete.mockResolvedValue({ ok: true });

    await callbackRoute(callbackRequest('state=s&id_token=t'));

    const form = mockedComplete.mock.calls[0][0] as FormData;
    expect(form.get('state')).toBe('s');
    expect(form.get('id_token')).toBe('t');
  });

  it('sends a failed sign-in back to the login page with its code', async () => {
    mockedComplete.mockResolvedValue({ ok: false, errorCode: 'rate_limited' });

    const res = await callbackRoute(callbackRequest('state=s&id_token=t'));

    expect(res.status).toBe(303);
    expect(res.headers.get('location')).toBe(`${origin}/login?error=rate_limited`);
  });

  it('treats a body that is not a form as a failed Apple sign-in', async () => {
    const res = await callbackRoute(callbackRequest('{"a":1}', 'application/json'));

    expect(mockedComplete).not.toHaveBeenCalled();
    expect(res.headers.get('location')).toBe(`${origin}/login?error=apple_failed`);
  });

  describe('when the round trip was a fresh authorization to delete the account', () => {
    beforeEach(() => mockedIntent.mockResolvedValue('delete'));

    it('keeps Apple’s answer and goes on to the route that deletes the account', async () => {
      mockedAcceptProof.mockResolvedValue({ ok: true });

      const res = await callbackRoute(callbackRequest('state=s&id_token=t&code=c'));

      const form = mockedAcceptProof.mock.calls[0][0] as FormData;
      expect(form.get('code')).toBe('c');
      expect(mockedComplete).not.toHaveBeenCalled();
      expect(res.status).toBe(303);
      expect(res.headers.get('location')).toBe(`${origin}/api/auth/apple/delete`);
    });

    it('passes a failure on to that route, which can find the signed-in person', async () => {
      mockedAcceptProof.mockResolvedValue({ ok: false, errorCode: 'apple_cancelled' });

      const res = await callbackRoute(callbackRequest('state=s&error=user_cancelled_authorize'));

      expect(res.headers.get('location')).toBe(`${origin}/api/auth/apple/delete?error=apple_cancelled`);
    });

    it('treats a body that is not a form as a failure', async () => {
      const res = await callbackRoute(callbackRequest('{"a":1}', 'application/json'));

      expect(mockedAcceptProof).not.toHaveBeenCalled();
      expect(res.headers.get('location')).toBe(`${origin}/api/auth/apple/delete?error=apple_failed`);
    });
  });
});

describe('GET /api/auth/apple/delete', () => {
  const request = (query = '') => new NextRequest(`${origin}/api/auth/apple/delete${query}`);

  it('deletes the account and answers with a 303 to the login page', async () => {
    mockedCompleteDeletion.mockResolvedValue({ ok: true });

    const res = await deleteRoute(request());

    expect(mockedCompleteDeletion).toHaveBeenCalledWith(origin);
    expect(res.status).toBe(303);
    expect(res.headers.get('location')).toBe(`${origin}/login?deleted=1`);
  });

  it('sends a failure back to the account page of the signed-in person with its code', async () => {
    mockedCompleteDeletion.mockResolvedValue({ ok: false, errorCode: 'apple_mismatch' });
    mockedGetSession.mockResolvedValue({ userId: 'u1' });

    const res = await deleteRoute(request());

    expect(res.headers.get('location')).toBe(`${origin}/user/u1/account?deleteError=apple_mismatch`);
  });

  it('sends a failure to the login page when nobody is signed in any more', async () => {
    mockedCompleteDeletion.mockResolvedValue({ ok: false, errorCode: 'session_expired' });
    mockedGetSession.mockResolvedValue(null);

    const res = await deleteRoute(request());

    expect(res.headers.get('location')).toBe(`${origin}/login`);
  });

  it('shows a failure the callback already found without trying to delete anything', async () => {
    mockedGetSession.mockResolvedValue({ userId: 'u1' });

    const res = await deleteRoute(request('?error=apple_cancelled'));

    expect(mockedCompleteDeletion).not.toHaveBeenCalled();
    expect(res.headers.get('location')).toBe(`${origin}/user/u1/account?deleteError=apple_cancelled`);
  });

  it('ignores an error value that is not a known code', async () => {
    mockedCompleteDeletion.mockResolvedValue({ ok: true });

    await deleteRoute(request('?error=<script>'));

    expect(mockedCompleteDeletion).toHaveBeenCalledTimes(1);
  });
});
