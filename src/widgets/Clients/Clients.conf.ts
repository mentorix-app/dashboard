'use client';

import { useMemo, useState } from 'react';

import { useLocale, useTranslations } from '@/i18n';
import { isClientOwnedBy } from '@/src/entities/client';
import { useCurrentUser } from '@/src/entities/user';
import { formatDate, ROUTES } from '@/src/shared/lib';

import type { ClientCardItem } from './Clients.types';
import { useClientAssign } from './hooks/useClientAssign';
import { useClientsBulkAssign } from './hooks/useClientsBulkAssign';
import { useClientsList } from './hooks/useClientsList';
import { useClientsSearch } from './hooks/useClientsSearch';
import { useClientsSelection } from './hooks/useClientsSelection';

export const useClientsConfig = () => {
  const t = useTranslations('Clients');
  const locale = useLocale();
  const user = useCurrentUser();
  const [inviteOpen, setInviteOpen] = useState(false);

  const search = useClientsSearch();
  const list = useClientsList(search.listParams);
  const assign = useClientAssign(list.clients);
  const selection = useClientsSelection(list.clients, user?.userId);
  const bulk = useClientsBulkAssign({
    selectedClients: selection.selectedClients,
    onCompleted: (failedIds) => selection.setSelection(failedIds),
  });

  const items: ClientCardItem[] = useMemo(
    () =>
      list.clients.map((client) => {
        const assignment = client.programAssignment;
        const programName = assignment
          ? locale === 'ru' && assignment.programNameRu
            ? assignment.programNameRu
            : assignment.programName
          : '';

        return {
          client,
          canAssign: isClientOwnedBy(client, user?.userId),
          selectable: selection.isSelectable(client),
          labels: {
            statusLabel: t(`status.${client.status}`),
            linkedLabel: t('linkedAt', { date: formatDate(client.linkedAt, locale, 'shortDate') }),
            programName,
            programHref: assignment ? ROUTES.programBasics(assignment.programId) : undefined,
            programLabel: assignment
              ? t('assignedProgram', { date: formatDate(assignment.assignedAt, locale, 'shortDate') })
              : t('noProgram'),
            assignLabel: assignment ? t('changeProgram') : t('assign'),
            avatarAlt: t('avatarAlt', { name: client.displayName }),
            blockedHint: t('blockedHint'),
            selectLabel: t('selectClient', { name: client.displayName }),
          },
        };
      }),
    [list.clients, t, locale, user?.userId, selection]
  );

  return {
    search: search.search,
    view: search.view,
    sortOrder: search.sortOrder,
    items,
    isPending: list.isPending,
    isFetchingNextPage: list.isFetchingNextPage,
    hasNextPage: list.hasNextPage,
    inviteOpen,
    pickerOpen: assign.pickerOpen,
    selectedProgramId: assign.selectedProgramId,
    selectedIds: selection.selectedIds,
    selectedCount: selection.selectedIds.size,
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
    handleOpenBulkAssign: bulk.handleOpen,
    handleBulkPickerOpenChange: bulk.handleOpenChange,
    handleConfirmBulkAssign: bulk.handleConfirm,
    handleInviteOpenChange: setInviteOpen,
    handleOpenInvite: () => setInviteOpen(true),
  };
};
