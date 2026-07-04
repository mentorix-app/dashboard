'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useId, useMemo } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';

import { useUpdateMe, useUserStore } from '@/src/entities/user';
import { useToast } from '@/src/shared/hooks';

import { createProfileSchema, type ProfileFormValues, type ProfileValidationMessages } from '../model/schema';
import type { ProfileFormMessages } from './ProfileForm.types';

type UseProfileFormConfigParams = {
  defaultName: string;
  validation: ProfileValidationMessages;
  messages: ProfileFormMessages;
};

export const useProfileFormConfig = ({ defaultName, validation, messages }: UseProfileFormConfigParams) => {
  const nameId = useId();

  const schema = useMemo(() => createProfileSchema(validation), [validation]);
  const setUser = useUserStore((state) => state.setUser);
  const { showSuccessToast, showErrorToast } = useToast();
  const { mutate, isPending } = useUpdateMe();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: defaultName },
    mode: 'onSubmit',
  });

  const handleValidSubmit: SubmitHandler<ProfileFormValues> = (values) => {
    mutate(
      { name: values.name },
      {
        onSuccess: (user) => {
          setUser(user);
          form.reset({ name: user.name ?? values.name });
          showSuccessToast(messages.updateSuccess);
        },
        onError: () => showErrorToast(messages.updateError),
      }
    );
  };

  return {
    nameId,
    nameErrorId: `${nameId}-error`,
    form,
    isPending,
    handleSubmit: form.handleSubmit(handleValidSubmit),
  };
};
