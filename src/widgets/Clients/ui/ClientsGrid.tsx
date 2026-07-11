'use client';

import { ClientCard } from '@/src/entities/client';

import type { ClientCardItem } from '../Clients.types';

type ClientsGridProps = {
  items: ClientCardItem[];
  selectedIds: Set<string>;
  syncingIds: Set<string>;
  onAssign: (clientUserId: string) => void;
  onToggleSelect: (clientUserId: string) => void;
  onSync: (clientUserId: string) => void;
};

export const ClientsGrid = ({ items, selectedIds, syncingIds, onAssign, onToggleSelect, onSync }: ClientsGridProps) => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    {items.map(({ client, labels, canAssign, selectable, canSync }) => (
      <ClientCard
        key={client.clientUserId}
        client={client}
        labels={labels}
        canAssign={canAssign}
        selectable={selectable}
        isSelected={selectedIds.has(client.clientUserId)}
        canSync={canSync}
        isSyncing={syncingIds.has(client.clientUserId)}
        onAssign={onAssign}
        onToggleSelect={onToggleSelect}
        onSync={onSync}
      />
    ))}
  </div>
);
