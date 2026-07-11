import { Avatar, AvatarFallback, AvatarImage, Button, Card, Checkbox, Typography } from '@/src/shared/ui';
import { Link } from '@/i18n';
import { cn } from '@/src/shared/lib/styles';

import { ClientStatus } from '../../model/types';
import { getClientAvatarSrc, getClientInitials } from '../../lib';
import { ClientStatusBadge } from '../ClientStatusBadge/ClientStatusBadge';
import type { ClientCardProps } from '../types';

export const ClientRowCard = ({
  client,
  labels,
  onAssign,
  canAssign,
  selectable,
  isSelected,
  onToggleSelect,
}: ClientCardProps) => {
  const isBlocked = client.status === ClientStatus.Blocked;
  const avatarSrc = getClientAvatarSrc(client.avatarUrl);

  return (
    <Card className={cn('flex-row items-center gap-4 p-4', isBlocked && 'opacity-60')}>
      {selectable ? (
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onToggleSelect(client.clientUserId)}
          aria-label={labels.selectLabel}
        />
      ) : null}

      <Avatar className="size-10 shrink-0">
        {avatarSrc ? <AvatarImage src={avatarSrc} alt={labels.avatarAlt} /> : null}
        <AvatarFallback className="text-xs">{getClientInitials(client.displayName)}</AvatarFallback>
      </Avatar>

      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <div className="flex min-w-0 items-center gap-2">
          <Typography variant="p" className="truncate font-medium">
            {client.displayName}
          </Typography>
          <ClientStatusBadge status={client.status} label={labels.statusLabel} />
        </div>
        <Typography variant="p-sm" className="text-muted-foreground truncate">
          {labels.linkedLabel} ·{' '}
          {labels.programName && labels.programHref ? (
            <Link href={labels.programHref} className="text-foreground underline-offset-4 hover:underline">
              {labels.programName}
            </Link>
          ) : (
            labels.programName || labels.programLabel
          )}
        </Typography>
      </div>

      {canAssign ? (
        <div className="flex shrink-0 flex-col items-end gap-1">
          <Button type="button" size="sm" disabled={isBlocked} onClick={() => onAssign(client.clientUserId)}>
            {labels.assignLabel}
          </Button>
          {isBlocked && labels.blockedHint ? (
            <Typography variant="p-xs" className="text-muted-foreground">
              {labels.blockedHint}
            </Typography>
          ) : null}
        </div>
      ) : null}
    </Card>
  );
};
