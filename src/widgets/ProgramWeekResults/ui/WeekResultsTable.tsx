'use client';

import { Link, useTranslations } from '@/i18n';
import { cn } from '@/src/shared/lib/styles';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Typography,
} from '@/src/shared/ui';

import type { WeekResultsCellVM, WeekResultsClientVM } from '../ProgramWeekResults.types';
import { canReplyToCell } from '../ProgramWeekResults.utils';
import { WeekResultsCell } from './WeekResultsCell';
import { WeekResultsMissingList } from './WeekResultsMissingList';

type WeekResultsTableProps = {
  dayNumbers: number[];
  clients: WeekResultsClientVM[];
  onOpenFeedback: (client: WeekResultsClientVM, cell: WeekResultsCellVM) => void;
};

export const WeekResultsTable = ({ dayNumbers, clients, onOpenFeedback }: WeekResultsTableProps) => {
  const t = useTranslations('ProgramWeekResults');

  const withResults = clients.filter((client) => client.cells.some((cell) => cell.isSubmitted));
  const withoutResults = clients.filter((client) => client.cells.every((cell) => !cell.isSubmitted));

  return (
    <div className="flex flex-col gap-6">
      {withResults.length > 0 && (
        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-56">{t('table.client')}</TableHead>
                {dayNumbers.map((day) => (
                  <TableHead key={day} className="text-center whitespace-nowrap">
                    {t('dayShort', { number: day })}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {withResults.map((client) => (
                <TableRow key={client.clientUserId}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="size-9">
                        <AvatarImage src={client.avatarSrc} alt={client.avatarAlt} />
                        <AvatarFallback>{client.initials}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <Link href={client.href} className="hover:underline">
                          <Typography variant="p-sm" className="truncate font-medium">
                            {client.displayName}
                          </Typography>
                        </Link>
                        <div className="flex items-center gap-2">
                          <Typography variant="p-sm" className="text-muted-foreground text-xs">
                            {client.progressLabel}
                          </Typography>
                          {client.isBehindLatest && (
                            <Badge
                              variant="outline"
                              className={cn('border-amber-500 text-amber-600 dark:text-amber-500')}
                            >
                              {t('client.behind')}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  {client.cells.map((cell) => (
                    <TableCell key={cell.dayNumber} className="text-center">
                      <WeekResultsCell
                        cell={cell}
                        onClick={canReplyToCell(cell) ? () => onOpenFeedback(client, cell) : undefined}
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <WeekResultsMissingList clients={withoutResults} description={t('missing.weekDescription')} />
    </div>
  );
};
