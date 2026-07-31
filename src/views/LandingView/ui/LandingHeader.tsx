'use client';

import { Menu, X } from 'lucide-react';
import { useState } from 'react';

import { Link } from '@/i18n/navigation';
import { useTranslations } from '@/i18n';
import { ROUTES } from '@/src/shared/lib';
import { cn } from '@/src/shared/lib/styles';
import { Button, Logo } from '@/src/shared/ui';
import { LanguageSwitcher } from '@/src/features/LanguageSwitcher/LanguageSwitcher';
import { ThemeSwitcher } from '@/src/features/ThemeSwitcher/ThemeSwitcher';

const NAV_ITEMS = [
  { key: 'features', href: '#features' },
  { key: 'preview', href: '#preview' },
  { key: 'pricing', href: '#pricing' },
] as const;

export const LandingHeader = () => {
  const t = useTranslations('Landing');
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  return (
    <header className="border-border/60 bg-background/80 sticky top-0 z-50 border-b backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" aria-label="Mentorix" onClick={close} className="shrink-0">
          <Logo className="h-8" />
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.key}
              href={item.href}
              className="text-muted-foreground hover:text-foreground rounded-md px-3 py-2 text-sm font-medium transition-colors"
            >
              {t(`nav.${item.key}`)}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <LanguageSwitcher />
          <ThemeSwitcher />
          <Button asChild variant="ghost" size="sm">
            <Link href={ROUTES.login}>{t('nav.signIn')}</Link>
          </Button>
          <Button asChild size="sm">
            <Link href={ROUTES.signup}>{t('nav.getStarted')}</Link>
          </Button>
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <ThemeSwitcher />
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={open ? t('nav.closeMenu') : t('nav.openMenu')}
            aria-expanded={open}
            onClick={() => setOpen((prev) => !prev)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      <div
        className={cn(
          'grid overflow-hidden transition-all duration-300 ease-out md:hidden',
          open ? 'border-border/60 grid-rows-[1fr] border-t' : 'grid-rows-[0fr]'
        )}
      >
        <div className="min-h-0">
          <nav aria-label="Mobile" className="flex flex-col gap-1 px-4 py-4 sm:px-6">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.key}
                href={item.href}
                onClick={close}
                className="text-foreground hover:bg-muted rounded-md px-3 py-2.5 text-base font-medium transition-colors"
              >
                {t(`nav.${item.key}`)}
              </a>
            ))}
            <div className="my-2 flex items-center justify-between gap-2">
              <LanguageSwitcher />
            </div>
            <Button asChild variant="outline" onClick={close}>
              <Link href={ROUTES.login}>{t('nav.signIn')}</Link>
            </Button>
            <Button asChild onClick={close}>
              <Link href={ROUTES.signup}>{t('nav.getStarted')}</Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
};
