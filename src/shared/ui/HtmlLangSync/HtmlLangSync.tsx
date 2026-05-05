'use client';

import { useEffect } from 'react';

import { useLocale } from '@/i18n';

/** Keeps <html lang> in sync with the active next-intl locale on the client. */
export const HtmlLangSync = () => {
  const locale = useLocale();

  useEffect(() => {
    if (document.documentElement.lang !== locale) {
      document.documentElement.lang = locale;
    }
  }, [locale]);

  return null;
};
