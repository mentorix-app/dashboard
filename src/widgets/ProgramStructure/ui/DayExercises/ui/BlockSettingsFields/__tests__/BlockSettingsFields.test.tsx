import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { EMPTY_BLOCK_SETTINGS } from '../../../../../../../entities/program/model/blockSettings';
import {
  ProgramBlockType,
  type ProgramDayBlock,
  type ProgramDayExercise,
} from '../../../../../../../entities/program/model/structure';

import type { BlockEditValue } from '../../BlockEditDialog/BlockEditDialog.types';
import { useBlockEditFormConfig } from '../../BlockEditForm/BlockEditForm.conf';
import { BlockSettingsFields } from '../BlockSettingsFields';

jest.mock('../../../../../../../../i18n', () => ({
  useTranslations: () => (key: string, values?: Record<string, unknown>) =>
    values ? `${key}:${JSON.stringify(values)}` : key,
}));

const buildExercise = (sets: string | null): ProgramDayExercise => ({
  id: 'item-1',
  exerciseId: 'exercise-1',
  exerciseName: 'Burpee',
  exerciseNameRu: 'Берпи',
  sortOrder: 1,
  sets,
  reps: '10',
  instruction: '',
  createdAt: '2026-10-25T00:00:00Z',
});

const buildBlock = (overrides: Partial<ProgramDayBlock> = {}): ProgramDayBlock => ({
  id: 'block-1',
  blockType: ProgramBlockType.Amrap,
  instruction: '',
  sortOrder: 1,
  clientUserIds: [],
  exercises: [],
  createdAt: '2026-10-25T00:00:00Z',
  ...EMPTY_BLOCK_SETTINGS,
  ...overrides,
});

const Harness = ({
  block,
  onSubmit,
}: {
  block: ProgramDayBlock;
  onSubmit: (value: BlockEditValue) => Promise<void>;
}) => {
  const config = useBlockEditFormConfig({ block, onSubmit });
  return (
    <>
      <BlockSettingsFields
        blockType={config.blockType}
        rule={config.rule}
        form={config.form}
        setsToClear={config.setsToClear}
        onDurationBlur={config.handleDurationBlur}
      />
      <button type="button" onClick={config.handleSubmit}>
        save
      </button>
    </>
  );
};

const minutesOf = (field: string) => new RegExp(`minutesOf.*fields\\.${field}`);
const secondsOf = (field: string) => new RegExp(`secondsOf.*fields\\.${field}`);

describe('BlockSettingsFields', () => {
  it('requires the AMRAP duration and reports it on the field', async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn().mockResolvedValue(undefined);
    render(<Harness block={buildBlock()} onSubmit={onSubmit} />);

    const minutes = screen.getByRole('textbox', { name: minutesOf('durationSec') });
    expect(minutes).toHaveAttribute('aria-required', 'true');

    await user.click(screen.getByRole('button', { name: 'save' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('structure.blocks.settings.errors.required');
    expect(minutes).toHaveAttribute('aria-invalid', 'true');
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('takes minutes and seconds separately, tidies them when focus leaves and submits seconds', async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn().mockResolvedValue(undefined);
    render(<Harness block={buildBlock()} onSubmit={onSubmit} />);

    const minutes = screen.getByRole('textbox', { name: minutesOf('durationSec') });
    const seconds = screen.getByRole('textbox', { name: secondsOf('durationSec') });
    await user.type(seconds, '90');
    await user.tab();

    expect(minutes).toHaveValue('1');
    expect(seconds).toHaveValue('30');

    await user.click(screen.getByRole('button', { name: 'save' }));

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        blockType: ProgramBlockType.Amrap,
        settings: { ...EMPTY_BLOCK_SETTINGS, durationSec: 90 },
      }),
      expect.anything()
    );
  });

  it('does not tidy while moving from minutes to seconds of the same field', async () => {
    const user = userEvent.setup();
    render(<Harness block={buildBlock()} onSubmit={jest.fn()} />);

    const minutes = screen.getByRole('textbox', { name: minutesOf('durationSec') });
    const seconds = screen.getByRole('textbox', { name: secondsOf('durationSec') });
    await user.type(minutes, '12');
    await user.click(seconds);

    expect(seconds).toHaveValue('');
  });

  it('prefills intervals and explains that the format has no sets', () => {
    render(
      <Harness
        block={buildBlock({ blockType: ProgramBlockType.Intervals, rounds: 8, workSec: 20, restSec: 0 })}
        onSubmit={jest.fn()}
      />
    );

    expect(screen.getByLabelText(/structure.blocks.settings.fields.rounds/)).toHaveValue('8');
    expect(screen.getByRole('textbox', { name: minutesOf('workSec') })).toHaveValue('0');
    expect(screen.getByRole('textbox', { name: secondsOf('workSec') })).toHaveValue('20');
    expect(screen.getByRole('textbox', { name: secondsOf('restSec') })).toHaveValue('0');
    expect(screen.getByText('structure.blocks.settings.noSets')).toBeInTheDocument();
  });

  it('warns when saving would clear exercise sets', () => {
    render(
      <Harness
        block={buildBlock({ blockType: ProgramBlockType.Emom, rounds: 10, exercises: [buildExercise('3')] })}
        onSubmit={jest.fn()}
      />
    );

    expect(screen.getByRole('status')).toHaveTextContent('structure.blocks.settings.setsWillBeCleared:{"count":1}');
  });

  it('renders nothing for a session-part type', () => {
    const { container } = render(
      <Harness block={buildBlock({ blockType: ProgramBlockType.Strength })} onSubmit={jest.fn()} />
    );

    expect(container.querySelector('section')).toBeNull();
  });
});
