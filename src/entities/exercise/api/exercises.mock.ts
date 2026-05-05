import type { Exercise } from '../model/types';

const MOCK_DELAY_MS = 400;

const mockExercises: Exercise[] = [
  { id: 'ex-001', name: 'Push-up', addedBy: 'Alex Ivanov' },
  { id: 'ex-002', name: 'Squat', addedBy: 'Maria Petrova' },
  { id: 'ex-003', name: 'Plank', addedBy: 'Alex Ivanov' },
  { id: 'ex-004', name: 'Lunge', addedBy: 'Sergey Smirnov' },
  { id: 'ex-005', name: 'Deadlift', addedBy: 'Maria Petrova' },
  { id: 'ex-006', name: 'Pull-up', addedBy: 'Anna Kuznetsova' },
  { id: 'ex-007', name: 'Burpee', addedBy: 'Sergey Smirnov' },
  { id: 'ex-008', name: 'Mountain Climber', addedBy: 'Alex Ivanov' },
  { id: 'ex-009', name: 'Bench Press', addedBy: 'Anna Kuznetsova' },
  { id: 'ex-010', name: 'Row', addedBy: 'Maria Petrova' },
];

export type FetchExercisesParams = {
  search?: string;
};

export const fetchExercises = ({ search }: FetchExercisesParams = {}): Promise<Exercise[]> => {
  const term = search?.trim().toLowerCase() ?? '';
  const result = term ? mockExercises.filter((exercise) => exercise.name.toLowerCase().includes(term)) : mockExercises;

  return new Promise((resolve) => {
    setTimeout(() => resolve(result), MOCK_DELAY_MS);
  });
};
