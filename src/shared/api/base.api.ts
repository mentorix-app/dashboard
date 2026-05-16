import axios, { type AxiosError, type AxiosInstance, type AxiosRequestConfig } from 'axios';
import {
  useMutation,
  useQuery,
  type UseMutationOptions,
  type UseMutationResult,
  type UseQueryOptions,
  type UseQueryResult,
} from '@tanstack/react-query';

import { BFF_BASE_URL, TIMEOUT_MS } from './base.constants';
import { messageFromErrorBody } from './base.utils';

// ---------------------------------------------------------------------------
// Axios instance
// ---------------------------------------------------------------------------

/**
 * Browser-side HTTP client. Always targets the local BFF (`/api/bff/*`),
 * which attaches the bearer token from the HttpOnly session cookie before
 * forwarding to the upstream backend. The access token never reaches JS.
 */
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
      // Session is gone or expired. A full reload lets proxy.ts redirect to
      // /login with the correct locale prefix.
      window.location.reload();
    }
    const message = messageFromErrorBody(error.response?.data) ?? error.message;
    return Promise.reject(new HttpError(message, error));
  }
);

// ---------------------------------------------------------------------------
// HttpError
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Query wrappers
// ---------------------------------------------------------------------------

/**
 * Wraps `useQuery` with a GET request via the shared axios instance.
 *
 * @example
 * const { data, isPending } = useGet<Exercise[]>(
 *   '/exercises',
 *   queryKeys.exercises.list({ search }),
 *   { enabled: !!search },
 * );
 */
export function useGet<TData, TError = HttpError>(
  url: string,
  queryKey: readonly unknown[],
  options?: Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'>,
  config?: AxiosRequestConfig
): UseQueryResult<TData, TError> {
  return useQuery<TData, TError>({
    queryKey: [...queryKey, url, config],
    queryFn: () => http.get<TData>(url, config).then((r) => r.data),
    ...options,
  });
}

// ---------------------------------------------------------------------------
// Mutation wrappers
// ---------------------------------------------------------------------------

/**
 * Wraps `useMutation` with a POST request via the shared axios instance.
 *
 * @example
 * const mutation = usePost<unknown, HttpError, RegisterPayload>(
 *   '/auth/register',
 *   { onSuccess: () => router.push('/') },
 * );
 * mutation.mutate({ email, password });
 */
export function usePost<TData, TError = HttpError, TVariables = void, TContext = unknown>(
  url: string,
  options?: UseMutationOptions<TData, TError, TVariables, TContext>,
  config?: AxiosRequestConfig
): UseMutationResult<TData, TError, TVariables, TContext> {
  return useMutation<TData, TError, TVariables, TContext>({
    mutationFn: (variables) => http.post<TData>(url, variables, config).then((r) => r.data),
    ...options,
  });
}

/**
 * Wraps `useMutation` with a PUT request via the shared axios instance.
 */
export function usePut<TData, TError = HttpError, TVariables = void, TContext = unknown>(
  url: string,
  options?: UseMutationOptions<TData, TError, TVariables, TContext>,
  config?: AxiosRequestConfig
): UseMutationResult<TData, TError, TVariables, TContext> {
  return useMutation<TData, TError, TVariables, TContext>({
    mutationFn: (variables) => http.put<TData>(url, variables, config).then((r) => r.data),
    ...options,
  });
}

/**
 * Wraps `useMutation` with a PATCH request via the shared axios instance.
 */
export function usePatch<TData, TError = HttpError, TVariables = void, TContext = unknown>(
  url: string,
  options?: UseMutationOptions<TData, TError, TVariables, TContext>,
  config?: AxiosRequestConfig
): UseMutationResult<TData, TError, TVariables, TContext> {
  return useMutation<TData, TError, TVariables, TContext>({
    mutationFn: (variables) => http.patch<TData>(url, variables, config).then((r) => r.data),
    ...options,
  });
}

/**
 * Wraps `useMutation` with a DELETE request via the shared axios instance.
 */
export function useDelete<TData, TError = HttpError, TVariables = void, TContext = unknown>(
  url: string,
  options?: UseMutationOptions<TData, TError, TVariables, TContext>,
  config?: AxiosRequestConfig
): UseMutationResult<TData, TError, TVariables, TContext> {
  return useMutation<TData, TError, TVariables, TContext>({
    mutationFn: (variables) => http.delete<TData>(url, { ...config, data: variables }).then((r) => r.data),
    ...options,
  });
}
