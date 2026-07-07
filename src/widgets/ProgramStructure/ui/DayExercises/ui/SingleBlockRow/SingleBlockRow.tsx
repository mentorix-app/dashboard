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
} from '@/src/shared/ui';

import { ExerciseFields } from '../ExerciseFields';
import type { SingleBlockRowProps } from './SingleBlockRow.types';

/**
 * A top-level single exercise. Carries a merge checkbox, the shared editable
 * fields, and a menu to move its block to another day or delete it. Returns
 * grid cells; the parent owns the row wrapper and its grid template.
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
      {canEdit ? (
        <Checkbox
          checked={selected}
          onCheckedChange={(checked) => onSelectChange(block.id, checked === true)}
          aria-label={t('structure.exercises.selectForMerge')}
          className="mx-auto"
        />
      ) : (
        <span aria-hidden className="size-4" />
      )}

      {dragHandle}

      <ExerciseFields exercise={exercise} exerciseName={exerciseName} canEdit={canEdit} onUpdate={onUpdate} />

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
        <span aria-hidden className="size-8" />
      )}
    </>
  );
};
