import type { ClientSelfAnalytics, ClientSelfAnalyticsParams } from '@/src/entities/analytics';

export type ClientStatsLinkParams = Partial<ClientSelfAnalyticsParams>;

export type ClientStatsErrorReason = 'broken' | 'expired' | 'unavailable' | 'unknown';

export type ClientStatsConfig =
  | { state: 'loading' }
  | { state: 'error'; reason: ClientStatsErrorReason }
  | { state: 'ready'; data: ClientSelfAnalytics };

export type ClientStatsViewProps = {
  linkParams: ClientStatsLinkParams;
};
