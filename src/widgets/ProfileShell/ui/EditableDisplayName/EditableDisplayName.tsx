'use client';

import { type FC } from 'react';
import { Controller } from 'react-hook-form';
import { Check, Loader2, Pencil, X } from 'lucide-react';

import { Button, FormMessage, Input, Label, Typography } from '@/src/shared/ui';

import { useEditableDisplayNameConfig } from './EditableDisplayName.conf';
import type { EditableDisplayNameProps } from './EditableDisplayName.types';

export const EditableDisplayName: FC<EditableDisplayNameProps> = ({ defaultName }) => {
  const { t, nameId, nameErrorId, isEditing, isPending, form, handleStartEdit, handleCancel, handleSubmit } =
    useEditableDisplayNameConfig(defaultName);

  if (!isEditing) {
    return (
      <div className="flex items-center justify-center gap-1.5 sm:justify-start">
        <Typography variant="h2" className="break-words">
          {defaultName}
        </Typography>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={t('editName')}
          onClick={handleStartEdit}
          className="text-muted-foreground shrink-0"
        >
          <Pencil />
        </Button>
      </div>
    );
  }

  return (
    <form className="flex flex-col gap-2" onSubmit={handleSubmit} noValidate>
      <Label htmlFor={nameId} className="sr-only">
        {t('displayedNameLabel')}
      </Label>
      <Controller
        name="name"
        control={form.control}
        render={({ field, fieldState }) => (
          <>
            <div className="flex items-center gap-2">
              <Input
                {...field}
                id={nameId}
                type="text"
                autoComplete="name"
                autoFocus
                placeholder={t('displayedNamePlaceholder')}
                aria-invalid={fieldState.invalid}
                aria-required="true"
                aria-describedby={fieldState.invalid ? nameErrorId : undefined}
              />
              <Button
                type="submit"
                size="icon"
                aria-label={t('save')}
                disabled={isPending}
                aria-busy={isPending}
                className="shrink-0"
              >
                {isPending ? <Loader2 className="animate-spin" /> : <Check />}
              </Button>
              <Button
                type="button"
                size="icon"
                variant="outline"
                aria-label={t('cancel')}
                disabled={isPending}
                onClick={handleCancel}
                className="shrink-0"
              >
                <X />
              </Button>
            </div>
            <FormMessage id={nameErrorId} message={fieldState.error?.message} />
          </>
        )}
      />
    </form>
  );
};
