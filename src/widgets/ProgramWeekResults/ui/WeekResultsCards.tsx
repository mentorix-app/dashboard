'use client';

import { MessageSquarePlus } from 'lucide-react';

import { Link, useTranslations } from '@/i18n';
import { Avatar, AvatarFallback, AvatarImage, Badge, Button, Card, ChatMessage, Typography } from '@/src/shared/ui';

import type { WeekResultsCellVM, WeekResultsClientVM } from '../ProgramWeekResults.types';
import { canReplyToCell } from '../ProgramWeekResults.utils';
import { WeekResultsMissingList } from './WeekResultsMissingList';

type WeekResultsCardsProps = {
  dayNumbers: number[];
  selectedDay: number;
  clients: WeekResultsClientVM[];
  onSelectDay: (day: number) => void;
  onOpenFeedback: (client: WeekResultsClientVM, cell: WeekResultsCellVM) => void;
};

const hasSubmittedDay = (client: WeekResultsClientVM, selectedDay: number): boolean =>
  client.cells.find((cell) => cell.dayNumber === selectedDay)?.isSubmitted ?? false;

export const WeekResultsCards = ({
  dayNumbers,
  selectedDay,
  clients,
  onSelectDay,
  onOpenFeedback,
}: WeekResultsCardsProps) => {
  const t = useTranslations('ProgramWeekResults');

  const submittedClients = clients.filter((client) => hasSubmittedDay(client, selectedDay));
  const missingClients = clients.filter((client) => !hasSubmittedDay(client, selectedDay));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2" role="tablist" aria-label={t('cards.daysLabel')}>
        {dayNumbers.map((day) => (
          <Button
            key={day}
            type="button"
            size="sm"
            role="tab"
            aria-selected={day === selectedDay}
            variant={day === selectedDay ? 'secondary' : 'outline'}
            onClick={() => onSelectDay(day)}
          >
            {t('dayLabel', { number: day })}
          </Button>
        ))}
      </div>

      {submittedClients.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {submittedClients.map((client) => {
            const cell = client.cells.find((item) => item.dayNumber === selectedDay);

            return (
              <Card key={client.clientUserId} className="gap-3 p-4">
                <div className="flex items-center gap-3">
                  <Avatar className="size-9">
                    <AvatarImage src={client.avatarSrc} alt={client.avatarAlt} />
                    <AvatarFallback>{client.initials}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <Link href={client.href} className="hover:underline">
                      <Typography variant="p-sm" className="truncate font-medium">
                        {client.displayName}
                      </Typography>
                    </Link>
                    <Typography variant="p-sm" className="text-muted-foreground text-xs">
                      {client.progressLabel}
                    </Typography>
                  </div>
                  {client.isBehindLatest && (
                    <Badge
                      variant="outline"
                      size="sm"
                      className="border-transparent bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                    >
                      {t('client.behind')}
                    </Badge>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <ChatMessage timestamp={cell?.completedAtLabel ?? undefined} muted={!cell?.resultText}>
                    {cell?.resultText || t('cell.noText')}
                  </ChatMessage>
                  {cell?.comments.map((comment) => (
                    <ChatMessage key={comment.id} variant="outgoing" timestamp={comment.createdAtLabel}>
                      {comment.text}
                    </ChatMessage>
                  ))}
                </div>

                {cell && canReplyToCell(cell) && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="mt-auto self-end"
                    onClick={() => onOpenFeedback(client, cell)}
                  >
                    <MessageSquarePlus aria-hidden />
                    {t('feedback.reply')}
                  </Button>
                )}
              </Card>
            );
          })}
        </div>
      )}

      <WeekResultsMissingList clients={missingClients} description={t('missing.dayDescription')} />
    </div>
  );
};
