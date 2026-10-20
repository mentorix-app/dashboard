import { createHash, randomBytes } from 'node:crypto';

/** Random URL-safe string for an OAuth `state` or a raw `nonce` (43 characters, well under the API's 256). */
export const generateOAuthValue = (): string => randomBytes(32).toString('base64url');

/**
 * What the identity providers receive as `nonce`: the lowercase hex SHA-256 of
 * the raw value. The API gets the raw value and compares it with the token's claim.
 */
export const hashNonce = (raw: string): string => createHash('sha256').update(raw).digest('hex');
