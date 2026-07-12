'use client';

import { useTranslations } from '@/i18n';
import { Input, Typography } from '@/src/shared/ui';
import { cn } from '@/src/shared/lib/styles';

import { useExerciseFieldsConfig } from './ExerciseFields.conf';
import type { ExerciseFieldsProps } from './ExerciseFields.types';

/**
 * The shared editable inputs (sets, reps, instruction). On mobile sets and reps
 * share a row while the instruction spans the full width beneath them; from the
 * `md` breakpoint up they lay out inline so every row lines up. The exercise
 * name is rendered by the row header, not here.
 */
export const ExerciseFields = ({ exercise, canEdit, onUpdate, className }: ExerciseFieldsProps) => {
  const t = useTranslations('ProgramWizard');
  const { sets, reps, instruction, onSetsChange, onRepsChange, onInstructionChange, onBlur } = useExerciseFieldsConfig({
    exercise,
    canEdit,
    onUpdate,
  });

  return (
    <div className={cn('grid grid-cols-2 items-center gap-2 md:flex md:min-w-0 md:flex-1', className)}>
      <div className="flex items-center gap-1 md:w-24 md:shrink-0">
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

      <div className="flex items-center gap-1 md:w-24 md:shrink-0">
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
        className="col-span-2 h-8 md:col-span-1 md:min-w-0 md:flex-1"
      />
    </div>
  );
};
