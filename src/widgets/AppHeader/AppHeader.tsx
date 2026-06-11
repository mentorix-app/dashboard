'use client';

import { Suspense } from 'react';
import { useTranslations } from '@/i18n';
import { LanguageSwitcher } from '@/src/features/LanguageSwitcher/LanguageSwitcher';
import { ThemeSwitcher } from '@/src/features/ThemeSwitcher/ThemeSwitcher';
import { SidebarTrigger } from '@/src/shared/ui';
import { UserAvatar } from './UserAvatar';

export const AppHeader = () => {
  const t = useTranslations('AppHeader');

  return (
    <header
      role="banner"
      className="bg-background sticky top-0 z-30 flex h-[var(--app-header-height)] items-center gap-3 border-b px-4"
    >
      <SidebarTrigger aria-label={t('toggleSidebar')} />
      <div className="ml-auto flex items-center gap-2">
        <ThemeSwitcher />
        <Suspense fallback={null}>
          <LanguageSwitcher />
        </Suspense>
        <UserAvatar />
      </div>
    </header>
  );
};
