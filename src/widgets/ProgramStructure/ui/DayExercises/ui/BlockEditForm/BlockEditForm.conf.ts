'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';

import { toGroupType } from '../BlockEditDialog/BlockEditDialog.utils';
import type { BlockEditFormProps } from './BlockEditForm.types';
import { blockEditSchema } from './BlockEditForm.schema';

export const useBlockEditFormConfig = ({ block, onSubmit }: Pick<BlockEditFormProps, 'block' | 'onSubmit'>) => {
  const form = useForm({
    resolver: zodResolver(blockEditSchema),
    defaultValues: {
      blockType: toGroupType(block.blockType),
      instruction: block.instruction,
    },
  });
  const blockType = useWatch({ control: form.control, name: 'blockType' });

  const handleBlockTypeChange = (blockType: string) => {
    form.setValue('blockType', toGroupType(blockType), { shouldDirty: true });
  };

  return {
    form,
    blockType,
    handleBlockTypeChange,
    handleSubmit: form.handleSubmit(onSubmit),
  };
};
