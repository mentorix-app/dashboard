'use client';

import { useTranslations } from '@/i18n';
import type { ProgramAnalyticsSortField, ProgramAnalyticsSortOrder } from '@/src/entities/analytics';
import { SortMenu, type SortOption } from '@/src/features/SortOrderControl';
import { Input } from '@/src/shared/ui';

type ProgramsAnalyticsToolbarProps = {
  search: string;
  sortBy: ProgramAnalyticsSortField;
  sortOrder: ProgramAnalyticsSortOrder;
  onSearchChange: (value: string) => void;
  onSortByChange: (sortBy: ProgramAnalyticsSortField) => void;
  onSortOrderChange: (order: ProgramAnalyticsSortOrder) => void;
};

export const ProgramsAnalyticsToolbar = ({
  search,
  sortBy,
  sortOrder,
  onSearchChange,
  onSortByChange,
  onSortOrderChange,
}: ProgramsAnalyticsToolbarProps) => {
  const t = useTranslations('ProgramsAnalytics');

  const sortOptions: readonly SortOption<ProgramAnalyticsSortField>[] = [
    { field: 'lastActivity', label: t('sort.lastActivity') },
    { field: 'name', label: t('sort.name') },
  ];

  const handleSelect = (field: ProgramAnalyticsSortField) => {
    if (field === sortBy) {
      onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc');
      return;
    }
    onSortByChange(field);
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <Input
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder={t('searchPlaceholder')}
        aria-label={t('searchPlaceholder')}
        className="sm:max-w-xs"
      />
      <div className="flex flex-wrap items-center justify-end gap-2 sm:ml-auto">
        <SortMenu
          field={sortBy}
          order={sortOrder}
          options={sortOptions}
          onSelect={handleSelect}
          label={t('sort.label')}
        />
      </div>
    </div>
  );
};
