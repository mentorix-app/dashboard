'use client';

import { Moon, Sun } from 'lucide-react';
import { useCallback } from 'react';

import { useTranslations } from '@/i18n';
import { useResolvedTheme } from '@/src/shared/hooks';
import { THEME_STORAGE_KEY } from '@/src/shared/lib/theme';
import { Button } from '@/src/shared/ui';

export const ThemeSwitcher = () => {
  const t = useTranslations('ThemeSwitcher');
  const resolved = useResolvedTheme();
  const isDark = resolved === 'dark';

  const handleToggle = useCallback(() => {
    const next = isDark ? 'light' : 'dark';
    localStorage.setItem(THEME_STORAGE_KEY, next);
    document.documentElement.classList.toggle('dark', next === 'dark');
  }, [isDark]);

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      aria-label={isDark ? t('switchToLight') : t('switchToDark')}
      onClick={handleToggle}
      suppressHydrationWarning
    >
      <span className="relative inline-flex size-4 items-center justify-center" aria-hidden>
        <Sun className="absolute inset-0 size-4 scale-100 rotate-0 opacity-100 transition-all duration-200 dark:scale-0 dark:-rotate-90 dark:opacity-0" />
        <Moon className="absolute inset-0 size-4 scale-0 rotate-90 opacity-0 transition-all duration-200 dark:scale-100 dark:rotate-0 dark:opacity-100" />
      </span>
    </Button>
  );
};
