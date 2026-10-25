import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { EMPTY_BLOCK_SETTINGS } from '../../../../../../../entities/program/model/blockSettings';
import {
  ProgramBlockType,
  type ProgramDay,
  type ProgramDayBlock,
  type ProgramWeek,
} from '../../../../../../../entities/program/model/structure';

import { CopyBlockDialog } from '../CopyBlockDialog';

const mockUseProgram = jest.fn();

jest.mock('../../../../../../../../i18n', () => ({
  useTranslations: () => (key: string, values?: Record<string, unknown>) =>
    values ? `${key}:${JSON.stringify(values)}` : key,
}));

jest.mock('../../../../../../../entities/program', () => ({
  ...jest.requireActual('../../../../../../../entities/program'),
  useProgram: (id: string) => mockUseProgram(id),
}));

const buildBlock = (id: string, clientUserIds: string[] = []): ProgramDayBlock => ({
  id,
  blockType: ProgramBlockType.Emom,
  instruction: '',
  sortOrder: 1,
  clientUserIds,
  exercises: [
    {
      id: `${id}-item`,
      exerciseId: 'exercise-1',
      exerciseName: 'Burpee',
      exerciseNameRu: 'Берпи',
      sortOrder: 1,
      sets: null,
      reps: '10',
      instruction: '',
      createdAt: '2026-10-25T00:00:00Z',
    },
  ],
  createdAt: '2026-10-25T00:00:00Z',
  ...EMPTY_BLOCK_SETTINGS,
  rounds: 10,
});

const buildDay = (id: string, dayNumber: number, blocks: ProgramDayBlock[]): ProgramDay => ({
  id,
  dayNumber,
  sortOrder: dayNumber,
  blocks,
  createdAt: '2026-10-25T00:00:00Z',
});

const buildWeek = (id: string, weekNumber: number, days: ProgramDay[]): ProgramWeek => ({
  id,
  weekNumber,
  sortOrder: weekNumber,
  days,
  createdAt: '2026-10-25T00:00:00Z',
});

const renderDialog = (block: ProgramDayBlock, onCopy = jest.fn().mockResolvedValue(true)) => {
  const onOpenChange = jest.fn();
  render(
    <CopyBlockDialog
      programId="program-1"
      sourceWeekId="w1"
      sourceDayId="d1"
      block={block}
      open
      getExerciseLabel={(exercise) => exercise.exerciseName}
      onOpenChange={onOpenChange}
      onCopy={onCopy}
    />
  );
  return { onCopy, onOpenChange };
};

beforeEach(() => {
  jest.clearAllMocks();
  const source = buildBlock('source', ['client-1']);
  mockUseProgram.mockReturnValue({
    data: {
      weeks: [buildWeek('w1', 1, [buildDay('d1', 1, [buildBlock('shared'), source]), buildDay('d2', 2, [])])],
    },
  });
});

describe('CopyBlockDialog', () => {
  it('previews the block and offers every day of the current week', () => {
    renderDialog(buildBlock('source', ['client-1']));

    expect(screen.getByRole('dialog', { name: 'structure.blocks.copyDialog.title' })).toBeInTheDocument();
    expect(screen.getByText('Burpee')).toBeInTheDocument();
    expect(screen.getAllByRole('radio')).toHaveLength(2);
    expect(screen.getByRole('button', { name: 'structure.blocks.copyDialog.submit' })).toBeDisabled();
    expect(screen.getByText('structure.blocks.copyDialog.restrictedInfo:{"count":1}')).toBeInTheDocument();
  });

  it('warns about a restricted copy into a rest day, then copies and closes', async () => {
    const user = userEvent.setup();
    const { onCopy, onOpenChange } = renderDialog(buildBlock('source', ['client-1']));

    await user.click(screen.getByRole('radio', { name: /structure.dayLabel:\{"number":2\}/ }));
    expect(screen.getByRole('status')).toHaveTextContent('structure.blocks.copyDialog.noSharedBlockWarning');

    await user.click(screen.getByRole('button', { name: 'structure.blocks.copyDialog.submit' }));

    expect(onCopy).toHaveBeenCalledWith('source', 'd2', 'structure.blocks.toast.blockCopied:{"week":1,"day":2}');
    await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(false));
  });
});
