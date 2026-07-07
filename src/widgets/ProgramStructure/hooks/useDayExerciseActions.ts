'use client';

import { useTranslations } from '@/i18n';
import {
  useAddProgramBlockExercise,
  useCreateProgramDayBlock,
  useDeleteProgramBlockExercise,
  useExtractProgramBlockExercise,
  useMoveProgramExerciseToBlock,
  useReorderProgramBlockExercises,
  useUpdateProgramBlockExercise,
  type ProgramDayExerciseInput,
} from '@/src/entities/program';
import { MAX_PICK } from '@/src/features/ExercisePicker';
import { useToast } from '@/src/shared/hooks';

type UseDayExerciseActionsParams = {
  programId: string;
  weekId: string;
  dayId: string;
};

const emptyExercise = (exerciseId: string): ProgramDayExerciseInput => ({
  exerciseId,
  sets: null,
  reps: null,
  instruction: '',
});

/**
 * Exercise-level mutations for the selected day. Adds are sequential POSTs
 * (capped at MAX_PICK) collapsed into one toast; updates persist on blur or
 * unmount; extract and cross-block moves each hit their dedicated endpoint.
 */
export const useDayExerciseActions = ({ programId, weekId, dayId }: UseDayExerciseActionsParams) => {
  const t = useTranslations('ProgramWizard');
  const { showSuccessToast, showErrorToast } = useToast();

  const createBlock = useCreateProgramDayBlock();
  const addExercise = useAddProgramBlockExercise();
  const updateExercise = useUpdateProgramBlockExercise();
  const deleteExercise = useDeleteProgramBlockExercise();
  const extractExercise = useExtractProgramBlockExercise();
  const moveExercise = useMoveProgramExerciseToBlock();
  const reorderExercises = useReorderProgramBlockExercises();

  const handleAddSingles = async (exerciseIds: string[]) => {
    const ids = exerciseIds.slice(0, MAX_PICK);
    if (ids.length === 0) return;
    try {
      for (const exerciseId of ids) {
        await createBlock.mutateAsync({ programId, weekId, dayId, exercise: emptyExercise(exerciseId) });
      }
      showSuccessToast(t('structure.exercises.toast.exerciseAdded'));
    } catch {
      showErrorToast(t('structure.exercises.toast.exerciseAddError'));
    }
  };

  const handleAddToBlock = async (blockId: string, exerciseIds: string[]) => {
    const ids = exerciseIds.slice(0, MAX_PICK);
    if (ids.length === 0) return;
    try {
      for (const exerciseId of ids) {
        await addExercise.mutateAsync({ programId, weekId, blockId, ...emptyExercise(exerciseId) });
      }
      showSuccessToast(t('structure.exercises.toast.exerciseAdded'));
    } catch {
      showErrorToast(t('structure.exercises.toast.exerciseAddError'));
    }
  };

  const handleUpdateExercise = (blockId: string, itemId: string, input: ProgramDayExerciseInput) => {
    updateExercise.mutate(
      { programId, weekId, blockId, itemId, ...input },
      { onError: () => showErrorToast(t('structure.exercises.toast.exerciseUpdateError')) }
    );
  };

  const handleDeleteExercise = (blockId: string, itemId: string) => {
    deleteExercise.mutate(
      { programId, weekId, blockId, itemId },
      {
        onSuccess: () => showSuccessToast(t('structure.exercises.toast.exerciseDeleted')),
        onError: () => showErrorToast(t('structure.exercises.toast.exerciseDeleteError')),
      }
    );
  };

  const handleExtractExercise = (blockId: string, itemId: string, sortOrder?: number) => {
    extractExercise.mutate(
      { programId, weekId, blockId, itemId, sortOrder },
      {
        onSuccess: () => showSuccessToast(t('structure.exercises.toast.exerciseExtracted')),
        onError: () => showErrorToast(t('structure.exercises.toast.exerciseExtractError')),
      }
    );
  };

  // The move endpoint appends to the target; when a drop specifies a slot we chase
  // it with a reorder so the exercise lands where the user dropped it.
  const handleMoveExerciseToBlock = async (
    blockId: string,
    itemId: string,
    targetBlockId: string,
    targetItemIds?: string[]
  ) => {
    try {
      await moveExercise.mutateAsync({ programId, weekId, blockId, itemId, targetBlockId });
      if (targetItemIds && targetItemIds.length > 0) {
        await reorderExercises.mutateAsync({
          programId,
          weekId,
          blockId: targetBlockId,
          exerciseItemIds: targetItemIds,
        });
      }
      showSuccessToast(t('structure.exercises.toast.exerciseMoved'));
    } catch {
      showErrorToast(t('structure.exercises.toast.exerciseMoveError'));
    }
  };

  return {
    handleAddSingles,
    handleAddToBlock,
    handleUpdateExercise,
    handleDeleteExercise,
    handleExtractExercise,
    handleMoveExerciseToBlock,
  };
};
