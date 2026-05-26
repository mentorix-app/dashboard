import type { LucideIcon } from 'lucide-react';
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
