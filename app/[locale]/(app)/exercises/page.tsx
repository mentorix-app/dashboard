import type { Metadata } from 'next';
import type { Locale } from 'next-intl';

import { getTranslations } from '@/i18n/server';
import { ExercisesView } from '@/src/views/ExercisesView/ExercisesView';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale: locale as Locale, namespace: 'Exercises' });
  return { title: t('title') };
}

export default function ExercisesPage() {
  return <ExercisesView />;
}
