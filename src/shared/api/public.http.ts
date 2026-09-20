import axios, { type AxiosError, type AxiosInstance } from 'axios';

import { TIMEOUT_MS } from './base.constants';
import { HttpError } from './base.http';
import { messageFromErrorBody } from './base.utils';

export const publicHttp: AxiosInstance = axios.create({
  baseURL: '/api/public',
  timeout: TIMEOUT_MS,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

publicHttp.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const message = messageFromErrorBody(error.response?.data) ?? error.message;
    return Promise.reject(new HttpError(message, error));
  }
);
