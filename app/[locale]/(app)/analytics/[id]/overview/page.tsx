import type { Metadata } from 'next';
import type { Locale } from 'next-intl';

import { getTranslations } from '@/i18n/server';
import { ProgramAnalytics } from '@/src/widgets/ProgramAnalytics';

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale: locale as Locale, namespace: 'ProgramAnalytics' });
  return { title: t('title') };
}

export default async function ProgramAnalyticsOverviewPage({ params }: Props) {
  const { id } = await params;
  return <ProgramAnalytics programId={id} />;
}
