'use client';

import { Link } from '@/i18n/navigation';
import { useTranslations } from '@/i18n';
import { ROUTES } from '@/src/shared/lib';
import { cn } from '@/src/shared/lib/styles';
import { Badge, Button, Card } from '@/src/shared/ui';

import { Reveal } from './Reveal';

const PLANS = [
  { key: 'free', recommended: false },
  { key: 'advance', recommended: true },
  { key: 'elite', recommended: false },
] as const;

export const PricingSection = () => {
  const t = useTranslations('Landing');
  const dimensions = t.raw('pricing.dimensions') as string[];

  return (
    <section id="pricing" className="scroll-mt-20 py-20 sm:py-24">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <h2 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">{t('pricing.title')}</h2>
          </Reveal>
          <Reveal delay={80}>
            <p className="text-muted-foreground mt-4 text-lg text-pretty">{t('pricing.subtitle')}</p>
          </Reveal>
        </div>

        <div className="mt-14 grid items-stretch gap-6 md:grid-cols-3">
          {PLANS.map((plan, index) => {
            const limits = t.raw(`pricing.limits.${plan.key}`) as string[];

            return (
              <Reveal key={plan.key} delay={index * 80} className="h-full">
                <Card
                  className={cn(
                    'relative h-full gap-6 p-6 sm:p-8',
                    plan.recommended && 'border-primary/60 shadow-primary/5 shadow-xl'
                  )}
                >
                  {plan.recommended && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">{t('pricing.recommended')}</Badge>
                  )}
                  <h3 className="text-lg font-semibold">{t(`pricing.plans.${plan.key}.name`)}</h3>

                  <ul className="flex-1 space-y-3">
                    {dimensions.map((dimension, i) => (
                      <li key={dimension} className="flex items-center justify-between gap-4 text-sm">
                        <span className="text-muted-foreground">{dimension}</span>
                        <span className="font-medium tabular-nums">{limits[i]}</span>
                      </li>
                    ))}
                  </ul>

                  <Button asChild variant={plan.recommended ? 'default' : 'outline'} size="lg" className="w-full">
                    <Link href={ROUTES.signup}>{t('pricing.cta')}</Link>
                  </Button>
                </Card>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={240}>
          <p className="text-muted-foreground mt-8 text-center text-sm">{t('pricing.note')}</p>
        </Reveal>
      </div>
    </section>
  );
};
