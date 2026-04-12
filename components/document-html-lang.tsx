'use client';

import { useLocale } from '@/i18n';
import { useLayoutEffect } from 'react';

/** Updates `<html lang>` from the active next-intl locale (root layout can lag on client navigation). */
export function DocumentHtmlLang() {
  const locale = useLocale();

  useLayoutEffect(() => {
    document.documentElement.setAttribute('lang', locale);
  }, [locale]);

  return null;
}
