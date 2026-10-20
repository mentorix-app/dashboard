/**
 * Reads a `Retry-After` header (whole seconds or an HTTP date) as milliseconds.
 * Returns `undefined` when the header is absent or unusable.
 */
export const parseRetryAfterMs = (value: string | null | undefined, now: number = Date.now()): number | undefined => {
  const trimmed = value?.trim();
  if (!trimmed) return undefined;

  if (/^\d+$/.test(trimmed)) return Number(trimmed) * 1_000;

  // An HTTP date starts with a day name; anything else ("-5", "1.5") is not a valid value.
  if (!/^[A-Za-z]/.test(trimmed)) return undefined;

  const at = Date.parse(trimmed);
  return Number.isNaN(at) ? undefined : Math.max(0, at - now);
};
