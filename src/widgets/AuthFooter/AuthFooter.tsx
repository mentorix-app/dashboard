'use client';

import { Suspense } from 'react';

import { Link } from '@/i18n/navigation';
import { useTranslations } from '@/i18n';
import { LanguageSwitcher } from '@/src/features/LanguageSwitcher/LanguageSwitcher';
import { ThemeSwitcher } from '@/src/features/ThemeSwitcher/ThemeSwitcher';
import { FOOTER_LINKS } from './AuthFooter.constants';

const LINK_CLASS = 'text-muted-foreground hover:text-foreground text-xs transition-colors';

export const AuthFooter = () => {
  const t = useTranslations('Legal');

  return (
    <footer className="border-t px-6 py-4">
      <div className="mx-auto flex max-w-screen-sm flex-col items-center gap-3 sm:flex-row sm:justify-between">
        <p className="text-muted-foreground text-xs">
          © {new Date().getFullYear()} Mentorix. {t('rights')}
        </p>
        <nav aria-label="Footer" className="flex flex-wrap justify-center gap-x-4 gap-y-1">
          {FOOTER_LINKS.map(({ key, href, internal }) =>
            internal ? (
              <Link key={key} href={href} className={LINK_CLASS}>
                {t(key)}
              </Link>
            ) : (
              <a key={key} href={href} className={LINK_CLASS}>
                {t(key)}
              </a>
            )
          )}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeSwitcher />
          <Suspense fallback={null}>
            <LanguageSwitcher />
          </Suspense>
        </div>
      </div>
    </footer>
  );
};
