'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { http, queryKeys, useGet, useInfiniteGet, usePost, type HttpError } from '@/src/shared/api';
import type { ProgramDetail } from '../model/structure';
import type {
  ArchiveProgramResponse,
  CreateProgramResponse,
  FetchProgramsListParams,
  ProgramsListResult,
  PublishProgramResponse,
  PublishProgramUpdateResponse,
  UpdateProgramResponse,
  UpdateProgramVariables,
} from '../model/programs';
import { buildProgramsQuery } from '../lib';

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

export const useArchiveProgram = () => {
  const queryClient = useQueryClient();

  // POST /programs/{id}/archive moves a published program to archived, after
  // which its structure is read-only until it is published again.
  return useMutation<ArchiveProgramResponse, HttpError, string>({
    mutationFn: (id) =>
      http
        .post<ArchiveProgramResponse>(`/programs/${encodeURIComponent(id)}/archive`)
        .then((response) => response.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.programs.all }),
  });
};

export const usePublishProgramUpdate = () => {
  const queryClient = useQueryClient();

  // POST /programs/{id}/publish-update freezes the current tree as a new version
  // (v2, v3, …). Existing assignments stay on their version until synced, so we
  // invalidate the whole program tree to refresh versions and assignment state.
  return useMutation<PublishProgramUpdateResponse, HttpError, string>({
    mutationFn: (id) =>
      http
        .post<PublishProgramUpdateResponse>(`/programs/${encodeURIComponent(id)}/publish-update`)
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
