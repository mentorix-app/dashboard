'use client';

import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';

import {
  blockVisibilitySchema,
  type BlockVisibilityValue,
} from '../../ui/BlockVisibilityFields/BlockVisibilityFields.schema';

type UseBlockVisibilityFormParams = {
  open: boolean;
  initialClientUserIds: string[];
};

export const useBlockVisibilityForm = ({ open, initialClientUserIds }: UseBlockVisibilityFormParams) => {
  const form = useForm<BlockVisibilityValue>({
    resolver: zodResolver(blockVisibilitySchema),
    defaultValues: {
      mode: initialClientUserIds.length > 0 ? 'restricted' : 'shared',
      clientUserIds: initialClientUserIds,
    },
  });
  const selectedClientUserIds = useWatch({ control: form.control, name: 'clientUserIds' });
  const mode = useWatch({ control: form.control, name: 'mode' });

  useEffect(() => {
    if (!open) return;
    form.reset({
      mode: initialClientUserIds.length > 0 ? 'restricted' : 'shared',
      clientUserIds: initialClientUserIds,
    });
  }, [form, initialClientUserIds, open]);

  const handleModeChange = (nextMode: BlockVisibilityValue['mode']) => {
    form.clearErrors('clientUserIds');
    form.setValue('mode', nextMode, { shouldDirty: true, shouldValidate: false });
    if (nextMode === 'shared') {
      form.setValue('clientUserIds', [], { shouldDirty: true, shouldValidate: false });
    }
  };

  const handleClientChange = (clientUserId: string, checked: boolean) => {
    const next = checked
      ? [...new Set([...selectedClientUserIds, clientUserId])]
      : selectedClientUserIds.filter((id) => id !== clientUserId);
    form.clearErrors('clientUserIds');
    if (checked) {
      form.setValue('mode', 'restricted', { shouldDirty: true, shouldValidate: false });
    }
    if (!checked && next.length === 0) {
      form.setValue('mode', 'shared', { shouldDirty: true, shouldValidate: false });
    }
    form.setValue('clientUserIds', next, { shouldDirty: true, shouldValidate: false });
  };

  return { form, mode, selectedClientUserIds, handleModeChange, handleClientChange };
};
