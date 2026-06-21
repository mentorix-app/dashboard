'use client';

import type { User } from './types';
import { useUserStore } from './store';

/**
 * Global accessor for the authenticated user. Reads the hydrated value from the
 * store, so it can be used anywhere without re-fetching GET /auth/me.
 */
export const useCurrentUser = (): User | null => useUserStore((state) => state.user);
