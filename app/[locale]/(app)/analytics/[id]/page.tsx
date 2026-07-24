import { type Locale } from 'next-intl';

import { redirect } from '@/i18n';
import { ROUTES } from '@/src/shared/lib';

type Props = {
  params: Promise<{ locale: Locale; id: string }>;
};

export default async function ProgramAnalyticsPage({ params }: Props) {
  const { locale, id } = await params;
  redirect({ href: ROUTES.programAnalyticsOverview(id), locale });
}
