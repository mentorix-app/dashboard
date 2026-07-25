'use client';

import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';

import { Link, useTranslations } from '@/i18n';
import { cn } from '@/src/shared/lib/styles';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  Card,
  Input,
  Progress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Typography,
} from '@/src/shared/ui';

import type { ActiveClientsSortField, ProgramAnalyticsClientVM } from '../ProgramAnalytics.types';
import { useActiveClientsView } from '../hooks/useActiveClientsView';

type ProgramAnalyticsClientsProps = {
  clients: ProgramAnalyticsClientVM[];
};

export const ProgramAnalyticsClients = ({ clients }: ProgramAnalyticsClientsProps) => {
  const t = useTranslations('ProgramAnalytics');
  const { search, setSearch, sortField, sortOrder, handleSort, visibleClients } = useActiveClientsView(clients);

  const renderSortIcon = (field: ActiveClientsSortField) => {
    if (sortField !== field) return <ArrowUpDown aria-hidden className="text-muted-foreground size-3.5" />;
    const Icon = sortOrder === 'desc' ? ArrowDown : ArrowUp;
    return <Icon aria-hidden className="text-foreground size-3.5" />;
  };

  if (clients.length === 0) {
    return (
      <Card className="flex flex-col gap-4 p-6">
        <Typography variant="h3">{t('clients.heading')}</Typography>
        <Typography variant="p-sm" className="text-muted-foreground">
          {t('clients.empty')}
        </Typography>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col gap-4 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Typography variant="h3">{t('clients.heading')}</Typography>
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder={t('clients.searchPlaceholder')}
          aria-label={t('clients.searchPlaceholder')}
          className="sm:max-w-xs"
        />
      </div>

      {visibleClients.length === 0 ? (
        <Typography variant="p-sm" className="text-muted-foreground">
          {t('clients.noMatches')}
        </Typography>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-56">{t('clients.client')}</TableHead>
                <TableHead className="whitespace-nowrap">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="-ml-2 h-8 justify-start px-2 font-medium"
                    onClick={() => handleSort('lastCompleted')}
                    aria-label={t('clients.sortBy', { column: t('clients.lastCompleted') })}
                  >
                    {t('clients.lastCompleted')}
                    {renderSortIcon('lastCompleted')}
                  </Button>
                </TableHead>
                <TableHead className="min-w-40">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="-ml-2 h-8 justify-start px-2 font-medium"
                    onClick={() => handleSort('progress')}
                    aria-label={t('clients.sortBy', { column: t('clients.progress') })}
                  >
                    {t('clients.progress')}
                    {renderSortIcon('progress')}
                  </Button>
                </TableHead>
                <TableHead className="whitespace-nowrap">{t('clients.completedDays')}</TableHead>
                <TableHead className="whitespace-nowrap">{t('clients.version')}</TableHead>
                <TableHead className="whitespace-nowrap">{t('clients.assigned')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visibleClients.map((client) => (
                <TableRow key={client.clientUserId}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="size-9">
                        {client.avatarSrc ? <AvatarImage src={client.avatarSrc} alt={client.avatarAlt} /> : null}
                        <AvatarFallback className="text-xs">{client.initials}</AvatarFallback>
                      </Avatar>
                      <Link
                        href={client.href}
                        aria-label={t('clients.openClient', { name: client.displayName })}
                        className="text-foreground font-medium underline-offset-4 hover:underline"
                      >
                        {client.displayName}
                      </Link>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground whitespace-nowrap">{client.lastCompletedLabel}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={client.completionPercent} className="w-28" aria-hidden />
                      <span className="text-muted-foreground text-sm tabular-nums">
                        {t('percent', { value: client.completionPercent })}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap tabular-nums">{client.daysLabel}</TableCell>
                  <TableCell className="whitespace-nowrap">
                    <Badge
                      variant="outline"
                      size="sm"
                      className={cn(
                        'border-transparent',
                        client.isBehindLatest
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                      )}
                    >
                      {client.versionLabel}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground whitespace-nowrap">{client.assignedLabel}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </Card>
  );
};
