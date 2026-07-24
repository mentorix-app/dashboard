'use client';

import { ArrowLeft, Pencil } from 'lucide-react';

import { Link, useLocale, useTranslations } from '@/i18n';
import { useProgramAnalytics } from '@/src/entities/analytics';
import { getProgramName, ProgramStatusBadge } from '@/src/entities/program';
import { formatDate, ROUTES } from '@/src/shared/lib';
import { Badge, Skeleton, Typography } from '@/src/shared/ui';

import { toProgramStatusEnum } from '../ProgramAnalyticsDetailShell.utils';

type DetailHeaderProps = {
  programId: string;
};

export const DetailHeader = ({ programId }: DetailHeaderProps) => {
  const t = useTranslations('ProgramAnalytics');
  const locale = useLocale();
  const { data, isPending } = useProgramAnalytics(programId);

  if (isPending) {
    return (
      <div className="flex flex-col gap-3">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-9 w-72" />
        <Skeleton className="h-4 w-40" />
      </div>
    );
  }

  if (!data) return null;

  const { program, summary } = data;
  const versionLabel =
    program.latestVersionNumber > 0 ? t('version', { number: program.latestVersionNumber }) : t('notPublished');
  const lastActivityLabel = summary.lastActivityAt
    ? t('lastActivity', { date: formatDate(summary.lastActivityAt, locale, 'shortDate') })
    : t('lastActivityNever');

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Link
          href={ROUTES.analytics}
          className="text-muted-foreground hover:text-foreground focus-visible:ring-ring inline-flex items-center gap-1.5 rounded-md text-sm focus-visible:ring-2 focus-visible:outline-none"
        >
          <ArrowLeft className="size-4" aria-hidden />
          {t('backToList')}
        </Link>
        <Link
          href={ROUTES.programBasics(program.programId)}
          className="border-border hover:bg-muted focus-visible:ring-ring inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium focus-visible:ring-2 focus-visible:outline-none"
        >
          <Pencil className="size-4" aria-hidden />
          {t('editProgram')}
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Typography variant="h1">{getProgramName(program, locale)}</Typography>
        <ProgramStatusBadge
          status={toProgramStatusEnum(program.status)}
          label={t(`status.${program.status}`)}
          size="lg"
        />
        <Badge variant="outline" size="lg">
          {versionLabel}
        </Badge>
        <Badge variant="outline" size="lg">
          {t('trainingDays', { count: program.trainingDaysCount })}
        </Badge>
      </div>

      <Typography variant="p-sm" className="text-muted-foreground">
        {lastActivityLabel}
      </Typography>
    </div>
  );
};
