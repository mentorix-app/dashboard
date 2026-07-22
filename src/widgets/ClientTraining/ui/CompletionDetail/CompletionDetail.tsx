'use client';

import { type FC } from 'react';

import { useTranslations } from '@/i18n';
import type { ClientCompletionItem } from '@/src/entities/analytics';
import { Badge, Card, Typography } from '@/src/shared/ui';

import { useCompletionDetailConfig } from './CompletionDetail.conf';
import { CompletionReplyForm } from './CompletionReplyForm';

type CompletionDetailProps = {
  clientUserId: string;
  completion: ClientCompletionItem | null;
};

export const CompletionDetail: FC<CompletionDetailProps> = ({ clientUserId, completion }) => {
  const t = useTranslations('ClientProfile');
  const model = useCompletionDetailConfig(completion);

  if (!completion || !model) {
    return (
      <Card className="text-muted-foreground flex min-h-64 items-center justify-center p-6 text-center text-sm">
        {t('detail.emptySelection')}
      </Card>
    );
  }

  return (
    <Card className="flex flex-col gap-4 p-6">
      <header className="flex flex-wrap items-center justify-between gap-2 border-b pb-4">
        <div className="flex flex-col gap-0.5">
          <Typography variant="h2">
            {t('detail.weekDay', { week: completion.weekNumber, day: completion.dayNumber })}
          </Typography>
          <span className="text-muted-foreground text-xs">{model.programName}</span>
        </div>
        {completion.isCurrentCycle ? (
          <Badge variant="secondary" size="sm">
            {t('detail.currentCycle')}
          </Badge>
        ) : null}
      </header>

      {/* Conversation: athlete result incoming (left), trainer reply outgoing (right). */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col items-start gap-1">
          <div className="bg-muted max-w-[85%] rounded-2xl rounded-bl-sm px-4 py-2.5">
            {model.hasResult ? (
              <p className="text-sm whitespace-pre-wrap">{completion.resultText}</p>
            ) : (
              <p className="text-muted-foreground text-sm italic">{t('detail.noResultText')}</p>
            )}
          </div>
          <span className="text-muted-foreground px-1 text-xs">{model.athleteTime}</span>
        </div>

        {model.comment ? (
          <div className="flex flex-col items-end gap-1">
            <div className="bg-primary text-primary-foreground max-w-[85%] rounded-2xl rounded-br-sm px-4 py-2.5 shadow-sm">
              <p className="text-sm whitespace-pre-wrap">{model.comment.text}</p>
            </div>
            <span className="text-muted-foreground px-1 text-xs">{model.trainerTime}</span>
          </div>
        ) : null}
      </div>

      {/* One reply per completion: show the input only until a reply exists. */}
      {model.comment ? null : <CompletionReplyForm clientUserId={clientUserId} completionId={completion.id} />}
    </Card>
  );
};
