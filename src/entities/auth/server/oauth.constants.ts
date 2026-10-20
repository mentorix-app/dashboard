export const GOOGLE_NONCE_COOKIE = 'google_nonce';
export const APPLE_STATE_COOKIE = 'apple_state';
export const APPLE_NONCE_COOKIE = 'apple_nonce';
/** What the Apple round trip is for: `signin` (the default) or `delete`, a fresh authorization to delete the account. */
export const APPLE_INTENT_COOKIE = 'apple_intent';
/** Carries the Apple answer from the callback to the route that deletes the account. */
export const APPLE_DELETION_PROOF_COOKIE = 'apple_deletion_proof';

/** How long the user may take at the provider before the sign-in has to be restarted. */
export const OAUTH_COOKIE_MAX_AGE_SECONDS = 10 * 60;

/** The Apple cookies are only ever sent to the two Apple routes. */
export const APPLE_COOKIE_PATH = '/api/auth/apple';
export const APPLE_CALLBACK_PATH = '/api/auth/apple/callback';
/**
 * Apple answers with a cross-site POST, which carries none of the session cookies, so the account
 * cannot be deleted there. The callback hands the answer over to this route, reached by a plain redirect.
 */
export const APPLE_DELETION_PATH = '/api/auth/apple/delete';
/** The proof is single-use and the authorization code lives five minutes. */
export const APPLE_DELETION_PROOF_MAX_AGE_SECONDS = 5 * 60;

export const APPLE_AUTHORIZE_URL = 'https://appleid.apple.com/auth/authorize';

/** Services ID of the dashboard; the API accepts it as an audience in APPLE_CLIENT_IDS. */
export const DEFAULT_APPLE_SERVICE_ID = 'com.mentorix.dashboard';
