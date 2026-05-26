import { Suspense } from 'react';
import { LanguageSwitcher } from '@/src/features/LanguageSwitcher/LanguageSwitcher';
import { ThemeSwitcher } from '@/src/features/ThemeSwitcher/ThemeSwitcher';
import { FOOTER_COPYRIGHT, FOOTER_LINKS } from './AuthFooter.constants';

export const AuthFooter = () => (
  <footer className="border-t px-6 py-4">
    <div className="mx-auto flex max-w-screen-sm flex-col items-center gap-3 sm:flex-row sm:justify-between">
      <p className="text-muted-foreground text-xs">{FOOTER_COPYRIGHT}</p>
      <nav aria-label="Footer" className="flex flex-wrap justify-center gap-x-4 gap-y-1">
        {FOOTER_LINKS.map(({ label, href }) => (
          <a key={href} href={href} className="text-muted-foreground hover:text-foreground text-xs transition-colors">
            {label}
          </a>
        ))}
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
