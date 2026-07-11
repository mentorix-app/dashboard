'use client';

import { ClientRowCard } from '@/src/entities/client';

import type { ClientCardItem } from '../Clients.types';

type ClientsListProps = {
  items: ClientCardItem[];
  selectedIds: Set<string>;
  onAssign: (clientUserId: string) => void;
  onToggleSelect: (clientUserId: string) => void;
};

export const ClientsList = ({ items, selectedIds, onAssign, onToggleSelect }: ClientsListProps) => (
  <div className="flex flex-col gap-2">
    {items.map(({ client, labels, canAssign, selectable }) => (
      <ClientRowCard
        key={client.clientUserId}
        client={client}
        labels={labels}
        canAssign={canAssign}
        selectable={selectable}
        isSelected={selectedIds.has(client.clientUserId)}
        onAssign={onAssign}
        onToggleSelect={onToggleSelect}
      />
    ))}
  </div>
);
