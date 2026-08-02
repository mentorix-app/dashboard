import { messageFromErrorBody, queryKeys } from '../base.utils';

describe('queryKeys', () => {
  it('builds stable, prefixed key hierarchies for each domain', () => {
    expect(queryKeys.auth.all).toEqual(['auth']);
    expect(queryKeys.auth.session()).toEqual(['auth', 'session']);

    expect(queryKeys.exercises.list({ page: 1 })).toEqual(['exercises', 'list', { page: 1 }]);
    expect(queryKeys.exercises.detail('ex-1')).toEqual(['exercises', 'detail', 'ex-1']);

    expect(queryKeys.programs.detail('p-1')).toEqual(['programs', 'detail', 'p-1']);
    expect(queryKeys.programs.versions('p-1')).toEqual(['programs', 'versions', 'p-1']);
    expect(queryKeys.programs.assignments('p-1')).toEqual(['programs', 'assignments', 'p-1']);

    expect(queryKeys.clients.assignment('c-1')).toEqual(['clients', 'assignment', 'c-1']);

    expect(queryKeys.analytics.client('c-1')).toEqual(['analytics', 'client', 'c-1']);
    expect(queryKeys.analytics.clientCompletions('c-1', { from: '2024' })).toEqual([
      'analytics',
      'client',
      'c-1',
      'completions',
      { from: '2024' },
    ]);
    expect(queryKeys.analytics.weekResults('p-1', 3)).toEqual(['analytics', 'programs', 'p-1', 'weeks', 3, 'results']);

    expect(queryKeys.user.me()).toEqual(['user', 'me']);
    expect(queryKeys.plans.catalog()).toEqual(['plans', 'catalog']);
  });
});

describe('messageFromErrorBody', () => {
  it('returns null for non-object bodies', () => {
    expect(messageFromErrorBody(null)).toBeNull();
    expect(messageFromErrorBody(undefined)).toBeNull();
    expect(messageFromErrorBody('boom')).toBeNull();
    expect(messageFromErrorBody(42)).toBeNull();
  });

  it('prefers `message`, then `error`, then `detail` string fields', () => {
    expect(messageFromErrorBody({ message: 'from message' })).toBe('from message');
    expect(messageFromErrorBody({ error: 'from error' })).toBe('from error');
    expect(messageFromErrorBody({ detail: 'from detail' })).toBe('from detail');
    expect(messageFromErrorBody({ message: 'a', error: 'b', detail: 'c' })).toBe('a');
  });

  it('joins FastAPI-style validation error arrays in `detail`', () => {
    const body = {
      detail: [{ msg: 'field required' }, { msg: 'must be positive' }, 'plain string entry', { noMsg: true }],
    };
    expect(messageFromErrorBody(body)).toBe('field required must be positive plain string entry');
  });

  it('returns null when `detail` is an array with no usable messages', () => {
    expect(messageFromErrorBody({ detail: [{ noMsg: true }, 42] })).toBeNull();
  });

  it('returns null when no recognised field is present', () => {
    expect(messageFromErrorBody({ foo: 'bar' })).toBeNull();
  });
});
