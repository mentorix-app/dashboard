'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { http, queryKeys, type HttpError } from '@/src/shared/api';
import type { User } from '../model/types';

export type UpdateMeVariables = {
  name: string;
};

/**
 * PATCH /auth/me updates the current user's displayed name and returns the full
 * updated user. We write it straight into the me cache (prefix match covers
 * useGet's url-suffixed key) instead of refetching. Callers typically also sync
 * the global user store so the header/avatar update instantly.
 */
export const useUpdateMe = () => {
  const queryClient = useQueryClient();

  return useMutation<User, HttpError, UpdateMeVariables>({
    mutationFn: (variables) => http.patch<User>('/auth/me', variables).then((response) => response.data),
    onSuccess: (user) => {
      queryClient.setQueriesData<User>({ queryKey: queryKeys.user.me() }, user);
    },
  });
};
