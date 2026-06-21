'use client';

import { useEffect, type ReactNode } from 'react';

import { useGetMe } from '../api/useGetMe';
import { useUserStore } from '../model/store';

/**
 * Fetches GET /auth/me once and syncs it into the global user store so any
 * component can read the user via `useCurrentUser` without re-fetching.
 */
export const UserHydrator = ({ children }: { children: ReactNode }) => {
  const { data: user } = useGetMe();
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    if (user) setUser(user);
  }, [user, setUser]);

  return <>{children}</>;
};
