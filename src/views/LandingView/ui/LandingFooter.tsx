'use client';

import { Link } from '@/i18n/navigation';
import { useTranslations } from '@/i18n';
import { ROUTES } from '@/src/shared/lib';
import { Logo } from '@/src/shared/ui';

const FOOTER_LINKS = [
  { key: 'features', href: '#features', internal: false },
  { key: 'preview', href: '#preview', internal: false },
  { key: 'pricing', href: '#pricing', internal: false },
  { key: 'signIn', href: ROUTES.login, internal: true },
  { key: 'signUp', href: ROUTES.signup, internal: true },
] as const;

export const LandingFooter = () => {
  const t = useTranslations('Landing');
  const year = new Date().getFullYear();

  return (
    <footer className="border-border/60 border-t">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-4 px-4 py-8 sm:flex-row sm:justify-between sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Logo className="h-6" />
          <span className="text-muted-foreground text-sm">
            © {year} Mentorix. {t('footer.rights')}
          </span>
        </div>

        <nav aria-label={t('footer.navLabel')}>
          <ul className="text-muted-foreground flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
            {FOOTER_LINKS.map((link) =>
              link.internal ? (
                <li key={link.key}>
                  <Link href={link.href} className="hover:text-foreground transition-colors">
                    {t(`footer.links.${link.key}`)}
                  </Link>
                </li>
              ) : (
                <li key={link.key}>
                  <a href={link.href} className="hover:text-foreground transition-colors">
                    {t(`footer.links.${link.key}`)}
                  </a>
                </li>
              )
            )}
          </ul>
        </nav>
      </div>
    </footer>
  );
};
