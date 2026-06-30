'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { http, queryKeys, useGet, useInfiniteGet, usePost, type HttpError } from '@/src/shared/api';
import type { ProgramDetail } from '../model/structure.types';
import type {
  CreateProgramResponse,
  FetchProgramsListParams,
  ProgramsListResult,
  PublishProgramResponse,
  UpdateProgramResponse,
  UpdateProgramVariables,
} from './programs.types';
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
  useGet<ProgramDetail>(`/programs/${id ?? ''}`, queryKeys.programs.detail(id ?? ''), { enabled: Boolean(id) });

export const useCreateProgram = () => {
  const queryClient = useQueryClient();

  // POST /programs takes no body: it creates a draft program with day 1.
  return usePost<CreateProgramResponse, HttpError, void>('/programs', {
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.programs.all }),
  });
};

export const useUpdateProgram = () => {
  const queryClient = useQueryClient();

  // PATCH /programs/{id} returns the full updated program, so we write it
  // straight into the detail cache (prefix match covers useGet's url-suffixed
  // key) instead of refetching. Other program queries are only marked stale
  // (refetchType: 'none') so the list refreshes the next time it mounts rather
  // than firing a request on every autosave.
  return useMutation<UpdateProgramResponse, HttpError, UpdateProgramVariables>({
    mutationFn: ({ id, params }) =>
      http
        .patch<UpdateProgramResponse>(`/programs/${encodeURIComponent(id)}`, params)
        .then((response) => response.data),
    onSuccess: (program, { id }) => {
      queryClient.setQueriesData<ProgramDetail>({ queryKey: queryKeys.programs.detail(id) }, program);
      queryClient.invalidateQueries({ queryKey: queryKeys.programs.all, refetchType: 'none' });
    },
  });
};

export const usePublishProgram = () => {
  const queryClient = useQueryClient();

  // POST /programs/{id}/publish validates required fields server-side.
  return useMutation<PublishProgramResponse, HttpError, string>({
    mutationFn: (id) =>
      http
        .post<PublishProgramResponse>(`/programs/${encodeURIComponent(id)}/publish`)
        .then((response) => response.data),
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
