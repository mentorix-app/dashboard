/** Public-facing site name used in metadata (title template, Open Graph, manifest). */
export const SITE_NAME = 'Mentorix';

/**
 * Absolute base URL of the dashboard, used for `metadataBase`, canonical URLs and
 * absolute Open Graph / Twitter image URLs. Configure via `NEXT_PUBLIC_APP_URL`
 * in production; falls back to localhost during development.
 */
export const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
