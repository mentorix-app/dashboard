import type { UserRole } from '../model/types';
import { UserRole as Role } from '../model/types';

export const isAdmin = (roles: readonly UserRole[]): boolean => roles.includes(Role.Admin);
export const isTrainer = (roles: readonly UserRole[]): boolean => roles.includes(Role.Trainer);

/**
 * `true` for an account that signed in with Google or Apple and has not become a
 * trainer yet. Administrators are exempt: the API refuses to activate them.
 */
export const needsTrainerActivation = (roles: readonly UserRole[]): boolean => !isAdmin(roles) && !isTrainer(roles);
