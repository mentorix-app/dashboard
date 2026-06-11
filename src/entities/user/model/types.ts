/**
 * Provisional shape of the GET /auth/me response. Fields are intentionally
 * permissive until the real backend payload is observed; tighten after that.
 */
export type User = {
  id: string;
  email: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  role?: string;
  createdAt?: string;
};
