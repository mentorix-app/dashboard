import type { ProfileSidebarProps } from './ui/ProfileSidebar/ProfileSidebar.types';

/** Placeholder sidebar shown before data is ready or on an error state. */
export const EMPTY_SIDEBAR: ProfileSidebarProps = { name: '', initials: '?', avatarAlt: '', meta: [] };

/** Map the current pathname to its tab key ('' when on no known profile tab). */
export const resolveActiveKey = (pathname: string): string => {
  if (pathname.endsWith('/training')) return 'training';
  if (pathname.endsWith('/subscription')) return 'subscription';
  return '';
};

/** Two-letter initials from a name, falling back to an email or "?". */
export const getInitials = (primary: string, fallback = ''): string => {
  const source = primary.trim().length > 0 ? primary : fallback;
  const parts = source.split(/\s+|[._-]/).filter(Boolean);
  const initials = parts
    .slice(0, 2)
    .map((part) => part[0])
    .join('');
  return (initials || source[0] || '?').toUpperCase();
};
