import type { ClientSortField, FetchClientsListParams } from './clients.types';

const SORT_FIELD_TO_QUERY: Record<ClientSortField, string> = {
  name: 'name',
  linkedAt: 'linked_at',
};

/**
 * Translates FE list params (camelCase) into the snake_case query the backend
 * expects for GET /trainer/clients.
 */
export const buildClientsQuery = (params: FetchClientsListParams): Record<string, string> => {
  const query: Record<string, string> = {};

  if (params.name) query.q = params.name;
  if (params.sortBy) {
    query.sort_by = SORT_FIELD_TO_QUERY[params.sortBy];
    query.sort_order = params.sortOrder ?? 'asc';
  }

  return query;
};
