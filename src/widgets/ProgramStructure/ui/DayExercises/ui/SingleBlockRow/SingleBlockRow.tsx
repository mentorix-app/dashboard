'use client';

import { MoreVertical, Trash2 } from 'lucide-react';

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
  Typography,
} from '@/src/shared/ui';

import { ExerciseFields } from '../ExerciseFields';
import type { SingleBlockRowProps } from './SingleBlockRow.types';

/**
 * A top-level single exercise. On mobile the merge checkbox, drag handle, name
 * and row actions sit on a header line with the editable fields full width
 * below; from `md` up the row flattens into a single top-aligned line — drag,
 * name (wrapping up to two lines), inputs, actions. Returns the pieces for the
 * parent row wrapper.
 */
export const SingleBlockRow = ({
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
}: SingleBlockRowProps) => {
  const t = useTranslations('ProgramWizard');

  return (
    <>
      <div className="flex items-center gap-2 xl:contents">
        {canEdit ? (
          <Checkbox
            checked={selected}
            onCheckedChange={(checked) => onSelectChange(block.id, checked === true)}
            aria-label={t('structure.exercises.selectForMerge')}
            className="shrink-0 xl:order-1 xl:mt-2"
          />
        ) : (
          <span aria-hidden className="size-4 shrink-0 xl:order-1" />
        )}

        <div className="flex shrink-0 xl:order-2 xl:self-center">{dragHandle}</div>

        <Typography
          variant="p-sm"
          className="line-clamp-2 min-w-0 flex-1 font-medium xl:order-3 xl:min-w-48 xl:self-center"
          title={exerciseName}
        >
          {exerciseName}
        </Typography>

        <div className="ml-auto shrink-0 xl:order-5 xl:ml-0 xl:self-center">
          {canEdit ? (
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button type="button" variant="ghost" size="icon-sm" aria-label={t('structure.exercises.rowActions')}>
                  <MoreVertical className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
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
          ) : (
            <span aria-hidden className="block size-8" />
          )}
        </div>
      </div>

      <ExerciseFields exercise={exercise} canEdit={canEdit} onUpdate={onUpdate} className="xl:order-4" />
    </>
  );
};
