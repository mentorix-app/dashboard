'use client';

import { type FC } from 'react';
import { Filter, Plus, Search, Trash2 } from 'lucide-react';
import { useTranslations } from '@/i18n';
import { Button, Collapsible, CollapsibleContent, Input } from '@/src/shared/ui';

import { ExercisesFilterChips } from '../ExercisesFilterChips';
import { ExercisesFilterPanel } from '../ExercisesFilterPanel';
import type { ExercisesToolbarProps } from './ExercisesToolbar.types';

export const ExercisesToolbar: FC<ExercisesToolbarProps> = ({
  search,
  filtersOpen,
  listParams,
  activeFilterCount,
  selectedCount,
  canManage,
  onSearchChange,
  onFiltersOpenChange,
  onCreateNew,
  onDeleteSelected,
  onTypeFilterChange,
  onMuscleGroupFilterChange,
  onEquipmentFilterChange,
  onDifficultyFilterChange,
  onClearFilters,
}) => {
  const t = useTranslations('Exercises');

  return (
    <Collapsible open={filtersOpen} onOpenChange={onFiltersOpenChange} className="flex flex-col gap-3">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex w-full flex-col gap-2 lg:max-w-3xl">
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative w-full sm:max-w-sm">
              <Search
                aria-hidden
                className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
              />
              <Input
                type="search"
                value={search}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder={t('searchPlaceholder')}
                aria-label={t('searchPlaceholder')}
                className="pl-9"
              />
            </div>
            <Button type="button" variant="outline" onClick={() => onFiltersOpenChange(!filtersOpen)}>
              <Filter aria-hidden />
              {filtersOpen ? t('filters.hide') : t('filters.show')}
              {activeFilterCount > 0 ? <span className="text-muted-foreground">{activeFilterCount}</span> : null}
            </Button>
          </div>
          <ExercisesFilterChips
            listParams={listParams}
            activeFilterCount={activeFilterCount}
            onTypeFilterChange={onTypeFilterChange}
            onMuscleGroupFilterChange={onMuscleGroupFilterChange}
            onEquipmentFilterChange={onEquipmentFilterChange}
            onDifficultyFilterChange={onDifficultyFilterChange}
            onClearFilters={onClearFilters}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {canManage && selectedCount > 0 ? (
            <Button type="button" variant="destructive" onClick={onDeleteSelected}>
              <Trash2 aria-hidden />
              {t('deleteSelected', { count: selectedCount })}
            </Button>
          ) : null}
          {canManage ? (
            <Button type="button" onClick={onCreateNew}>
              <Plus aria-hidden />
              {t('createNew')}
            </Button>
          ) : null}
        </div>
      </div>
      <CollapsibleContent>
        <ExercisesFilterPanel
          listParams={listParams}
          onTypeFilterChange={onTypeFilterChange}
          onMuscleGroupFilterChange={onMuscleGroupFilterChange}
          onEquipmentFilterChange={onEquipmentFilterChange}
          onDifficultyFilterChange={onDifficultyFilterChange}
        />
      </CollapsibleContent>
    </Collapsible>
  );
};
