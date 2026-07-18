'use client';

import { useState } from 'react';

import { useLocale, useTranslations } from '@/i18n';
import { isClientOwnedBy } from '@/src/entities/client';
import { useCapabilities, useCurrentUser } from '@/src/entities/user';
import { formatDate, ROUTES } from '@/src/shared/lib';

import type { ClientCardItem } from './Clients.types';
import { useClientAssign } from './hooks/useClientAssign';
import { useClientsBulkAssign } from './hooks/useClientsBulkAssign';
import { useClientsList } from './hooks/useClientsList';
import { useClientsSearch } from './hooks/useClientsSearch';
import { useClientsSelection } from './hooks/useClientsSelection';
import { useClientSync } from './hooks/useClientSync';

export const useClientsConfig = () => {
  const t = useTranslations('Clients');
  const locale = useLocale();
  const user = useCurrentUser();
  const { isAdmin, canCreateInvite } = useCapabilities();
  const [inviteOpen, setInviteOpen] = useState(false);
  const [plansOpen, setPlansOpen] = useState(false);
  // Admins have read-only access, so they cannot invite clients.
  const canInvite = !isAdmin;

  const search = useClientsSearch();
  const list = useClientsList(search.listParams);
  const assign = useClientAssign(list.clients);
  const selection = useClientsSelection(list.clients, user?.userId);
  const bulk = useClientsBulkAssign({
    selectedClients: selection.selectedClients,
    onCompleted: (failedIds) => selection.setSelection(failedIds),
  });
  const sync = useClientSync(list.clients);

  const items: ClientCardItem[] = list.clients.map((client) => {
    const assignment = client.programAssignment;
    const programName = assignment
      ? locale === 'ru' && assignment.programNameRu
        ? assignment.programNameRu
        : assignment.programName
      : '';

    const isOwned = isClientOwnedBy(client, user?.userId);

    return {
      client,
      canAssign: isOwned,
      selectable: selection.isSelectable(client),
      canSync: Boolean(assignment?.isBehindLatest) && isOwned,
      labels: {
        statusLabel: t(`status.${client.status}`),
        linkedLabel: t('linkedAt', { date: formatDate(client.linkedAt, locale, 'shortDate') }),
        programName,
        programHref: assignment ? ROUTES.programBasics(assignment.programId) : undefined,
        programLabel: assignment
          ? t('assignedProgram', { date: formatDate(assignment.assignedAt, locale, 'shortDate') })
          : t('noProgram'),
        // Admins see clients from every trainer; surface whose client this is.
        trainerLabel: isOwned ? undefined : t('trainer', { name: client.trainerDisplayName }),
        lastActiveLabel: client.lastActiveAt
          ? t('lastActive', { date: formatDate(client.lastActiveAt, locale, 'shortDate') })
          : t('neverActive'),
        assignLabel: assignment ? t('changeProgram') : t('assign'),
        syncLabel: t('syncToLatest'),
        avatarAlt: t('avatarAlt', { name: client.displayName }),
        blockedHint: t('blockedHint'),
        selectLabel: t('selectClient', { name: client.displayName }),
      },
    };
  });

  return {
    search: search.search,
    view: search.view,
    sortOrder: search.sortOrder,
    items,
    isPending: list.isPending,
    isFetchingNextPage: list.isFetchingNextPage,
    hasNextPage: list.hasNextPage,
    inviteOpen,
    plansOpen,
    canInvite,
    pickerOpen: assign.pickerOpen,
    selectedProgramId: assign.selectedProgramId,
    selectedIds: selection.selectedIds,
    selectedCount: selection.selectedIds.size,
    syncingIds: sync.syncingIds,
    bulkPickerOpen: bulk.open,
    bulkRemovable: bulk.hasExistingAssignments,
    bulkOverwriteEntries: bulk.overwriteEntries,
    handleSearchChange: search.handleSearchChange,
    handleViewChange: search.handleViewChange,
    handleSortOrderChange: search.handleSortOrderChange,
    handleLoadMore: list.handleLoadMore,
    handleAssign: assign.handleAssign,
    handlePickerOpenChange: assign.handlePickerOpenChange,
    handleConfirmAssign: assign.handleConfirm,
    handleRemoveAssign: assign.handleRemove,
    handleToggleSelect: selection.toggle,
    handleClearSelection: selection.clear,
    handleSyncClient: sync.handleSync,
    handleOpenBulkAssign: bulk.handleOpen,
    handleBulkPickerOpenChange: bulk.handleOpenChange,
    handleConfirmBulkAssign: bulk.handleConfirm,
    handleInviteOpenChange: setInviteOpen,
    handlePlansOpenChange: setPlansOpen,
    // Trainers who exhausted their invite quota are shown the upgrade modal.
    handleOpenInvite: () => (canCreateInvite ? setInviteOpen(true) : setPlansOpen(true)),
  };
};
