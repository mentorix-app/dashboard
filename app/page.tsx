import { redirect } from 'next/navigation';
import { routing } from '@/i18n';

/**
 * Root `/` has no locale segment; send users to the default locale.
 * Keeps the app route tree valid for Turbopack (avoids missing `/page` endpoint).
 */
export default function RootPage() {
  redirect(`/${routing.defaultLocale}`);
}
