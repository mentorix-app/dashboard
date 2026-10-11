import { renderHook } from '@testing-library/react';

import { ProgramBlockType, type ProgramDayBlock } from '../../../../../../../entities/program';

import { useGroupBlockCardConfig } from '../GroupBlockCard.conf';

jest.mock('../../../../../../../../i18n', () => ({
  useTranslations: () => (key: string) => key,
}));

jest.mock('../../../../../../../shared/ui', () => ({
  confirm: jest.fn(),
}));

const block: ProgramDayBlock = {
  id: 'block-1',
  blockType: ProgramBlockType.Emom,
  instruction: '',
  sortOrder: 1,
  clientUserIds: [],
  exercises: [
    {
      id: 'item-1',
      exerciseId: 'exercise-1',
      exerciseName: 'Burpee',
      exerciseNameRu: 'Берпи',
      sortOrder: 1,
      sets: null,
      reps: '10',
      instruction: '',
      createdAt: '2026-10-11T00:00:00Z',
    },
  ],
  createdAt: '2026-10-11T00:00:00Z',
};

describe('useGroupBlockCardConfig', () => {
  it('does not exclude exercises already present in the block', () => {
    const { result } = renderHook(() =>
      useGroupBlockCardConfig({
        block,
        onAddExercise: jest.fn(),
        onDeleteBlock: jest.fn(),
      })
    );

    expect(result.current).not.toHaveProperty('excludeIds');
  });
});
