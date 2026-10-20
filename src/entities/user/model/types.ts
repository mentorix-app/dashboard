import type { Subscription } from '@/src/shared/types';

/**
 * An administrator is never also a trainer or client, but `trainer` and `client`
 * coexist: a person who becomes a trainer keeps the `client` role. The `roles`
 * array mirrors the backend contract; use the helpers in `lib/roles` to test it.
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
