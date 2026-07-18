import type { UserRole } from '../model/types';
import { UserRole as Role } from '../model/types';

export const isAdmin = (roles: readonly UserRole[]): boolean => roles.includes(Role.Admin);
export const isTrainer = (roles: readonly UserRole[]): boolean => roles.includes(Role.Trainer);
