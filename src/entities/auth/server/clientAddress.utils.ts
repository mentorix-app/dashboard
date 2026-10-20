import { isIP } from 'node:net';

/**
 * Cloudflare sets this header itself with the address of the visitor, and
 * Render's stage sits behind Cloudflare (the API relies on the same header).
 * `X-Forwarded-For` is deliberately not used: its left part is chosen by the client.
 */
const CLOUDFLARE_CLIENT_IP_HEADER = 'cf-connecting-ip';

/** Returns the browser address from the incoming request headers, or `null` when there is none. */
export const pickClientAddress = (read: (name: string) => string | null): string | null => {
  const value = read(CLOUDFLARE_CLIENT_IP_HEADER)?.trim();
  if (!value) return null;
  return isIP(value) === 0 ? null : value;
};
