import type { ReactNode } from 'react';

import type { ProfileSidebarProps } from './ui/ProfileSidebar/ProfileSidebar.types';
import type { ProfileTab } from './ui/ProfileTabNav';

export type ProfileShellHeader = {
  /** Page heading. Omitted for the client view, where the sidebar shows the name. */
  title?: string;
  subtitle?: string;
  backHref?: string;
  backLabel?: string;
};

export type ProfileShellConfig = {
  /** True once the current user is hydrated and any client analytics have settled. */
  isReady: boolean;
  /** Set when client analytics could not be loaded (e.g. not linked / forbidden). */
  error: string | null;
  header: ProfileShellHeader;
  sidebar: ProfileSidebarProps;
  tabs: ProfileTab[];
  activeKey: string;
  tabNavLabel: string;
};

/** The per-profile portion of the config, built by the self/client sub-hooks. */
export type ProfileViewModel = Pick<ProfileShellConfig, 'isReady' | 'error' | 'header' | 'sidebar' | 'tabs'>;

export type ProfileShellProps = {
  userId: string;
  children: ReactNode;
};
