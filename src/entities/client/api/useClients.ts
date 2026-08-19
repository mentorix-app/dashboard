'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { http, queryKeys, useInfiniteGet, usePost, type HttpError } from '@/src/shared/api';

import type {
  ClientsListResult,
  FetchClientsListParams,
  SetClientsProgramParams,
  SetClientsProgramResult,
  TrainerInvite,
} from './clients.types';
import { buildClientsQuery } from './clients.utils';

const CLIENTS_PAGE_SIZE = 20;

type UseClientsInfiniteOptions = {
  enabled?: boolean;
};

export const useClientsInfinite = (params: FetchClientsListParams = {}, options?: UseClientsInfiniteOptions) =>
  useInfiniteGet<ClientsListResult>(
    '/trainer/clients',
    queryKeys.clients.list(params),
    (page) => ({ ...buildClientsQuery(params), page, limit: CLIENTS_PAGE_SIZE }),
    (lastPage) =>
      lastPage.pagination.page < lastPage.pagination.totalPages ? lastPage.pagination.page + 1 : undefined,
    options
  );

export const useCreateTrainerInvite = () => {
  const queryClient = useQueryClient();

  // POST /trainer/invites takes no body: it mints a one-time Telegram invite link.
  return usePost<TrainerInvite, HttpError, void>('/trainer/invites', {
    // Minting an invite can consume quota, so refresh the quota-aware
    // capabilities on /auth/me (keeps `canCreateInvite` from going stale).
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.user.me() }),
  });
};

export const useSetClientsProgram = () => {
  const queryClient = useQueryClient();

  return useMutation<SetClientsProgramResult, HttpError, SetClientsProgramParams>({
    // One endpoint assigns or clears a program for 1–100 clients at once.
    mutationFn: ({ programId, clientUserIds }) =>
      http
        .put<SetClientsProgramResult>('/trainer/clients/program-assignment', { programId, clientUserIds })
        .then((response) => response.data),
    onSuccess: () => {
      // Refresh client lists and program analytics, since assigning/clearing a
      // program changes the analytics rollups (assigned counts, completion, etc.).
      queryClient.invalidateQueries({ queryKey: queryKeys.clients.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.analytics.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.programs.all });
    },
  });
};
