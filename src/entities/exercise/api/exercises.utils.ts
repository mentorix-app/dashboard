import type { Exercise } from '../model/types';

export const filterExercisesByName = (exercises: Exercise[], name?: string): Exercise[] => {
  const term = name?.trim().toLowerCase() ?? '';
  if (!term) return exercises;

  return exercises.filter((exercise) =>
    [
      exercise.name,
      exercise.description,
      exercise.addedBy,
      exercise.modifiedBy,
      exercise.equipment,
      exercise.type,
      exercise.muscleGroup,
      exercise.difficulty,
    ].some((value) => value?.toLowerCase().includes(term))
  );
};
