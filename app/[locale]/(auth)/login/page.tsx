import type { Metadata } from 'next';
import type { Locale } from 'next-intl';

import { isAuthErrorCode } from '@/src/entities/auth';
import { LoginView } from '@/src/views/LoginView/LoginView';
import { getTranslations } from '@/i18n/server';

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ error?: string | string[]; deleted?: string | string[] }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale: locale as Locale, namespace: 'Login' });
  return {
    title: t('pageTitle'),
    description: t('metadataDescription'),
  };
}

export default async function LoginRoutePage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { error, deleted } = await searchParams;
  const errorCode = isAuthErrorCode(error) ? error : undefined;

  return <LoginView locale={locale} errorCode={errorCode} accountDeleted={deleted === '1'} />;
}
