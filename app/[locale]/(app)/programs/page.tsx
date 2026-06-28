import type { Metadata } from 'next';
import type { Locale } from 'next-intl';

import { getTranslations } from '@/i18n/server';
import { ProgramsView } from '@/src/views/ProgramsView/ProgramsView';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale: locale as Locale, namespace: 'Programs' });
  return { title: t('title') };
}

export default function ProgramsPage() {
  return <ProgramsView />;
}
