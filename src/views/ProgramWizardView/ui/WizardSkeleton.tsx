import { Skeleton } from '@/src/shared/ui';

export const WizardSkeleton = () => (
  <section className="flex flex-1 flex-col gap-6" aria-busy="true" aria-live="polite">
    <header className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-7 w-20 rounded-md" />
      </div>
      <Skeleton className="h-4 w-48" />
      <Skeleton className="h-2 w-full rounded-full" />
      <div className="flex justify-center gap-4">
        <Skeleton className="h-8 w-28 rounded-full" />
        <Skeleton className="h-8 w-28 rounded-full" />
      </div>
    </header>

    <div className="flex flex-1 flex-col gap-4">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-24 w-full" />
    </div>

    <footer className="flex items-center justify-between gap-4 border-t pt-6">
      <Skeleton className="h-9 w-24" />
      <Skeleton className="h-9 w-24" />
    </footer>
  </section>
);
