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

http.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Silent refresh is handled server-side by the BFF. A 401 here means the
    // refresh token is gone/expired, so send the user to login gracefully.
    // The locale prefix is added by the middleware.
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      window.location.assign('/login');
    }
    const message = messageFromErrorBody(error.response?.data) ?? error.message;
    return Promise.reject(new HttpError(message, error));
  }
);
