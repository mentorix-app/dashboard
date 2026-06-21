export enum UserRole {
  Admin = 'admin',
  Trainer = 'trainer',
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
  name?: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
};
