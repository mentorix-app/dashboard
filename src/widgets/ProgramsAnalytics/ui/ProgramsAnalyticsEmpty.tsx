'use client';

import { useTranslations } from '@/i18n';
import { Typography } from '@/src/shared/ui';

type ProgramsAnalyticsEmptyProps = {
  isSearching: boolean;
};

export const ProgramsAnalyticsEmpty = ({ isSearching }: ProgramsAnalyticsEmptyProps) => {
  const t = useTranslations('ProgramsAnalytics');

  return (
    <div className="border-border text-muted-foreground flex min-h-40 items-center justify-center rounded-md border border-dashed p-8 text-center">
      <Typography variant="p-sm">{isSearching ? t('emptySearch') : t('empty')}</Typography>
    </div>
  );
};
