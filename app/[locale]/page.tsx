import { type Locale } from 'next-intl';

import { redirect } from '@/i18n';

export default async function LocaleIndexPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  redirect({ href: '/dashboard', locale });
}
