'use client';

import { useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';

type ClientsLoadMoreProps = {
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
};

export const ClientsLoadMore = ({ isFetchingNextPage, onLoadMore }: ClientsLoadMoreProps) => {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) onLoadMore();
    });

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [onLoadMore]);

  return (
    <div className="flex items-center justify-center py-4">
      <div ref={sentinelRef} aria-hidden className="h-px w-full" />
      {isFetchingNextPage ? <Loader2 className="text-muted-foreground size-5 animate-spin" /> : null}
    </div>
  );
};
