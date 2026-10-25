'use client';

import { Plus } from 'lucide-react';

import { useTranslations } from '@/i18n';
import { ExercisePicker } from '@/src/features/ExercisePicker';
import { BlockTypeBadge } from '@/src/entities/program';
import { Button, Checkbox, SortableItem, Typography } from '@/src/shared/ui';

import { BLOCK_DND_PREFIX, getBlockTypeLabelKey } from '../../lib';
import { BlockEditDialog } from '../BlockEditDialog';
import { BlockSettingsSummary } from '../BlockSettingsSummary';
import { BlockVisibilityIndicator } from '../BlockVisibilityIndicator';
import { GroupBlockActions } from '../GroupBlockActions';
import { GroupBlockExercises } from '../GroupBlockExercises';
import { RowDragHandle } from '../RowDragHandle';
import { useGroupBlockCardConfig } from './GroupBlockCard.conf';
import type { GroupBlockCardProps } from './GroupBlockCard.types';

/** A grouped work block: a titled card with its format settings wrapping several exercises. */
export const GroupBlockCard = (props: GroupBlockCardProps) => {
  const {
    programId,
    weekId,
    block,
    canEdit,
    getExerciseLabel,
    exerciseMoveTargets,
    dayMoveTargets,
    selected,
    onSelectChange,
    onUpdateExercise,
    onRequestDeleteExercise,
    onDuplicateExercise,
    onExtractExercise,
    onMoveExerciseToBlock,
    onAddExercise,
    onUngroupBlock,
    onDeleteBlock,
    onMoveBlockToDay,
    onCopyBlock,
    isLastSharedBlock,
  } = props;
  const t = useTranslations('ProgramWizard');
  const card = useGroupBlockCardConfig({ block, onAddExercise, onDeleteBlock });
  const otherBlockTargets = exerciseMoveTargets.filter((target) => target.id !== block.id);
  const typeLabel = t(getBlockTypeLabelKey(block.blockType));

  return (
    <SortableItem id={`${BLOCK_DND_PREFIX}${block.id}`} className="bg-card space-y-1.5 rounded-lg border px-3 py-2">
      <div className="flex flex-wrap items-center gap-2">
        {canEdit ? (
          <Checkbox
            checked={selected}
            onCheckedChange={(checked) => onSelectChange(block.id, checked === true)}
            aria-label={t('structure.blocks.selectForMerge')}
          />
        ) : null}
        <RowDragHandle canEdit={canEdit} label={t('structure.blocks.reorderBlock')} />
        <BlockTypeBadge blockType={block.blockType} label={typeLabel} />
        <BlockSettingsSummary block={block} onEditMissing={canEdit ? card.onOpenEdit : undefined} />
        <div className="ml-auto flex items-center gap-1">
          <BlockVisibilityIndicator
            clientCount={block.clientUserIds.length}
            onClick={canEdit ? card.onOpenEdit : undefined}
          />
          {canEdit ? (
            <div className="flex w-9 justify-start">
              <GroupBlockActions
                dayMoveTargets={dayMoveTargets}
                onEdit={card.onOpenEdit}
                onCopy={() => onCopyBlock(block.id)}
                onMoveToDay={(targetDayId) => onMoveBlockToDay(block.id, targetDayId)}
                onUngroup={() => onUngroupBlock(block.id)}
                onDelete={card.onOpenDelete}
              />
            </div>
          ) : null}
        </div>
      </div>

      {block.instruction ? (
        <Typography variant="p-sm" className="text-muted-foreground whitespace-pre-wrap">
          {block.instruction}
        </Typography>
      ) : canEdit ? (
        <button
          type="button"
          onClick={card.onOpenEdit}
          className="text-muted-foreground hover:text-foreground focus-visible:ring-ring/50 -ml-1 inline-flex w-fit items-center gap-1 rounded-sm px-1 py-0.5 text-xs transition-colors outline-none focus-visible:ring-[3px]"
        >
          <Plus aria-hidden="true" className="size-3.5" />
          {t('structure.blocks.addInstruction')}
        </button>
      ) : null}

      <GroupBlockExercises
        block={block}
        canEdit={canEdit}
        getExerciseLabel={getExerciseLabel}
        moveTargets={otherBlockTargets}
        onUpdateExercise={onUpdateExercise}
        onRequestDeleteExercise={onRequestDeleteExercise}
        onDuplicateExercise={onDuplicateExercise}
        onExtractExercise={onExtractExercise}
        onMoveExerciseToBlock={onMoveExerciseToBlock}
      />

      {canEdit ? (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={card.onOpenPicker}
          className="h-auto min-h-8 w-full justify-start py-1.5 text-left whitespace-normal"
        >
          <Plus className="size-4" />
          {t('structure.blocks.addExerciseToBlock', { type: typeLabel })}
        </Button>
      ) : null}

      <BlockEditDialog
        programId={programId}
        weekId={weekId}
        block={block}
        isLastSharedBlock={isLastSharedBlock}
        open={card.isEditOpen}
        onOpenChange={card.onEditOpenChange}
      />
      <ExercisePicker
        open={card.isPickerOpen}
        onOpenChange={card.onPickerOpenChange}
        onConfirm={card.handleAddConfirm}
      />
    </SortableItem>
  );
};
