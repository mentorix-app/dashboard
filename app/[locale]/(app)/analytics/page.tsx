import type { Metadata } from 'next';
import type { Locale } from 'next-intl';

import { getTranslations } from '@/i18n/server';
import { ProgramsAnalyticsView } from '@/src/views/ProgramsAnalyticsView';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale: locale as Locale, namespace: 'ProgramsAnalytics' });
  return { title: t('title') };
}

export default function ProgramsAnalyticsPage() {
  return <ProgramsAnalyticsView />;
}
