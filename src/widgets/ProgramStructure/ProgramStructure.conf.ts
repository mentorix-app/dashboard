'use client';

import { useState } from 'react';

import { useTranslations } from '@/i18n';

import { useStructureState } from './hooks/useStructureState';
import { useWeeksActions } from './hooks/useWeeksActions';

export const useProgramStructureConfig = (programId: string) => {
  const t = useTranslations('ProgramWizard');
  const { isLoading, isDraft, weeks } = useStructureState(programId);
  const { canAddWeek, handleAddWeek, handleDeleteWeek, handleReorderWeeks, isMutating } = useWeeksActions({
    programId,
    isDraft,
    weeks,
  });

  const [selectedWeekId, setSelectedWeekId] = useState<string | null>(null);
  const [weekPendingDeletion, setWeekPendingDeletion] = useState<string | null>(null);

  // Derive the active selection during render so it stays valid as weeks are
  // added, removed, or reordered without syncing state inside an effect.
  const activeWeekId =
    selectedWeekId && weeks.some((week) => week.id === selectedWeekId) ? selectedWeekId : (weeks[0]?.id ?? null);
  const selectedWeek = weeks.find((week) => week.id === activeWeekId) ?? null;

  const handleConfirmDelete = () => {
    if (!weekPendingDeletion) return;
    handleDeleteWeek(weekPendingDeletion);
    setWeekPendingDeletion(null);
  };

  const handleDeleteModalOpenChange = (open: boolean) => {
    if (!open) setWeekPendingDeletion(null);
  };

  return {
    t,
    isLoading,
    isDraft,
    weeks,
    selectedWeekId: activeWeekId,
    selectedWeek,
    canAddWeek,
    isBusy: isMutating,
    isDeleteModalOpen: weekPendingDeletion !== null,
    onSelectWeek: setSelectedWeekId,
    onRequestDeleteWeek: setWeekPendingDeletion,
    onAddWeek: handleAddWeek,
    onReorderWeeks: handleReorderWeeks,
    onConfirmDeleteWeek: handleConfirmDelete,
    onDeleteModalOpenChange: handleDeleteModalOpenChange,
  };
};
