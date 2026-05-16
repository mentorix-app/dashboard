import { type Locale } from 'next-intl';
import { redirect } from '@/i18n';
import { ROUTES } from '@/src/shared/lib';

export default async function LocaleIndexPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  redirect({ href: ROUTES.dashboard, locale });
}
