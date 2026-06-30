'use client';

import { useId } from 'react';
import { type Control, Controller, type FieldValues, type Path } from 'react-hook-form';
import { FormMessage, Input, Label } from '@/src/shared/ui';

type ProgramTextFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
};

export const ProgramTextField = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  type = 'text',
  disabled = false,
}: ProgramTextFieldProps<T>) => {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <div className="flex flex-col gap-2">
          <Label htmlFor={id}>{label}</Label>
          <Input
            {...field}
            id={id}
            type={type}
            disabled={disabled}
            placeholder={placeholder}
            aria-invalid={fieldState.invalid}
            aria-describedby={fieldState.invalid ? errorId : undefined}
          />
          <FormMessage id={errorId} message={fieldState.error?.message} />
        </div>
      )}
    />
  );
};
