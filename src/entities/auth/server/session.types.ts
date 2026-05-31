export type AuthSession = {
  accessToken: string;
  expiresAt: string;
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

export const mapResponseToSession = (raw: LoginResponse): AuthSession => ({
  accessToken: raw.access_token,
  expiresAt: raw.expires_at,
  userId: raw.user_id,
  email: raw.email,
});
