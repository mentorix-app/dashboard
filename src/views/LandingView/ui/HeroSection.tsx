'use client';

import {
  ArrowRight,
  Activity,
  BarChart3,
  Globe2,
  LayoutGrid,
  Send,
  TrendingUp,
  Users,
  type LucideIcon,
} from 'lucide-react';

import { Link } from '@/i18n/navigation';
import { useTranslations } from '@/i18n';
import { ROUTES } from '@/src/shared/lib';
import { Badge, Button } from '@/src/shared/ui';

import { Reveal } from './Reveal';

const HIGHLIGHTS = [
  { key: 'builder', icon: LayoutGrid },
  { key: 'onboarding', icon: Send },
  { key: 'insights', icon: Activity },
  { key: 'languages', icon: Globe2 },
] as const satisfies readonly { key: string; icon: LucideIcon }[];
const MOCK_BARS = [52, 64, 58, 72, 80, 76, 88, 92];

const DashboardMock = () => {
  const t = useTranslations('Landing');

  return (
    <div className="border-border/70 bg-card relative overflow-hidden rounded-2xl border shadow-2xl shadow-black/5 dark:shadow-black/40">
      <div className="border-border/60 bg-muted/40 flex items-center gap-1.5 border-b px-4 py-3">
        <span className="size-2.5 rounded-full bg-red-400/70" />
        <span className="size-2.5 rounded-full bg-yellow-400/70" />
        <span className="size-2.5 rounded-full bg-green-400/70" />
        <span className="text-muted-foreground ml-3 text-xs font-medium">{t('hero.mock.title')}</span>
        <Badge variant="secondary" size="sm" className="ml-auto gap-1">
          <span className="size-1.5 animate-pulse rounded-full bg-green-500" />
          {t('hero.mock.live')}
        </Badge>
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Users, label: t('hero.mock.activeClients'), value: '148' },
            { icon: TrendingUp, label: t('hero.mock.completion'), value: '92%' },
            { icon: BarChart3, label: t('hero.mock.programs'), value: '24' },
          ].map((card) => (
            <div key={card.label} className="border-border/60 bg-background rounded-xl border p-3">
              <card.icon className="text-muted-foreground size-4" />
              <p className="mt-2 text-lg font-semibold tabular-nums">{card.value}</p>
              <p className="text-muted-foreground truncate text-[0.7rem]">{card.label}</p>
            </div>
          ))}
        </div>

        <div className="border-border/60 bg-background rounded-xl border p-4">
          <p className="text-muted-foreground mb-3 text-xs font-medium">{t('hero.mock.weeklyCompletion')}</p>
          <div className="flex h-24 items-end gap-2">
            {MOCK_BARS.map((height, index) => (
              <div
                key={index}
                className="bg-primary/80 hover:bg-primary flex-1 rounded-t transition-all"
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const HeroSection = () => {
  const t = useTranslations('Landing');

  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,color-mix(in_oklch,var(--primary)_9%,transparent),transparent)]"
      />
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:gap-8 lg:px-8 lg:py-28">
        <div className="flex flex-col items-start text-left">
          <Reveal>
            <Badge variant="outline" size="lg" className="mb-5 rounded-full">
              {t('hero.badge')}
            </Badge>
          </Reveal>
          <Reveal delay={60}>
            <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
              {t('hero.title')}
            </h1>
          </Reveal>
          <Reveal delay={120}>
            <p className="text-muted-foreground mt-6 max-w-xl text-lg text-pretty">{t('hero.subtitle')}</p>
          </Reveal>
          <Reveal delay={180} className="w-full">
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button asChild size="lg" className="h-12 px-6 text-base">
                <Link href={ROUTES.signup}>
                  {t('hero.ctaPrimary')}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 px-6 text-base">
                <Link href={ROUTES.login}>{t('hero.ctaSecondary')}</Link>
              </Button>
            </div>
            <p className="text-muted-foreground mt-4 text-sm">{t('hero.note')}</p>
          </Reveal>
        </div>

        <Reveal delay={220} className="w-full">
          <DashboardMock />
        </Reveal>
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <Reveal>
          <ul className="border-border/60 bg-card/40 grid grid-cols-2 gap-4 rounded-2xl border p-6 sm:p-8 lg:grid-cols-4 lg:gap-6">
            {HIGHLIGHTS.map((item) => (
              <li key={item.key} className="flex items-center gap-3">
                <span className="bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-lg">
                  <item.icon className="size-4.5" />
                </span>
                <span className="text-sm leading-snug font-medium text-balance">{t(`highlights.${item.key}`)}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
};
