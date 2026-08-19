'use client';

import { useTranslations } from '@/i18n';
import { ProgramBlockType } from '@/src/entities/program';
import { SortableItem } from '@/src/shared/ui';
import { cn } from '@/src/shared/lib/styles';

import { EXERCISE_ROW_LAYOUT } from '../../DayExercises.constants';
import { BLOCK_DND_PREFIX } from '../../lib';
import { GroupBlockCard } from '../GroupBlockCard';
import { RowDragHandle } from '../RowDragHandle';
import { SingleBlockRow } from '../SingleBlockRow';
import type { DayBlockProps } from './DayBlock.types';

/** Renders one day block as either a flat single row or a grouped block card. */
export const DayBlock = (props: DayBlockProps) => {
  const {
    programId,
    weekId,
    block,
    canEdit,
    getExerciseLabel,
    selectedBlockIds,
    exerciseMoveTargets,
    dayMoveTargets,
    onSelectChange,
    onUpdateExercise,
    onRequestDeleteExercise,
    onExtractExercise,
    onMoveExerciseToBlock,
    onAddExercise,
    onPatchBlock,
    onUngroupBlock,
    onDeleteBlock,
    onMoveBlockToDay,
    isLastSharedBlock,
    visibilityOpen,
    onOpenVisibility,
    onVisibilityOpenChange,
  } = props;
  const t = useTranslations('ProgramWizard');

  if (block.blockType !== ProgramBlockType.Single) {
    return (
      <GroupBlockCard
        programId={programId}
        weekId={weekId}
        block={block}
        canEdit={canEdit}
        getExerciseLabel={getExerciseLabel}
        exerciseMoveTargets={exerciseMoveTargets}
        dayMoveTargets={dayMoveTargets}
        selected={selectedBlockIds.has(block.id)}
        onSelectChange={onSelectChange}
        onUpdateExercise={onUpdateExercise}
        onRequestDeleteExercise={onRequestDeleteExercise}
        onExtractExercise={onExtractExercise}
        onMoveExerciseToBlock={onMoveExerciseToBlock}
        onAddExercise={onAddExercise}
        onPatchBlock={onPatchBlock}
        onUngroupBlock={onUngroupBlock}
        onDeleteBlock={onDeleteBlock}
        onMoveBlockToDay={onMoveBlockToDay}
        isLastSharedBlock={isLastSharedBlock}
      />
    );
  }

  const exercise = block.exercises[0];
  if (!exercise) return null;

  return (
    <SortableItem
      id={`${BLOCK_DND_PREFIX}${block.id}`}
      className={cn(EXERCISE_ROW_LAYOUT, 'border-border/60 rounded-md border px-3 py-2.5')}
    >
      <SingleBlockRow
        programId={programId}
        weekId={weekId}
        block={block}
        exercise={exercise}
        exerciseName={getExerciseLabel(exercise)}
        canEdit={canEdit}
        selected={selectedBlockIds.has(block.id)}
        dragHandle={<RowDragHandle canEdit={canEdit} label={t('structure.blocks.reorderBlock')} />}
        moveTargets={dayMoveTargets}
        onSelectChange={onSelectChange}
        onUpdate={(itemId, input) => onUpdateExercise(block.id, itemId, input)}
        onRequestDelete={onRequestDeleteExercise}
        onMoveToDay={onMoveBlockToDay}
        isLastSharedBlock={isLastSharedBlock}
        visibilityOpen={visibilityOpen}
        onOpenVisibility={onOpenVisibility}
        onVisibilityOpenChange={onVisibilityOpenChange}
      />
    </SortableItem>
  );
};
