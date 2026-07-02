'use client';

import { GripVertical, Plus } from 'lucide-react';

import { ExercisePicker } from '@/src/features/ExercisePicker';
import { Button, ConfirmationModal, Sortable, SortableItem, SortableItemHandle, Typography } from '@/src/shared/ui';

import { useDayExercisesConfig } from './DayExercises.conf';
import { EXERCISE_ROW_GRID } from './DayExercises.constants';
import type { DayExercisesProps } from './DayExercises.types';
import { DayExerciseRow } from './ui/DayExerciseRow';

export const DayExercises = (props: DayExercisesProps) => {
  const {
    t,
    exercises,
    exerciseIds,
    canEdit,
    moveTargets,
    getExerciseLabel,
    isPickerOpen,
    onOpenPicker,
    onPickerOpenChange,
    onConfirmAdd,
    onUpdateExercise,
    onReorderExercises,
    onMoveExercise,
    isDeleteModalOpen,
    onRequestDelete,
    onDeleteModalOpenChange,
    onConfirmDelete,
  } = useDayExercisesConfig(props);

  return (
    <div className="flex min-h-48 flex-1 flex-col gap-3 p-3">
      <div className="flex items-center justify-between gap-2">
        <Typography variant="p-sm" className="text-muted-foreground font-medium">
          {t('structure.exercises.heading')}
        </Typography>
        {canEdit ? (
          <Button type="button" variant="outline" size="sm" onClick={onOpenPicker}>
            <Plus className="size-4" />
            {t('structure.exercises.addExercise')}
          </Button>
        ) : null}
      </div>

      {exercises.length === 0 ? (
        <div className="flex flex-1 items-center justify-center p-6">
          <Typography variant="p-sm" className="text-muted-foreground text-center">
            {t('structure.exercises.empty')}
          </Typography>
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          <div className={`${EXERCISE_ROW_GRID} px-1 pb-1`}>
            <span />
            <Typography variant="p-xs" className="text-muted-foreground">
              {t('structure.exercises.columns.exercise')}
            </Typography>
            <Typography variant="p-xs" className="text-muted-foreground text-center">
              {t('structure.exercises.columns.sets')}
            </Typography>
            <Typography variant="p-xs" className="text-muted-foreground text-center">
              {t('structure.exercises.columns.reps')}
            </Typography>
            <Typography variant="p-xs" className="text-muted-foreground text-center">
              {t('structure.exercises.columns.weight')}
            </Typography>
            <Typography variant="p-xs" className="text-muted-foreground">
              {t('structure.exercises.columns.instruction')}
            </Typography>
            <span />
          </div>

          {canEdit ? (
            <Sortable items={exerciseIds} onReorder={onReorderExercises} orientation="vertical">
              {exercises.map((exercise) => (
                <SortableItem
                  key={exercise.id}
                  id={exercise.id}
                  className={`${EXERCISE_ROW_GRID} bg-card rounded-md border px-1 py-1`}
                >
                  <DayExerciseRow
                    exercise={exercise}
                    exerciseName={getExerciseLabel(exercise)}
                    canEdit
                    moveTargets={moveTargets}
                    dragHandle={
                      <SortableItemHandle
                        aria-label={t('structure.exercises.reorderExercise')}
                        className="text-muted-foreground focus-visible:ring-ring/50 flex size-7 cursor-grab touch-none items-center justify-center rounded-md outline-none focus-visible:ring-2 active:cursor-grabbing"
                      >
                        <GripVertical className="size-4" />
                      </SortableItemHandle>
                    }
                    onUpdate={onUpdateExercise}
                    onDelete={onRequestDelete}
                    onMove={onMoveExercise}
                  />
                </SortableItem>
              ))}
            </Sortable>
          ) : (
            exercises.map((exercise) => (
              <div key={exercise.id} className={`${EXERCISE_ROW_GRID} bg-card rounded-md border px-1 py-1`}>
                <DayExerciseRow
                  exercise={exercise}
                  exerciseName={getExerciseLabel(exercise)}
                  canEdit={false}
                  moveTargets={[]}
                  dragHandle={<span aria-hidden className="size-7" />}
                  onUpdate={onUpdateExercise}
                  onDelete={onRequestDelete}
                  onMove={onMoveExercise}
                />
              </div>
            ))
          )}
        </div>
      )}

      <ExercisePicker open={isPickerOpen} onOpenChange={onPickerOpenChange} onConfirm={onConfirmAdd} />

      <ConfirmationModal
        open={isDeleteModalOpen}
        title={t('structure.exercises.deleteExerciseConfirmTitle')}
        description={t('structure.exercises.deleteExerciseConfirmDescription')}
        cancelLabel={t('structure.exercises.deleteExerciseCancel')}
        confirmLabel={t('structure.exercises.deleteExerciseConfirm')}
        onOpenChange={onDeleteModalOpenChange}
        onConfirm={onConfirmDelete}
      />
    </div>
  );
};
