import { Card, Skeleton } from '@/src/shared/ui';

export const WeekResultsSkeleton = () => (
  <div className="flex flex-col gap-6">
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
      {Array.from({ length: 5 }).map((_, index) => (
        <Card key={index} className="gap-2 p-4">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-7 w-12" />
        </Card>
      ))}
    </div>

    <Card className="p-6">
      <Skeleton className="h-64 w-full" />
    </Card>
  </div>
);
