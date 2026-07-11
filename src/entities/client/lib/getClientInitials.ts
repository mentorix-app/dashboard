/**
 * Derives up to two uppercase initials from a client display name for use in
 * the avatar fallback when no Telegram photo is available.
 */
export const getClientInitials = (displayName: string): string => {
  const parts = displayName.trim().split(/\s+/).filter(Boolean).slice(0, 2);

  if (parts.length === 0) return '?';

  return parts.map((part) => part[0]?.toUpperCase() ?? '').join('');
};
