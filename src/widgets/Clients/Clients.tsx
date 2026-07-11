'use client';

import { useTranslations } from '@/i18n';
import { InviteClientDialog } from '@/src/features/InviteClientDialog';
import { ProgramPicker } from '@/src/features/ProgramPicker';
import { Typography } from '@/src/shared/ui';

import { useClientsConfig } from './Clients.conf';
import { ClientsBulkBar } from './ui/ClientsBulkBar';
import { ClientsEmpty } from './ui/ClientsEmpty';
import { ClientsGrid } from './ui/ClientsGrid';
import { ClientsList } from './ui/ClientsList';
import { ClientsLoadMore } from './ui/ClientsLoadMore';
import { ClientsSkeleton } from './ui/ClientsSkeleton';
import { ClientsToolbar } from './ui/ClientsToolbar';

export const Clients = () => {
  const t = useTranslations('Clients');
  const {
    search,
    view,
    sortOrder,
    items,
    isPending,
    isFetchingNextPage,
    hasNextPage,
    inviteOpen,
    pickerOpen,
    selectedProgramId,
    selectedIds,
    selectedCount,
    bulkPickerOpen,
    bulkRemovable,
    bulkOverwriteEntries,
    handleSearchChange,
    handleViewChange,
    handleSortOrderChange,
    handleLoadMore,
    handleAssign,
    handlePickerOpenChange,
    handleConfirmAssign,
    handleRemoveAssign,
    handleToggleSelect,
    handleClearSelection,
    handleOpenBulkAssign,
    handleBulkPickerOpenChange,
    handleConfirmBulkAssign,
    handleInviteOpenChange,
    handleOpenInvite,
  } = useClientsConfig();

  const isSearching = search.trim().length > 0;

  const bulkNotice =
    bulkOverwriteEntries.length > 0 ? (
      <div className="flex flex-col gap-1">
        <Typography variant="p-sm" className="font-medium">
          {t('overwriteWarning')}
        </Typography>
        <ul className="flex flex-col gap-0.5">
          {bulkOverwriteEntries.map((entry) => (
            <li key={entry.id}>
              <Typography variant="p-xs" className="text-muted-foreground">
                {entry.name} — {entry.programName} · {entry.assignedLabel}
              </Typography>
            </li>
          ))}
        </ul>
      </div>
    ) : null;

  return (
    <div className="flex flex-col gap-4">
      <ClientsToolbar
        search={search}
        view={view}
        sortOrder={sortOrder}
        onSearchChange={handleSearchChange}
        onViewChange={handleViewChange}
        onSortOrderChange={handleSortOrderChange}
        onAddClient={handleOpenInvite}
      />

      <ClientsBulkBar
        count={selectedCount}
        countLabel={t('selectedCount', { count: selectedCount })}
        assignLabel={t('bulkAssign')}
        clearLabel={t('clearSelection')}
        onAssign={handleOpenBulkAssign}
        onClear={handleClearSelection}
      />

      {isPending ? (
        <ClientsSkeleton view={view} />
      ) : items.length === 0 ? (
        <ClientsEmpty isSearching={isSearching} />
      ) : view === 'grid' ? (
        <ClientsGrid
          items={items}
          selectedIds={selectedIds}
          onAssign={handleAssign}
          onToggleSelect={handleToggleSelect}
        />
      ) : (
        <ClientsList
          items={items}
          selectedIds={selectedIds}
          onAssign={handleAssign}
          onToggleSelect={handleToggleSelect}
        />
      )}

      {hasNextPage ? <ClientsLoadMore isFetchingNextPage={isFetchingNextPage} onLoadMore={handleLoadMore} /> : null}

      <ProgramPicker
        open={pickerOpen}
        onOpenChange={handlePickerOpenChange}
        onConfirm={handleConfirmAssign}
        onRemove={handleRemoveAssign}
        selectedProgramId={selectedProgramId}
      />

      <ProgramPicker
        open={bulkPickerOpen}
        onOpenChange={handleBulkPickerOpenChange}
        onConfirm={handleConfirmBulkAssign}
        selectedProgramId={null}
        removable={bulkRemovable}
        notice={bulkNotice}
      />

      <InviteClientDialog open={inviteOpen} onOpenChange={handleInviteOpenChange} />
    </div>
  );
};
