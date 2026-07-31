'use client';

import { type FC } from 'react';
import { PlansModal } from '@/src/features/PlansModal';

import { useProgramsConfig } from './Programs.conf';
import { ProgramsTable } from './ui/ProgramsTable/ProgramsTable';
import { ProgramsToolbar } from './ui/ProgramsToolbar/ProgramsToolbar';

export const Programs: FC = () => {
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
    isCreating,
    isPlansModalOpen,
    canCreate,
    canManageProgram,
    handleSearchChange,
    handleFiltersOpenChange,
    handleCreateNew,
    handlePlansModalOpenChange,
    handleToggleRow,
    handleToggleAllVisible,
    handleStatusFilterChange,
    handleCategoryFilterChange,
    handleDifficultyFilterChange,
    handleClearFilters,
    handleSortChange,
    handleLoadMore,
    handleDeleteClick,
    handleDeleteProgram,
  } = useProgramsConfig();

  return (
    <>
      <ProgramsToolbar
        search={search}
        filtersOpen={filtersOpen}
        listParams={listParams}
        activeFilterCount={activeFilterCount}
        selectedCount={visibleSelected.size}
        isCreating={isCreating}
        canCreate={canCreate}
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
          onDeleteRow={handleDeleteProgram}
        />
      </div>
      <PlansModal open={isPlansModalOpen} onOpenChange={handlePlansModalOpenChange} />
    </>
  );
};
