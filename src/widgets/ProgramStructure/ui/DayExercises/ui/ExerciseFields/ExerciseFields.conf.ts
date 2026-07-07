'use client';

import { useEffect, useRef, useState } from 'react';

import type { ProgramDayExerciseInput } from '@/src/entities/program';

import { formatNumberField, isSameExerciseInput, normalizeExerciseInput, parseCountField } from '../../lib';
import type { ExerciseFieldsProps } from './ExerciseFields.types';

type UseExerciseFieldsConfigParams = Pick<ExerciseFieldsProps, 'exercise' | 'canEdit' | 'onUpdate'>;

/**
 * Holds the row's editable fields locally and persists them via update on blur
 * and once more on unmount (e.g. when the day changes) if anything is still
 * dirty. A ref carries the latest values so the unmount flush stays current
 * without an effect that re-subscribes on every render. Read-only rows never
 * persist.
 */
export const useExerciseFieldsConfig = ({ exercise, canEdit, onUpdate }: UseExerciseFieldsConfigParams) => {
  const [sets, setSets] = useState(() => formatNumberField(exercise.sets));
  const [reps, setReps] = useState(() => formatNumberField(exercise.reps));
  const [instruction, setInstruction] = useState(exercise.instruction);

  const savedRef = useRef<ProgramDayExerciseInput>(
    normalizeExerciseInput({
      exerciseId: exercise.exerciseId,
      sets: exercise.sets,
      reps: exercise.reps,
      instruction: exercise.instruction,
    })
  );

  const currentInput: ProgramDayExerciseInput = {
    exerciseId: exercise.exerciseId,
    sets: parseCountField(sets),
    reps: parseCountField(reps),
    instruction: instruction.trim(),
  };

  const flushRef = useRef<() => void>(() => {});
  const flush = () => {
    if (!canEdit) return;
    if (isSameExerciseInput(currentInput, savedRef.current)) return;
    savedRef.current = currentInput;
    onUpdate(exercise.id, currentInput);
  };
  useEffect(() => {
    flushRef.current = flush;
  });

  useEffect(() => () => flushRef.current(), []);

  return {
    sets,
    reps,
    instruction,
    onSetsChange: setSets,
    onRepsChange: setReps,
    onInstructionChange: setInstruction,
    onBlur: flush,
  };
};
