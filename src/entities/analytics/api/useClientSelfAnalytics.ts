'use client';

import { useQuery } from '@tanstack/react-query';

import { publicHttp, type HttpError } from '@/src/shared/api';

import type { ClientSelfAnalytics, ClientSelfAnalyticsParams } from './clientSelfAnalytics.types';

export const useClientSelfAnalytics = (params: ClientSelfAnalyticsParams, enabled: boolean) =>
  useQuery<ClientSelfAnalytics, HttpError>({
    queryKey: ['analytics', 'client-self', params],
    queryFn: () =>
      publicHttp.get<ClientSelfAnalytics>(`/client-stats${window.location.search}`).then(({ data }) => data),
    enabled,
    retry: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
