import type { Metadata } from 'next';
import type { Locale } from 'next-intl';

import { LoginPage } from '@/src/views/login';
import { getTranslations } from '@/i18n/server';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale: locale as Locale, namespace: 'Login' });
  return {
    title: t('pageTitle'),
    description: t('metadataDescription'),
  };
}

export default async function LoginRoutePage({ params }: Props) {
  const { locale } = await params;
  return <LoginPage locale={locale} />;
}
