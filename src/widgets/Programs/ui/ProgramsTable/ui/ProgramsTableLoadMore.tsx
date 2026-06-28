'use client';

import { type FC, useEffect, useRef } from 'react';

import type { ProgramsTableLoadMoreProps } from '../ProgramsTable.types';

export const ProgramsTableLoadMore: FC<ProgramsTableLoadMoreProps> = ({ disabled, onLoadMore }) => {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || disabled) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) onLoadMore();
    });

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [disabled, onLoadMore]);

  return <div ref={sentinelRef} aria-hidden className="h-px" />;
};
