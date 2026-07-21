/**
 * Primitives shared across analytics payloads. The analytics entity is
 * self-contained (FSD: no imports from the `client`/`program` entities), so it
 * declares its own pagination envelope and status unions instead of reusing the
 * enums those entities export. The values mirror the backend strings.
 */

/** Standard pagination envelope for analytics list responses. */
export type AnalyticsPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

/** Client link state in analytics payloads. */
export type AnalyticsClientStatus = 'active' | 'blocked';

/** Program lifecycle in analytics payloads. */
export type AnalyticsProgramStatus = 'draft' | 'published' | 'archived';
