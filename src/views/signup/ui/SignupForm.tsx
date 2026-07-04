'use client';

import { type FC } from 'react';
import { Controller } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { Link } from '@/i18n';
import { Button, FormMessage, Input, Label } from '@/src/shared/ui';
import { useSignupFormConfig } from './SignupForm.conf';
import type { SignupFormProps } from './SignupForm.types';

export const SignupForm: FC<SignupFormProps> = ({ labels, validation }) => {
  const {
    nameId,
    nameErrorId,
    emailId,
    emailErrorId,
    passwordId,
    passwordErrorId,
    errorId,
    form,
    isPending,
    serverError,
    handleSubmit,
  } = useSignupFormConfig(validation);

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
      <div className="flex flex-col gap-2">
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <>
              <Label htmlFor={nameId}>{labels.nameLabel}</Label>
              <Input
                {...field}
                id={nameId}
                type="text"
                autoComplete="name"
                placeholder={labels.namePlaceholder}
                aria-invalid={fieldState.invalid}
                aria-required="true"
                aria-describedby={fieldState.invalid ? nameErrorId : undefined}
              />
              <FormMessage id={nameErrorId} message={fieldState.error?.message} />
            </>
          )}
        />
      </div>
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
              <Label htmlFor={passwordId}>{labels.passwordLabel}</Label>
              <Input
                {...field}
                id={passwordId}
                type="password"
                autoComplete="new-password"
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
        {labels.alreadyHaveAccount}{' '}
        <Link href="/login" className="text-foreground font-medium underline-offset-4 hover:underline">
          {labels.signInLabel}
        </Link>
      </p>
    </form>
  );
};
