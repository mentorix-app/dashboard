'use client';

import { useTranslations } from '@/i18n';
import { useAddProgramDay, useDeleteProgramDay, useReorderProgramDays, type ProgramDay } from '@/src/entities/program';
import { useToast } from '@/src/shared/hooks';

import { MAX_DAYS } from '../ProgramStructure.constants';

type UseDaysActionsParams = {
  programId: string;
  weekId: string;
  days: ProgramDay[];
};

/**
 * Add/delete/reorder handlers for the days of a single week. Every change
 * persists straight through the API for draft and published programs; archived
 * programs never reach these handlers because the UI hides their controls.
 */
export const useDaysActions = ({ programId, weekId, days }: UseDaysActionsParams) => {
  const t = useTranslations('ProgramWizard');
  const { showSuccessToast, showErrorToast } = useToast();

  const addMutation = useAddProgramDay();
  const deleteMutation = useDeleteProgramDay();
  const reorderMutation = useReorderProgramDays();

  const canAddDay = days.length < MAX_DAYS;

  const handleAddDay = () => {
    if (!canAddDay) {
      showErrorToast(t('structure.maxDaysReached', { max: MAX_DAYS }));
      return;
    }

    addMutation.mutate(
      { programId, weekId },
      {
        onSuccess: () => showSuccessToast(t('structure.toast.dayAdded')),
        onError: (error) =>
          showErrorToast(
            t(error.status === 409 ? 'structure.maxDaysReached' : 'structure.toast.dayAddError', { max: MAX_DAYS })
          ),
      }
    );
  };

  const handleDeleteDay = (dayId: string) => {
    deleteMutation.mutate(
      { programId, weekId, dayId },
      {
        onSuccess: () => showSuccessToast(t('structure.toast.dayDeleted')),
        onError: (error) =>
          showErrorToast(t(error.status === 409 ? 'structure.toast.lastDayError' : 'structure.toast.dayDeleteError')),
      }
    );
  };

  const handleReorderDays = (dayIds: string[]) => {
    reorderMutation.mutate(
      { programId, weekId, dayIds },
      {
        onSuccess: () => showSuccessToast(t('structure.toast.daysReordered')),
        onError: () => showErrorToast(t('structure.toast.dayReorderError')),
      }
    );
  };

  return {
    canAddDay,
    handleAddDay,
    handleDeleteDay,
    handleReorderDays,
    isMutating: addMutation.isPending || deleteMutation.isPending || reorderMutation.isPending,
  };
};
