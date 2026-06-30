'use client';

import { useWatch } from 'react-hook-form';

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
  const { isSaving } = useProgramAutosave(programId, form, program, hydratedRef);
  const { categoryOptions, difficultyOptions, preview } = useProgramBasicsPreview(values);

  return { t, form, isLoading, isSaving, categoryOptions, difficultyOptions, preview };
};
