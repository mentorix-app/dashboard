import type { FetchProgramsAnalyticsParams, ProgramAnalyticsSortField } from '../api/programAnalytics.types';

const SORT_FIELD_TO_QUERY: Record<ProgramAnalyticsSortField, string> = {
  name: 'name',
  lastActivity: 'last_activity',
};

/**
 * Translates FE list params (camelCase) into the query the backend expects for
 * GET /trainer/programs/analytics. `q` is sent when present so search works as
 * soon as the backend adds it. Default sort order is `desc` (last activity).
 */
export const buildProgramsAnalyticsQuery = (params: FetchProgramsAnalyticsParams): Record<string, string> => {
  const query: Record<string, string> = {};

  if (params.name) query.q = params.name;
  if (params.sortBy) {
    query.sort_by = SORT_FIELD_TO_QUERY[params.sortBy];
    query.sort_order = params.sortOrder ?? 'desc';
  }

  return query;
};
