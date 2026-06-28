'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { http, queryKeys, useGet, useInfiniteGet, usePost, type HttpError } from '@/src/shared/api';
import type { Program } from '../model/types';
import type { CreateProgramResponse, FetchProgramsListParams, ProgramsListResult } from './programs.types';
import { buildProgramsQuery } from './programs.utils';

const PROGRAMS_PAGE_SIZE = 20;

export const useProgramsInfinite = (params: FetchProgramsListParams = {}) =>
  useInfiniteGet<ProgramsListResult>(
    '/programs',
    queryKeys.programs.list(params),
    (page) => ({ ...buildProgramsQuery(params), page, limit: PROGRAMS_PAGE_SIZE }),
    (lastPage) => (lastPage.pagination.page < lastPage.pagination.totalPages ? lastPage.pagination.page + 1 : undefined)
  );

export const useProgram = (id: string | undefined) =>
  useGet<Program>(`/programs/${id ?? ''}`, queryKeys.programs.detail(id ?? ''), { enabled: Boolean(id) });

export const useCreateProgram = () => {
  const queryClient = useQueryClient();

  // POST /programs takes no body: it creates a draft program with day 1.
  return usePost<CreateProgramResponse, HttpError, void>('/programs', {
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.programs.all }),
  });
};

export const useDeleteProgram = () => {
  const queryClient = useQueryClient();

  // Backend exposes a single soft-delete endpoint (DELETE /programs/{id}, 204).
  // Bulk delete in the UI fans out to one request per selected program.
  return useMutation<void, HttpError, string>({
    mutationFn: (id) => http.delete<void>(`/programs/${id}`).then(() => undefined),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.programs.all }),
  });
};
