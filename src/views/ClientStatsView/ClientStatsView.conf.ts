'use client';

import { useClientSelfAnalytics } from '@/src/entities/analytics';

import type { ClientStatsConfig, ClientStatsLinkParams } from './ClientStatsView.types';
import { hasCompleteLinkParams, resolveErrorReason } from './ClientStatsView.utils';

const EMPTY_PARAMS = { clientUserId: '', trainerId: '', exp: '', sig: '' };

export const useClientStatsConfig = (linkParams: ClientStatsLinkParams): ClientStatsConfig => {
  const hasCompleteParams = hasCompleteLinkParams(linkParams);
  const query = useClientSelfAnalytics(hasCompleteParams ? linkParams : EMPTY_PARAMS, hasCompleteParams);

  if (!hasCompleteParams) return { state: 'error', reason: 'broken' };
  if (query.isPending) return { state: 'loading' };
  if (query.isError) return { state: 'error', reason: resolveErrorReason(query.error.status) };
  if (!query.data) return { state: 'error', reason: 'unknown' };

  return { state: 'ready', data: query.data };
};
