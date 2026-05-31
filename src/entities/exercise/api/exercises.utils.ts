import type { Exercise } from '../model/types';

export const filterExercisesBySearch = (exercises: Exercise[], search?: string): Exercise[] => {
  const term = search?.trim().toLowerCase() ?? '';
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
    ].some((value) => value.toLowerCase().includes(term))
  );
};
