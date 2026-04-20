'use client';

import { useCallback, useSyncExternalStore } from 'react';
import { useTranslations } from '@/i18n';
import { THEME_STORAGE_KEY } from '@/src/shared/lib/theme-inline-script';

type ResolvedTheme = 'light' | 'dark';

const getThemeSnapshot = (): ResolvedTheme => (document.documentElement.classList.contains('dark') ? 'dark' : 'light');

const getServerSnapshot = (): ResolvedTheme => 'light';

const themeSwitchButtonClassName =
  'inline-flex min-h-9 min-w-9 items-center justify-center rounded-md p-2 text-zinc-700 transition hover:bg-zinc-100 focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-zinc-200 dark:hover:bg-zinc-800 dark:focus-visible:ring-zinc-100 dark:focus-visible:ring-offset-zinc-950';

const subscribeToTheme = (onChange: () => void) => {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  const onStorage = (event: StorageEvent) => {
    if (event.key === THEME_STORAGE_KEY || event.key === null) {
      onChange();
    }
  };
  window.addEventListener('storage', onStorage);
  return () => {
    observer.disconnect();
    window.removeEventListener('storage', onStorage);
  };
};

export function ThemeSwitcher() {
  const t = useTranslations('ThemeSwitcher');
  const resolved = useSyncExternalStore(subscribeToTheme, getThemeSnapshot, getServerSnapshot);

  const handleLight = useCallback(() => {
    localStorage.setItem(THEME_STORAGE_KEY, 'light');
    document.documentElement.classList.remove('dark');
  }, []);

  const handleDark = useCallback(() => {
    localStorage.setItem(THEME_STORAGE_KEY, 'dark');
    document.documentElement.classList.add('dark');
  }, []);

  const isLightPressed = resolved === 'light';
  const isDarkPressed = resolved === 'dark';

  return (
    <div role="group" aria-label={t('groupLabel')} className="inline-flex items-center gap-1" suppressHydrationWarning>
      <button
        type="button"
        onClick={handleLight}
        className={themeSwitchButtonClassName}
        aria-pressed={isLightPressed}
        aria-label={t('light')}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
      </button>
      <button
        type="button"
        onClick={handleDark}
        className={themeSwitchButtonClassName}
        aria-pressed={isDarkPressed}
        aria-label={t('dark')}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
      </button>
    </div>
  );
}
