'use client';

import { useId } from 'react';

import { useTranslations } from '@/i18n';
import { isDurationSetting } from '@/src/entities/program';
import { FormMessage, Input, Typography } from '@/src/shared/ui';

import { BLOCK_SETTING_HINT_KEY, BLOCK_SETTING_ICON, BLOCK_SETTING_LABEL_KEY } from '../../DayExercises.constants';
import type { BlockSettingInputProps } from './BlockSettingsFields.types';
import { DurationSettingInput } from './DurationSettingInput';
import { SettingLabel } from './SettingLabel';

/** One format setting: rounds as a single number, times as minutes + seconds. */
export const BlockSettingInput = ({ field, required, form, onDurationBlur }: BlockSettingInputProps) => {
  const t = useTranslations('ProgramWizard');
  const id = useId();

  if (isDurationSetting(field)) {
    return <DurationSettingInput field={field} required={required} form={form} onDurationBlur={onDurationBlur} />;
  }

  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const Icon = BLOCK_SETTING_ICON[field];
  const hintKey = BLOCK_SETTING_HINT_KEY[field];
  const error = form.formState.errors[field]?.message;

  return (
    <div className="grid content-start gap-1.5">
      <SettingLabel htmlFor={id} label={t(BLOCK_SETTING_LABEL_KEY[field])} required={required} />
      <div className="relative">
        <Icon
          aria-hidden="true"
          className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
        />
        <Input
          id={id}
          {...form.register(field)}
          inputMode="numeric"
          autoComplete="off"
          placeholder="10"
          aria-required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : hintId}
          className="bg-background pl-9 tabular-nums"
        />
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
