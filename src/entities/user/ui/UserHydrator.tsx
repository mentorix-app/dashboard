'use client';

import { useEffect, type ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { useGetMe } from '../api/useGetMe';
import { useUserStore } from '../model/store';

// Module scope so the previous identity survives the client-side navigations and
// UserHydrator remounts that happen on login/logout. Resets on a full page
// reload, where the QueryClient cache starts empty anyway.
let lastUserId: string | null | undefined;

/**
 * Fetches GET /auth/me and syncs it into the global user store so any component
 * can read the user via `useCurrentUser` without re-fetching.
 *
 * The QueryClient lives in the root layout and survives login/logout, so a new
 * user would otherwise be served the previous user's cached queries (clients,
 * programs, etc.). When the server session's `userId` changes, wipe the entire
 * cache so every query refetches for the new user instead of serving stale
 * cross-user data.
 */
export const UserHydrator = ({ userId, children }: { userId: string | null; children: ReactNode }) => {
  const queryClient = useQueryClient();
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    if (lastUserId !== undefined && lastUserId !== userId) {
      queryClient.clear();
    }
    lastUserId = userId;
  }, [userId, queryClient]);

  const { data: user } = useGetMe();

  useEffect(() => {
    if (user) setUser(user);
  }, [user, setUser]);

  return <>{children}</>;
};
