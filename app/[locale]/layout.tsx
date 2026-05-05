import type { Metadata } from 'next';
import { type Locale } from 'next-intl';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { type ReactNode } from 'react';

import { Providers } from '@/app/providers';
import { routing } from '@/i18n';
import { getMessages, getTranslations, setRequestLocale } from '@/i18n/server';
import { HtmlLangSync, SidebarInset, SidebarProvider } from '@/src/shared/ui';
import { AppHeader } from '@/src/widgets/app-header';
import { AppSidebar } from '@/src/widgets/app-sidebar';

const SIDEBAR_COOKIE = 'sidebar_state';

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export const generateStaticParams = () => routing.locales.map((locale) => ({ locale }));

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { locale } = await params;
  const t = await getTranslations({ locale: locale as Locale, namespace: 'Metadata' });
  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      languages: { en: '/en', ru: '/ru' },
    },
  };
};

const LocaleLayout = async ({ children, params }: Props) => {
  const { locale } = await params;

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  setRequestLocale(locale as Locale);
  const [messages, cookieStore] = await Promise.all([getMessages(), cookies()]);
  const sidebarOpen = cookieStore.get(SIDEBAR_COOKIE)?.value !== 'false';

  return (
    <NextIntlClientProvider messages={messages}>
      <Providers>
        <HtmlLangSync />
        <SidebarProvider defaultOpen={sidebarOpen}>
          <AppSidebar />
          <SidebarInset className="min-h-dvh">
            <AppHeader />
            <main className="flex flex-1 flex-col px-[var(--app-content-px)] py-[var(--app-content-py)]">
              {children}
            </main>
          </SidebarInset>
        </SidebarProvider>
      </Providers>
    </NextIntlClientProvider>
  );
};

export default LocaleLayout;
