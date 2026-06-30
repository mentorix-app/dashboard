'use client';

import { type FC } from 'react';
import { Filter, Loader2, Plus, Search, Trash2 } from 'lucide-react';
import { useTranslations } from '@/i18n';
import { Button, Collapsible, CollapsibleContent, Input } from '@/src/shared/ui';

import { ProgramsFilterChips } from '../ProgramsFilterChips';
import { ProgramsFilterPanel } from '../ProgramsFilterPanel';
import type { ProgramsToolbarProps } from './ProgramsToolbar.types';

export const ProgramsToolbar: FC<ProgramsToolbarProps> = ({
  search,
  filtersOpen,
  listParams,
  activeFilterCount,
  selectedCount,
  isCreating,
  onSearchChange,
  onFiltersOpenChange,
  onCreateNew,
  onDeleteSelected,
  onStatusFilterChange,
  onCategoryFilterChange,
  onDifficultyFilterChange,
  onClearFilters,
}) => {
  const t = useTranslations('Programs');

  return (
    <Collapsible open={filtersOpen} onOpenChange={onFiltersOpenChange} className="flex flex-col gap-3">
      <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-start lg:justify-between">
        <div className="flex w-full min-w-0 flex-col gap-2 lg:max-w-3xl lg:flex-1">
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
          <ProgramsFilterChips
            listParams={listParams}
            activeFilterCount={activeFilterCount}
            onStatusFilterChange={onStatusFilterChange}
            onCategoryFilterChange={onCategoryFilterChange}
            onDifficultyFilterChange={onDifficultyFilterChange}
            onClearFilters={onClearFilters}
          />
        </div>
        <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto lg:shrink-0">
          {selectedCount > 0 ? (
            <Button type="button" variant="destructive" className="w-full sm:w-auto" onClick={onDeleteSelected}>
              <Trash2 aria-hidden />
              {t('deleteSelected', { count: selectedCount })}
            </Button>
          ) : null}
          <Button type="button" className="w-full sm:w-auto" onClick={onCreateNew} disabled={isCreating}>
            {isCreating ? <Loader2 className="animate-spin" aria-hidden /> : <Plus aria-hidden />}
            {t('createNew')}
          </Button>
        </div>
      </div>
      <CollapsibleContent>
        <ProgramsFilterPanel
          listParams={listParams}
          onStatusFilterChange={onStatusFilterChange}
          onCategoryFilterChange={onCategoryFilterChange}
          onDifficultyFilterChange={onDifficultyFilterChange}
        />
      </CollapsibleContent>
    </Collapsible>
  );
};
