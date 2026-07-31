'use client';

import { Plus } from 'lucide-react';

import { Button, Sortable } from '@/src/shared/ui';

import { DayExercises } from '../DayExercises';
import { DayTab } from '../DayTab';
import { useDaysTableConfig } from './DaysTable.conf';
import type { DaysTableProps } from './DaysTable.types';

export const DaysTable = (props: DaysTableProps) => {
  const {
    t,
    programId,
    week,
    days,
    dayIds,
    selectedDayId,
    selectedDay,
    canEdit,
    canAddDay,
    isBusy,
    onSelectDay,
    onRequestDeleteDay,
    onAddDay,
    onReorderDays,
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
              canEdit={canEdit}
              onSelect={() => onSelectDay(day.id)}
              onDelete={() => onRequestDeleteDay(day.id)}
            />
          ))}
        </Sortable>

        {canEdit ? (
          <Button
            type="button"
            variant="outline"
            className="shrink-0"
            onClick={onAddDay}
            disabled={!canAddDay || isBusy}
          >
            <Plus className="size-4" />
            {t('structure.addDay')}
          </Button>
        ) : null}
      </div>

      {selectedDay ? (
        <DayExercises programId={programId} weekId={week.id} day={selectedDay} week={week} canEdit={canEdit} />
      ) : null}
    </div>
  );
};
