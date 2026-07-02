'use client';

import { useWatch } from 'react-hook-form';

import { ProgramStatus } from '@/src/entities/program';

import { useProgramAutosave } from './hooks/useProgramAutosave';
import { useProgramBasicsForm } from './hooks/useProgramBasicsForm';
import { useProgramBasicsPreview } from './hooks/useProgramBasicsPreview';
import { useProgramDraftSync } from './hooks/useProgramDraftSync';
import { useProgramValidateOnPublish } from './hooks/useProgramValidateOnPublish';

export const useProgramBasicsFormConfig = (programId: string) => {
  const { t, form, program, isLoading, hydratedRef } = useProgramBasicsForm(programId);
  const values = useWatch({ control: form.control });

  useProgramValidateOnPublish(form, hydratedRef, program);
  useProgramDraftSync(programId, form, values);
  const { isSaving, onBlur } = useProgramAutosave(programId, form, program, hydratedRef);
  const { categoryOptions, difficultyOptions, preview } = useProgramBasicsPreview(values);

  const isArchived = program?.status === ProgramStatus.Archived;
  const isFieldDisabled = isLoading || isArchived;

  return { t, form, isLoading, isSaving, onBlur, isFieldDisabled, categoryOptions, difficultyOptions, preview };
};
