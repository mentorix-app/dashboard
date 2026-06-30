'use client';

import { useEffect, type RefObject } from 'react';
import { useSearchParams } from 'next/navigation';
import type { UseFormReturn } from 'react-hook-form';
import type { Program } from '@/src/entities/program';

import { PUBLISH_VALIDATE_PARAM } from '../ProgramBasicsForm.constants';
import type { ProgramBasicsFormValues } from '../ProgramBasicsForm.types';

/**
 * When the user is bounced here from a failed publish (?validate=1), surfaces
 * the missing-field errors as soon as the form has hydrated.
 */
export const useProgramValidateOnPublish = (
  form: UseFormReturn<ProgramBasicsFormValues>,
  hydratedRef: RefObject<boolean>,
  program: Program | undefined
) => {
  const searchParams = useSearchParams();
  const shouldValidate = searchParams.get(PUBLISH_VALIDATE_PARAM) === '1';

  useEffect(() => {
    if (shouldValidate && hydratedRef.current) void form.trigger();
  }, [shouldValidate, program, form, hydratedRef]);
};
