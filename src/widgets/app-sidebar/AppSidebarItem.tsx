'use client';

import { type FC } from 'react';
import { useTranslations } from 'next-intl';

import { Link, usePathname } from '@/i18n';
import { SidebarMenuButton, SidebarMenuItem, Typography, useSidebar } from '@/src/shared/ui';

import type { SidebarNavItem } from './AppSidebar.constants';

type Props = {
  item: SidebarNavItem;
};

export const AppSidebarItem: FC<Props> = ({ item }) => {
  const t = useTranslations('AppSidebar');
  const pathname = usePathname();
  const { state } = useSidebar();
  const Icon = item.icon;
  const label = t(item.i18nKey);
  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
  const isCollapsed = state === 'collapsed';

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={isActive}
        tooltip={label}
        className="group-data-[collapsible=icon]:h-auto group-data-[collapsible=icon]:py-2"
      >
        <Link href={item.href} aria-current={isActive ? 'page' : undefined}>
          <Icon aria-hidden />
          {isCollapsed ? (
            <Typography variant="tag" as="span" className="text-[10px] leading-tight">
              {label}
            </Typography>
          ) : (
            <span className="truncate">{label}</span>
          )}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};
