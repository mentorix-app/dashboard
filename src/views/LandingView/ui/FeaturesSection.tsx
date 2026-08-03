'use client';

import { BarChart3, Dumbbell, Globe, History, LayoutGrid, Send, type LucideIcon } from 'lucide-react';

import { useTranslations } from '@/i18n';
import { Card } from '@/src/shared/ui';

import { Reveal } from './Reveal';

const FEATURES = [
  { key: 'library', icon: Dumbbell },
  { key: 'builder', icon: LayoutGrid },
  { key: 'invites', icon: Send },
  { key: 'analytics', icon: BarChart3 },
  { key: 'versioning', icon: History },
  { key: 'global', icon: Globe },
] as const satisfies readonly { key: string; icon: LucideIcon }[];

export const FeaturesSection = () => {
  const t = useTranslations('Landing');

  return (
    <section id="features" className="scroll-mt-20 py-8 sm:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <h2 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">{t('features.title')}</h2>
          </Reveal>
          <Reveal delay={80}>
            <p className="text-muted-foreground mt-4 text-lg text-pretty">{t('features.subtitle')}</p>
          </Reveal>
        </div>

        <div className="mt-10 grid gap-5 sm:mt-14 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, index) => (
            <Reveal key={feature.key} delay={index * 60}>
              <Card className="group hover:border-primary/40 h-full gap-4 p-6 transition-colors">
                <div className="bg-primary/10 text-primary flex size-11 items-center justify-center rounded-xl transition-transform group-hover:scale-105">
                  <feature.icon className="size-5.5" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-lg font-semibold">{t(`features.items.${feature.key}.title`)}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed text-pretty">
                    {t(`features.items.${feature.key}.description`)}
                  </p>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
