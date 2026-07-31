'use client';

import { useCallback, useMemo, useState } from 'react';

import { useTranslations } from '@/i18n';
import { useSetClientsProgram, type Client } from '@/src/entities/client';
import { useToast } from '@/src/shared/hooks';
import { confirm } from '@/src/shared/ui';

export const useClientAssign = (clients: Client[]) => {
  const t = useTranslations('Clients');
  const { showSuccessToast, showErrorToast } = useToast();
  const { mutate } = useSetClientsProgram();

  const [activeClientId, setActiveClientId] = useState<string | null>(null);

  const activeClient = useMemo(
    () => clients.find((client) => client.clientUserId === activeClientId) ?? null,
    [clients, activeClientId]
  );

  const handleAssign = useCallback(
    (clientUserId: string) => {
      const client = clients.find((candidate) => candidate.clientUserId === clientUserId);
      // Only warn when there's an existing assignment to lose; a client's
      // first-ever assignment has no analytics to reset.
      if (client?.programAssignment) {
        confirm({
          title: t('changeConfirmTitle'),
          description: t('changeConfirmDescription'),
          cancelLabel: t('cancel'),
          confirmLabel: t('changeProgram'),
          variant: 'destructive',
          onConfirm: () => setActiveClientId(clientUserId),
        });
        return;
      }
      setActiveClientId(clientUserId);
    },
    [clients, t]
  );

  const handlePickerOpenChange = useCallback((open: boolean) => {
    if (!open) setActiveClientId(null);
  }, []);

  const runMutation = useCallback(
    (programId: string | null) => {
      if (!activeClientId) return;

      mutate(
        { programId, clientUserIds: [activeClientId] },
        {
          onSuccess: (result) => {
            // A single-client request reports failure via `skipped`.
            if (result.skipped.length > 0) {
              showErrorToast(t('assignError'));
              return;
            }
            showSuccessToast(programId ? t('assignSuccess') : t('assignRemoved'));
          },
          onError: () => showErrorToast(t('assignError')),
        }
      );
      setActiveClientId(null);
    },
    [activeClientId, mutate, showSuccessToast, showErrorToast, t]
  );

  const handleConfirm = useCallback((programId: string) => runMutation(programId), [runMutation]);
  const handleRemove = useCallback(() => runMutation(null), [runMutation]);

  return {
    pickerOpen: activeClientId !== null,
    selectedProgramId: activeClient?.programAssignment?.programId ?? null,
    handleAssign,
    handlePickerOpenChange,
    handleConfirm,
    handleRemove,
  };
};
