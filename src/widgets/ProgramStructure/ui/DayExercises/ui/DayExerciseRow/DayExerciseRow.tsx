'use client';

import { MoreVertical, Trash2 } from 'lucide-react';

import { useTranslations } from '@/i18n';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Input,
  Typography,
} from '@/src/shared/ui';

import { useDayExerciseRowConfig } from './DayExerciseRow.conf';
import type { DayExerciseRowProps } from './DayExerciseRow.types';

export const DayExerciseRow = ({
  exercise,
  exerciseName,
  canEdit,
  dragHandle,
  moveTargets,
  onUpdate,
  onDelete,
  onMove,
}: DayExerciseRowProps) => {
  const t = useTranslations('ProgramWizard');
  const { sets, reps, weight, instruction, onSetsChange, onRepsChange, onWeightChange, onInstructionChange, onBlur } =
    useDayExerciseRowConfig({ exercise, canEdit, onUpdate });

  return (
    <>
      {dragHandle}

      <Typography variant="p-sm" className="truncate font-medium" title={exerciseName}>
        {exerciseName}
      </Typography>

      <Input
        type="number"
        inputMode="numeric"
        min={0}
        value={sets}
        onChange={(event) => onSetsChange(event.target.value)}
        onBlur={onBlur}
        disabled={!canEdit}
        aria-label={t('structure.exercises.columns.sets')}
        className="h-8 px-2 text-center"
      />
      <Input
        type="number"
        inputMode="numeric"
        min={0}
        value={reps}
        onChange={(event) => onRepsChange(event.target.value)}
        onBlur={onBlur}
        disabled={!canEdit}
        aria-label={t('structure.exercises.columns.reps')}
        className="h-8 px-2 text-center"
      />
      <Input
        type="number"
        inputMode="decimal"
        min={0}
        step="0.5"
        value={weight}
        onChange={(event) => onWeightChange(event.target.value)}
        onBlur={onBlur}
        disabled={!canEdit}
        aria-label={t('structure.exercises.columns.weight')}
        className="h-8 px-2 text-center"
      />
      <Input
        value={instruction}
        onChange={(event) => onInstructionChange(event.target.value)}
        onBlur={onBlur}
        disabled={!canEdit}
        aria-label={t('structure.exercises.columns.instruction')}
        className="h-8"
      />

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
                  <DropdownMenuItem key={target.id} onClick={() => onMove(exercise.id, target.id)}>
                    {target.label}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
              </>
            ) : null}
            <DropdownMenuItem variant="destructive" onClick={() => onDelete(exercise.id)}>
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
