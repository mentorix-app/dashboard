'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useId, useMemo, useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';

import { useTranslations } from '@/i18n';
import { useUpdateMe, useUserStore } from '@/src/entities/user';
import { useToast } from '@/src/shared/hooks';

import { createDisplayNameSchema, type DisplayNameValues } from './EditableDisplayName.validation';

export const useEditableDisplayNameConfig = (defaultName: string) => {
  const t = useTranslations('Profile');
  const nameId = useId();
  const [isEditing, setIsEditing] = useState(false);

  const setUser = useUserStore((state) => state.setUser);
  const { showSuccessToast, showErrorToast } = useToast();
  const { mutate, isPending } = useUpdateMe();

  const schema = useMemo(
    () =>
      createDisplayNameSchema({
        nameRequired: t('validation.nameRequired'),
        nameMinLength: t('validation.nameMinLength'),
      }),
    [t]
  );

  const form = useForm<DisplayNameValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: defaultName },
    mode: 'onSubmit',
  });

  const handleStartEdit = () => {
    form.reset({ name: defaultName });
    setIsEditing(true);
  };

  const handleCancel = () => {
    form.reset({ name: defaultName });
    setIsEditing(false);
  };

  const handleValidSubmit: SubmitHandler<DisplayNameValues> = (values) => {
    mutate(
      { name: values.name },
      {
        onSuccess: (user) => {
          setUser(user);
          form.reset({ name: user.name ?? values.name });
          setIsEditing(false);
          showSuccessToast(t('updateSuccess'));
        },
        onError: () => showErrorToast(t('updateError')),
      }
    );
  };

  return {
    t,
    nameId,
    nameErrorId: `${nameId}-error`,
    isEditing,
    isPending,
    form,
    handleStartEdit,
    handleCancel,
    handleSubmit: form.handleSubmit(handleValidSubmit),
  };
};
