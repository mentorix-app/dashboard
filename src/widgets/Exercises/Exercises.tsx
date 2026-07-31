'use client';

import { type FC } from 'react';
import { PlansModal } from '@/src/features/PlansModal';
import { useExercisesConfig } from './Exercises.conf';
import { ExerciseForm } from './ui/ExerciseForm';
import { ExercisesTable } from './ui/ExercisesTable/ExercisesTable';
import { ExercisesToolbar } from './ui/ExercisesToolbar/ExercisesToolbar';

export const Exercises: FC = () => {
  const {
    search,
    filtersOpen,
    listParams,
    canManage,
    canManageExercise,
    exercises,
    isPending,
    isFetchingNextPage,
    hasNextPage,
    activeFilterCount,
    visibleSelected,
    isFormOpen,
    isFormReadOnly,
    isPlansModalOpen,
    editingId,
    handleSearchChange,
    handleFiltersOpenChange,
    handleCreateNew,
    handlePlansModalOpenChange,
    handleRowClick,
    handleFormOpenChange,
    handleToggleRow,
    handleToggleAllVisible,
    handleTypeFilterChange,
    handleMuscleGroupFilterChange,
    handleEquipmentFilterChange,
    handleDifficultyFilterChange,
    handleScopeFilterChange,
    handleClearFilters,
    handleSortChange,
    handleLoadMore,
    handleDeleteClick,
  } = useExercisesConfig();

  return (
    <>
      <ExercisesToolbar
        search={search}
        filtersOpen={filtersOpen}
        listParams={listParams}
        activeFilterCount={activeFilterCount}
        selectedCount={visibleSelected.size}
        canManage={canManage}
        onSearchChange={handleSearchChange}
        onFiltersOpenChange={handleFiltersOpenChange}
        onCreateNew={handleCreateNew}
        onDeleteSelected={handleDeleteClick}
        onTypeFilterChange={handleTypeFilterChange}
        onMuscleGroupFilterChange={handleMuscleGroupFilterChange}
        onEquipmentFilterChange={handleEquipmentFilterChange}
        onDifficultyFilterChange={handleDifficultyFilterChange}
        onScopeFilterChange={handleScopeFilterChange}
        onClearFilters={handleClearFilters}
      />
      <div className="border-border bg-card overflow-x-auto rounded-md border">
        <ExercisesTable
          exercises={exercises}
          isLoading={isPending}
          isFetchingNextPage={isFetchingNextPage}
          hasNextPage={hasNextPage}
          selectedIds={visibleSelected}
          activeId={isFormOpen ? editingId : undefined}
          canSelect={canManage}
          canSelectExercise={canManageExercise}
          sortBy={listParams.sortBy}
          sortOrder={listParams.sortOrder}
          onToggleRow={handleToggleRow}
          onToggleAllVisible={handleToggleAllVisible}
          onRowClick={handleRowClick}
          onSortChange={handleSortChange}
          onLoadMore={handleLoadMore}
        />
      </div>
      <ExerciseForm
        open={isFormOpen}
        exerciseId={editingId}
        readOnly={isFormReadOnly}
        onOpenChange={handleFormOpenChange}
      />
      <PlansModal open={isPlansModalOpen} onOpenChange={handlePlansModalOpenChange} />
    </>
  );
};
