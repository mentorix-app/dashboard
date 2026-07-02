import type { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/src/shared/api';

import type { ProgramDetail } from '../model/structure';

/**
 * Writes a freshly returned program straight into the detail cache instead of
 * refetching, then marks sibling list queries stale without firing a request.
 * Shared by every week/day mutation, which all return the full updated program.
 */
export const writeProgramDetail = (queryClient: ReturnType<typeof useQueryClient>, program: ProgramDetail) => {
  queryClient.setQueriesData<ProgramDetail>({ queryKey: queryKeys.programs.detail(program.id) }, program);
  queryClient.invalidateQueries({ queryKey: queryKeys.programs.all, refetchType: 'none' });
};
