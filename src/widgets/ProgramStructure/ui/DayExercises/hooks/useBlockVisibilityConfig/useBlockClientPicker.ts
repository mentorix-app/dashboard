'use client';

import { useMemo, useState } from 'react';
import { useQueryClient, type InfiniteData } from '@tanstack/react-query';

import { useClientsInfinite, type Client, type ClientsListResult } from '@/src/entities/client';
import { queryKeys } from '@/src/shared/api';
import { useDebouncedValue } from '@/src/shared/hooks';

const SEARCH_DEBOUNCE_MS = 300;

type UseBlockClientPickerParams = {
  enabled: boolean;
  selectedClientUserIds: string[];
  eligibleClientUserIds: ReadonlySet<string>;
};

export const useBlockClientPicker = ({
  enabled,
  selectedClientUserIds,
  eligibleClientUserIds,
}: UseBlockClientPickerParams) => {
  const [search, setSearch] = useState('');
  const [isOpen, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const debouncedSearch = useDebouncedValue(search.trim(), SEARCH_DEBOUNCE_MS);
  const clients = useClientsInfinite(
    { name: debouncedSearch || undefined, sortBy: 'name', sortOrder: 'asc' },
    { enabled }
  );
  const loadedClients = useMemo(() => clients.data?.pages.flatMap((page) => page.items) ?? [], [clients.data]);
  const cachedLists = queryClient.getQueriesData<InfiniteData<ClientsListResult, number>>({
    queryKey: [...queryKeys.clients.all, 'list'],
  });
  const cachedClients = cachedLists.flatMap(([, data]) => data?.pages.flatMap((page) => page.items) ?? []);
  const clientCache = new Map<string, Client>(cachedClients.map((client) => [client.clientUserId, client]));
  const selectedClients = selectedClientUserIds.flatMap((id) => {
    const client = clientCache.get(id);
    return client ? [client] : [];
  });
  const eligibleLoadedClients = loadedClients.filter((client) => eligibleClientUserIds.has(client.clientUserId));
  const visibleClients = Array.from(
    new Map([...selectedClients, ...eligibleLoadedClients].map((client) => [client.clientUserId, client])).values()
  );
  const unresolvedClientUserIds = selectedClientUserIds.filter((id) => !clientCache.has(id));
  const normalizedSearch = search.trim().toLocaleLowerCase();
  const pickerClients = visibleClients.filter(
    (client) =>
      !normalizedSearch ||
      client.displayName.toLocaleLowerCase().includes(normalizedSearch) ||
      client.clientUserId.toLocaleLowerCase().includes(normalizedSearch)
  );
  const pickerUnresolvedClientUserIds = unresolvedClientUserIds.filter((id) =>
    id.toLocaleLowerCase().includes(normalizedSearch)
  );

  return {
    search,
    setSearch,
    isOpen,
    setOpen,
    visibleClients,
    pickerClients,
    unresolvedClientUserIds,
    pickerUnresolvedClientUserIds,
    isLoading: clients.isPending,
    isError: clients.isError,
    hasNextPage: Boolean(clients.hasNextPage),
    isFetchingNextPage: clients.isFetchingNextPage,
    fetchNextPage: clients.fetchNextPage,
  };
};
