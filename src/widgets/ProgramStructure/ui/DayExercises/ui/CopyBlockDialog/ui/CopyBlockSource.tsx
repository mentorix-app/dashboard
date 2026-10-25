'use client';

import { useTranslations } from '@/i18n';
import {
  BlockTypeBadge,
  ProgramBlockType,
  type ProgramDayBlock,
  type ProgramDayExercise,
} from '@/src/entities/program';
import { Typography } from '@/src/shared/ui';

import { getBlockTypeLabelKey } from '../../../lib';
import { BlockSettingsSummary } from '../../BlockSettingsSummary';
import { summarizeNames } from '../CopyBlockDialog.utils';

type CopyBlockSourceProps = {
  block: ProgramDayBlock;
  getExerciseLabel: (exercise: ProgramDayExercise) => string;
};

/** Read-only preview of the block being copied: type, settings and its exercises. */
export const CopyBlockSource = ({ block, getExerciseLabel }: CopyBlockSourceProps) => {
  const t = useTranslations('ProgramWizard');
  const names = block.exercises.map(getExerciseLabel);
  const { shown, hiddenCount } = summarizeNames(names);
  const isSingle = block.blockType === ProgramBlockType.Single;

  return (
    <div className="bg-muted/40 dark:bg-muted/20 grid gap-2 rounded-lg border p-3">
      <div className="flex flex-wrap items-center gap-2">
        <BlockTypeBadge blockType={block.blockType} label={t(getBlockTypeLabelKey(block.blockType))} />
        <BlockSettingsSummary block={block} />
        {!isSingle ? (
          <Typography variant="p-xs" className="text-muted-foreground ml-auto">
            {t('structure.blocks.copyDialog.exerciseCount', { count: names.length })}
          </Typography>
        ) : null}
      </div>
      {names.length > 0 ? (
        <Typography variant="p-sm" className="line-clamp-2 font-medium">
          {shown.join(' · ')}
          {hiddenCount > 0 ? (
            <span className="text-muted-foreground font-normal">
              {' '}
              {t('structure.blocks.copyDialog.moreExercises', { count: hiddenCount })}
            </span>
          ) : null}
        </Typography>
      ) : (
        <Typography variant="p-sm" className="text-muted-foreground italic">
          {t('structure.blocks.copyDialog.noExercises')}
        </Typography>
      )}
    </div>
  );
};
