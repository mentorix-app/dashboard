'use client';

import { CornerUpLeft, MoreVertical, Trash2 } from 'lucide-react';

import { useTranslations } from '@/i18n';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/src/shared/ui';

import { ExerciseFields } from '../ExerciseFields';
import type { GroupExerciseRowProps } from './GroupExerciseRow.types';

/**
 * An exercise inside a group block. Mobile places the full-width content below
 * its controls; desktop centres drag/actions around the two-column exercise
 * content. Its menu can extract, move, or delete the exercise.
 */
export const GroupExerciseRow = ({
  block,
  exercise,
  exerciseName,
  canEdit,
  dragHandle,
  moveTargets,
  onUpdate,
  onRequestDelete,
  onExtract,
  onMoveToBlock,
}: GroupExerciseRowProps) => {
  const t = useTranslations('ProgramWizard');

  return (
    <>
      <div className="flex shrink-0 pt-0.5">{dragHandle}</div>

      <ExerciseFields
        exercise={exercise}
        exerciseName={exerciseName}
        action={
          canEdit ? (
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button type="button" variant="ghost" size="icon-sm" aria-label={t('structure.exercises.rowActions')}>
                  <MoreVertical className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onExtract(block.id, exercise.id)}>
                  <CornerUpLeft className="size-4" />
                  {t('structure.exercises.extractToSingle')}
                </DropdownMenuItem>
                {moveTargets.length > 0 ? (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>{t('structure.exercises.moveToBlock')}</DropdownMenuLabel>
                    {moveTargets.map((target) => (
                      <DropdownMenuItem key={target.id} onClick={() => onMoveToBlock(block.id, exercise.id, target.id)}>
                        {target.label}
                      </DropdownMenuItem>
                    ))}
                  </>
                ) : null}
                <DropdownMenuSeparator />
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
    </>
  );
};
