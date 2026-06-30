import { type ComponentProps } from 'react';

import { cn } from '@/src/shared/lib/styles';

type ProgressProps = Omit<ComponentProps<'div'>, 'role' | 'aria-valuenow'> & {
  value: number;
  label?: string;
};

export const Progress = ({ value, label, className, ...props }: ProgressProps) => {
  const clamped = Math.min(100, Math.max(0, Math.round(value)));

  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className={cn('bg-muted relative h-2 w-full overflow-hidden rounded-full', className)}
      {...props}
    >
      <div className="bg-primary h-full rounded-full transition-all" style={{ width: `${clamped}%` }} />
    </div>
  );
};
