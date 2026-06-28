'use client';

import { type FC } from 'react';
import { Link, usePathname, useTranslations } from '@/i18n';
import { SidebarMenuButton, SidebarMenuItem } from '@/src/shared/ui';
import type { SidebarNavItem } from '../AppSidebar.types';

type Props = {
  item: SidebarNavItem;
};

export const AppSidebarItem: FC<Props> = ({ item }) => {
  const t = useTranslations('AppSidebar');
  const pathname = usePathname();
  const Icon = item.icon;
  const label = t(item.i18nKey);
  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive} tooltip={label}>
        <Link href={item.href} aria-current={isActive ? 'page' : undefined}>
          <Icon aria-hidden />
          <span className="truncate">{label}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};
