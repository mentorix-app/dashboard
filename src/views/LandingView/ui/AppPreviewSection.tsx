'use client';

import { Activity, GripVertical, Pencil, TrendingUp, Users } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

import { useTranslations } from '@/i18n';
import {
  Badge,
  Button,
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/src/shared/ui';
import { cn } from '@/src/shared/lib/styles';

import { Reveal } from './Reveal';

const CHART_DATA = [
  { week: 'W1', completed: 58 },
  { week: 'W2', completed: 64 },
  { week: 'W3', completed: 61 },
  { week: 'W4', completed: 72 },
  { week: 'W5', completed: 78 },
  { week: 'W6', completed: 74 },
  { week: 'W7', completed: 86 },
  { week: 'W8', completed: 92 },
];

const CLIENT_STATUS = ['active', 'invited', 'active', 'resting'] as const;
const AVATAR_TINTS = [
  'bg-primary/10 text-primary',
  'bg-sky-500/10 text-sky-600',
  'bg-violet-500/10 text-violet-600',
  'bg-amber-500/10 text-amber-600',
];

const AnalyticsPanel = () => {
  const t = useTranslations('Landing');
  const chartConfig = {
    completed: { label: t('preview.analytics.legend'), color: 'var(--primary)' },
  } satisfies ChartConfig;

  return (
    <div className="grid gap-3 sm:gap-4">
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: Users, label: t('preview.analytics.activeClients'), value: '148' },
          { icon: TrendingUp, label: t('preview.analytics.avgCompletion'), value: '92%' },
          { icon: Activity, label: t('preview.analytics.dropoff'), value: '4.2%' },
        ].map((stat) => (
          <div key={stat.label} className="border-border/60 bg-background rounded-xl border p-3 sm:p-4">
            <stat.icon className="text-muted-foreground size-4" />
            <p className="mt-2 text-xl font-semibold tabular-nums sm:text-2xl">{stat.value}</p>
            <p className="text-muted-foreground mt-0.5 truncate text-[0.7rem] sm:text-xs">{stat.label}</p>
          </div>
        ))}
      </div>
      <div className="border-border/60 bg-background rounded-xl border p-4">
        <p className="text-muted-foreground mb-3 text-sm font-medium">{t('preview.analytics.title')}</p>
        <ChartContainer config={chartConfig} className="h-48 w-full sm:h-56">
          <AreaChart data={CHART_DATA} margin={{ left: 4, right: 4, top: 4 }}>
            <defs>
              <linearGradient id="landingFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-completed)" stopOpacity={0.35} />
                <stop offset="100%" stopColor="var(--color-completed)" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="week" tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Area
              dataKey="completed"
              type="monotone"
              stroke="var(--color-completed)"
              strokeWidth={2}
              fill="url(#landingFill)"
            />
          </AreaChart>
        </ChartContainer>
      </div>
    </div>
  );
};

const BuilderPanel = () => {
  const t = useTranslations('Landing');
  const blocks = t.raw('preview.builder.blocks') as string[];

  return (
    <div className="grid gap-3 sm:grid-cols-[10rem_1fr] sm:gap-4">
      <div className="flex gap-2 overflow-x-auto pb-1 sm:flex-col sm:overflow-visible sm:pb-0">
        {[1, 2, 3, 4].map((week) => (
          <div
            key={week}
            className={cn(
              'bg-card flex shrink-0 items-center gap-2 rounded-md border px-2 py-2 text-sm font-medium transition-colors',
              week === 1 ? 'border-border bg-muted' : 'hover:bg-muted/60 border-transparent'
            )}
          >
            <GripVertical className="text-muted-foreground size-4 shrink-0" />
            {t('preview.builder.week')} {week}
          </div>
        ))}
      </div>

      <div className="min-w-0">
        <div className="mb-3 flex items-center gap-1.5 overflow-x-auto pb-1">
          {[1, 2, 3].map((day) => (
            <span
              key={day}
              className={cn(
                'bg-card shrink-0 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors',
                day === 1
                  ? 'border-border bg-muted text-foreground'
                  : 'text-muted-foreground hover:bg-muted/60 border-transparent'
              )}
            >
              {t('preview.builder.day')} {day}
            </span>
          ))}
        </div>
        <div className="border-border/60 bg-background rounded-xl border p-3">
          <p className="text-muted-foreground mb-2 truncate px-1 text-xs font-medium">
            {t('preview.builder.programTitle')}
          </p>
          <ul className="space-y-2">
            {blocks.map((block) => (
              <li
                key={block}
                className="bg-card hover:bg-muted/60 flex items-center gap-2 rounded-md border px-3 py-2.5 text-sm transition-colors"
              >
                <GripVertical className="text-muted-foreground size-4 shrink-0" />
                <span className="truncate">{block}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

const ClientsPanel = () => {
  const t = useTranslations('Landing');
  const people = t.raw('preview.clients.people') as string[];
  const programs = t.raw('preview.clients.programs') as string[];

  return (
    <div className="flex flex-col gap-2">
      {people.map((person, index) => {
        const status = CLIENT_STATUS[index] ?? 'active';
        const initials = person
          .split(' ')
          .map((part) => part[0])
          .join('');
        return (
          <div
            key={person}
            className="border-border/60 bg-background flex items-center gap-3 rounded-xl border p-3 sm:p-4"
          >
            <span
              className={cn(
                'flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold',
                AVATAR_TINTS[index % AVATAR_TINTS.length]
              )}
            >
              {initials}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="truncate text-sm font-medium">{person}</span>
                <Badge
                  variant={status === 'active' ? 'default' : 'outline'}
                  size="sm"
                  className={cn('gap-1.5', status === 'resting' && 'text-muted-foreground')}
                >
                  <span
                    aria-hidden
                    className={cn(
                      'size-1.5 rounded-full',
                      status === 'active' && 'bg-green-500',
                      status === 'invited' && 'bg-amber-500',
                      status === 'resting' && 'bg-muted-foreground/50'
                    )}
                  />
                  {t(`preview.clients.status.${status}`)}
                </Badge>
              </div>
              <p className="text-muted-foreground truncate text-xs">
                {t('preview.clients.linkedLabel')} · {programs[index % programs.length]}
              </p>
            </div>
            <Button type="button" size="icon-sm" variant="outline" className="shrink-0" tabIndex={-1} aria-hidden>
              <Pencil className="size-4" />
            </Button>
          </div>
        );
      })}
    </div>
  );
};

export const AppPreviewSection = () => {
  const t = useTranslations('Landing');

  return (
    <section id="preview" className="bg-muted/30 scroll-mt-20 border-y py-20 sm:py-24">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <h2 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">{t('preview.title')}</h2>
          </Reveal>
          <Reveal delay={80}>
            <p className="text-muted-foreground mt-4 text-lg text-pretty">{t('preview.subtitle')}</p>
          </Reveal>
        </div>

        <Reveal delay={120} className="mt-12">
          <Tabs defaultValue="analytics" className="w-full gap-0">
            <div className="border-border/70 bg-card overflow-hidden rounded-2xl border shadow-2xl shadow-black/5 dark:shadow-black/40">
              <div className="border-border/60 bg-muted/40 flex flex-wrap items-center gap-3 border-b px-4 py-3 sm:px-5">
                <div className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-full bg-red-400/70" />
                  <span className="size-2.5 rounded-full bg-yellow-400/70" />
                  <span className="size-2.5 rounded-full bg-green-400/70" />
                </div>
                <TabsList className="ml-auto sm:ml-4">
                  <TabsTrigger value="analytics">{t('preview.tabs.analytics')}</TabsTrigger>
                  <TabsTrigger value="builder">{t('preview.tabs.builder')}</TabsTrigger>
                  <TabsTrigger value="clients">{t('preview.tabs.clients')}</TabsTrigger>
                </TabsList>
              </div>

              <div className="min-h-[26rem] p-4 sm:min-h-[24rem] sm:p-6">
                <TabsContent value="analytics">
                  <AnalyticsPanel />
                </TabsContent>
                <TabsContent value="builder">
                  <BuilderPanel />
                </TabsContent>
                <TabsContent value="clients">
                  <ClientsPanel />
                </TabsContent>
              </div>
            </div>
          </Tabs>
        </Reveal>
      </div>
    </section>
  );
};
