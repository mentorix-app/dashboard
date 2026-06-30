'use client';

import { useState } from 'react';

import { useTranslations } from '@/i18n';

import { useDaysActions } from '../../hooks/useDaysActions';
import type { DaysTableProps } from './DaysTable.types';

/**
 * Logic for the days table: resolves day actions for the selected week and owns
 * the day-delete confirmation state so the parent widget stays focused on weeks.
 */
export const useDaysTableConfig = ({ programId, isDraft, weeks, week }: DaysTableProps) => {
  const t = useTranslations('ProgramWizard');
  const { canAddDay, handleAddDay, handleDeleteDay, handleReorderDays, isMutating } = useDaysActions({
    programId,
    weekId: week.id,
    isDraft,
    weeks,
    days: week.days,
  });

  const [dayPendingDeletion, setDayPendingDeletion] = useState<string | null>(null);
  const [selectedDayId, setSelectedDayId] = useState<string | null>(null);

  // Derive the active day during render so it stays valid as days are added,
  // removed, reordered, or the selected week changes — without an effect.
  const activeDayId =
    selectedDayId && week.days.some((day) => day.id === selectedDayId) ? selectedDayId : (week.days[0]?.id ?? null);
  const selectedDay = week.days.find((day) => day.id === activeDayId) ?? null;

  const handleConfirmDelete = () => {
    if (!dayPendingDeletion) return;
    handleDeleteDay(dayPendingDeletion);
    setDayPendingDeletion(null);
  };

  const handleDeleteModalOpenChange = (open: boolean) => {
    if (!open) setDayPendingDeletion(null);
  };

  return {
    t,
    days: week.days,
    dayIds: week.days.map((day) => day.id),
    selectedDayId: activeDayId,
    selectedDay,
    canAddDay,
    isBusy: isMutating,
    isDeleteModalOpen: dayPendingDeletion !== null,
    onSelectDay: setSelectedDayId,
    onRequestDeleteDay: setDayPendingDeletion,
    onAddDay: handleAddDay,
    onReorderDays: handleReorderDays,
    onConfirmDeleteDay: handleConfirmDelete,
    onDeleteModalOpenChange: handleDeleteModalOpenChange,
  };
};
