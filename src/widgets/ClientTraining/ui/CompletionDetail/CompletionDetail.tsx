'use client';

import { type FC } from 'react';

import { useTranslations } from '@/i18n';
import type { ClientCompletionItem } from '@/src/entities/analytics';
import { Badge, Card, ChatMessage, Typography } from '@/src/shared/ui';

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
        <ChatMessage timestamp={model.athleteTime} muted={!model.hasResult}>
          {model.hasResult ? completion.resultText : t('detail.noResultText')}
        </ChatMessage>

        {model.comment ? (
          <ChatMessage variant="outgoing" timestamp={model.trainerTime}>
            {model.comment.text}
          </ChatMessage>
        ) : null}
      </div>

      {/* One reply per completion: show the input only until a reply exists. */}
      {model.comment ? null : <CompletionReplyForm clientUserId={clientUserId} completionId={completion.id} />}
    </Card>
  );
};
