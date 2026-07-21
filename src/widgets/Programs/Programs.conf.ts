'use client';

import { useCallback, useMemo, useState } from 'react';

import { useTranslations, useLocale, useRouter } from '@/i18n';
import { canManageProgram, useCreateProgram, type Program } from '@/src/entities/program';
import { parseQuotaError } from '@/src/entities/subscription';
import { useCapabilities, useCurrentUser } from '@/src/entities/user';
import { useToast } from '@/src/shared/hooks';

import type { ProgramsConfig } from './Programs.types';
import { useProgramsDeletion } from './hooks/useProgramsDeletion';
import { useProgramsFilters } from './hooks/useProgramsFilters';
import { useProgramsList } from './hooks/useProgramsList';
import { useProgramsSearch } from './hooks/useProgramsSearch';
import { useProgramsSelection } from './hooks/useProgramsSelection';
import { useProgramsSort } from './hooks/useProgramsSort';

export const useProgramsConfig = (): ProgramsConfig => {
  const t = useTranslations('Programs');
  const { showSuccessToast, showErrorToast } = useToast();
  const router = useRouter();
  const locale = useLocale();
  const currentUser = useCurrentUser();
  const { isTrainer, canCreateProgram } = useCapabilities();
  const userId = currentUser?.userId;

  // Roles are mutually exclusive: admins are read-only for other trainers'
  // programs, so only the owning trainer may manage a program.
  const canManage = useCallback(
    (program: Program) => canManageProgram(program, { isTrainer, userId }),
    [isTrainer, userId]
  );
  // Only trainers can create programs; the button is hidden for admins/clients.
  const canCreate = isTrainer;

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [isPlansModalOpen, setIsPlansModalOpen] = useState(false);
  const createProgram = useCreateProgram();
  // Creating a draft program immediately opens its setup wizard so the trainer
  // can fill in the details, while a toast confirms the draft was created. When
  // the plan quota is reached the upgrade modal is surfaced instead.
  const handleCreateNew = useCallback(() => {
    if (!canCreateProgram) {
      setIsPlansModalOpen(true);
      return;
    }
    createProgram.mutate(undefined, {
      onSuccess: (program) => {
        showSuccessToast(t('toast.draftCreated'));
        router.push(`/programs/${program.id}/basics`, { locale });
      },
      // Quota (409) errors are surfaced by the global handler; avoid a duplicate toast.
      onError: (error) => {
        if (!parseQuotaError(error)) showErrorToast(t('toast.createError'));
      },
    });
  }, [canCreateProgram, createProgram, router, locale, showSuccessToast, showErrorToast, t]);

  const search = useProgramsSearch();
  const list = useProgramsList(search.listParams);
  const filters = useProgramsFilters(search);
  const sort = useProgramsSort(search);
  const selection = useProgramsSelection(list.programs, canManage);
  const deletion = useProgramsDeletion({
    programs: list.programs,
    selectedIds: selection.selectedIds,
    setSelectedIds: selection.setSelectedIds,
  });

  return useMemo(
    () => ({
      search: search.search,
      filtersOpen,
      listParams: search.listParams,
      programs: list.programs,
      isPending: list.isPending,
      isFetchingNextPage: list.isFetchingNextPage,
      hasNextPage: list.hasNextPage,
      activeFilterCount: filters.activeFilterCount,
      visibleSelected: selection.visibleSelected,
      deletePendingPrograms: deletion.pendingPrograms,
      deletePendingCount: deletion.pendingCount,
      isDeleteDialogOpen: deletion.isDeleteDialogOpen,
      isDeleting: deletion.isDeleting,
      isCreating: createProgram.isPending,
      isPlansModalOpen,
      canCreate,
      canManageProgram: canManage,
      handleSearchChange: search.handleSearchChange,
      handleFiltersOpenChange: setFiltersOpen,
      handleCreateNew,
      handlePlansModalOpenChange: setIsPlansModalOpen,
      handleToggleRow: selection.handleToggleRow,
      handleToggleAllVisible: selection.handleToggleAllVisible,
      handleStatusFilterChange: filters.handleStatusFilterChange,
      handleCategoryFilterChange: filters.handleCategoryFilterChange,
      handleDifficultyFilterChange: filters.handleDifficultyFilterChange,
      handleClearFilters: filters.handleClearFilters,
      handleSortChange: sort.handleSortChange,
      handleLoadMore: list.handleLoadMore,
      handleDeleteClick: deletion.handleDeleteClick,
      handleDeleteProgram: deletion.handleDeleteProgram,
      handleDeleteDialogOpenChange: deletion.handleDeleteDialogOpenChange,
      handleConfirmDelete: deletion.handleConfirmDelete,
    }),
    [
      search,
      filtersOpen,
      list,
      filters,
      selection,
      deletion,
      sort,
      canManage,
      canCreate,
      isPlansModalOpen,
      handleCreateNew,
      createProgram.isPending,
    ]
  );
};
