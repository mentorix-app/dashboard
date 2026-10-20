'use client';

import { useMutation } from '@tanstack/react-query';
import { http, type HttpError } from '@/src/shared/api';
import type { User } from '../model/types';

export type ActivateTrainerVariables = {
  /** Version of the accepted trainer terms, a calendar date (`YYYY-MM-DD`). */
  termsVersion: string;
};

/**
 * POST /auth/me/trainer gives the account the `trainer` role (`client` is kept),
 * creates its trainer profile and records the accepted terms. It is idempotent
 * and answers with the updated profile.
 *
 * The profile is deliberately not written into the `/auth/me` cache here: the
 * caller decides when the cabinet may replace the onboarding screen.
 */
export const useActivateTrainer = () =>
  useMutation<User, HttpError, ActivateTrainerVariables>({
    mutationFn: (variables) => http.post<User>('/auth/me/trainer', variables).then((response) => response.data),
  });
