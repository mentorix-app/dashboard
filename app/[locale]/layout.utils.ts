import { routing } from '@/i18n';
import { getTranslations } from '@/i18n/server';
import { type Locale } from 'next-intl';
import type { Metadata } from 'next';
import { type LayoutProps } from './layout.conf';

export const generateStaticParams = () => routing.locales.map((locale) => ({ locale }));

export const generateMetadata = async ({ params }: LayoutProps): Promise<Metadata> => {
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
