'use client';

import { ArrowDownAZ, ArrowUpAZ, UserPlus } from 'lucide-react';

import { useTranslations } from '@/i18n';
import type { ClientSortOrder } from '@/src/entities/client';
import { SortOrderControl } from '@/src/features/SortOrderControl';
import { ViewModeSwitch, type ViewMode } from '@/src/features/ViewModeSwitch';
import { Button, Input } from '@/src/shared/ui';

type ClientsToolbarProps = {
  search: string;
  view: ViewMode;
  sortOrder: ClientSortOrder;
  onSearchChange: (value: string) => void;
  onViewChange: (view: ViewMode) => void;
  onSortOrderChange: (order: ClientSortOrder) => void;
  onAddClient: () => void;
};

export const ClientsToolbar = ({
  search,
  view,
  sortOrder,
  onSearchChange,
  onViewChange,
  onSortOrderChange,
  onAddClient,
}: ClientsToolbarProps) => {
  const t = useTranslations('Clients');

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <Input
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder={t('searchPlaceholder')}
        aria-label={t('searchPlaceholder')}
        className="sm:max-w-xs"
      />
      <div className="flex flex-wrap items-center justify-end gap-2 sm:ml-auto">
        <SortOrderControl
          order={sortOrder}
          onOrderChange={onSortOrderChange}
          labels={{ label: t('sort.label'), asc: t('sort.asc'), desc: t('sort.desc') }}
          ascIcon={ArrowDownAZ}
          descIcon={ArrowUpAZ}
        />
        <ViewModeSwitch value={view} onChange={onViewChange} labels={{ grid: t('view.grid'), list: t('view.list') }} />
        <Button type="button" onClick={onAddClient}>
          <UserPlus className="size-4" />
          {t('addClient')}
        </Button>
      </div>
    </div>
  );
};
