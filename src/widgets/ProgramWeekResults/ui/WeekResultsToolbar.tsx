'use client';

import { Search } from 'lucide-react';

import { useTranslations } from '@/i18n';
import { ViewModeSwitch, type ViewMode } from '@/src/features/ViewModeSwitch';
import { Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/shared/ui';

import type { WeekOption } from '../ProgramWeekResults.types';

type WeekResultsToolbarProps = {
  weekOptions: WeekOption[];
  week: number;
  onWeekChange: (week: number) => void;
  view: ViewMode;
  onViewChange: (view: ViewMode) => void;
  search: string;
  onSearchChange: (value: string) => void;
};

export const WeekResultsToolbar = ({
  weekOptions,
  week,
  onWeekChange,
  view,
  onViewChange,
  search,
  onSearchChange,
}: WeekResultsToolbarProps) => {
  const t = useTranslations('ProgramWeekResults');

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Select value={String(week)} onValueChange={(value) => onWeekChange(Number(value))}>
        <SelectTrigger className="w-40" aria-label={t('toolbar.weekLabel')}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {weekOptions.map((option) => (
            <SelectItem key={option.value} value={String(option.value)}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="relative min-w-48 flex-1">
        <Search
          className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2"
          aria-hidden
        />
        <Input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={t('toolbar.searchPlaceholder')}
          aria-label={t('toolbar.searchLabel')}
          className="pl-8"
        />
      </div>

      <ViewModeSwitch
        value={view}
        onChange={onViewChange}
        labels={{ grid: t('toolbar.cardsView'), list: t('toolbar.tableView') }}
      />
    </div>
  );
};
