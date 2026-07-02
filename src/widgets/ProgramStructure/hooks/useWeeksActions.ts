'use client';

import { useTranslations } from '@/i18n';
import {
  useAddProgramWeek,
  useDeleteProgramWeek,
  useReorderProgramWeeks,
  type ProgramWeek,
} from '@/src/entities/program';
import { useToast } from '@/src/shared/hooks';

import { MAX_WEEKS } from '../ProgramStructure.constants';

type UseWeeksActionsParams = {
  programId: string;
  weeks: ProgramWeek[];
};

/**
 * Add/delete/reorder handlers for the weeks sidebar. Every change persists
 * straight through the API for draft and published programs; archived programs
 * never reach these handlers because the UI hides their controls.
 */
export const useWeeksActions = ({ programId, weeks }: UseWeeksActionsParams) => {
  const t = useTranslations('ProgramWizard');
  const { showSuccessToast, showErrorToast } = useToast();

  const addMutation = useAddProgramWeek();
  const deleteMutation = useDeleteProgramWeek();
  const reorderMutation = useReorderProgramWeeks();

  const canAddWeek = weeks.length < MAX_WEEKS;

  const handleAddWeek = () => {
    if (!canAddWeek) {
      showErrorToast(t('structure.maxWeeksReached', { max: MAX_WEEKS }));
      return;
    }

    addMutation.mutate(
      { programId },
      {
        onSuccess: () => showSuccessToast(t('structure.toast.weekAdded')),
        onError: () => showErrorToast(t('structure.toast.addError')),
      }
    );
  };

  const handleDeleteWeek = (weekId: string) => {
    deleteMutation.mutate(
      { programId, weekId },
      {
        onSuccess: () => showSuccessToast(t('structure.toast.weekDeleted')),
        onError: (error) =>
          showErrorToast(t(error.status === 409 ? 'structure.toast.lastWeekError' : 'structure.toast.deleteError')),
      }
    );
  };

  const handleReorderWeeks = (weekIds: string[]) => {
    reorderMutation.mutate(
      { programId, weekIds },
      {
        onSuccess: () => showSuccessToast(t('structure.toast.weeksReordered')),
        onError: () => showErrorToast(t('structure.toast.reorderError')),
      }
    );
  };

  return {
    canAddWeek,
    handleAddWeek,
    handleDeleteWeek,
    handleReorderWeeks,
    isMutating: addMutation.isPending || deleteMutation.isPending || reorderMutation.isPending,
  };
};
