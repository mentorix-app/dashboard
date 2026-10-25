'use client';

import { CircleAlert, Hourglass, Pause, Repeat, Timer, Zap, type LucideIcon } from 'lucide-react';

import { useTranslations } from '@/i18n';
import type { ProgramDayBlock } from '@/src/entities/program';
import { cn } from '@/src/shared/lib/styles';

import { BLOCK_SETTING_MISSING_KEY } from '../../DayExercises.constants';
import { useDurationFormatter } from '../../hooks/useDurationFormatter';
import { getBlockSettingChips, type BlockSettingChip } from '../../lib';

type BlockSettingsSummaryProps = {
  block: ProgramDayBlock;
  /** Opens the block editor; turns "not set" chips into buttons. */
  onEditMissing?: () => void;
  className?: string;
};

const CHIP_ICON: Record<BlockSettingChip['kind'], LucideIcon> = {
  rounds: Repeat,
  duration: Timer,
  timeCap: Hourglass,
  work: Zap,
  rest: Pause,
  noRest: Pause,
  missing: CircleAlert,
};

const CHIP_CLASS =
  'inline-flex h-6 items-center gap-1 rounded-full border px-2 text-xs font-medium whitespace-nowrap tabular-nums [&_svg]:size-3.5 [&_svg]:shrink-0';
const VALUE_CHIP_CLASS = 'border-border/70 bg-muted/60 text-foreground/80 [&_svg]:text-muted-foreground';
const MISSING_CHIP_CLASS =
  'border-dashed border-amber-400/80 bg-amber-50 text-amber-800 dark:border-amber-500/40 dark:bg-amber-950/40 dark:text-amber-300';

/** Compact, readable chips with a block's format settings (e.g. `⟳ 10 rounds`, `⏱ 12 min`). */
export const BlockSettingsSummary = ({ block, onEditMissing, className }: BlockSettingsSummaryProps) => {
  const t = useTranslations('ProgramWizard');
  const formatDuration = useDurationFormatter();
  const chips = getBlockSettingChips(block);
  if (chips.length === 0) return null;

  const chipText = (chip: BlockSettingChip): string => {
    switch (chip.kind) {
      case 'rounds':
        return t('structure.blocks.settings.summary.rounds', { count: chip.count });
      case 'duration':
        return formatDuration(chip.seconds);
      case 'timeCap':
        return t('structure.blocks.settings.summary.timeCap', { time: formatDuration(chip.seconds) });
      case 'work':
        return t('structure.blocks.settings.summary.work', { time: formatDuration(chip.seconds) });
      case 'rest':
        return t('structure.blocks.settings.summary.rest', { time: formatDuration(chip.seconds) });
      case 'noRest':
        return t('structure.blocks.settings.summary.noRest');
      case 'missing':
        return t(BLOCK_SETTING_MISSING_KEY[chip.field]);
    }
  };

  return (
    <ul
      aria-label={t('structure.blocks.settings.summary.label')}
      className={cn('flex flex-wrap items-center gap-1.5', className)}
    >
      {chips.map((chip) => {
        const Icon = CHIP_ICON[chip.kind];
        const content = (
          <>
            <Icon aria-hidden="true" />
            {chipText(chip)}
          </>
        );
        const key = chip.kind === 'missing' ? `missing-${chip.field}` : chip.kind;

        if (chip.kind !== 'missing') {
          return (
            <li key={key} className={cn(CHIP_CLASS, VALUE_CHIP_CLASS)}>
              {content}
            </li>
          );
        }

        return (
          <li key={key}>
            {onEditMissing ? (
              <button
                type="button"
                onClick={onEditMissing}
                title={t('structure.blocks.settings.summary.missingAction')}
                className={cn(
                  CHIP_CLASS,
                  MISSING_CHIP_CLASS,
                  'focus-visible:ring-ring/50 cursor-pointer transition-colors outline-none hover:bg-amber-100 focus-visible:ring-[3px] dark:hover:bg-amber-950/70'
                )}
              >
                {content}
                <span className="sr-only">. {t('structure.blocks.settings.summary.missingAction')}</span>
              </button>
            ) : (
              <span className={cn(CHIP_CLASS, MISSING_CHIP_CLASS)}>{content}</span>
            )}
          </li>
        );
      })}
    </ul>
  );
};
