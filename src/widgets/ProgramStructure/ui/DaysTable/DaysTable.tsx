'use client';

import { Plus } from 'lucide-react';

import { Button, ConfirmationModal, Sortable, Typography } from '@/src/shared/ui';

import { DayTab } from '../DayTab';
import { useDaysTableConfig } from './DaysTable.conf';
import type { DaysTableProps } from './DaysTable.types';

export const DaysTable = (props: DaysTableProps) => {
  const {
    t,
    days,
    dayIds,
    selectedDayId,
    selectedDay,
    canAddDay,
    isBusy,
    isDeleteModalOpen,
    onSelectDay,
    onRequestDeleteDay,
    onAddDay,
    onReorderDays,
    onConfirmDeleteDay,
    onDeleteModalOpenChange,
  } = useDaysTableConfig(props);

  return (
    <div className="flex min-h-64 min-w-0 flex-1 flex-col rounded-lg border">
      <div className="flex items-center gap-2 overflow-x-auto border-b p-2">
        <Sortable items={dayIds} onReorder={onReorderDays} orientation="horizontal">
          {days.map((day) => (
            <DayTab
              key={day.id}
              id={day.id}
              label={t('structure.dayLabel', { number: day.dayNumber })}
              selectLabel={t('structure.selectDay', { number: day.dayNumber })}
              deleteLabel={t('structure.deleteDay', { number: day.dayNumber })}
              reorderLabel={t('structure.reorderDay', { number: day.dayNumber })}
              isSelected={day.id === selectedDayId}
              onSelect={() => onSelectDay(day.id)}
              onDelete={() => onRequestDeleteDay(day.id)}
            />
          ))}
        </Sortable>

        <Button type="button" variant="outline" className="shrink-0" onClick={onAddDay} disabled={!canAddDay || isBusy}>
          <Plus className="size-4" />
          {t('structure.addDay')}
        </Button>
      </div>

      {selectedDay ? (
        <div className="flex min-h-48 flex-1 items-center justify-center p-6">
          <Typography variant="p-sm" className="text-muted-foreground text-center">
            {t('structure.dayExercisesPlaceholder')}
          </Typography>
        </div>
      ) : null}

      <ConfirmationModal
        open={isDeleteModalOpen}
        title={t('structure.deleteDayConfirmTitle')}
        description={t('structure.deleteDayConfirmDescription')}
        cancelLabel={t('structure.deleteDayCancel')}
        confirmLabel={t('structure.deleteDayConfirm')}
        onOpenChange={onDeleteModalOpenChange}
        onConfirm={onConfirmDeleteDay}
      />
    </div>
  );
};
