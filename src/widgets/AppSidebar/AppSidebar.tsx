'use client';

import { useTranslations } from 'next-intl';

import {
  Logo,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarRail,
} from '@/src/shared/ui';

import { AppSidebarItem } from './AppSidebarItem';
import { navGroups } from './AppSidebar.constants';

export const AppSidebar = () => {
  const t = useTranslations('AppSidebar');

  return (
    <Sidebar collapsible="icon" aria-label={t('label')}>
      <SidebarHeader>
        <div className="flex items-center justify-center px-1 py-2 group-data-[state=expanded]:justify-start">
          <Logo showWordmark className="group-data-[collapsible=icon]:[&>span:last-child]:hidden" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        {navGroups.map((group) => (
          <SidebarGroup key={group.id}>
            <SidebarGroupLabel>{t(group.i18nKey)}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <AppSidebarItem key={item.id} item={item} />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
};
