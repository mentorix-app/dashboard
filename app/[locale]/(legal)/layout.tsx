import { type ReactNode } from 'react';
import { type Locale } from 'next-intl';

import { Link } from '@/i18n/navigation';
import { getTranslations } from '@/i18n/server';
import { HtmlLangSync, Logo } from '@/src/shared/ui';
import { AuthFooter } from '@/src/widgets/AuthFooter/AuthFooter';

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

/** Public frame of the legal pages: a bar that leads back to the landing, the page, the shared footer. */
const LegalLayout = async ({ children, params }: Props) => {
  const { locale } = await params;
  const t = await getTranslations({ locale: locale as Locale, namespace: 'Legal' });

  return (
    <>
      <HtmlLangSync />
      <div className="flex min-h-svh flex-col">
        <header className="border-b">
          <div className="mx-auto flex h-14 w-full max-w-3xl items-center justify-between px-4">
            <Link href="/" aria-label={t('backToSite')}>
              <Logo className="h-7" />
            </Link>
            <Link href="/" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
              {t('backToSite')}
            </Link>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <AuthFooter />
      </div>
    </>
  );
};

export default LegalLayout;
