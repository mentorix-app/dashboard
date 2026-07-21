'use client';

import { useState } from 'react';

import type {
  ActiveClientsSortField,
  ActiveClientsSortOrder,
  ProgramAnalyticsClientVM,
} from '../ProgramAnalytics.types';

const toTimestamp = (value: string | null): number => (value ? new Date(value).getTime() : 0);

const compareBy = (a: ProgramAnalyticsClientVM, b: ProgramAnalyticsClientVM, field: ActiveClientsSortField): number =>
  field === 'progress'
    ? a.completionPercent - b.completionPercent
    : toTimestamp(a.lastCompletedAt) - toTimestamp(b.lastCompletedAt);

/**
 * Client-side search and sort for the already-loaded active-clients list. Search
 * matches the display name; sort toggles progress or last-completed. No sort
 * field keeps the server order.
 */
export const useActiveClientsView = (clients: ProgramAnalyticsClientVM[]) => {
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<ActiveClientsSortField | null>(null);
  const [sortOrder, setSortOrder] = useState<ActiveClientsSortOrder>('desc');

  const handleSort = (field: ActiveClientsSortField) => {
    if (field === sortField) {
      setSortOrder((order) => (order === 'asc' ? 'desc' : 'asc'));
      return;
    }
    setSortField(field);
    setSortOrder('desc');
  };

  const query = search.trim().toLowerCase();
  const filtered = query ? clients.filter((client) => client.displayName.toLowerCase().includes(query)) : clients;

  const visibleClients = sortField
    ? [...filtered].sort((a, b) => {
        const result = compareBy(a, b, sortField);
        return sortOrder === 'asc' ? result : -result;
      })
    : filtered;

  return { search, setSearch, sortField, sortOrder, handleSort, visibleClients };
};
