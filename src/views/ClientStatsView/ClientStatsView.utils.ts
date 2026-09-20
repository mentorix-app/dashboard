import type { ClientSelfAnalyticsParams } from '@/src/entities/analytics';

import type { ClientStatsErrorReason, ClientStatsLinkParams } from './ClientStatsView.types';

export const hasCompleteLinkParams = (params: ClientStatsLinkParams): params is ClientSelfAnalyticsParams =>
  Boolean(params.clientUserId?.trim() && params.trainerId?.trim() && params.exp?.trim() && params.sig?.trim());

export const resolveErrorReason = (status: number | undefined): ClientStatsErrorReason => {
  if (status === 400) return 'broken';
  if (status === 401) return 'expired';
  if (status === 404) return 'unavailable';
  return 'unknown';
};

export const getRemainingMinutes = (expiresAt: string, now = Date.now()): number => {
  const difference = new Date(expiresAt).getTime() - now;
  if (!Number.isFinite(difference) || difference <= 0) return 0;
  return Math.ceil(difference / 60_000);
};

export const pickLocalizedName = (locale: string, name: string, nameRu: string): string => {
  const preferred = locale === 'ru' ? nameRu : name;
  return preferred.trim() || name.trim() || nameRu.trim();
};
