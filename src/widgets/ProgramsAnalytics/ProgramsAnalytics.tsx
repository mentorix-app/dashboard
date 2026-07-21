'use client';

import { useProgramsAnalyticsConfig } from './ProgramsAnalytics.conf';
import { ProgramsAnalyticsEmpty } from './ui/ProgramsAnalyticsEmpty';
import { ProgramsAnalyticsGrid } from './ui/ProgramsAnalyticsGrid';
import { ProgramsAnalyticsLoadMore } from './ui/ProgramsAnalyticsLoadMore';
import { ProgramsAnalyticsSkeleton } from './ui/ProgramsAnalyticsSkeleton';
import { ProgramsAnalyticsToolbar } from './ui/ProgramsAnalyticsToolbar';

export const ProgramsAnalytics = () => {
  const {
    search,
    sortBy,
    sortOrder,
    cards,
    isPending,
    isFetchingNextPage,
    hasNextPage,
    isSearching,
    handleSearchChange,
    handleSortByChange,
    handleSortOrderChange,
    handleLoadMore,
  } = useProgramsAnalyticsConfig();

  return (
    <div className="flex flex-col gap-4">
      <ProgramsAnalyticsToolbar
        search={search}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSearchChange={handleSearchChange}
        onSortByChange={handleSortByChange}
        onSortOrderChange={handleSortOrderChange}
      />

      {isPending ? (
        <ProgramsAnalyticsSkeleton />
      ) : cards.length === 0 ? (
        <ProgramsAnalyticsEmpty isSearching={isSearching} />
      ) : (
        <ProgramsAnalyticsGrid cards={cards} />
      )}

      {hasNextPage ? (
        <ProgramsAnalyticsLoadMore isFetchingNextPage={isFetchingNextPage} onLoadMore={handleLoadMore} />
      ) : null}
    </div>
  );
};
