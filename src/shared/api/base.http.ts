import axios, { type AxiosError, type AxiosInstance } from 'axios';

import { BFF_BASE_URL, TIMEOUT_MS } from './base.constants';
import { messageFromErrorBody } from './base.utils';

export class HttpError extends Error {
  readonly status?: number;
  readonly cause?: AxiosError;

  constructor(message: string, cause?: AxiosError) {
    super(message);
    this.name = 'HttpError';
    this.status = cause?.response?.status;
    this.cause = cause;
  }
}

export const http: AxiosInstance = axios.create({
  baseURL: BFF_BASE_URL,
  timeout: TIMEOUT_MS,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
  // Serialize array params as repeated keys (e.g. `type=a&type=b`) for the Go backend.
  paramsSerializer: { indexes: null },
});

// Auth paths where a 401 is expected (e.g. the /auth/me probe on the login
// page); redirecting from here would loop. Locale prefixes are ignored via
// `includes` on the trailing segment.
const AUTH_REDIRECT_PATHS = ['/login', '/signup', '/forgot-password'];

// Guards against redirect spam: once a 401 triggers navigation, further 401s
// (retries, parallel queries) must not queue more `assign` calls, which would
// otherwise lock the UI in a reload storm.
let isRedirectingToLogin = false;

const redirectToLogin = (): void => {
  if (typeof window === 'undefined' || isRedirectingToLogin) return;
  const { pathname } = window.location;
  if (AUTH_REDIRECT_PATHS.some((path) => pathname.endsWith(path))) return;
  isRedirectingToLogin = true;
  // The locale prefix is added by the middleware.
  window.location.assign('/login');
};

http.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Silent refresh is handled server-side by the BFF. A 401 here means the
    // refresh token is gone/expired, so send the user to login gracefully.
    if (error.response?.status === 401) {
      redirectToLogin();
    }
    const message = messageFromErrorBody(error.response?.data) ?? error.message;
    return Promise.reject(new HttpError(message, error));
  }
);
