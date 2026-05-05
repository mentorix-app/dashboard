'use client';

import { Moon, Sun } from 'lucide-react';
import { useCallback, useSyncExternalStore } from 'react';

import { useTranslations } from '@/i18n';
import { THEME_STORAGE_KEY } from '@/src/shared/lib/theme';
import { Button } from '@/src/shared/ui';

type ResolvedTheme = 'light' | 'dark';

const getThemeSnapshot = (): ResolvedTheme => (document.documentElement.classList.contains('dark') ? 'dark' : 'light');

const getServerSnapshot = (): ResolvedTheme => 'light';

const subscribeToTheme = (onChange: () => void) => {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

  const handleStorage = (event: StorageEvent) => {
    if (event.key === THEME_STORAGE_KEY || event.key === null) onChange();
  };
  window.addEventListener('storage', handleStorage);

  return () => {
    observer.disconnect();
    window.removeEventListener('storage', handleStorage);
  };
};

export const ThemeSwitcher = () => {
  const t = useTranslations('ThemeSwitcher');
  const resolved = useSyncExternalStore(subscribeToTheme, getThemeSnapshot, getServerSnapshot);
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
