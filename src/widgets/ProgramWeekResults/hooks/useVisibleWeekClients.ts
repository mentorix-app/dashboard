'use client';

import { useMemo, useState } from 'react';

import type { WeekResultsClientVM } from '../ProgramWeekResults.types';

/** Client-side filter of clients by display name. */
export const useVisibleWeekClients = (clients: WeekResultsClientVM[]) => {
  const [search, setSearch] = useState('');
  const query = search.trim().toLowerCase();

  const visibleClients = useMemo(
    () => (query ? clients.filter((client) => client.displayName.toLowerCase().includes(query)) : clients),
    [clients, query]
  );

  return { search, setSearch, visibleClients };
};
