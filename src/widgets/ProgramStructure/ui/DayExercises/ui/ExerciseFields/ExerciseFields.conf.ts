'use client';

import { useEffect, useRef, useState } from 'react';

import type { ProgramDayExerciseInput } from '@/src/entities/program';

import {
  applySetsPolicy,
  formatVolumeField,
  isSameExerciseInput,
  normalizeExerciseInput,
  sanitizeVolumeInput,
  toVolumeField,
} from '../../lib';
import type { ExerciseFieldsProps } from './ExerciseFields.types';

type UseExerciseFieldsConfigParams = Pick<ExerciseFieldsProps, 'exercise' | 'canEdit' | 'onUpdate'> & {
  showSets: boolean;
};

/**
 * Holds the row's editable fields locally and persists them via update on blur
 * and once more on unmount (e.g. when the day changes) if anything is still
 * dirty. A ref carries the latest values so the unmount flush stays current
 * without an effect that re-subscribes on every render. Read-only rows never
 * persist. Rows in a block without sets always send `sets: null`.
 */
export const useExerciseFieldsConfig = ({ exercise, canEdit, showSets, onUpdate }: UseExerciseFieldsConfigParams) => {
  const [sets, setSets] = useState(() => formatVolumeField(exercise.sets));
  const [reps, setReps] = useState(() => formatVolumeField(exercise.reps));
  const [instruction, setInstruction] = useState(exercise.instruction);

  const savedRef = useRef<ProgramDayExerciseInput>(
    normalizeExerciseInput({
      exerciseId: exercise.exerciseId,
      sets: exercise.sets,
      reps: exercise.reps,
      instruction: exercise.instruction,
    })
  );

  const currentInput = applySetsPolicy(
    {
      exerciseId: exercise.exerciseId,
      sets: toVolumeField(sets),
      reps: toVolumeField(reps),
      instruction: instruction.trim(),
    },
    showSets
  );

  const flushRef = useRef<() => void>(() => {});
  const flush = () => {
    if (!canEdit) return;
    if (isSameExerciseInput(currentInput, applySetsPolicy(savedRef.current, showSets))) return;
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
    onSetsChange: (value: string) => setSets(sanitizeVolumeInput(value)),
    onRepsChange: (value: string) => setReps(sanitizeVolumeInput(value)),
    onInstructionChange: setInstruction,
    onBlur: flush,
  };
};
