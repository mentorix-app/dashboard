import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  Typography,
} from '@/src/shared/ui';
import { Link } from '@/i18n';
import { cn } from '@/src/shared/lib/styles';

import { ClientStatus } from '../../model/types';
import { getClientAvatarSrc, getClientInitials } from '../../lib';
import { ClientStatusBadge } from '../ClientStatusBadge/ClientStatusBadge';
import { ClientSyncButton } from '../ClientSyncButton/ClientSyncButton';
import type { ClientCardProps } from '../types';

export const ClientCard = ({
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
    <Card className={cn('h-full gap-4 py-4', isBlocked && 'opacity-60')}>
      <CardHeader className="gap-0 px-4">
        <div className="flex items-center gap-3">
          {selectable ? (
            <Checkbox
              checked={isSelected}
              onCheckedChange={() => onToggleSelect(client.clientUserId)}
              aria-label={labels.selectLabel}
            />
          ) : null}
          <Avatar className="size-12">
            {avatarSrc ? <AvatarImage src={avatarSrc} alt={labels.avatarAlt} /> : null}
            <AvatarFallback className="text-sm">{getClientInitials(client.displayName)}</AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            {labels.profileHref ? (
              <CardTitle className="line-clamp-2 leading-snug break-words">
                <Link href={labels.profileHref} className="underline-offset-4 hover:underline">
                  {client.displayName}
                </Link>
              </CardTitle>
            ) : (
              <CardTitle className="line-clamp-2 leading-snug break-words">{client.displayName}</CardTitle>
            )}
            <div>
              <ClientStatusBadge status={client.status} label={labels.statusLabel} />
            </div>
          </div>
          {canSync ? (
            <ClientSyncButton
              label={labels.syncLabel}
              isSyncing={isSyncing}
              onSync={() => onSync(client.clientUserId)}
              className="shrink-0"
            />
          ) : null}
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-1 px-4">
        <Typography variant="p-sm" className="text-muted-foreground">
          {labels.linkedLabel}
        </Typography>
        {labels.programName ? (
          <>
            {labels.programHref ? (
              <Link
                href={labels.programHref}
                className="text-foreground truncate font-medium underline-offset-4 hover:underline"
              >
                {labels.programName}
              </Link>
            ) : (
              <Typography variant="p-sm" className="truncate font-medium">
                {labels.programName}
              </Typography>
            )}
            <Typography variant="p-xs" className="text-muted-foreground">
              {labels.programLabel}
            </Typography>
          </>
        ) : (
          <Typography variant="p-sm" className="text-muted-foreground">
            {labels.programLabel}
          </Typography>
        )}
        {labels.trainerLabel ? (
          <div className="text-muted-foreground flex flex-wrap items-center gap-x-1.5">
            <Typography variant="p-xs" className="text-muted-foreground truncate">
              {labels.trainerLabel}
            </Typography>
            <span aria-hidden className="text-muted-foreground/60">
              ·
            </span>
            <Typography variant="p-xs" className="text-muted-foreground">
              {labels.lastActiveLabel}
            </Typography>
          </div>
        ) : (
          <Typography variant="p-xs" className="text-muted-foreground">
            {labels.lastActiveLabel}
          </Typography>
        )}
      </CardContent>

      {canAssign ? (
        <CardFooter className="mt-auto flex-col items-stretch gap-1 px-4">
          <Button type="button" className="w-full" disabled={isBlocked} onClick={() => onAssign(client.clientUserId)}>
            {labels.assignLabel}
          </Button>
          {isBlocked && labels.blockedHint ? (
            <Typography variant="p-xs" className="text-muted-foreground text-center">
              {labels.blockedHint}
            </Typography>
          ) : null}
        </CardFooter>
      ) : null}
    </Card>
  );
};
