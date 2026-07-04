'use client';

import { type FC } from 'react';
import { Controller } from 'react-hook-form';
import { Loader2 } from 'lucide-react';

import { Button, FormMessage, Input, Label } from '@/src/shared/ui';

import { useProfileFormConfig } from './ProfileForm.conf';
import type { ProfileFormProps } from './ProfileForm.types';

export const ProfileForm: FC<ProfileFormProps> = ({ defaultName, labels, validation, messages }) => {
  const { nameId, nameErrorId, form, isPending, handleSubmit } = useProfileFormConfig({
    defaultName,
    validation,
    messages,
  });

  return (
    <form className="flex flex-col gap-4 sm:max-w-sm" onSubmit={handleSubmit} noValidate>
      <div className="flex flex-col gap-2">
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <>
              <Label htmlFor={nameId}>{labels.displayedNameLabel}</Label>
              <Input
                {...field}
                id={nameId}
                type="text"
                autoComplete="name"
                placeholder={labels.displayedNamePlaceholder}
                aria-invalid={fieldState.invalid}
                aria-required="true"
                aria-describedby={fieldState.invalid ? nameErrorId : undefined}
              />
              <FormMessage id={nameErrorId} message={fieldState.error?.message} />
            </>
          )}
        />
      </div>
      <Button className="sm:w-fit" type="submit" size="lg" disabled={isPending} aria-busy={isPending}>
        {isPending && <Loader2 className="animate-spin" />}
        {labels.saveLabel}
      </Button>
    </form>
  );
};
