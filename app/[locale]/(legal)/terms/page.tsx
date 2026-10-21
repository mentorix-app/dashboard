import type { Metadata } from 'next';
import { type Locale } from 'next-intl';

import { getTranslations } from '@/i18n/server';
import { ROUTES } from '@/src/shared/lib';
import { LegalView } from '@/src/views/LegalView';

type Props = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'TermsOfService' });
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: {
      canonical: `/${locale}${ROUTES.terms}`,
      languages: { en: `/en${ROUTES.terms}`, ru: `/ru${ROUTES.terms}` },
    },
  };
}

export default async function TermsPage({ params }: Props) {
  const { locale } = await params;
  return <LegalView locale={locale} document="TermsOfService" />;
}
