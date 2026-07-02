'use client';

import { useTranslations } from '@/i18n';
import {
  useAddProgramDayExercise,
  useDeleteProgramDayExercise,
  useReorderProgramWeekExercises,
  useUpdateProgramDayExercise,
  type ProgramDayExerciseInput,
  type ProgramWeek,
} from '@/src/entities/program';
import { useToast } from '@/src/shared/hooks';

import { MAX_PICK } from '@/src/features/ExercisePicker';
import { withMovedExercise, withReorderedDay } from '../ui/DayExercises/DayExercises.utils';

type UseExercisesActionsParams = {
  programId: string;
  weekId: string;
  week: ProgramWeek;
  dayId: string;
};

/**
 * Exercise mutations for the selected day. Adds are sequential POSTs (capped at
 * MAX_PICK) collapsed into one toast; updates persist on blur/unmount; reorder
 * and cross-day moves both go through the week-scoped reorder endpoint.
 */
export const useExercisesActions = ({ programId, weekId, week, dayId }: UseExercisesActionsParams) => {
  const t = useTranslations('ProgramWizard');
  const { showSuccessToast, showErrorToast } = useToast();

  const addMutation = useAddProgramDayExercise();
  const updateMutation = useUpdateProgramDayExercise();
  const deleteMutation = useDeleteProgramDayExercise();
  const reorderMutation = useReorderProgramWeekExercises();

  const handleAddExercises = async (exerciseIds: string[]) => {
    const ids = exerciseIds.slice(0, MAX_PICK);
    if (ids.length === 0) return;

    try {
      for (const exerciseId of ids) {
        await addMutation.mutateAsync({
          programId,
          weekId,
          dayId,
          exerciseId,
          sets: null,
          reps: null,
          weightKg: null,
          instruction: '',
        });
      }
      showSuccessToast(t('structure.exercises.toast.exerciseAdded'));
    } catch {
      showErrorToast(t('structure.exercises.toast.exerciseAddError'));
    }
  };

  const handleUpdateExercise = (itemId: string, input: ProgramDayExerciseInput) => {
    updateMutation.mutate(
      { programId, weekId, dayId, itemId, ...input },
      { onError: () => showErrorToast(t('structure.exercises.toast.exerciseUpdateError')) }
    );
  };

  const handleDeleteExercise = (itemId: string) => {
    deleteMutation.mutate(
      { programId, weekId, dayId, itemId },
      {
        onSuccess: () => showSuccessToast(t('structure.exercises.toast.exerciseDeleted')),
        onError: () => showErrorToast(t('structure.exercises.toast.exerciseDeleteError')),
      }
    );
  };

  const handleReorderExercises = (exerciseItemIds: string[]) => {
    reorderMutation.mutate(
      { programId, weekId, days: withReorderedDay(week, dayId, exerciseItemIds) },
      { onError: () => showErrorToast(t('structure.exercises.toast.exerciseReorderError')) }
    );
  };

  const handleMoveExercise = (itemId: string, toDayId: string) => {
    reorderMutation.mutate(
      { programId, weekId, days: withMovedExercise(week, dayId, toDayId, itemId) },
      {
        onSuccess: () => showSuccessToast(t('structure.exercises.toast.exerciseMoved')),
        onError: () => showErrorToast(t('structure.exercises.toast.exerciseMoveError')),
      }
    );
  };

  return {
    handleAddExercises,
    handleUpdateExercise,
    handleDeleteExercise,
    handleReorderExercises,
    handleMoveExercise,
    isMutating:
      addMutation.isPending || updateMutation.isPending || deleteMutation.isPending || reorderMutation.isPending,
  };
};
