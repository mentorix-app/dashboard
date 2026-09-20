import type { Metadata } from 'next';
import { type Locale } from 'next-intl';

import { getTranslations } from '@/i18n/server';
import { ClientStatsView, type ClientStatsLinkParams } from '@/src/views/ClientStatsView';

type SearchParams = Record<string, string | string[] | undefined>;

type Props = {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<SearchParams>;
};

const firstValue = (value: string | string[] | undefined): string | undefined =>
  Array.isArray(value) ? value[0] : value;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'ClientStatsPage' });

  return {
    title: t('meta.title'),
    description: t('meta.description'),
    robots: { index: false, follow: false },
  };
}

export default async function ClientStatsPage({ searchParams }: Props) {
  const query = await searchParams;
  const linkParams: ClientStatsLinkParams = {
    clientUserId: firstValue(query.client_user_id),
    trainerId: firstValue(query.trainer_id),
    exp: firstValue(query.exp),
    sig: firstValue(query.sig),
  };

  return <ClientStatsView linkParams={linkParams} />;
}
