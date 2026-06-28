import { routing } from '@/i18n';
import { getTranslations } from '@/i18n/server';
import { type Locale } from 'next-intl';
import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL } from '@/src/shared/lib';
import { type LayoutProps } from './layout.conf';

export const generateStaticParams = () => routing.locales.map((locale) => ({ locale }));

export const generateMetadata = async ({ params }: LayoutProps): Promise<Metadata> => {
  const { locale } = await params;
  const t = await getTranslations({ locale: locale as Locale, namespace: 'Metadata' });

  const title = t('title');
  const description = t('description');
  const url = `${SITE_URL}/${locale}`;

  return {
    metadataBase: new URL(SITE_URL),
    applicationName: SITE_NAME,
    title: {
      default: title,
      template: `%s · ${SITE_NAME}`,
    },
    description,
    alternates: {
      canonical: url,
      languages: { en: '/en', ru: '/ru' },
    },
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      locale,
      url,
      title,
      description,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
};
