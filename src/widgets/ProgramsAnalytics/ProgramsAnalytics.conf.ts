'use client';

import { useLocale, useTranslations } from '@/i18n';
import { getProgramName } from '@/src/entities/program';
import { formatDate, ROUTES } from '@/src/shared/lib';

import type { ProgramAnalyticsCardVM } from './ProgramsAnalytics.types';
import { isAnalyticsDetailAvailable, toProgramStatusEnum } from './ProgramsAnalytics.utils';
import { useProgramsAnalyticsList } from './hooks/useProgramsAnalyticsList';
import { useProgramsAnalyticsSearch } from './hooks/useProgramsAnalyticsSearch';

const EM_DASH = '—';

export const useProgramsAnalyticsConfig = () => {
  const t = useTranslations('ProgramsAnalytics');
  const locale = useLocale();
  const search = useProgramsAnalyticsSearch();
  const list = useProgramsAnalyticsList(search.listParams);

  const cards: ProgramAnalyticsCardVM[] = list.items.map((item) => ({
    programId: item.programId,
    name: getProgramName(item, locale),
    status: toProgramStatusEnum(item.status),
    statusLabel: t(`status.${item.status}`),
    href: isAnalyticsDetailAvailable(item.status) ? ROUTES.programAnalytics(item.programId) : null,
    activeClients: item.activeClientsCount,
    totalCompletions: item.totalCompletions,
    completionsLast30Days: item.completionsLast30Days,
    avgCompletionLabel:
      item.avgCompletionPercent === null ? EM_DASH : t('percent', { value: item.avgCompletionPercent }),
    avgCompletionPercent: item.avgCompletionPercent,
    lastActivityLabel: item.lastActivityAt ? formatDate(item.lastActivityAt, locale, 'shortDate') : EM_DASH,
  }));

  return {
    search: search.search,
    sortBy: search.sortBy,
    sortOrder: search.sortOrder,
    cards,
    isPending: list.isPending,
    isFetchingNextPage: list.isFetchingNextPage,
    hasNextPage: list.hasNextPage,
    isSearching: search.search.trim().length > 0,
    handleSearchChange: search.handleSearchChange,
    handleSortByChange: search.handleSortByChange,
    handleSortOrderChange: search.handleSortOrderChange,
    handleLoadMore: list.handleLoadMore,
  };
};
