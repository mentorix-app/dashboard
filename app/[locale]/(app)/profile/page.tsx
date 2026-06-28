import type { Metadata } from 'next';
import type { Locale } from 'next-intl';

import { getTranslations } from '@/i18n/server';
import { Profile } from '@/src/views/profile/Profile';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale: locale as Locale, namespace: 'Profile' });
  return { title: t('title') };
}

export default function ProfilePage() {
  return <Profile />;
}
