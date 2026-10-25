'use client';

import { useId, type FocusEvent } from 'react';

import { useTranslations } from '@/i18n';
import { cn } from '@/src/shared/lib/styles';
import { FormMessage, Typography } from '@/src/shared/ui';

import { BLOCK_SETTING_HINT_KEY, BLOCK_SETTING_ICON, BLOCK_SETTING_LABEL_KEY } from '../../DayExercises.constants';
import type { DurationSettingInputProps } from './BlockSettingsFields.types';
import { SettingLabel } from './SettingLabel';

const PART_INPUT_CLASS =
  'placeholder:text-muted-foreground/70 w-full min-w-0 bg-transparent text-right text-sm tabular-nums outline-none disabled:cursor-not-allowed';

/**
 * A time setting as one field with two parts — `[ 12 ] min | [ 0 ] s` — so a
 * value like "20 seconds of rest" needs no format to remember. Leaving the
 * field tidies it (blank part → 0, 90 s → 1 min 30 s).
 */
export const DurationSettingInput = ({ field, required, form, onDurationBlur }: DurationSettingInputProps) => {
  const t = useTranslations('ProgramWizard');
  const id = useId();
  const labelId = `${id}-label`;
  const minutesId = `${id}-minutes`;
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const Icon = BLOCK_SETTING_ICON[field];
  const label = t(BLOCK_SETTING_LABEL_KEY[field]);
  const hintKey = BLOCK_SETTING_HINT_KEY[field];
  const error = form.formState.errors[field]?.message;
  const describedBy = error ? errorId : hintKey ? hintId : undefined;

  const handleGroupBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (event.currentTarget.contains(event.relatedTarget)) return;
    onDurationBlur(field);
  };

  return (
    <div className="grid content-start gap-1.5">
      <SettingLabel id={labelId} htmlFor={minutesId} label={label} required={required} />
      <div
        role="group"
        aria-labelledby={labelId}
        aria-describedby={describedBy}
        onBlur={handleGroupBlur}
        className={cn(
          'bg-background dark:bg-input/30 flex h-9 w-full items-center rounded-md border shadow-xs transition-[color,box-shadow]',
          'focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]',
          error && 'border-destructive focus-within:border-destructive focus-within:ring-destructive/20'
        )}
      >
        <Icon aria-hidden="true" className="text-muted-foreground ml-3 size-4 shrink-0" />
        <label className="flex flex-1 items-center gap-1.5 pr-3 pl-2">
          <input
            id={minutesId}
            {...form.register(`${field}.minutes`)}
            inputMode="numeric"
            autoComplete="off"
            placeholder="0"
            aria-label={t('structure.blocks.settings.fields.minutesOf', { field: label })}
            aria-required={required}
            aria-invalid={error ? true : undefined}
            className={PART_INPUT_CLASS}
          />
          <span className="text-muted-foreground text-sm">{t('structure.blocks.settings.units.min')}</span>
        </label>
        <span aria-hidden="true" className="bg-border h-5 w-px shrink-0" />
        <label className="flex flex-1 items-center gap-1.5 pr-3 pl-2">
          <input
            {...form.register(`${field}.seconds`)}
            inputMode="numeric"
            autoComplete="off"
            placeholder="0"
            aria-label={t('structure.blocks.settings.fields.secondsOf', { field: label })}
            aria-invalid={error ? true : undefined}
            className={PART_INPUT_CLASS}
          />
          <span className="text-muted-foreground text-sm">{t('structure.blocks.settings.units.sec')}</span>
        </label>
      </div>
      {error ? (
        <FormMessage id={errorId} message={error} className="text-xs" />
      ) : hintKey ? (
        <Typography id={hintId} variant="p-xs" className="text-muted-foreground">
          {t(hintKey)}
        </Typography>
      ) : null}
    </div>
  );
};
