'use client';

import { useState } from 'react';

import { useTranslations } from '@/i18n';
import { confirm } from '@/src/shared/ui';

import { useStructureState } from './hooks/useStructureState';
import { useWeeksActions } from './hooks/useWeeksActions';

export const useProgramStructureConfig = (programId: string) => {
  const t = useTranslations('ProgramWizard');
  const { isLoading, canEdit, weeks } = useStructureState(programId);
  const { canAddWeek, handleAddWeek, handleDeleteWeek, handleReorderWeeks, isMutating } = useWeeksActions({
    programId,
    weeks,
  });

  const [selectedWeekId, setSelectedWeekId] = useState<string | null>(null);

  // Derive the active selection during render so it stays valid as weeks are
  // added, removed, or reordered without syncing state inside an effect.
  const activeWeekId =
    selectedWeekId && weeks.some((week) => week.id === selectedWeekId) ? selectedWeekId : (weeks[0]?.id ?? null);
  const selectedWeek = weeks.find((week) => week.id === activeWeekId) ?? null;

  const handleRequestDeleteWeek = (weekId: string) => {
    confirm({
      title: t('structure.deleteConfirmTitle'),
      description: t('structure.deleteConfirmDescription'),
      cancelLabel: t('structure.deleteCancel'),
      confirmLabel: t('structure.deleteConfirm'),
      variant: 'destructive',
      onConfirm: () => handleDeleteWeek(weekId),
    });
  };

  return {
    t,
    isLoading,
    canEdit,
    weeks,
    selectedWeekId: activeWeekId,
    selectedWeek,
    canAddWeek,
    isBusy: isMutating,
    onSelectWeek: setSelectedWeekId,
    onRequestDeleteWeek: handleRequestDeleteWeek,
    onAddWeek: handleAddWeek,
    onReorderWeeks: handleReorderWeeks,
  };
};
