import { Badge } from '@/src/shared/ui';
import { cn } from '@/src/shared/lib/styles';

import { ClientStatus } from '../../model/types';

const STATUS_CLASS: Record<ClientStatus, string> = {
  [ClientStatus.Active]: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
  [ClientStatus.Blocked]: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300',
};

type ClientStatusBadgeProps = {
  status: ClientStatus;
  label: string;
  className?: string;
};

export const ClientStatusBadge = ({ status, label, className }: ClientStatusBadgeProps) => (
  <Badge variant="outline" size="sm" className={cn('border-transparent', STATUS_CLASS[status], className)}>
    {label}
  </Badge>
);
