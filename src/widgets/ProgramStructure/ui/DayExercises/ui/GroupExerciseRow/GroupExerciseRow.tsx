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
  Typography,
} from '@/src/shared/ui';

import { ExerciseFields } from '../ExerciseFields';
import type { GroupExerciseRowProps } from './GroupExerciseRow.types';

/**
 * An exercise inside a group block. On mobile the drag handle, name and row
 * actions sit on a header line with the editable fields full width below; from
 * `md` up the row flattens into a single top-aligned line — drag, name
 * (wrapping up to two lines), inputs, actions. Its menu can extract the
 * exercise, move it into another group, or delete it.
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
      <div className="flex items-center gap-2 xl:contents">
        <div className="flex shrink-0 xl:order-1 xl:self-center">{dragHandle}</div>

        <Typography
          variant="p-sm"
          className="line-clamp-2 min-w-0 flex-1 font-medium xl:order-2 xl:min-w-48 xl:self-center"
          title={exerciseName}
        >
          {exerciseName}
        </Typography>

        <div className="ml-auto shrink-0 xl:order-4 xl:ml-0 xl:self-center">
          {canEdit ? (
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
          ) : (
            <span aria-hidden className="block size-8" />
          )}
        </div>
      </div>

      <ExerciseFields exercise={exercise} canEdit={canEdit} onUpdate={onUpdate} className="xl:order-3" />
    </>
  );
};
