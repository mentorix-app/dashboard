'use client';

import { useCallback, useMemo, useState } from 'react';

import { useLocale, useTranslations } from '@/i18n';
import { useSetClientsProgram, type Client } from '@/src/entities/client';
import { useToast } from '@/src/shared/hooks';
import { formatDate } from '@/src/shared/lib';

type UseClientsBulkAssignParams = {
  selectedClients: Client[];
  /** Called after a run with the ids that were skipped, so they stay selected. */
  onCompleted: (skippedClientIds: string[]) => void;
};

/** A selected client that already has a program — surfaced as an overwrite warning. */
export type BulkOverwriteEntry = {
  id: string;
  name: string;
  programName: string;
  assignedLabel: string;
};

/**
 * Assigns one program to every selected client in a single bulk request. The
 * backend reports per-client failures in `skipped`; those clients remain
 * selected so the trainer can retry.
 */
export const useClientsBulkAssign = ({ selectedClients, onCompleted }: UseClientsBulkAssignParams) => {
  const t = useTranslations('Clients');
  const locale = useLocale();
  const { showSuccessToast, showErrorToast } = useToast();
  const { mutateAsync, isPending } = useSetClientsProgram();

  const [open, setOpen] = useState(false);

  const overwriteEntries = useMemo<BulkOverwriteEntry[]>(
    () =>
      selectedClients
        .filter((client) => client.programAssignment)
        .map((client) => {
          const assignment = client.programAssignment!;
          const programName =
            locale === 'ru' && assignment.programNameRu ? assignment.programNameRu : assignment.programName;

          return {
            id: client.clientUserId,
            name: client.displayName,
            programName,
            assignedLabel: t('assignedProgram', { date: formatDate(assignment.assignedAt, locale, 'shortDate') }),
          };
        }),
    [selectedClients, t, locale]
  );

  const hasExistingAssignments = overwriteEntries.length > 0;

  const handleOpen = useCallback(() => setOpen(true), []);

  const handleOpenChange = useCallback(
    (next: boolean) => {
      // Don't let the dialog close while the request is still in flight.
      if (!isPending) setOpen(next);
    },
    [isPending]
  );

  const handleConfirm = useCallback(
    async (programId: string) => {
      const clientUserIds = selectedClients.map((client) => client.clientUserId);
      if (clientUserIds.length === 0) return;

      try {
        const result = await mutateAsync({ programId, clientUserIds });
        const succeeded = clientUserIds.length - result.skipped.length;

        if (result.skipped.length === 0) {
          showSuccessToast(t('bulkAssignSuccess', { count: succeeded }));
        } else if (succeeded > 0) {
          showErrorToast(t('bulkAssignPartial', { succeeded, failed: result.skipped.length }));
        } else {
          showErrorToast(t('bulkAssignError'));
        }

        setOpen(false);
        onCompleted(result.skipped.map((entry) => entry.clientUserId));
      } catch {
        showErrorToast(t('bulkAssignError'));
      }
    },
    [selectedClients, mutateAsync, showSuccessToast, showErrorToast, t, onCompleted]
  );

  return {
    open,
    isAssigning: isPending,
    hasExistingAssignments,
    overwriteEntries,
    handleOpen,
    handleOpenChange,
    handleConfirm,
  };
};
