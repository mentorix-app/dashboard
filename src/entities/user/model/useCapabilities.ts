'use client';

import { useMemo } from 'react';

import { type Capabilities, deriveCapabilities } from '../lib/deriveCapabilities';
import { useCurrentUser } from './useCurrentUser';

/**
 * Global, role- and subscription-aware access checks. Reads the hydrated user
 * from the store and memoizes the derived capabilities so gating stays cheap.
 */
export const useCapabilities = (): Capabilities => {
  const user = useCurrentUser();
  return useMemo(() => deriveCapabilities(user), [user]);
};
