'use client';

import { useTranslations } from '@/i18n';
import { Input, Textarea, Typography } from '@/src/shared/ui';
import { cn } from '@/src/shared/lib/styles';

import { useExerciseFieldsConfig } from './ExerciseFields.conf';
import type { ExerciseFieldsProps } from './ExerciseFields.types';

/**
 * The shared editable inputs, laid out as a compact two-row block: sets and
 * reps on the top line, with a full-width, auto-growing instruction textarea
 * beneath them. On desktop the block keeps a fixed width so it stays aligned
 * across rows while the exercise name (rendered by the row header) takes the
 * remaining space. The exercise name is not rendered here.
 */
export const ExerciseFields = ({ exercise, canEdit, onUpdate, className }: ExerciseFieldsProps) => {
  const t = useTranslations('ProgramWizard');
  const { sets, reps, instruction, onSetsChange, onRepsChange, onInstructionChange, onBlur } = useExerciseFieldsConfig({
    exercise,
    canEdit,
    onUpdate,
  });

  return (
    <div className={cn('flex flex-col gap-2 xl:w-80 xl:shrink-0', className)}>
      <div className="flex items-center gap-2">
        <div className="flex flex-1 items-center gap-1">
          <Typography variant="p-xs" className="text-muted-foreground">
            {t('structure.exercises.columns.sets')}
          </Typography>
          <Input
            type="text"
            inputMode="text"
            value={sets}
            onChange={(event) => onSetsChange(event.target.value)}
            onBlur={onBlur}
            disabled={!canEdit}
            aria-label={t('structure.exercises.columns.sets')}
            className="h-8 w-full min-w-0 px-1 text-center"
          />
        </div>

        <div className="flex flex-1 items-center gap-1">
          <Typography variant="p-xs" className="text-muted-foreground">
            {t('structure.exercises.columns.reps')}
          </Typography>
          <Input
            type="text"
            inputMode="text"
            value={reps}
            onChange={(event) => onRepsChange(event.target.value)}
            onBlur={onBlur}
            disabled={!canEdit}
            aria-label={t('structure.exercises.columns.reps')}
            className="h-8 w-full min-w-0 px-1 text-center"
          />
        </div>
      </div>

      <Textarea
        rows={2}
        value={instruction}
        onChange={(event) => onInstructionChange(event.target.value)}
        onBlur={onBlur}
        disabled={!canEdit}
        aria-label={t('structure.exercises.columns.instruction')}
        placeholder={t('structure.exercises.columns.instruction')}
        className="min-h-9 w-full resize-none"
      />
    </div>
  );
};
