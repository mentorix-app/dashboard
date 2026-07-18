import { ExerciseScope } from '../../model/types';
import { buildExercisesQuery } from '../exercises.utils';

describe('buildExercisesQuery', () => {
  it('omits scope when not provided', () => {
    expect(buildExercisesQuery({})).toEqual({});
  });

  it('serializes the scope filter as-is', () => {
    expect(buildExercisesQuery({ scope: ExerciseScope.Private })).toEqual({ scope: 'private' });
    expect(buildExercisesQuery({ scope: ExerciseScope.Global })).toEqual({ scope: 'global' });
  });

  it('combines scope with other filters', () => {
    const query = buildExercisesQuery({ name: 'squat', scope: ExerciseScope.Private });

    expect(query).toEqual({ q: 'squat', scope: 'private' });
  });
});
