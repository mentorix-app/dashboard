'use client';

import { Card, CardContent, Skeleton, Typography } from '@/src/shared/ui';

import { useProgramStructureConfig } from './ProgramStructure.conf';
import type { ProgramStructureProps } from './ProgramStructure.types';
import { DaysTable } from './ui/DaysTable';
import { WeeksSidebar } from './ui/WeeksSidebar';

export const ProgramStructure = ({ programId }: ProgramStructureProps) => {
  const {
    t,
    isLoading,
    canEdit,
    weeks,
    selectedWeekId,
    selectedWeek,
    canAddWeek,
    isBusy,
    onSelectWeek,
    onRequestDeleteWeek,
    onAddWeek,
    onReorderWeeks,
  } = useProgramStructureConfig(programId);

  if (isLoading) {
    return <Skeleton className="h-96 w-full" />;
  }

  return (
    <Card className="md:bg-card gap-0 rounded-none border-0 bg-transparent py-0 shadow-none md:gap-6 md:rounded-xl md:border md:py-6 md:shadow-sm">
      <CardContent className="flex flex-col gap-6 px-0 pt-0 md:px-6 md:pt-6 lg:flex-row">
        <WeeksSidebar
          weeks={weeks}
          selectedWeekId={selectedWeekId}
          canEdit={canEdit}
          canAddWeek={canAddWeek}
          isBusy={isBusy}
          onSelectWeek={onSelectWeek}
          onDeleteWeek={onRequestDeleteWeek}
          onReorderWeeks={onReorderWeeks}
          onAddWeek={onAddWeek}
        />

        {selectedWeek ? (
          <DaysTable programId={programId} canEdit={canEdit} week={selectedWeek} />
        ) : (
          <div className="flex min-h-64 flex-1 items-center justify-center rounded-md border border-dashed">
            <Typography variant="p-sm" className="text-muted-foreground">
              {t('structure.emptyMain')}
            </Typography>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
