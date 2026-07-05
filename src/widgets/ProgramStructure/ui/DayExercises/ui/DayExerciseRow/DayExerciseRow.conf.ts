'use client';

import { useEffect, useRef, useState } from 'react';

import type { ProgramDayExercise, ProgramDayExerciseInput } from '@/src/entities/program';

import {
  formatNumberField,
  isSameExerciseInput,
  normalizeExerciseInput,
  parseCountField,
  parseWeightField,
} from '../../DayExercises.utils';

type UseDayExerciseRowConfigParams = {
  exercise: ProgramDayExercise;
  canEdit: boolean;
  onUpdate: (itemId: string, input: ProgramDayExerciseInput) => void;
};

/**
 * Holds the row's editable fields locally and persists them via PUT on blur and
 * once more on unmount (e.g. when the day changes) if anything is still dirty.
 * A ref carries the latest values so the unmount flush stays current without an
 * effect that re-subscribes on every render. Read-only rows never persist.
 */
export const useDayExerciseRowConfig = ({ exercise, canEdit, onUpdate }: UseDayExerciseRowConfigParams) => {
  const [sets, setSets] = useState(() => formatNumberField(exercise.sets));
  const [reps, setReps] = useState(() => formatNumberField(exercise.reps));
  const [weight, setWeight] = useState(() => formatNumberField(exercise.weightKg));
  const [instruction, setInstruction] = useState(exercise.instruction);

  const savedRef = useRef<ProgramDayExerciseInput>(
    normalizeExerciseInput({
      exerciseId: exercise.exerciseId,
      sets: exercise.sets,
      reps: exercise.reps,
      weightKg: exercise.weightKg,
      instruction: exercise.instruction,
    })
  );

  const currentInput: ProgramDayExerciseInput = {
    exerciseId: exercise.exerciseId,
    sets: parseCountField(sets),
    reps: parseCountField(reps),
    weightKg: parseWeightField(weight),
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
    weight,
    instruction,
    onSetsChange: setSets,
    onRepsChange: setReps,
    onWeightChange: setWeight,
    onInstructionChange: setInstruction,
    onBlur: flush,
  };
};
