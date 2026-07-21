'use client';

import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import { useTranslations } from '@/i18n';
import {
  Card,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  Typography,
  type ChartConfig,
} from '@/src/shared/ui';

import type { WeeklyDropOffPoint } from '../ProgramAnalytics.types';

type WeeklyDropOffProps = {
  chartConfig: ChartConfig;
  chartData: WeeklyDropOffPoint[];
};

export const WeeklyDropOff = ({ chartConfig, chartData }: WeeklyDropOffProps) => {
  const t = useTranslations('ProgramAnalytics');

  return (
    <Card className="flex flex-col gap-4 p-6">
      <header className="flex flex-col gap-1">
        <Typography variant="h3">{t('weekly.heading')}</Typography>
        <Typography variant="p-xs" className="text-muted-foreground">
          {t('weekly.note')}
        </Typography>
      </header>

      {chartData.length > 0 ? (
        <ChartContainer config={chartConfig} className="max-h-64 w-full">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="week" tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip content={<ChartTooltipContent className="min-w-52" />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="completions" fill="var(--color-completions)" radius={4} />
            <Bar dataKey="distinctClients" fill="var(--color-distinctClients)" radius={4} />
          </BarChart>
        </ChartContainer>
      ) : (
        <Typography variant="p-sm" className="text-muted-foreground">
          {t('weekly.empty')}
        </Typography>
      )}
    </Card>
  );
};
