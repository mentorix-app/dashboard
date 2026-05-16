import { routing } from '@/i18n';
import { type ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { getMessages, setRequestLocale } from '@/i18n/server';
import { type Locale } from 'next-intl';

export type LayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export const getLayoutConfig = async (props: LayoutProps) => {
  const { params, children } = props;
  const { locale } = await params;

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  setRequestLocale(locale as Locale);
  const messages = await getMessages();

  return { messages, children };
};
