export type AuthSession = {
  accessToken: string;
  /** ISO timestamp when the access token expires (~15 min). */
  accessExpiresAt: string;
  refreshToken: string;
  /** ISO timestamp when the refresh token expires (~30 days). */
  refreshExpiresAt: string;
  userId: string;
  email: string;
};

export type LoginResponse = {
  access_token: string;
  token_type: string;
  expires_at: string;
  user_id: string;
  email: string;
};

export const mapResponseToSession = (
  raw: LoginResponse,
  refreshToken: string,
  refreshExpiresAt: string
): AuthSession => ({
  accessToken: raw.access_token,
  accessExpiresAt: raw.expires_at,
  refreshToken,
  refreshExpiresAt,
  userId: raw.user_id,
  email: raw.email,
});
