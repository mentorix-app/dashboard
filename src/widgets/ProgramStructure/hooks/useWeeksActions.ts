'use client';

import { useTranslations } from '@/i18n';
import {
  useAddProgramWeek,
  useDeleteProgramWeek,
  useProgramStructureStore,
  useReorderProgramWeeks,
  type ProgramWeek,
} from '@/src/entities/program';
import { useToast } from '@/src/shared/hooks';

import { MAX_WEEKS, MIN_WEEKS } from '../ProgramStructure.constants';
import { buildLocalWeek, reorderWeeks } from '../ProgramStructure.utils';

type UseWeeksActionsParams = {
  programId: string;
  isDraft: boolean;
  weeks: ProgramWeek[];
};

/**
 * Add/delete/reorder handlers for the weeks sidebar. Draft programs persist
 * each change through the API (with toast feedback); published/archived
 * programs mutate the in-memory working copy until an explicit save.
 */
export const useWeeksActions = ({ programId, isDraft, weeks }: UseWeeksActionsParams) => {
  const t = useTranslations('ProgramWizard');
  const { showSuccessToast, showErrorToast } = useToast();
  const setWorkingWeeks = useProgramStructureStore((state) => state.setWorkingWeeks);

  const addMutation = useAddProgramWeek();
  const deleteMutation = useDeleteProgramWeek();
  const reorderMutation = useReorderProgramWeeks();

  const canAddWeek = weeks.length < MAX_WEEKS;

  const handleAddWeek = () => {
    if (!canAddWeek) {
      showErrorToast(t('structure.maxWeeksReached', { max: MAX_WEEKS }));
      return;
    }

    if (isDraft) {
      addMutation.mutate(
        { programId },
        {
          onSuccess: () => showSuccessToast(t('structure.toast.weekAdded')),
          onError: () => showErrorToast(t('structure.toast.addError')),
        }
      );
      return;
    }

    setWorkingWeeks([...weeks, buildLocalWeek(weeks)]);
  };

  const handleDeleteWeek = (weekId: string) => {
    if (isDraft) {
      deleteMutation.mutate(
        { programId, weekId },
        {
          onSuccess: () => showSuccessToast(t('structure.toast.weekDeleted')),
          onError: (error) =>
            showErrorToast(t(error.status === 409 ? 'structure.toast.lastWeekError' : 'structure.toast.deleteError')),
        }
      );
      return;
    }

    if (weeks.length <= MIN_WEEKS) {
      showErrorToast(t('structure.toast.lastWeekError'));
      return;
    }

    setWorkingWeeks(weeks.filter((week) => week.id !== weekId));
  };

  const handleReorderWeeks = (weekIds: string[]) => {
    if (isDraft) {
      reorderMutation.mutate(
        { programId, weekIds },
        {
          onSuccess: () => showSuccessToast(t('structure.toast.weeksReordered')),
          onError: () => showErrorToast(t('structure.toast.reorderError')),
        }
      );
      return;
    }

    setWorkingWeeks(reorderWeeks(weeks, weekIds));
  };

  return {
    canAddWeek,
    handleAddWeek,
    handleDeleteWeek,
    handleReorderWeeks,
    isMutating: addMutation.isPending || deleteMutation.isPending || reorderMutation.isPending,
  };
};
