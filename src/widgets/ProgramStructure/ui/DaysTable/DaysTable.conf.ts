'use client';

import { useState } from 'react';

import { useTranslations } from '@/i18n';
import { confirm } from '@/src/shared/ui';

import { useDaysActions } from '../../hooks/useDaysActions';
import type { DaysTableProps } from './DaysTable.types';

/**
 * Logic for the days table: resolves day actions for the selected week and
 * queues the day-delete confirmation via the global `confirm()` singleton.
 */
export const useDaysTableConfig = ({ programId, canEdit, week }: DaysTableProps) => {
  const t = useTranslations('ProgramWizard');
  const { canAddDay, handleAddDay, handleDeleteDay, handleReorderDays, isMutating } = useDaysActions({
    programId,
    weekId: week.id,
    days: week.days,
  });

  const [selectedDayId, setSelectedDayId] = useState<string | null>(null);

  // Derive the active day during render so it stays valid as days are added,
  // removed, reordered, or the selected week changes — without an effect.
  const activeDayId =
    selectedDayId && week.days.some((day) => day.id === selectedDayId) ? selectedDayId : (week.days[0]?.id ?? null);
  const selectedDay = week.days.find((day) => day.id === activeDayId) ?? null;

  const handleRequestDeleteDay = (dayId: string) => {
    confirm({
      title: t('structure.deleteDayConfirmTitle'),
      description: t('structure.deleteDayConfirmDescription'),
      cancelLabel: t('structure.deleteDayCancel'),
      confirmLabel: t('structure.deleteDayConfirm'),
      variant: 'destructive',
      onConfirm: () => handleDeleteDay(dayId),
    });
  };

  return {
    t,
    programId,
    week,
    days: week.days,
    dayIds: week.days.map((day) => day.id),
    selectedDayId: activeDayId,
    selectedDay,
    canEdit,
    canAddDay,
    isBusy: isMutating,
    onSelectDay: setSelectedDayId,
    onRequestDeleteDay: handleRequestDeleteDay,
    onAddDay: handleAddDay,
    onReorderDays: handleReorderDays,
  };
};
