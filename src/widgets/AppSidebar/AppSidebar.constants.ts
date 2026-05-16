import { Dumbbell, LayoutDashboard, type LucideIcon } from 'lucide-react';
import { ROUTES } from '@/src/shared/lib';

import type messages from '@/i18n/messages/en';

type AppSidebarMessages = (typeof messages)['AppSidebar'];

export type SidebarItemI18nKey = keyof Omit<AppSidebarMessages, 'groups' | 'label'>;
export type SidebarGroupI18nKey = `groups.${keyof AppSidebarMessages['groups']}`;

export type SidebarNavItem = {
  id: string;
  i18nKey: SidebarItemI18nKey;
  href: string;
  icon: LucideIcon;
  /** Reserved for future nested-accordion items. */
  children?: SidebarNavItem[];
};

export type SidebarNavGroup = {
  id: string;
  i18nKey: SidebarGroupI18nKey;
  items: SidebarNavItem[];
};

export const navGroups: SidebarNavGroup[] = [
  {
    id: 'main',
    i18nKey: 'groups.main',
    items: [
      { id: 'dashboard', i18nKey: 'dashboard', href: ROUTES.dashboard, icon: LayoutDashboard },
      { id: 'exercises', i18nKey: 'exercises', href: ROUTES.exercises, icon: Dumbbell },
    ],
  },
];
