'use client';

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
    <div className="bg-card sticky top-2 z-10 flex items-center gap-3 rounded-lg border p-3 shadow-sm">
      <Typography variant="p-sm" className="font-medium">
        {countLabel}
      </Typography>
      <div className="ml-auto flex items-center gap-2">
        <Button type="button" variant="ghost" size="sm" onClick={onClear}>
          {clearLabel}
        </Button>
        {count > 1 ? (
          <Button type="button" size="sm" onClick={onAssign}>
            {assignLabel}
          </Button>
        ) : null}
      </div>
    </div>
  );
};
