import {
  useInfiniteQuery,
  useQuery,
  type InfiniteData,
  type UseInfiniteQueryOptions,
  type UseInfiniteQueryResult,
  type UseQueryOptions,
  type UseQueryResult,
} from '@tanstack/react-query';
import type { AxiosRequestConfig } from 'axios';

import { http, type HttpError } from './base.http';

export function useGet<TData, TError = HttpError>(
  url: string,
  queryKey: readonly unknown[],
  options?: Omit<UseQueryOptions<TData, TError, TData>, 'queryKey' | 'queryFn'>,
  config?: AxiosRequestConfig
): UseQueryResult<TData, TError> {
  return useQuery<TData, TError, TData>({
    queryKey: [...queryKey, url, config],
    queryFn: () => http.get<TData>(url, config).then((response) => response.data),
    ...options,
  });
}

export function useInfiniteGet<TPage, TError = HttpError>(
  url: string,
  queryKey: readonly unknown[],
  buildParams: (page: number) => Record<string, unknown>,
  getNextPageParam: (lastPage: TPage) => number | undefined,
  options?: Pick<
    UseInfiniteQueryOptions<TPage, TError, InfiniteData<TPage, number>, readonly unknown[], number>,
    'enabled'
  >,
  config?: AxiosRequestConfig
): UseInfiniteQueryResult<InfiniteData<TPage, number>, TError> {
  // Callers encode all varying inputs (filters, sort) into `queryKey`; `buildParams`
  // and `config` are derived from those, so they need not be listed separately.
  // eslint-disable-next-line @tanstack/query/exhaustive-deps
  return useInfiniteQuery<TPage, TError, InfiniteData<TPage, number>, readonly unknown[], number>({
    queryKey: [...queryKey, url],
    queryFn: ({ pageParam }) =>
      http.get<TPage>(url, { ...config, params: buildParams(pageParam) }).then((response) => response.data),
    initialPageParam: 1,
    getNextPageParam,
    ...options,
  });
}
