'use client';

import { type FC } from 'react';

import { useProgramsConfig } from './Programs.conf';
import { ProgramsTable } from './ui/ProgramsTable/ProgramsTable';
import { ProgramsToolbar } from './ui/ProgramsToolbar/ProgramsToolbar';

export const Programs: FC = () => {
  const {
    search,
    programs,
    isPending,
    isFetchingNextPage,
    hasNextPage,
    handleSearchChange,
    handleCreateNew,
    handleLoadMore,
  } = useProgramsConfig();

  return (
    <>
      <ProgramsToolbar search={search} onSearchChange={handleSearchChange} onCreateNew={handleCreateNew} />
      <div className="border-border bg-card overflow-x-auto rounded-md border">
        <ProgramsTable
          programs={programs}
          isLoading={isPending}
          isFetchingNextPage={isFetchingNextPage}
          hasNextPage={hasNextPage}
          onLoadMore={handleLoadMore}
        />
      </div>
    </>
  );
};
