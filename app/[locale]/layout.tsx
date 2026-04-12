import type { Metadata } from 'next';
import type { Locale } from 'next-intl';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from '@/i18n/server';
import { Suspense, type ReactNode } from 'react';
import { Providers } from '@/app/providers';
import { LanguageSwitcher } from '@/components/language-switcher';
import { routing } from '@/i18n';

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale: locale as Locale, namespace: 'Metadata' });
  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      languages: {
        en: '/en',
        ru: '/ru',
      },
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  setRequestLocale(locale as Locale);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <Providers>
        <div className="flex justify-end gap-2 border-b border-zinc-200 px-4 py-2 dark:border-zinc-800">
          <Suspense fallback={null}>
            <LanguageSwitcher />
          </Suspense>
        </div>
        {children}
      </Providers>
    </NextIntlClientProvider>
  );
}
