'use client';

import { useRef } from 'react';

import { useTranslations } from '@/i18n';
import {
  parseProgramBlockError,
  useAddProgramBlockExercise,
  useCreateProgramDayBlock,
  useDeleteProgramBlockExercise,
  useDuplicateProgramBlockExercise,
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
 * unmount; extract, cross-block moves and duplicates each hit their dedicated
 * endpoint. In-flight updates are tracked per row so a duplicate or block copy
 * can wait for the latest values to land first.
 */
export const useDayExerciseActions = ({ programId, weekId, dayId }: UseDayExerciseActionsParams) => {
  const t = useTranslations('ProgramWizard');
  const { showSuccessToast, showErrorToast } = useToast();

  const createBlock = useCreateProgramDayBlock();
  const addExercise = useAddProgramBlockExercise();
  const updateExercise = useUpdateProgramBlockExercise();
  const deleteExercise = useDeleteProgramBlockExercise();
  const duplicateExercise = useDuplicateProgramBlockExercise();
  const extractExercise = useExtractProgramBlockExercise();
  const moveExercise = useMoveProgramExerciseToBlock();
  const reorderExercises = useReorderProgramBlockExercises();
  const pendingUpdatesRef = useRef(new Map<string, Promise<void>>());

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
    const pending = pendingUpdatesRef.current;
    const request = updateExercise.mutateAsync({ programId, weekId, blockId, itemId, ...input }).then(
      () => undefined,
      () => showErrorToast(t('structure.exercises.toast.exerciseUpdateError'))
    );
    pending.set(itemId, request);
    void request.then(() => {
      if (pending.get(itemId) === request) pending.delete(itemId);
    });
  };

  /** Resolves once every in-flight update of the given rows has settled (successfully or not). */
  const waitForPendingUpdates = async (itemIds: string[]) => {
    const pending = pendingUpdatesRef.current;
    await Promise.all(
      itemIds.flatMap((itemId) => {
        const request = pending.get(itemId);
        return request ? [request] : [];
      })
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

  const handleDuplicateExercise = async (blockId: string, itemId: string) => {
    await waitForPendingUpdates([itemId]);
    try {
      await duplicateExercise.mutateAsync({ programId, weekId, blockId, itemId });
      showSuccessToast(t('structure.exercises.toast.exerciseDuplicated'));
    } catch (error) {
      showErrorToast(
        parseProgramBlockError(error) === 'notFound'
          ? t('structure.exercises.toast.exerciseDuplicateNotFound')
          : t('structure.exercises.toast.exerciseDuplicateError')
      );
    }
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
  // it with a reorder so the exercise lands where the user dropped it. When the
  // target type carries no sets the backend clears them, and the toast says so.
  const handleMoveExerciseToBlock = async (
    blockId: string,
    itemId: string,
    targetBlockId: string,
    targetItemIds?: string[],
    clearedSetsBlockLabel?: string
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
      showSuccessToast(
        t('structure.exercises.toast.exerciseMoved'),
        clearedSetsBlockLabel
          ? { description: t('structure.exercises.toast.setsCleared', { type: clearedSetsBlockLabel }) }
          : undefined
      );
    } catch {
      showErrorToast(t('structure.exercises.toast.exerciseMoveError'));
    }
  };

  return {
    handleAddSingles,
    handleAddToBlock,
    handleUpdateExercise,
    handleDeleteExercise,
    handleDuplicateExercise,
    handleExtractExercise,
    handleMoveExerciseToBlock,
    waitForPendingUpdates,
  };
};
