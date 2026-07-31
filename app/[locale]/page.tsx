import type { Metadata } from 'next';
import { type Locale } from 'next-intl';

import { getTranslations } from '@/i18n/server';
import { LandingView } from '@/src/views/LandingView/LandingView';

type Props = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Landing' });

  const title = t('meta.title');
  const description = t('meta.description');

  return {
    title,
    description,
    keywords: t('meta.keywords'),
    openGraph: { title, description },
    twitter: { title, description },
  };
}

export default async function LandingPage({ params }: Props) {
  const { locale } = await params;
  return <LandingView locale={locale} />;
}
