'use client';

import { ArrowLeft, Pencil } from 'lucide-react';

import { Link, useTranslations } from '@/i18n';
import { ProgramStatusBadge } from '@/src/entities/program';
import { Badge, Typography } from '@/src/shared/ui';

import type { ProgramAnalyticsHeaderVM } from '../ProgramAnalytics.types';

type ProgramAnalyticsHeaderProps = {
  header: ProgramAnalyticsHeaderVM;
};

export const ProgramAnalyticsHeader = ({ header }: ProgramAnalyticsHeaderProps) => {
  const t = useTranslations('ProgramAnalytics');

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Link
          href={header.backHref}
          className="text-muted-foreground hover:text-foreground focus-visible:ring-ring inline-flex items-center gap-1.5 rounded-md text-sm focus-visible:ring-2 focus-visible:outline-none"
        >
          <ArrowLeft className="size-4" aria-hidden />
          {t('backToList')}
        </Link>
        <Link
          href={header.editHref}
          className="border-border hover:bg-muted focus-visible:ring-ring inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium focus-visible:ring-2 focus-visible:outline-none"
        >
          <Pencil className="size-4" aria-hidden />
          {t('editProgram')}
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Typography variant="h1">{header.name}</Typography>
        <ProgramStatusBadge status={header.status} label={header.statusLabel} size="lg" />
        <Badge variant="outline" size="lg">
          {header.versionLabel}
        </Badge>
        <Badge variant="outline" size="lg">
          {header.trainingDaysLabel}
        </Badge>
      </div>

      <Typography variant="p-sm" className="text-muted-foreground">
        {header.lastActivityLabel}
      </Typography>
    </div>
  );
};
