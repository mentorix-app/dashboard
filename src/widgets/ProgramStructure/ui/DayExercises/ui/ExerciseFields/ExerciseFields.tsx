'use client';

import { useTranslations } from '@/i18n';
import { Input, Textarea, Typography } from '@/src/shared/ui';
import { cn } from '@/src/shared/lib/styles';

import { useExerciseFieldsConfig } from './ExerciseFields.conf';
import type { ExerciseFieldsProps } from './ExerciseFields.types';

type VolumeInputProps = {
  label: string;
  value: string;
  disabled: boolean;
  onChange: (value: string) => void;
  onBlur: () => void;
};

const VolumeInput = ({ label, value, disabled, onChange, onBlur }: VolumeInputProps) => (
  <label className="flex items-center gap-1.5">
    <Typography as="span" variant="p-xs" className="text-muted-foreground">
      {label}
    </Typography>
    <Input
      type="text"
      inputMode="text"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      onBlur={onBlur}
      disabled={disabled}
      aria-label={label}
      className="h-8 w-16 px-1 text-center tabular-nums"
    />
  </label>
);

/**
 * Shared exercise content. Narrow containers stack the details above the
 * instruction; wider ones keep a compact details column (name, then sets/reps)
 * and give the rest of the row to the instruction, so it sits right next to
 * the exercise. In block types without sets only reps are shown.
 */
export const ExerciseFields = ({
  exercise,
  exerciseName,
  indicator,
  action,
  canEdit,
  showSets = true,
  onUpdate,
  className,
}: ExerciseFieldsProps) => {
  const t = useTranslations('ProgramWizard');
  const { sets, reps, instruction, onSetsChange, onRepsChange, onInstructionChange, onBlur } = useExerciseFieldsConfig({
    exercise,
    canEdit,
    showSets,
    onUpdate,
  });

  return (
    <div className={cn('grid min-w-0 gap-3 @min-[640px]:grid-cols-[minmax(17rem,19rem)_minmax(0,1fr)]', className)}>
      <div className="grid min-w-0 content-start gap-2">
        <div className="flex min-w-0 items-start gap-1">
          {indicator ? <div className="mt-px shrink-0">{indicator}</div> : null}
          <Typography variant="p-sm" className="line-clamp-2 min-w-0 flex-1 font-medium" title={exerciseName}>
            {exerciseName}
          </Typography>
        </div>

        <div className="flex items-center gap-3">
          {showSets ? (
            <VolumeInput
              label={t('structure.exercises.columns.sets')}
              value={sets}
              disabled={!canEdit}
              onChange={onSetsChange}
              onBlur={onBlur}
            />
          ) : null}
          <VolumeInput
            label={t('structure.exercises.columns.reps')}
            value={reps}
            disabled={!canEdit}
            onChange={onRepsChange}
            onBlur={onBlur}
          />
        </div>
      </div>

      {/* Stretches to the row height so the instruction lines up with the exercise details. */}
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
            'scrollbar-slim [field-sizing:content] max-h-40 min-h-16 w-full resize-none overflow-y-auto @min-[640px]:min-h-full',
            action && 'pr-11',
            !instruction && 'border-border/60 border-dashed shadow-none'
          )}
        />
        {action ? <div className="absolute top-2 right-2 flex items-center gap-1">{action}</div> : null}
      </div>
    </div>
  );
};
