'use client';

import { useTransition } from 'react';

import { routing, useLocale, usePathname, useRouter, useTranslations } from '@/i18n';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/shared/ui';

type LocaleCode = (typeof routing.locales)[number];

export const LanguageSwitcher = () => {
  const t = useTranslations('LanguageSwitcher');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleChange = (next: string) => {
    if (next === locale) return;
    startTransition(() => {
      router.replace(pathname, { locale: next as LocaleCode });
    });
  };

  return (
    <Select value={locale} onValueChange={handleChange} disabled={isPending}>
      <SelectTrigger size="sm" aria-label={t('label')} className="min-w-[5rem]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {routing.locales.map((loc) => (
          <SelectItem key={loc} value={loc}>
            {loc === 'ru' ? t('ru') : t('en')}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
