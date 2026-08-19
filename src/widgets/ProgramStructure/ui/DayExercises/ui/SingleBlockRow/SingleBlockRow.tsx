'use client';

import { MoreVertical, Pencil, Trash2 } from 'lucide-react';

import { useTranslations } from '@/i18n';
import {
  Button,
  Checkbox,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/src/shared/ui';

import { ExerciseFields } from '../ExerciseFields';
import { BlockVisibilityDialog } from '../BlockVisibilityDialog';
import { BlockVisibilityIndicator } from '../BlockVisibilityIndicator';
import type { SingleBlockRowProps } from './SingleBlockRow.types';

/**
 * A top-level single exercise. Mobile keeps select/drag and actions in a compact
 * control row with full-width exercise content beneath it. Desktop centres those
 * controls around a two-column content area.
 */
export const SingleBlockRow = ({
  programId,
  weekId,
  block,
  exercise,
  exerciseName,
  canEdit,
  selected,
  dragHandle,
  moveTargets,
  onSelectChange,
  onUpdate,
  onRequestDelete,
  onMoveToDay,
  isLastSharedBlock,
  visibilityOpen,
  onOpenVisibility,
  onVisibilityOpenChange,
}: SingleBlockRowProps) => {
  const t = useTranslations('ProgramWizard');

  return (
    <>
      <div className="flex items-center gap-2 pt-0.5">
        {canEdit ? (
          <Checkbox
            checked={selected}
            onCheckedChange={(checked) => onSelectChange(block.id, checked === true)}
            aria-label={t('structure.exercises.selectForMerge')}
            className="shrink-0"
          />
        ) : (
          <span aria-hidden className="size-4 shrink-0" />
        )}

        <div className="flex shrink-0">{dragHandle}</div>
      </div>

      <ExerciseFields
        exercise={exercise}
        exerciseName={exerciseName}
        indicator={
          block.clientUserIds.length > 0 ? (
            <BlockVisibilityIndicator
              clientCount={block.clientUserIds.length}
              onClick={canEdit ? onOpenVisibility : undefined}
            />
          ) : undefined
        }
        action={
          canEdit ? (
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button type="button" variant="ghost" size="icon-sm" aria-label={t('structure.exercises.rowActions')}>
                  <MoreVertical className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onOpenVisibility}>
                  <Pencil className="size-4" />
                  {t('structure.blocks.editBlock')}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {moveTargets.length > 0 ? (
                  <>
                    <DropdownMenuLabel>{t('structure.exercises.moveToDay')}</DropdownMenuLabel>
                    {moveTargets.map((target) => (
                      <DropdownMenuItem key={target.id} onClick={() => onMoveToDay(block.id, target.id)}>
                        {target.label}
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                  </>
                ) : null}
                <DropdownMenuItem variant="destructive" onClick={() => onRequestDelete(block.id, exercise.id)}>
                  <Trash2 className="size-4" />
                  {t('structure.exercises.deleteExercise')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null
        }
        canEdit={canEdit}
        onUpdate={onUpdate}
        className="min-w-0"
      />

      <BlockVisibilityDialog
        programId={programId}
        weekId={weekId}
        block={block}
        isLastSharedBlock={isLastSharedBlock}
        open={visibilityOpen}
        onOpenChange={onVisibilityOpenChange}
      />
    </>
  );
};
