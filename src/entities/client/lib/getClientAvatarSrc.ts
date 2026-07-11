import { BFF_BASE_URL } from '@/src/shared/api';

/**
 * Resolves the signed relative avatar URL from GET /trainer/clients into an
 * `<img src>` served through the BFF proxy. The URL already carries `exp`+`sig`
 * (24h TTL) so no Bearer token is needed. Returns undefined when the client has
 * no Telegram photo, letting the avatar fall back to initials.
 */
export const getClientAvatarSrc = (avatarUrl: string): string | undefined =>
  avatarUrl ? `${BFF_BASE_URL}${avatarUrl}` : undefined;
