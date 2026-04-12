import type { Locale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

const locales = routing.locales;

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !locales.includes(locale as (typeof locales)[number])) {
    locale = routing.defaultLocale;
  }

  const resolved = locale as Locale;

  return {
    locale: resolved,
    messages: (await import(`./messages/${resolved}.json`)).default,
  };
});
