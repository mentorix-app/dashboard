'use client';

import { useTranslations } from '@/i18n';
import {
  useAddProgramDay,
  useDeleteProgramDay,
  useProgramStructureStore,
  useReorderProgramDays,
  type ProgramDay,
  type ProgramWeek,
} from '@/src/entities/program';
import { useToast } from '@/src/shared/hooks';

import { MAX_DAYS, MIN_DAYS } from '../ProgramStructure.constants';
import { buildLocalDay, reorderDays } from '../ProgramStructure.utils';

type UseDaysActionsParams = {
  programId: string;
  weekId: string;
  isDraft: boolean;
  weeks: ProgramWeek[];
  days: ProgramDay[];
};

/**
 * Add/delete/reorder handlers for the days of a single week. Draft programs
 * persist each change through the API (with toast feedback); published/archived
 * programs mutate the in-memory working copy until an explicit save.
 */
export const useDaysActions = ({ programId, weekId, isDraft, weeks, days }: UseDaysActionsParams) => {
  const t = useTranslations('ProgramWizard');
  const { showSuccessToast, showErrorToast } = useToast();
  const setWorkingWeeks = useProgramStructureStore((state) => state.setWorkingWeeks);

  const addMutation = useAddProgramDay();
  const deleteMutation = useDeleteProgramDay();
  const reorderMutation = useReorderProgramDays();

  const canAddDay = days.length < MAX_DAYS;

  const replaceWeekDays = (nextDays: ProgramDay[]) =>
    setWorkingWeeks(weeks.map((week) => (week.id === weekId ? { ...week, days: nextDays } : week)));

  const handleAddDay = () => {
    if (!canAddDay) {
      showErrorToast(t('structure.maxDaysReached', { max: MAX_DAYS }));
      return;
    }

    if (isDraft) {
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
      return;
    }

    replaceWeekDays([...days, buildLocalDay(days)]);
  };

  const handleDeleteDay = (dayId: string) => {
    if (isDraft) {
      deleteMutation.mutate(
        { programId, weekId, dayId },
        {
          onSuccess: () => showSuccessToast(t('structure.toast.dayDeleted')),
          onError: (error) =>
            showErrorToast(t(error.status === 409 ? 'structure.toast.lastDayError' : 'structure.toast.dayDeleteError')),
        }
      );
      return;
    }

    if (days.length <= MIN_DAYS) {
      showErrorToast(t('structure.toast.lastDayError'));
      return;
    }

    replaceWeekDays(days.filter((day) => day.id !== dayId));
  };

  const handleReorderDays = (dayIds: string[]) => {
    if (isDraft) {
      reorderMutation.mutate(
        { programId, weekId, dayIds },
        {
          onSuccess: () => showSuccessToast(t('structure.toast.daysReordered')),
          onError: () => showErrorToast(t('structure.toast.dayReorderError')),
        }
      );
      return;
    }

    replaceWeekDays(reorderDays(days, dayIds));
  };

  return {
    canAddDay,
    handleAddDay,
    handleDeleteDay,
    handleReorderDays,
    isMutating: addMutation.isPending || deleteMutation.isPending || reorderMutation.isPending,
  };
};
