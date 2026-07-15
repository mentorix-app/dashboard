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
 * A top-level single exercise. On mobile the merge checkbox, drag handle,
 * exercise name and row actions sit on a header line with the editable fields
 * full width below; from `md` up the parent row flattens everything back into a
 * single aligned line. Returns cells for the parent row wrapper.
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
      <div className="flex items-center gap-2 md:contents">
        {canEdit ? (
          <Checkbox
            checked={selected}
            onCheckedChange={(checked) => onSelectChange(block.id, checked === true)}
            aria-label={t('structure.exercises.selectForMerge')}
            className="shrink-0 md:order-1"
          />
        ) : (
          <span aria-hidden className="size-4 shrink-0 md:order-1" />
        )}

        <div className="flex shrink-0 md:order-2">{dragHandle}</div>

        <Typography variant="p-sm" className="min-w-0 flex-1 truncate font-medium md:order-3" title={exerciseName}>
          {exerciseName}
        </Typography>

        <div className="ml-auto shrink-0 md:order-5 md:ml-0">
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

      <ExerciseFields exercise={exercise} canEdit={canEdit} onUpdate={onUpdate} className="md:order-4" />
    </>
  );
};
