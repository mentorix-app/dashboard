import type { Metadata } from 'next';
import type { Locale } from 'next-intl';

import { getTranslations } from '@/i18n/server';
import { SignUpView } from '@/src/views/SignUpView/SignUpView';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale: locale as Locale, namespace: 'Signup' });
  return {
    title: t('pageTitle'),
    description: t('metadataDescription'),
  };
}

export default async function SignupRoutePage({ params }: Props) {
  const { locale } = await params;
  return <SignUpView locale={locale} />;
}
