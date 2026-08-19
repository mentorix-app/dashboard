'use client';

import { useTranslations } from '@/i18n';
import { Input, Textarea, Typography } from '@/src/shared/ui';
import { cn } from '@/src/shared/lib/styles';

import { useExerciseFieldsConfig } from './ExerciseFields.conf';
import type { ExerciseFieldsProps } from './ExerciseFields.types';

/**
 * Shared exercise content. Mobile stacks the exercise details above the
 * instruction; desktop renders details and instruction as two balanced
 * columns. The title is clamped to two lines, sets/reps sit directly beneath
 * it, and the instruction starts at two rows and grows with its content.
 */
export const ExerciseFields = ({
  exercise,
  exerciseName,
  indicator,
  action,
  canEdit,
  onUpdate,
  className,
}: ExerciseFieldsProps) => {
  const t = useTranslations('ProgramWizard');
  const { sets, reps, instruction, onSetsChange, onRepsChange, onInstructionChange, onBlur } = useExerciseFieldsConfig({
    exercise,
    canEdit,
    onUpdate,
  });

  return (
    <div
      className={cn(
        'grid min-w-0 gap-3 min-[1100px]:@min-[700px]:grid-cols-[minmax(12rem,0.85fr)_minmax(16rem,1.15fr)] min-[1100px]:@min-[700px]:items-start',
        className
      )}
    >
      <div className="grid min-w-0 gap-2">
        <div className="flex min-w-0 items-start gap-1">
          {indicator ? <div className="mt-px shrink-0">{indicator}</div> : null}
          <Typography variant="p-sm" className="line-clamp-2 min-w-0 flex-1 font-medium" title={exerciseName}>
            {exerciseName}
          </Typography>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <label className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)] items-center gap-1">
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
          </label>

          <label className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)] items-center gap-1">
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
          </label>
        </div>
      </div>

      <div className="relative min-w-0">
        <Textarea
          rows={2}
          value={instruction}
          onChange={(event) => onInstructionChange(event.target.value)}
          onBlur={onBlur}
          disabled={!canEdit}
          aria-label={t('structure.exercises.columns.instruction')}
          placeholder={t('structure.exercises.columns.instruction')}
          className={cn(
            '[field-sizing:content] max-h-40 min-h-16 w-full resize-none overflow-y-auto',
            action && 'pr-11',
            !instruction && 'border-border/60 border-dashed shadow-none'
          )}
        />
        {action ? <div className="absolute top-2 right-2 flex items-center gap-1">{action}</div> : null}
      </div>
    </div>
  );
};
