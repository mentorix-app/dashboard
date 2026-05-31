import { useQuery, type UseQueryOptions, type UseQueryResult } from '@tanstack/react-query';
import type { AxiosRequestConfig } from 'axios';

import { http, type HttpError } from './base.http';

export function useGet<TData, TError = HttpError>(
  url: string,
  queryKey: readonly unknown[],
  options?: Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'>,
  config?: AxiosRequestConfig
): UseQueryResult<TData, TError> {
  return useQuery<TData, TError>({
    queryKey: [...queryKey, url, config],
    queryFn: () => http.get<TData>(url, config).then((response) => response.data),
    ...options,
  });
}
