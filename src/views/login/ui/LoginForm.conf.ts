'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useId, useMemo, useState, useTransition } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { loginAction } from '@/src/entities/auth';
import { createLoginSchema, type LoginFormValues, type LoginValidationMessages } from '../model/schema';

export const useLoginFormConfig = (validation: LoginValidationMessages) => {
  const emailId = useId();
  const passwordId = useId();
  const feedbackId = useId();

  const schema = useMemo(() => createLoginSchema(validation), [validation]);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
    mode: 'onSubmit',
  });

  const handleValidSubmit: SubmitHandler<LoginFormValues> = (values) => {
    setServerError(null);
    startTransition(async () => {
      const result = await loginAction(values);
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
