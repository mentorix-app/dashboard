'use client';

import { BarChart3, LayoutGrid, Send, type LucideIcon } from 'lucide-react';

import { useTranslations } from '@/i18n';

import { Reveal } from './Reveal';

const STEPS = [
  { key: 'one', icon: LayoutGrid },
  { key: 'two', icon: Send },
  { key: 'three', icon: BarChart3 },
] as const satisfies readonly { key: string; icon: LucideIcon }[];

export const HowItWorksSection = () => {
  const t = useTranslations('Landing');

  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <h2 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">{t('howItWorks.title')}</h2>
          </Reveal>
          <Reveal delay={80}>
            <p className="text-muted-foreground mt-4 text-lg text-pretty">{t('howItWorks.subtitle')}</p>
          </Reveal>
        </div>

        <ol className="relative mt-14 grid gap-10 md:grid-cols-3">
          <span
            aria-hidden
            className="bg-border absolute top-5 right-[16.6667%] left-[16.6667%] z-0 hidden h-px md:block"
          />
          {STEPS.map((step, index) => (
            <Reveal as="li" key={step.key} delay={index * 90}>
              <div className="flex flex-col items-center text-center">
                <span className="bg-primary text-primary-foreground relative z-10 flex size-10 items-center justify-center rounded-full text-base font-bold tabular-nums">
                  {index + 1}
                </span>
                <step.icon className="text-muted-foreground mt-3 size-5" />
                <h3 className="mt-3 text-xl font-semibold">{t(`howItWorks.steps.${step.key}.title`)}</h3>
                <p className="text-muted-foreground mt-2 max-w-xs text-pretty">
                  {t(`howItWorks.steps.${step.key}.description`)}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
};
