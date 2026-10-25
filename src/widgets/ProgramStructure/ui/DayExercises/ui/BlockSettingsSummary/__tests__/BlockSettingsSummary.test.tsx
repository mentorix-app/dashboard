import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { EMPTY_BLOCK_SETTINGS } from '../../../../../../../entities/program/model/blockSettings';
import { ProgramBlockType, type ProgramDayBlock } from '../../../../../../../entities/program/model/structure';

import { BlockSettingsSummary } from '../BlockSettingsSummary';

const translate = (key: string, values?: Record<string, unknown>) =>
  values ? `${key}:${JSON.stringify(values)}` : key;

jest.mock('../../../../../../../../i18n', () => ({
  useTranslations: () => (key: string, values?: Record<string, unknown>) =>
    values ? `${key}:${JSON.stringify(values)}` : key,
}));

const buildBlock = (overrides: Partial<ProgramDayBlock> = {}): ProgramDayBlock => ({
  id: 'block-1',
  blockType: ProgramBlockType.Intervals,
  instruction: '',
  sortOrder: 1,
  clientUserIds: [],
  exercises: [],
  createdAt: '2026-10-25T00:00:00Z',
  ...EMPTY_BLOCK_SETTINGS,
  ...overrides,
});

const seconds = (value: number) => translate('structure.blocks.settings.units.seconds', { seconds: value });

describe('BlockSettingsSummary', () => {
  it('lists the block settings as chips with human durations', () => {
    render(<BlockSettingsSummary block={buildBlock({ rounds: 8, workSec: 20, restSec: 10 })} />);

    const list = screen.getByRole('list', { name: 'structure.blocks.settings.summary.label' });
    const items = within(list).getAllByRole('listitem');
    expect(items.map((item) => item.textContent)).toEqual([
      translate('structure.blocks.settings.summary.rounds', { count: 8 }),
      translate('structure.blocks.settings.summary.work', { time: seconds(20) }),
      translate('structure.blocks.settings.summary.rest', { time: seconds(10) }),
    ]);
  });

  it('says whole minutes for an AMRAP', () => {
    render(<BlockSettingsSummary block={buildBlock({ blockType: ProgramBlockType.Amrap, durationSec: 720 })} />);

    expect(screen.getByRole('listitem')).toHaveTextContent(
      translate('structure.blocks.settings.units.minutes', { minutes: 12 })
    );
  });

  it('turns a missing required setting into a button that opens the editor', async () => {
    const user = userEvent.setup();
    const onEditMissing = jest.fn();
    render(<BlockSettingsSummary block={buildBlock({ rounds: 8 })} onEditMissing={onEditMissing} />);

    await user.click(screen.getByRole('button', { name: /structure.blocks.settings.summary.missing.workSec/ }));

    expect(onEditMissing).toHaveBeenCalledTimes(1);
  });

  it('shows a missing setting as plain text when the program is read-only', () => {
    render(<BlockSettingsSummary block={buildBlock({ rounds: 8 })} />);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.getByText('structure.blocks.settings.summary.missing.workSec')).toBeInTheDocument();
  });

  it('renders nothing for a type without settings', () => {
    const { container } = render(<BlockSettingsSummary block={buildBlock({ blockType: ProgramBlockType.Strength })} />);

    expect(container).toBeEmptyDOMElement();
  });
});
