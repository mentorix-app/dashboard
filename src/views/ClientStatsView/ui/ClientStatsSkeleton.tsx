import { Skeleton } from '@/src/shared/ui';

export const ClientStatsSkeleton = () => (
  <main className="mx-auto flex w-full max-w-3xl flex-col gap-5 px-4 py-5 sm:px-6 sm:py-8" aria-busy="true">
    <Skeleton className="h-60 w-full rounded-xl" />
    <Skeleton className="h-64 w-full rounded-xl" />
    <div className="grid grid-cols-2 gap-3">
      {Array.from({ length: 4 }, (_, index) => (
        <Skeleton key={index} className="h-32 w-full rounded-xl" />
      ))}
    </div>
    <Skeleton className="h-52 w-full rounded-xl" />
  </main>
);
