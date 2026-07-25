'use client';

import { X } from 'lucide-react';

import { Button, Typography } from '@/src/shared/ui';

type ClientsBulkBarProps = {
  count: number;
  countLabel: string;
  assignLabel: string;
  clearLabel: string;
  onAssign: () => void;
  onClear: () => void;
};

export const ClientsBulkBar = ({
  count,
  countLabel,
  assignLabel,
  clearLabel,
  onAssign,
  onClear,
}: ClientsBulkBarProps) => {
  if (count === 0) return null;

  return (
    <div className="bg-card sticky top-2 z-10 flex items-center gap-2 rounded-lg border p-3 shadow-sm">
      <Typography variant="p-sm" className="font-medium">
        {countLabel}
      </Typography>
      <Button type="button" variant="ghost" size="icon-sm" onClick={onClear} aria-label={clearLabel} title={clearLabel}>
        <X className="size-4" />
      </Button>
      {count > 1 ? (
        <Button type="button" size="sm" onClick={onAssign} className="ml-auto">
          {assignLabel}
        </Button>
      ) : null}
    </div>
  );
};
