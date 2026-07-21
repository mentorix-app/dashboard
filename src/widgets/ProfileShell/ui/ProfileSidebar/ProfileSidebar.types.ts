export type ProfileSidebarBadgeTone = 'active' | 'neutral';

export type ProfileSidebarBadge = {
  label: string;
  tone: ProfileSidebarBadgeTone;
};

export type ProfileSidebarMeta = {
  id: string;
  label: string;
  value: string;
  /** When set, the value renders as an internal link. */
  href?: string;
};

export type ProfileSidebarStatTone = 'default' | 'positive' | 'attention';

export type ProfileSidebarStat = {
  id: string;
  label: string;
  value: number;
  tone?: ProfileSidebarStatTone;
};

export type ProfileSidebarProps = {
  name: string;
  initials: string;
  avatarUrl?: string;
  avatarAlt: string;
  /** Renders an inline pencil-edit control for the current user's own name. */
  editableName?: boolean;
  badge?: ProfileSidebarBadge;
  /** Optional "@handle" line shown under the status badge. */
  username?: string;
  meta: ProfileSidebarMeta[];
  stats?: ProfileSidebarStat[];
};
