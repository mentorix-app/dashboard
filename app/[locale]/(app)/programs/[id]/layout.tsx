import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import type { Locale } from 'next-intl';

import { getTranslations } from '@/i18n/server';
import { ProgramWizardView } from '@/src/views/ProgramWizardView';

type Props = {
  params: Promise<{ locale: string; id: string }>;
  children: ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale: locale as Locale, namespace: 'ProgramWizard' });
  return { title: t('metaTitle') };
}

export default async function ProgramWizardLayout({ params, children }: Props) {
  const { id } = await params;
  return <ProgramWizardView programId={id}>{children}</ProgramWizardView>;
}
