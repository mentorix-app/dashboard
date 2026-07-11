'use client';

import { Skeleton } from '@/src/shared/ui';
import type { ViewMode } from '@/src/features/ViewModeSwitch';

const PLACEHOLDER_COUNT = 8;

type ClientsSkeletonProps = {
  view: ViewMode;
};

export const ClientsSkeleton = ({ view }: ClientsSkeletonProps) => {
  if (view === 'list') {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: PLACEHOLDER_COUNT }).map((_, index) => (
          <Skeleton key={index} className="h-16 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: PLACEHOLDER_COUNT }).map((_, index) => (
        <Skeleton key={index} className="h-52 w-full rounded-xl" />
      ))}
    </div>
  );
};
