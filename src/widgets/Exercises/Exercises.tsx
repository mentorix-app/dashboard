'use client';

import { type FC } from 'react';
import { useTranslations } from '@/i18n';
import { ConfirmationModal } from '@/src/shared/ui';
import { useExercisesConfig } from './Exercises.conf';
import { ExerciseForm } from './ui/ExerciseForm';
import { ExercisesTable } from './ui/ExercisesTable/ExercisesTable';
import { ExercisesToolbar } from './ui/ExercisesToolbar/ExercisesToolbar';

export const Exercises: FC = () => {
  const t = useTranslations('Exercises');
  const {
    search,
    filtersOpen,
    listParams,
    canManage,
    exercises,
    isPending,
    isFetchingNextPage,
    hasNextPage,
    activeFilterCount,
    visibleSelected,
    selectedExercises,
    isDeleteDialogOpen,
    isDeleting,
    isFormOpen,
    editingId,
    handleSearchChange,
    handleFiltersOpenChange,
    handleCreateNew,
    handleRowClick,
    handleFormOpenChange,
    handleToggleRow,
    handleToggleAllVisible,
    handleTypeFilterChange,
    handleMuscleGroupFilterChange,
    handleEquipmentFilterChange,
    handleDifficultyFilterChange,
    handleClearFilters,
    handleSortChange,
    handleLoadMore,
    handleDeleteClick,
    handleDeleteDialogOpenChange,
    handleConfirmDelete,
  } = useExercisesConfig();
  const selectedNames = selectedExercises.map((exercise) => exercise.name).join(', ');

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
          sortBy={listParams.sortBy}
          sortOrder={listParams.sortOrder}
          onToggleRow={handleToggleRow}
          onToggleAllVisible={handleToggleAllVisible}
          onRowClick={handleRowClick}
          onSortChange={handleSortChange}
          onLoadMore={handleLoadMore}
        />
      </div>
      <ConfirmationModal
        open={isDeleteDialogOpen}
        title={t('deleteConfirm.title', { count: visibleSelected.size })}
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
      <ExerciseForm
        open={isFormOpen}
        exerciseId={editingId}
        readOnly={!canManage}
        onOpenChange={handleFormOpenChange}
      />
    </>
  );
};
