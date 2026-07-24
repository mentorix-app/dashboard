import type { Metadata } from 'next';
import type { Locale } from 'next-intl';

import { getTranslations } from '@/i18n/server';
import { ProgramWeekResults } from '@/src/widgets/ProgramWeekResults';

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale: locale as Locale, namespace: 'ProgramWeekResults' });
  return { title: t('title') };
}

export default async function ProgramAnalyticsResultsPage({ params }: Props) {
  const { id } = await params;
  return <ProgramWeekResults programId={id} />;
}
