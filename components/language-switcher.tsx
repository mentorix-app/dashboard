'use client';

import { routing, useLocale, usePathname, useRouter, useTranslations } from '@/i18n';

export function LanguageSwitcher() {
  const t = useTranslations('LanguageSwitcher');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div role="group" aria-label={t('label')}>
      {routing.locales.map((loc) => (
        <button
          key={loc}
          type="button"
          onClick={() => {
            router.replace(pathname, { locale: loc });
          }}
          disabled={loc === locale}
        >
          {loc === 'ru' ? t('ru') : t('en')}
        </button>
      ))}
    </div>
  );
}
