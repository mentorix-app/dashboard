'use client';

import { ArrowRight, CreditCard, Sparkles, Zap } from 'lucide-react';

import { Link } from '@/i18n/navigation';
import { useTranslations } from '@/i18n';
import { ROUTES } from '@/src/shared/lib';
import { Button } from '@/src/shared/ui';

import { Reveal } from './Reveal';

const TRUST_ITEMS = [
  { key: 'free', icon: Sparkles },
  { key: 'noCard', icon: CreditCard },
  { key: 'setup', icon: Zap },
] as const;

export const FinalCtaSection = () => {
  const t = useTranslations('Landing');

  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="border-border/60 bg-card relative overflow-hidden rounded-3xl border px-6 py-14 text-center sm:px-12 sm:py-20">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(70%_60%_at_50%_0%,color-mix(in_oklch,var(--primary)_14%,transparent),transparent)]"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(color-mix(in_oklch,var(--foreground)_4%,transparent)_1px,transparent_1px),linear-gradient(90deg,color-mix(in_oklch,var(--foreground)_4%,transparent)_1px,transparent_1px)] [mask-image:radial-gradient(60%_60%_at_50%_20%,black,transparent)] bg-[size:2.5rem_2.5rem]"
            />
            <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-balance sm:text-4xl">
              {t('cta.title')}
            </h2>
            <p className="text-muted-foreground mx-auto mt-4 max-w-xl text-lg text-pretty">{t('cta.subtitle')}</p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" className="h-12 px-6 text-base">
                <Link href={ROUTES.signup}>
                  {t('cta.primary')}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 px-6 text-base">
                <Link href={ROUTES.login}>{t('cta.secondary')}</Link>
              </Button>
            </div>
            <ul className="text-muted-foreground mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
              {TRUST_ITEMS.map((item) => (
                <li key={item.key} className="flex items-center gap-1.5">
                  <item.icon className="text-primary size-4" />
                  {t(`cta.trust.${item.key}`)}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
