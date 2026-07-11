'use client';

import { useCallback, useState } from 'react';

import { useTranslations } from '@/i18n';
import { type Client } from '@/src/entities/client';
import { useSyncProgramAssignments } from '@/src/entities/program';
import { useToast } from '@/src/shared/hooks';

/** Syncs a single client to its program's latest version, tracking in-flight ids. */
export const useClientSync = (clients: Client[]) => {
  const t = useTranslations('Clients');
  const { showSuccessToast, showErrorToast } = useToast();
  const { mutate } = useSyncProgramAssignments();
  const [syncingIds, setSyncingIds] = useState<Set<string>>(new Set());

  const setSyncing = useCallback((clientUserId: string, syncing: boolean) => {
    setSyncingIds((prev) => {
      const next = new Set(prev);
      if (syncing) next.add(clientUserId);
      else next.delete(clientUserId);
      return next;
    });
  }, []);

  const handleSync = useCallback(
    (clientUserId: string) => {
      const assignment = clients.find((client) => client.clientUserId === clientUserId)?.programAssignment;
      if (!assignment?.assignmentId) return;

      setSyncing(clientUserId, true);
      mutate(
        { programId: assignment.programId, params: { assignmentIds: [assignment.assignmentId] } },
        {
          onSuccess: (result) => {
            if (result.skipped.length > 0) showErrorToast(t('syncError'));
            else showSuccessToast(t('syncSuccess'));
          },
          onError: () => showErrorToast(t('syncError')),
          onSettled: () => setSyncing(clientUserId, false),
        }
      );
    },
    [clients, mutate, setSyncing, showSuccessToast, showErrorToast, t]
  );

  return { syncingIds, handleSync };
};
