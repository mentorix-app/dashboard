'use client';

import { Card, CardContent, ConfirmationModal, Skeleton, Typography } from '@/src/shared/ui';

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
    isDeleteModalOpen,
    onSelectWeek,
    onRequestDeleteWeek,
    onAddWeek,
    onReorderWeeks,
    onConfirmDeleteWeek,
    onDeleteModalOpenChange,
  } = useProgramStructureConfig(programId);

  if (isLoading) {
    return <Skeleton className="h-96 w-full" />;
  }

  return (
    <Card>
      <CardContent className="flex flex-col gap-6 pt-6 lg:flex-row">
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

      <ConfirmationModal
        open={isDeleteModalOpen}
        title={t('structure.deleteConfirmTitle')}
        description={t('structure.deleteConfirmDescription')}
        cancelLabel={t('structure.deleteCancel')}
        confirmLabel={t('structure.deleteConfirm')}
        onOpenChange={onDeleteModalOpenChange}
        onConfirm={onConfirmDeleteWeek}
      />
    </Card>
  );
};
