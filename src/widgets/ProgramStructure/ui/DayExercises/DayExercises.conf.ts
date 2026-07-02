'use client';

import { useState } from 'react';

import { useLocale, useTranslations } from '@/i18n';
import type { ProgramDayExercise } from '@/src/entities/program';

import { useExercisesActions } from '../../hooks/useExercisesActions';
import type { DayExercisesProps, MoveTargetDay } from './DayExercises.types';

/**
 * Logic for the selected day's exercise editor: derives move targets and
 * localized names, owns the picker + delete-confirmation state, and forwards
 * mutations to the (always server-backed) exercise actions.
 */
export const useDayExercisesConfig = ({ programId, weekId, day, week, canEdit }: DayExercisesProps) => {
  const t = useTranslations('ProgramWizard');
  const locale = useLocale();
  const actions = useExercisesActions({ programId, weekId, week, dayId: day.id });

  const [isPickerOpen, setPickerOpen] = useState(false);
  const [pendingDeletion, setPendingDeletion] = useState<string | null>(null);

  const moveTargets: MoveTargetDay[] = week.days
    .filter((other) => other.id !== day.id)
    .map((other) => ({ id: other.id, label: t('structure.exercises.moveToDayLabel', { number: other.dayNumber }) }));

  const getExerciseLabel = (exercise: ProgramDayExercise) =>
    locale === 'ru' && exercise.exerciseNameRu ? exercise.exerciseNameRu : exercise.exerciseName;

  const handleConfirmDelete = () => {
    if (!pendingDeletion) return;
    actions.handleDeleteExercise(pendingDeletion);
    setPendingDeletion(null);
  };

  const handleDeleteModalOpenChange = (open: boolean) => {
    if (!open) setPendingDeletion(null);
  };

  return {
    t,
    exercises: day.exercises,
    exerciseIds: day.exercises.map((exercise) => exercise.id),
    canEdit,
    moveTargets,
    getExerciseLabel,
    isPickerOpen,
    onOpenPicker: () => setPickerOpen(true),
    onPickerOpenChange: setPickerOpen,
    onConfirmAdd: actions.handleAddExercises,
    onUpdateExercise: actions.handleUpdateExercise,
    onReorderExercises: actions.handleReorderExercises,
    onMoveExercise: actions.handleMoveExercise,
    isDeleteModalOpen: pendingDeletion !== null,
    onRequestDelete: setPendingDeletion,
    onDeleteModalOpenChange: handleDeleteModalOpenChange,
    onConfirmDelete: handleConfirmDelete,
  };
};
