'use client';

import { Check, Flame, Play, Smartphone } from 'lucide-react';

import { Link } from '@/i18n/navigation';
import { useTranslations } from '@/i18n';
import { ROUTES } from '@/src/shared/lib';
import { Badge, Button } from '@/src/shared/ui';

import { Reveal } from './Reveal';

const PhoneMock = () => {
  const t = useTranslations('Landing');

  return (
    <div className="relative mx-auto w-[240px] sm:w-[280px]">
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-8 -z-10 rounded-full bg-[radial-gradient(circle,color-mix(in_oklch,var(--primary)_16%,transparent),transparent_70%)]"
      />
      <div className="border-border/70 bg-card rounded-[2.5rem] border-[6px] p-2.5 shadow-2xl shadow-black/10 dark:shadow-black/50">
        <div className="bg-background relative overflow-hidden rounded-[1.9rem]">
          <div className="bg-card/80 absolute top-0 right-0 left-0 z-10 flex justify-center pt-2">
            <span className="bg-foreground/15 h-1.5 w-16 rounded-full" />
          </div>
          <div className="space-y-4 px-4 pt-8 pb-6">
            <div className="flex items-center justify-between">
              <span className="font-semibold">{t('mobile.phone.app')}</span>
              <Flame className="size-5 text-orange-500" />
            </div>
            <div className="border-border/60 bg-muted/40 rounded-2xl border p-4">
              <p className="text-muted-foreground text-xs">{t('mobile.phone.todayWorkout')}</p>
              <p className="mt-1 font-semibold">{t('mobile.phone.session')}</p>
              <Button size="sm" className="mt-3 w-full">
                <Play className="size-4" />
                {t('mobile.phone.start')}
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" size="sm" className="gap-1">
                <Flame className="size-3 text-orange-500" />
                {t('mobile.phone.streak')}
              </Badge>
            </div>
            <div className="space-y-2">
              {[70, 55, 85].map((width, index) => (
                <div key={index} className="bg-muted h-2.5 rounded-full" style={{ width: `${width}%` }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const MobileAppSection = () => {
  const t = useTranslations('Landing');
  const features = t.raw('mobile.features') as string[];

  return (
    <section className="bg-muted/30 border-y py-8 sm:py-20 lg:py-24">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <Reveal className="order-2 lg:order-1">
          <Badge variant="outline" size="lg" className="mb-5 gap-1.5 rounded-full">
            <Smartphone className="size-3.5" />
            {t('mobile.badge')}
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">{t('mobile.title')}</h2>
          <p className="text-muted-foreground mt-4 text-lg text-pretty">{t('mobile.description')}</p>

          <ul className="mt-6 space-y-3">
            {features.map((feature) => (
              <li key={feature} className="flex items-start gap-3">
                <span className="bg-primary/10 text-primary mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full">
                  <Check className="size-3.5" />
                </span>
                <span className="text-sm">{feature}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <Button asChild size="lg" className="h-11 px-6">
              <Link href={ROUTES.signup}>{t('mobile.cta')}</Link>
            </Button>
            <p className="text-muted-foreground text-xs">{t('mobile.soon')}</p>
          </div>
        </Reveal>

        <Reveal delay={120} className="order-1 lg:order-2">
          <PhoneMock />
        </Reveal>
      </div>
    </section>
  );
};
