import type { Metadata } from 'next';
import type { Locale } from 'next-intl';

import { getTranslations } from '@/i18n/server';
import { ClientsView } from '@/src/views/ClientsView/ClientsView';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale: locale as Locale, namespace: 'Clients' });
  return { title: t('title') };
}

export default function ClientsPage() {
  return <ClientsView />;
}
