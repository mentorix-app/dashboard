import type { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/src/shared/api';
import type { ProgramDetail } from '../model/structure.types';
import type { FetchProgramsListParams, ProgramSortField } from './programs.types';

const SORT_FIELD_TO_QUERY: Record<ProgramSortField, string> = {
  name: 'name',
  status: 'status',
  category: 'category',
  difficulty: 'difficulty',
  createdAt: 'created_at',
  modifiedAt: 'modified_at',
};

/**
 * Translates FE list params (camelCase) into the query the backend expects.
 * Filters are array-shaped to stay multi-select ready; today the UI only sends `name`.
 */
export const buildProgramsQuery = (params: FetchProgramsListParams): Record<string, string | string[]> => {
  const query: Record<string, string | string[]> = {};

  if (params.name) query.q = params.name;
  if (params.status?.length) query.status = params.status.join(',');
  if (params.category?.length) query.category = [...params.category];
  if (params.difficulty?.length) query.difficulty = [...params.difficulty];
  if (params.sortBy) {
    query.sort_by = SORT_FIELD_TO_QUERY[params.sortBy];
    query.sort_order = params.sortOrder ?? 'asc';
  }

  return query;
};

/**
 * Writes a freshly returned program straight into the detail cache instead of
 * refetching, then marks sibling list queries stale without firing a request.
 * Shared by every week/day mutation, which all return the full updated program.
 */
export const writeProgramDetail = (queryClient: ReturnType<typeof useQueryClient>, program: ProgramDetail) => {
  queryClient.setQueriesData<ProgramDetail>({ queryKey: queryKeys.programs.detail(program.id) }, program);
  queryClient.invalidateQueries({ queryKey: queryKeys.programs.all, refetchType: 'none' });
};
