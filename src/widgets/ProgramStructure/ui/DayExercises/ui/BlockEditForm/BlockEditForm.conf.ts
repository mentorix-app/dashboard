'use client';

import { useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';

import { useTranslations } from '@/i18n';
import {
  BLOCK_SETTING_FIELDS,
  BLOCK_SETTING_LIMITS,
  getBlockTypeRule,
  type ProgramBlockDurationField,
} from '@/src/entities/program';

import { countExercisesLosingSets } from '../../lib';
import { toGroupType } from '../BlockEditDialog/BlockEditDialog.utils';
import type { BlockEditValue } from '../BlockEditDialog/BlockEditDialog.types';
import { createBlockEditSchema } from './BlockEditForm.schema';
import type { BlockEditFormProps, BlockEditFormValues } from './BlockEditForm.types';
import { normalizeDurationInput, toBlockEditFormValues } from './BlockEditForm.utils';

/**
 * Block form state. Switching the type keeps every typed value (so switching
 * back restores it) but drops errors of settings the new type does not take;
 * only the resulting type's settings are validated and saved.
 */
export const useBlockEditFormConfig = ({ block, onSubmit }: Pick<BlockEditFormProps, 'block' | 'onSubmit'>) => {
  const t = useTranslations('ProgramWizard');
  const schema = useMemo(
    () =>
      createBlockEditSchema({
        required: t('structure.blocks.settings.errors.required'),
        rounds: t('structure.blocks.settings.errors.rounds', {
          min: BLOCK_SETTING_LIMITS.rounds.min,
          max: BLOCK_SETTING_LIMITS.rounds.max,
        }),
        durationFormat: t('structure.blocks.settings.errors.durationFormat'),
        durationRange: t('structure.blocks.settings.errors.durationRange'),
        restRange: t('structure.blocks.settings.errors.restRange'),
      }),
    [t]
  );

  const form = useForm<BlockEditFormValues, unknown, BlockEditValue>({
    resolver: zodResolver(schema),
    defaultValues: toBlockEditFormValues(block),
  });
  const blockType = useWatch({ control: form.control, name: 'blockType' });
  const rule = getBlockTypeRule(blockType);

  const handleBlockTypeChange = (value: string) => {
    const nextType = toGroupType(value);
    const nextFields = getBlockTypeRule(nextType).fields;
    form.setValue('blockType', nextType, { shouldDirty: true });
    form.clearErrors(BLOCK_SETTING_FIELDS.filter((field) => !nextFields.includes(field)));
  };

  const handleDurationBlur = (field: ProgramBlockDurationField) => {
    const current = form.getValues(field);
    const normalized = normalizeDurationInput(field, current);
    if (normalized.minutes !== current.minutes || normalized.seconds !== current.seconds) {
      form.setValue(field, normalized, { shouldDirty: true });
    }
  };

  return {
    form,
    blockType,
    rule,
    setsToClear: countExercisesLosingSets(block, blockType),
    handleBlockTypeChange,
    handleDurationBlur,
    handleSubmit: form.handleSubmit(onSubmit),
  };
};
