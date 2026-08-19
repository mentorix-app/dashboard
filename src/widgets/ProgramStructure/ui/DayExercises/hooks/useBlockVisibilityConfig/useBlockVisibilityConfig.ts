'use client';

import { useMemo } from 'react';

import { ProgramAssignmentStatus, useProgramAssignments } from '@/src/entities/program';

import { useBlockVisibilityForm } from './useBlockVisibilityForm';

type UseBlockVisibilityConfigParams = {
  programId: string;
  open: boolean;
  initialClientUserIds: string[];
  isLastSharedBlock: boolean;
};

export const useBlockVisibilityConfig = ({
  programId,
  open,
  initialClientUserIds,
  isLastSharedBlock,
}: UseBlockVisibilityConfigParams) => {
  const assignments = useProgramAssignments(programId, open);
  const visibilityForm = useBlockVisibilityForm({ open, initialClientUserIds });
  const eligibleClientUserIds = useMemo(
    () =>
      new Set(
        (assignments.data?.items ?? [])
          .filter((assignment) => assignment.status === ProgramAssignmentStatus.Active)
          .map((assignment) => assignment.clientUserId)
      ),
    [assignments.data]
  );
  const canChooseRestricted = eligibleClientUserIds.size > 0 && !isLastSharedBlock;

  const validateAndGetClientIds = async (): Promise<string[] | null> => {
    const valid = await visibilityForm.form.trigger();
    if (!valid) return null;
    if (visibilityForm.mode === 'shared') return [];

    const refreshed = await assignments.refetch();
    if (refreshed.isError || !refreshed.data) {
      visibilityForm.form.setError('clientUserIds', { message: 'assignmentsUnavailable' });
      return null;
    }
    const activeIds = new Set(
      refreshed.data.items
        .filter((assignment) => assignment.status === ProgramAssignmentStatus.Active)
        .map((assignment) => assignment.clientUserId)
    );
    if (visibilityForm.selectedClientUserIds.some((id) => !activeIds.has(id))) {
      visibilityForm.form.setError('clientUserIds', { message: 'clientNotAssigned' });
      return null;
    }
    return visibilityForm.selectedClientUserIds;
  };

  return {
    ...visibilityForm,
    open,
    eligibleClientUserIds,
    hasEmptyRestriction: visibilityForm.mode === 'restricted' && visibilityForm.selectedClientUserIds.length === 0,
    canChooseRestricted,
    hasEligibleClients: eligibleClientUserIds.size > 0,
    isCheckingAssignments: assignments.isPending,
    hasAssignmentLoadError: assignments.isError,
    isLastSharedBlock,
    validateAndGetClientIds,
  };
};

export type BlockVisibilityConfig = ReturnType<typeof useBlockVisibilityConfig>;
