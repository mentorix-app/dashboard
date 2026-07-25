import { Pencil, Plus } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage, Button, Card, Checkbox, Typography } from '@/src/shared/ui';
import { Link } from '@/i18n';
import { cn } from '@/src/shared/lib/styles';

import { ClientStatus } from '../../model/types';
import { getClientAvatarSrc, getClientInitials } from '../../lib';
import { ClientStatusBadge } from '../ClientStatusBadge/ClientStatusBadge';
import { ClientSyncButton } from '../ClientSyncButton/ClientSyncButton';
import type { ClientCardProps } from '../types';

export const ClientRowCard = ({
  client,
  labels,
  onAssign,
  canAssign,
  selectable,
  isSelected,
  onToggleSelect,
  canSync,
  isSyncing,
  onSync,
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
          <Typography variant="p" className="min-w-0 truncate font-medium">
            {labels.profileHref ? (
              <Link href={labels.profileHref} className="underline-offset-4 hover:underline">
                {client.displayName}
              </Link>
            ) : (
              client.displayName
            )}
          </Typography>
          <ClientStatusBadge status={client.status} label={labels.statusLabel} className="hidden sm:inline-flex" />
        </div>
        <Typography variant="p-sm" className="text-muted-foreground truncate">
          <span className="hidden md:inline">{labels.linkedLabel} · </span>
          {labels.programName && labels.programHref ? (
            <Link href={labels.programHref} className="text-foreground underline-offset-4 hover:underline">
              {labels.programName}
            </Link>
          ) : (
            labels.programName || labels.programLabel
          )}
        </Typography>
        <Typography variant="p-xs" className="text-muted-foreground truncate">
          {labels.trainerLabel ? `${labels.trainerLabel} · ` : ''}
          {labels.lastActiveLabel}
        </Typography>
      </div>

      {canSync || canAssign ? (
        <div className="flex shrink-0 flex-col items-end gap-1">
          {canSync ? (
            <ClientSyncButton
              label={labels.syncLabel}
              isSyncing={isSyncing}
              onSync={() => onSync(client.clientUserId)}
            />
          ) : null}
          {canAssign ? (
            <Button
              type="button"
              size="icon-sm"
              variant="outline"
              disabled={isBlocked}
              onClick={() => onAssign(client.clientUserId)}
              aria-label={labels.assignLabel}
              title={labels.assignLabel}
            >
              {labels.programName ? <Pencil className="size-4" /> : <Plus className="size-4" />}
            </Button>
          ) : null}
          {canAssign && isBlocked && labels.blockedHint ? (
            <Typography variant="p-xs" className="text-muted-foreground">
              {labels.blockedHint}
            </Typography>
          ) : null}
        </div>
      ) : null}
    </Card>
  );
};
