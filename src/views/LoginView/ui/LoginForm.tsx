'use client';

import { type FC } from 'react';
import { Controller } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { Link } from '@/i18n';
import { Button, FormMessage, Input, Label } from '@/src/shared/ui';
import { useLoginFormConfig } from './LoginForm.conf';
import type { LoginFormProps } from './LoginForm.types';

export const LoginForm: FC<LoginFormProps> = ({ labels, validation }) => {
  const { emailId, emailErrorId, passwordId, passwordErrorId, errorId, form, isPending, serverError, handleSubmit } =
    useLoginFormConfig(validation);

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
      <div className="flex flex-col gap-2">
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <>
              <Label htmlFor={emailId}>{labels.emailLabel}</Label>
              <Input
                {...field}
                id={emailId}
                type="email"
                autoComplete="email"
                placeholder={labels.emailPlaceholder}
                aria-invalid={fieldState.invalid}
                aria-required="true"
                aria-describedby={fieldState.invalid ? emailErrorId : undefined}
              />
              <FormMessage id={emailErrorId} message={fieldState.error?.message} />
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
              <div className="flex items-center justify-between">
                <Label htmlFor={passwordId}>{labels.passwordLabel}</Label>
                <Link
                  href="/forgot-password"
                  className="text-muted-foreground hover:text-foreground text-xs transition-colors"
                >
                  {labels.forgotPasswordLabel}
                </Link>
              </div>
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
      {serverError && <FormMessage id={errorId} message={serverError} />}
      <Button className="w-full" type="submit" size="lg" disabled={isPending} aria-busy={isPending}>
        {isPending && <Loader2 className="animate-spin" />}
        {labels.submitLabel}
      </Button>
      <p className="text-muted-foreground text-center text-sm">
        {labels.newToMentorix}{' '}
        <Link href="/signup" className="text-foreground font-medium underline-offset-4 hover:underline">
          {labels.createAccountLabel}
        </Link>
      </p>
    </form>
  );
};
