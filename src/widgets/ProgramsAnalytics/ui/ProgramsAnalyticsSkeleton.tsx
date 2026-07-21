import { Card, CardContent, CardHeader, Skeleton } from '@/src/shared/ui';

const PLACEHOLDER_COUNT = 8;

export const ProgramsAnalyticsSkeleton = () => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    {Array.from({ length: PLACEHOLDER_COUNT }).map((_, index) => (
      <Card key={index} className="h-full gap-4 py-4">
        <CardHeader className="gap-2 px-4">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-16" />
        </CardHeader>
        <CardContent className="flex flex-col gap-4 px-4">
          <div className="grid grid-cols-3 gap-3">
            <Skeleton className="h-10" />
            <Skeleton className="h-10" />
            <Skeleton className="h-10" />
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-3 w-2/3" />
        </CardContent>
      </Card>
    ))}
  </div>
);
