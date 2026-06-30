'use client';

import { useLocale, useTranslations } from '@/i18n';

import { PROGRAM_CATEGORY_VALUES, PROGRAM_DIFFICULTY_VALUES } from '../ProgramBasicsForm.constants';
import type { ProgramBasicsFormValues } from '../ProgramBasicsForm.types';
import { buildOptions } from '../ProgramBasicsForm.utils';

/**
 * Builds the localized select options and the live preview-card labels from the
 * current form values, keeping this presentation logic out of the view.
 */
export const useProgramBasicsPreview = (values: Partial<ProgramBasicsFormValues>) => {
  const t = useTranslations('ProgramWizard');
  const locale = useLocale();

  const categoryOptions = buildOptions(PROGRAM_CATEGORY_VALUES, (value) => t(`categories.${value}`));
  const difficultyOptions = buildOptions(PROGRAM_DIFFICULTY_VALUES, (value) => t(`difficulty.${value}`));

  const name = (locale === 'ru' ? values.nameRu : values.name) ?? '';

  return {
    categoryOptions,
    difficultyOptions,
    preview: {
      name,
      levelLabel: t('preview.level', {
        value: values.difficulty ? t(`difficulty.${values.difficulty}`) : t('preview.empty'),
      }),
      categoryLabel: t('preview.category', {
        value: values.category ? t(`categories.${values.category}`) : t('preview.empty'),
      }),
      previewImageUrl: values.previewImageUrl ?? '',
    },
  };
};
