import type { Subscription } from '@/src/shared/types';

/**
 * User roles are mutually exclusive: an administrator is never also a trainer
 * or client. The `roles` array still mirrors the backend contract, but callers
 * should treat membership as a single effective role.
 */
export enum UserRole {
  Admin = 'admin',
  Trainer = 'trainer',
  Client = 'client',
}

/**
 * Shape of the GET /auth/me response. Backend-confirmed fields are required;
 * UI-only fields (name, avatar, …) stay optional until the backend returns them.
 */
export type User = {
  userId: string;
  email: string;
  createdAt: string;
  roles: UserRole[];
  /** Effective plan of the trainer profile; null for admins and profileless users. */
  subscription?: Subscription | null;
  name?: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
};
