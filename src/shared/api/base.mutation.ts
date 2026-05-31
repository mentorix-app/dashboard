import { useMutation, type UseMutationOptions, type UseMutationResult } from '@tanstack/react-query';
import type { AxiosRequestConfig } from 'axios';

import { http, type HttpError } from './base.http';

export function usePost<TData, TError = HttpError, TVariables = void, TContext = unknown>(
  url: string,
  options?: UseMutationOptions<TData, TError, TVariables, TContext>,
  config?: AxiosRequestConfig
): UseMutationResult<TData, TError, TVariables, TContext> {
  return useMutation({
    mutationFn: (variables) => http.post<TData>(url, variables, config).then((response) => response.data),
    ...options,
  });
}

export function usePut<TData, TError = HttpError, TVariables = void, TContext = unknown>(
  url: string,
  options?: UseMutationOptions<TData, TError, TVariables, TContext>,
  config?: AxiosRequestConfig
): UseMutationResult<TData, TError, TVariables, TContext> {
  return useMutation({
    mutationFn: (variables) => http.put<TData>(url, variables, config).then((response) => response.data),
    ...options,
  });
}

export function usePatch<TData, TError = HttpError, TVariables = void, TContext = unknown>(
  url: string,
  options?: UseMutationOptions<TData, TError, TVariables, TContext>,
  config?: AxiosRequestConfig
): UseMutationResult<TData, TError, TVariables, TContext> {
  return useMutation({
    mutationFn: (variables) => http.patch<TData>(url, variables, config).then((response) => response.data),
    ...options,
  });
}

export function useDelete<TData, TError = HttpError, TVariables = void, TContext = unknown>(
  url: string,
  options?: UseMutationOptions<TData, TError, TVariables, TContext>,
  config?: AxiosRequestConfig
): UseMutationResult<TData, TError, TVariables, TContext> {
  return useMutation({
    mutationFn: (variables) =>
      http.delete<TData>(url, { ...config, data: variables }).then((response) => response.data),
    ...options,
  });
}
