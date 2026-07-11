import { UserRole } from './types';

export enum Permission {
  ExerciseManage = 'exercise:manage',
  ClientManage = 'client:manage',
}

/**
 * Role → permission map. Admin is granted every permission, so it can do
 * anything; extend this map when adding new roles or permissions.
 */
const ROLE_PERMISSIONS: Record<UserRole, readonly Permission[]> = {
  [UserRole.Admin]: Object.values(Permission),
  [UserRole.Trainer]: [Permission.ClientManage],
};

export const hasPermission = (roles: readonly UserRole[], permission: Permission): boolean =>
  roles.some((role) => ROLE_PERMISSIONS[role]?.includes(permission));
