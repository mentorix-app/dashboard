'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useId, useMemo } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';

import { useLogin } from '@/src/entities/auth';

import { createLoginSchema, type LoginFormValues, type LoginValidationMessages } from '../model/schema';

export const useLoginFormConfig = (validation: LoginValidationMessages) => {
  const emailId = useId();
  const passwordId = useId();
  const feedbackId = useId();

  const schema = useMemo(() => createLoginSchema(validation), [validation]);
  const loginMutation = useLogin();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
    mode: 'onSubmit',
  });

  const handleValidSubmit: SubmitHandler<LoginFormValues> = (values) => {
    loginMutation.reset();
    loginMutation.mutate(values, { onSuccess: () => form.reset() });
  };

  return {
    emailId,
    emailErrorId: `${emailId}-error`,
    passwordId,
    passwordErrorId: `${passwordId}-error`,
    successId: `${feedbackId}-success`,
    errorId: `${feedbackId}-error`,
    form,
    loginMutation,
    handleSubmit: form.handleSubmit(handleValidSubmit),
  };
};
