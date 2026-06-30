import { Badge } from '@/src/shared/ui';
import { cn } from '@/src/shared/lib/styles';

import { ProgramStatus } from '../../model/types';

const STATUS_CLASS: Record<ProgramStatus, string> = {
  [ProgramStatus.Draft]: 'bg-muted text-muted-foreground',
  [ProgramStatus.Published]: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
  [ProgramStatus.Archived]: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
};

type ProgramStatusBadgeProps = {
  status: ProgramStatus;
  label: string;
  size?: 'default' | 'sm' | 'lg';
  className?: string;
};

export const ProgramStatusBadge = ({ status, label, size = 'default', className }: ProgramStatusBadgeProps) => (
  <Badge variant="outline" size={size} className={cn('border-transparent', STATUS_CLASS[status], className)}>
    {label}
  </Badge>
);
