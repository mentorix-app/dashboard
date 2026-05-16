'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useId, useMemo } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';

import { useRegister } from '@/src/entities/auth';
import { useRouter } from '@/i18n';

import { createSignupSchema, type SignupFormValues, type SignupValidationMessages } from '../model/schema';

export const useSignupFormConfig = (validation: SignupValidationMessages) => {
  const emailId = useId();
  const passwordId = useId();
  const feedbackId = useId();
  const router = useRouter();

  const schema = useMemo(() => createSignupSchema(validation), [validation]);
  const registerMutation = useRegister();

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
    mode: 'onSubmit',
  });

  const handleValidSubmit: SubmitHandler<SignupFormValues> = (values) => {
    registerMutation.reset();
    registerMutation.mutate(values, { onSuccess: () => router.push('/login') });
  };

  return {
    emailId,
    emailErrorId: `${emailId}-error`,
    passwordId,
    passwordErrorId: `${passwordId}-error`,
    successId: `${feedbackId}-success`,
    errorId: `${feedbackId}-error`,
    form,
    registerMutation,
    handleSubmit: form.handleSubmit(handleValidSubmit),
  };
};
