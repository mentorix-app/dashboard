'use client';

import { useCallback } from 'react';

import { hasPermission, type Permission } from './permissions';
import { useCurrentUser } from './useCurrentUser';

/**
 * Global, role-based access check. Reads the current user from the store and
 * exposes `can` to gate UI and actions anywhere in the app.
 */
export const usePermissions = () => {
  const user = useCurrentUser();
  const roles = user?.roles;

  const can = useCallback((permission: Permission) => hasPermission(roles ?? [], permission), [roles]);

  return { can };
};
