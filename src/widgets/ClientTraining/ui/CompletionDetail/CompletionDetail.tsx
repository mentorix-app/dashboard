'use client';

import { type FC } from 'react';
import { ChevronDown } from 'lucide-react';

import { useTranslations } from '@/i18n';
import type { ClientCompletionItem } from '@/src/entities/analytics';
import { Badge, Button, Card, ChatMessage, Typography } from '@/src/shared/ui';

import { useCompletionDetailConfig } from './CompletionDetail.conf';
import { CompletionReplyForm } from './CompletionReplyForm';

type CompletionDetailProps = {
  clientUserId: string;
  completion: ClientCompletionItem | null;
  /** Opens the history picker; on mobile the header acts as the trigger. */
  onOpenHistory?: () => void;
};

export const CompletionDetail: FC<CompletionDetailProps> = ({ clientUserId, completion, onOpenHistory }) => {
  const t = useTranslations('ClientProfile');
  const model = useCompletionDetailConfig(completion);

  if (!completion || !model) {
    return (
      <Card className="text-muted-foreground flex min-h-64 flex-col items-center justify-center gap-3 p-6 text-center text-sm">
        <span>{t('detail.emptySelection')}</span>
        {onOpenHistory ? (
          <Button variant="outline" size="sm" onClick={onOpenHistory} className="xl:hidden">
            {t('history.open')}
          </Button>
        ) : null}
      </Card>
    );
  }

  return (
    <Card className="flex flex-col gap-4 p-6">
      {/* Mobile: the header is a button that opens the history picker. */}
      <button
        type="button"
        onClick={onOpenHistory}
        aria-label={t('history.open')}
        className="hover:bg-muted/50 -m-2 flex items-center justify-between gap-2 rounded-md border-b p-2 pb-4 text-left transition-colors xl:hidden"
      >
        <div className="flex min-w-0 flex-col gap-0.5">
          <span className="flex items-center gap-2">
            <Typography variant="h2">
              {t('detail.weekDay', { week: completion.weekNumber, day: completion.dayNumber })}
            </Typography>
            {completion.isCurrentCycle ? (
              <Badge variant="secondary" size="sm">
                {t('detail.currentCycle')}
              </Badge>
            ) : null}
          </span>
          <span className="text-muted-foreground truncate text-xs">{model.programName}</span>
        </div>
        <ChevronDown className="text-muted-foreground size-5 shrink-0" aria-hidden />
      </button>

      {/* Desktop: static header (history lives in the sidebar). */}
      <header className="hidden flex-wrap items-center justify-between gap-2 border-b pb-4 xl:flex">
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
