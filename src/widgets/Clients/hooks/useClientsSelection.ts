'use client';

import { useCallback, useMemo, useState } from 'react';

import { ClientStatus, isClientOwnedBy, type Client } from '@/src/entities/client';

/**
 * Tracks which clients are picked for bulk assignment. A client is selectable
 * only when the current user owns it (admins see every trainer's clients but
 * may only assign their own) and it is active.
 */
export const useClientsSelection = (clients: Client[], userId: string | undefined) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const isSelectable = useCallback(
    (client: Client) => isClientOwnedBy(client, userId) && client.status !== ClientStatus.Blocked,
    [userId]
  );

  const toggle = useCallback((clientUserId: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(clientUserId)) next.delete(clientUserId);
      else next.add(clientUserId);
      return next;
    });
  }, []);

  const clear = useCallback(() => setSelectedIds(new Set()), []);

  const setSelection = useCallback((ids: string[]) => setSelectedIds(new Set(ids)), []);

  const selectedClients = useMemo(
    () => clients.filter((client) => selectedIds.has(client.clientUserId)),
    [clients, selectedIds]
  );

  return { selectedIds, selectedClients, isSelectable, toggle, clear, setSelection };
};
