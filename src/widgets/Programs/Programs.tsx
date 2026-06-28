'use client';

import { type FC } from 'react';
import { useTranslations } from '@/i18n';
import { ConfirmationModal } from '@/src/shared/ui';

import { useProgramsConfig } from './Programs.conf';
import { ProgramsTable } from './ui/ProgramsTable/ProgramsTable';
import { ProgramsToolbar } from './ui/ProgramsToolbar/ProgramsToolbar';

export const Programs: FC = () => {
  const t = useTranslations('Programs');
  const {
    search,
    filtersOpen,
    listParams,
    programs,
    isPending,
    isFetchingNextPage,
    hasNextPage,
    activeFilterCount,
    visibleSelected,
    selectedPrograms,
    isDeleteDialogOpen,
    isDeleting,
    canManageProgram,
    handleSearchChange,
    handleFiltersOpenChange,
    handleCreateNew,
    handleToggleRow,
    handleToggleAllVisible,
    handleStatusFilterChange,
    handleCategoryFilterChange,
    handleDifficultyFilterChange,
    handleClearFilters,
    handleSortChange,
    handleLoadMore,
    handleDeleteClick,
    handleDeleteDialogOpenChange,
    handleConfirmDelete,
  } = useProgramsConfig();
  const selectedNames = selectedPrograms.map((program) => program.name).join(', ');

  return (
    <>
      <ProgramsToolbar
        search={search}
        filtersOpen={filtersOpen}
        listParams={listParams}
        activeFilterCount={activeFilterCount}
        selectedCount={visibleSelected.size}
        onSearchChange={handleSearchChange}
        onFiltersOpenChange={handleFiltersOpenChange}
        onCreateNew={handleCreateNew}
        onDeleteSelected={handleDeleteClick}
        onStatusFilterChange={handleStatusFilterChange}
        onCategoryFilterChange={handleCategoryFilterChange}
        onDifficultyFilterChange={handleDifficultyFilterChange}
        onClearFilters={handleClearFilters}
      />
      <div className="border-border bg-card overflow-x-auto rounded-md border">
        <ProgramsTable
          programs={programs}
          isLoading={isPending}
          isFetchingNextPage={isFetchingNextPage}
          hasNextPage={hasNextPage}
          selectedIds={visibleSelected}
          canManageProgram={canManageProgram}
          sortBy={listParams.sortBy}
          sortOrder={listParams.sortOrder}
          onToggleRow={handleToggleRow}
          onToggleAllVisible={handleToggleAllVisible}
          onSortChange={handleSortChange}
          onLoadMore={handleLoadMore}
        />
      </div>
      <ConfirmationModal
        open={isDeleteDialogOpen}
        title={t('deleteConfirm.title')}
        description={t('deleteConfirm.description', {
          count: visibleSelected.size,
          names: selectedNames || t('deleteConfirm.selectedItems'),
        })}
        cancelLabel={t('deleteConfirm.cancel')}
        confirmLabel={t('deleteConfirm.confirm')}
        isPending={isDeleting}
        onOpenChange={handleDeleteDialogOpenChange}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};
