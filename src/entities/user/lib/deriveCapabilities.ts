import type { Subscription } from '@/src/shared/types';

import type { User } from '../model/types';

import { isAdmin, isTrainer } from './roles';

/**
 * Effective, role- and subscription-aware capabilities used to gate UI. Roles
 * are mutually exclusive, so admin and trainer paths never overlap:
 * - Admin owns the shared/global exercise catalog but is read-only for other
 *   trainers' programs and clients (no create/edit/invite).
 * - Trainer capabilities are driven by the plan permissions returned on
 *   GET /auth/me; a `false` flag means the plan quota is reached and the UI
 *   should surface an upgrade prompt instead of hiding the action.
 */
export type Capabilities = {
  isAdmin: boolean;
  isTrainer: boolean;
  canCreateExercise: boolean;
  canCreateProgram: boolean;
  canCreateInvite: boolean;
  canViewClients: boolean;
  canManageClients: boolean;
};

export const deriveCapabilities = (user: User | null): Capabilities => {
  const roles = user?.roles ?? [];
  const admin = isAdmin(roles);
  const trainer = isTrainer(roles);
  const permissions: Subscription['permissions'] | null = user?.subscription?.permissions ?? null;

  return {
    isAdmin: admin,
    isTrainer: trainer,
    canCreateExercise: admin || (permissions?.canCreateExercise ?? false),
    canCreateProgram: !admin && (permissions?.canCreateProgram ?? false),
    canCreateInvite: !admin && (permissions?.canCreateInvite ?? false),
    canViewClients: admin || trainer,
    canManageClients: !admin && (permissions?.canManageClients ?? false),
  };
};
