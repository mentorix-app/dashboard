'use client';

import { useWatch } from 'react-hook-form';

import { ProgramStatus } from '@/src/entities/program';
import { useCapabilities } from '@/src/entities/user';

import { useProgramAutosave } from './hooks/useProgramAutosave';
import { useProgramBasicsForm } from './hooks/useProgramBasicsForm';
import { useProgramBasicsPreview } from './hooks/useProgramBasicsPreview';
import { useProgramDraftSync } from './hooks/useProgramDraftSync';
import { useProgramValidateOnPublish } from './hooks/useProgramValidateOnPublish';

export const useProgramBasicsFormConfig = (programId: string) => {
  const { t, form, program, isLoading, hydratedRef } = useProgramBasicsForm(programId);
  const { isAdmin } = useCapabilities();
  const values = useWatch({ control: form.control });

  useProgramValidateOnPublish(form, hydratedRef, program);
  useProgramDraftSync(programId, form, values);
  const { isSaving, onBlur } = useProgramAutosave(programId, form, program, hydratedRef);
  const { categoryOptions, difficultyOptions, preview } = useProgramBasicsPreview(values);

  const isArchived = program?.status === ProgramStatus.Archived;
  // Admins have read-only access to programs they do not own.
  const isFieldDisabled = isLoading || isArchived || isAdmin;

  return { t, form, isLoading, isSaving, onBlur, isFieldDisabled, categoryOptions, difficultyOptions, preview };
};
