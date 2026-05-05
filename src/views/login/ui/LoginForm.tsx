'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useId, useMemo, type FC } from 'react';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';

import { Button, FormMessage, Input, Label } from '@/src/shared/ui';
import { createLoginSchema, type LoginFormValues, type LoginValidationMessages } from '../model/schema';

export type LoginFormLabels = {
  usernameLabel: string;
  usernamePlaceholder: string;
  passwordLabel: string;
  passwordPlaceholder: string;
  submitLabel: string;
};

export const LoginForm: FC<{
  labels: LoginFormLabels;
  validation: LoginValidationMessages;
}> = ({ labels, validation }) => {
  const usernameId = useId();
  const usernameErrorId = `${usernameId}-error`;
  const passwordId = useId();
  const passwordErrorId = `${passwordId}-error`;

  const schema = useMemo(() => createLoginSchema(validation), [validation]);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { username: '', password: '' },
    mode: 'onSubmit',
  });

  const handleValidSubmit: SubmitHandler<LoginFormValues> = () => {
    // Credentials will be sent to the API in a follow-up change.
  };

  return (
    <form className="flex flex-col gap-5" onSubmit={form.handleSubmit(handleValidSubmit)} noValidate>
      <div className="flex flex-col gap-2">
        <Controller
          name="username"
          control={form.control}
          render={({ field, fieldState }) => (
            <>
              <Label htmlFor={usernameId}>{labels.usernameLabel}</Label>
              <Input
                {...field}
                id={usernameId}
                type="text"
                autoComplete="username"
                placeholder={labels.usernamePlaceholder}
                aria-invalid={fieldState.invalid}
                aria-required="true"
                aria-describedby={fieldState.invalid ? usernameErrorId : undefined}
              />
              <FormMessage id={usernameErrorId} message={fieldState.error?.message} />
            </>
          )}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <>
              <Label htmlFor={passwordId}>{labels.passwordLabel}</Label>
              <Input
                {...field}
                id={passwordId}
                type="password"
                autoComplete="current-password"
                placeholder={labels.passwordPlaceholder}
                aria-invalid={fieldState.invalid}
                aria-required="true"
                aria-describedby={fieldState.invalid ? passwordErrorId : undefined}
              />
              <FormMessage id={passwordErrorId} message={fieldState.error?.message} />
            </>
          )}
        />
      </div>
      <Button className="w-full" type="submit" size="lg">
        {labels.submitLabel}
      </Button>
    </form>
  );
};
