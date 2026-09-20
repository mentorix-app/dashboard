'use client';

import { useTransition } from 'react';

import { routing, useLocale, usePathname, useRouter, useTranslations } from '@/i18n';
import { cn } from '@/src/shared/lib';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/shared/ui';

type LocaleCode = (typeof routing.locales)[number];

type LanguageSwitcherProps = {
  compact?: boolean;
  inverse?: boolean;
};

export const LanguageSwitcher = ({ compact = false, inverse = false }: LanguageSwitcherProps) => {
  const t = useTranslations('LanguageSwitcher');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleChange = (next: string) => {
    if (next === locale) return;
    startTransition(() => {
      router.replace(`${pathname}${window.location.search}`, { locale: next as LocaleCode });
    });
  };

  return (
    <Select value={locale} onValueChange={handleChange} disabled={isPending}>
      <SelectTrigger
        size="sm"
        aria-label={t('label')}
        className={cn(
          compact ? 'min-w-0 gap-1.5 px-2' : 'min-w-[5rem]',
          inverse && "border-white/25 bg-white/10 text-white hover:bg-white/15 [&_svg:not([class*='text-'])]:text-white"
        )}
      >
        <SelectValue>{compact ? locale.toUpperCase() : undefined}</SelectValue>
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
