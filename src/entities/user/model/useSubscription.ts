'use client';

import type { Subscription } from '@/src/shared/types';

import { useCurrentUser } from './useCurrentUser';

/**
 * Current user's effective subscription, or null for admins and users without
 * a trainer profile. Sourced from the hydrated GET /auth/me payload.
 */
export const useSubscription = (): Subscription | null => {
  const user = useCurrentUser();
  return user?.subscription ?? null;
};
