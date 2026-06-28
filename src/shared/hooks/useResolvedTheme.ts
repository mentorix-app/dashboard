'use client';

import { useSyncExternalStore } from 'react';

import { THEME_STORAGE_KEY } from '@/src/shared/lib/theme';

export type ResolvedTheme = 'light' | 'dark';

const getSnapshot = (): ResolvedTheme => (document.documentElement.classList.contains('dark') ? 'dark' : 'light');

const getServerSnapshot = (): ResolvedTheme => 'light';

const subscribe = (onChange: () => void) => {
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

export const useResolvedTheme = (): ResolvedTheme => useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
