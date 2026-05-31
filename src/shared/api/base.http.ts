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
});

http.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      window.location.reload();
    }
    const message = messageFromErrorBody(error.response?.data) ?? error.message;
    return Promise.reject(new HttpError(message, error));
  }
);
