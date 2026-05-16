'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useId, useMemo, useState, useTransition } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';

import { signupAction } from '@/src/entities/auth';

import { createSignupSchema, type SignupFormValues, type SignupValidationMessages } from '../model/schema';

export const useSignupFormConfig = (validation: SignupValidationMessages) => {
  const emailId = useId();
  const passwordId = useId();
  const feedbackId = useId();

  const schema = useMemo(() => createSignupSchema(validation), [validation]);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
    mode: 'onSubmit',
  });

  const handleValidSubmit: SubmitHandler<SignupFormValues> = (values) => {
    setServerError(null);
    startTransition(async () => {
      const result = await signupAction(values);
      if (result?.error) setServerError(result.error);
    });
  };

  return {
    emailId,
    emailErrorId: `${emailId}-error`,
    passwordId,
    passwordErrorId: `${passwordId}-error`,
    successId: `${feedbackId}-success`,
    errorId: `${feedbackId}-error`,
    form,
    isPending,
    serverError,
    handleSubmit: form.handleSubmit(handleValidSubmit),
  };
};
