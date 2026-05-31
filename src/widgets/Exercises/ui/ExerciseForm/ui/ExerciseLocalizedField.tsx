'use client';

import { useId } from 'react';
import { type Control, Controller, type FieldValues, type Path, useFormState } from 'react-hook-form';
import { FormMessage, Input, Label, Tabs, TabsContent, TabsList, TabsTrigger, Textarea } from '@/src/shared/ui';

type LocaleField<T extends FieldValues> = {
  locale: string;
  label: string;
  name: Path<T>;
};

type ExerciseLocalizedFieldProps<T extends FieldValues> = {
  control: Control<T>;
  label: string;
  placeholder?: string;
  multiline?: boolean;
  fields: [LocaleField<T>, LocaleField<T>];
};

export const ExerciseLocalizedField = <T extends FieldValues>({
  control,
  label,
  placeholder,
  multiline = false,
  fields,
}: ExerciseLocalizedFieldProps<T>) => {
  const baseId = useId();
  const { errors } = useFormState({ control, name: fields.map((field) => field.name) });
  const hasError = (name: Path<T>) => Boolean((errors as Record<string, unknown>)[name]);

  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      <Tabs defaultValue={fields[0].locale}>
        <TabsList>
          {fields.map((field) => (
            <TabsTrigger
              key={field.locale}
              value={field.locale}
              className={hasError(field.name) ? 'text-destructive' : undefined}
            >
              {field.label}
              {hasError(field.name) ? <span aria-hidden>*</span> : null}
            </TabsTrigger>
          ))}
        </TabsList>
        {fields.map((field) => {
          const fieldId = `${baseId}-${field.locale}`;
          const errorId = `${fieldId}-error`;

          return (
            <TabsContent key={field.locale} value={field.locale}>
              <Controller
                control={control}
                name={field.name}
                render={({ field: controllerField, fieldState }) => (
                  <div className="flex flex-col gap-2">
                    {multiline ? (
                      <Textarea
                        {...controllerField}
                        id={fieldId}
                        rows={4}
                        placeholder={placeholder}
                        aria-invalid={fieldState.invalid}
                        aria-describedby={fieldState.invalid ? errorId : undefined}
                      />
                    ) : (
                      <Input
                        {...controllerField}
                        id={fieldId}
                        placeholder={placeholder}
                        aria-invalid={fieldState.invalid}
                        aria-describedby={fieldState.invalid ? errorId : undefined}
                      />
                    )}
                    <FormMessage id={errorId} message={fieldState.error?.message} />
                  </div>
                )}
              />
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
};
