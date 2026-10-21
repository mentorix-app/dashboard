/**
 * Version of the Terms of Service and Privacy Policy: the date they took effect (`YYYY-MM-DD`).
 * It is shown on both pages and sent to the API when a trainer accepts the terms, so the stored
 * `terms_version` always names the text the person could read. Bump it when either text changes.
 */
export const LEGAL_VERSION = '2026-10-21';

/** Who answers questions about the service and personal data. Shown in the legal texts and footers. */
export const SUPPORT_EMAIL = 'mentorix.app@proton.me';

export const SUPPORT_MAILTO = `mailto:${SUPPORT_EMAIL}`;
