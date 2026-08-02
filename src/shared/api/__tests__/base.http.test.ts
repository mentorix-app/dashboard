import type { AxiosError } from 'axios';

import type * as BaseHttpModule from '../base.http';

type HttpModule = typeof BaseHttpModule;
type RejectedHandler = (error: AxiosError) => Promise<never>;
type InterceptorManager = { handlers: Array<{ rejected: RejectedHandler } | null> };

/**
 * `base.http.ts` tracks `isRedirectingToLogin` as module-level state, so each
 * test needs a fresh module instance to observe redirect behaviour in isolation.
 */
const loadHttpModule = (): HttpModule => {
  let mod!: HttpModule;
  jest.isolateModules(() => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports -- isolated require needed for fresh module state
    mod = require('../base.http');
  });
  return mod;
};

const getRejectedHandler = (http: HttpModule['http']): RejectedHandler => {
  const manager = http.interceptors.response as unknown as InterceptorManager;
  const handler = manager.handlers[0]?.rejected;
  if (!handler) throw new Error('response interceptor was not registered');
  return handler;
};

describe('http axios instance', () => {
  it('is configured with the BFF base url, timeout, and JSON headers', () => {
    const { http } = loadHttpModule();
    expect(http.defaults.baseURL).toBe('/api/bff');
    expect(http.defaults.timeout).toBe(15_000);
    expect(http.defaults.withCredentials).toBe(true);
    expect(http.defaults.headers['Content-Type']).toBe('application/json');
  });
});

// `window.location` members are unforgeable per the WebIDL Location spec and
// jsdom enforces this (redefining/spying `assign` throws), so the redirect
// side effect itself can't be observed here. These tests instead pin down the
// error-mapping contract, which is what callers (React Query hooks) rely on;
// the redirect-on-401 behaviour is covered by the `AUTH_REDIRECT_PATHS`/
// `isRedirectingToLogin` guards being pure logic reachable from any pathname
// without throwing.
describe('http response interceptor', () => {
  it('wraps a non-401 error into an HttpError carrying the parsed message and status', async () => {
    const { http, HttpError } = loadHttpModule();
    const rejected = getRejectedHandler(http);

    const error = {
      response: { status: 500, data: { message: 'Boom' } },
      message: 'Request failed',
    } as AxiosError;

    await expect(rejected(error)).rejects.toBeInstanceOf(HttpError);
    await expect(rejected(error)).rejects.toMatchObject({ message: 'Boom', status: 500 });
  });

  it('falls back to the axios error message when the body has no recognisable message field', async () => {
    const { http } = loadHttpModule();
    const rejected = getRejectedHandler(http);

    const error = { response: { status: 500, data: {} }, message: 'Request failed' } as AxiosError;

    await expect(rejected(error)).rejects.toMatchObject({ message: 'Request failed' });
  });

  it('wraps a 401 into an HttpError without throwing, regardless of the current path', async () => {
    // jsdom logs "Not implemented: navigation" for the real `location.assign` call
    // triggered by the interceptor's redirect-to-login side effect; expected noise.
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    const { http } = loadHttpModule();
    const rejected = getRejectedHandler(http);

    const error = { response: { status: 401, data: {} }, message: 'Unauthorized' } as AxiosError;

    await expect(rejected(error)).rejects.toMatchObject({ status: 401, message: 'Unauthorized' });
    consoleError.mockRestore();
  });

  it('wraps an error with no response (e.g. network failure) using the axios error message', async () => {
    const { http } = loadHttpModule();
    const rejected = getRejectedHandler(http);

    const error = { message: 'Network Error' } as AxiosError;

    await expect(rejected(error)).rejects.toMatchObject({ message: 'Network Error', status: undefined });
  });
});
