'use client';

import { useId } from 'react';
import { type Control, Controller, type FieldValues, type Path } from 'react-hook-form';
import { FormMessage, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/shared/ui';

import type { ProgramBasicsOption } from '../ProgramBasicsForm.utils';

type ProgramSelectFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder: string;
  options: ProgramBasicsOption[];
  disabled?: boolean;
};

export const ProgramSelectField = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  options,
  disabled = false,
}: ProgramSelectFieldProps<T>) => {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <div className="flex flex-col gap-2">
          <Label htmlFor={id}>{label}</Label>
          <Select value={field.value ?? ''} onValueChange={field.onChange} disabled={disabled}>
            <SelectTrigger
              id={id}
              className="w-full"
              aria-invalid={fieldState.invalid}
              aria-describedby={fieldState.invalid ? errorId : undefined}
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage id={errorId} message={fieldState.error?.message} />
        </div>
      )}
    />
  );
};
