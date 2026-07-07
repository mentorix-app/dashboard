'use client';

import { useTranslations } from '@/i18n';
import { Input, Typography } from '@/src/shared/ui';

import { useExerciseFieldsConfig } from './ExerciseFields.conf';
import type { ExerciseFieldsProps } from './ExerciseFields.types';

/**
 * The shared editable cells (name, sets, reps, instruction) rendered as grid
 * children so both single rows and grouped rows keep their columns aligned.
 */
export const ExerciseFields = ({ exercise, exerciseName, canEdit, onUpdate }: ExerciseFieldsProps) => {
  const t = useTranslations('ProgramWizard');
  const { sets, reps, instruction, onSetsChange, onRepsChange, onInstructionChange, onBlur } = useExerciseFieldsConfig({
    exercise,
    canEdit,
    onUpdate,
  });

  return (
    <>
      <Typography variant="p-sm" className="truncate font-medium" title={exerciseName}>
        {exerciseName}
      </Typography>

      <div className="flex items-center gap-1">
        <Typography variant="p-xs" className="text-muted-foreground">
          {t('structure.exercises.columns.sets')}
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
          className="h-8 w-full min-w-0 px-1 text-center"
        />
      </div>

      <div className="flex items-center gap-1">
        <Typography variant="p-xs" className="text-muted-foreground">
          {t('structure.exercises.columns.reps')}
        </Typography>
        <Input
          type="number"
          inputMode="numeric"
          min={0}
          value={reps}
          onChange={(event) => onRepsChange(event.target.value)}
          onBlur={onBlur}
          disabled={!canEdit}
          aria-label={t('structure.exercises.columns.reps')}
          className="h-8 w-full min-w-0 px-1 text-center"
        />
      </div>

      <Input
        value={instruction}
        onChange={(event) => onInstructionChange(event.target.value)}
        onBlur={onBlur}
        disabled={!canEdit}
        aria-label={t('structure.exercises.columns.instruction')}
        placeholder={t('structure.exercises.columns.instruction')}
        className="h-8"
      />
    </>
  );
};
