import { type FC } from 'react';
import { CheckCircle2, MessageCircle } from 'lucide-react';
import { useLocale } from 'next-intl';

import { useTranslations } from '@/i18n';
import type { ClientCompletionItem } from '@/src/entities/analytics';
import { formatDate } from '@/src/shared/lib';
import { Card, ChatMessage, Typography } from '@/src/shared/ui';

import { pickLocalizedName } from '../ClientStatsView.utils';

type ClientStatsCompletionsProps = {
  completions: ClientCompletionItem[];
};

export const ClientStatsCompletions: FC<ClientStatsCompletionsProps> = ({ completions }) => {
  const locale = useLocale();
  const t = useTranslations('ClientStatsPage');

  return (
    <section aria-labelledby="history-heading" className="space-y-3 pb-4">
      <div className="flex items-end justify-between gap-3">
        <Typography id="history-heading" variant="h2">
          {t('history.heading')}
        </Typography>
        <span className="text-muted-foreground text-sm tabular-nums">
          {t('history.count', { count: completions.length })}
        </span>
      </div>
      {completions.length === 0 ? (
        <Card className="items-center gap-3 p-8 text-center shadow-none">
          <CheckCircle2 aria-hidden className="text-muted-foreground size-7" />
          <p className="text-muted-foreground text-sm">{t('history.empty')}</p>
        </Card>
      ) : (
        <ol className="space-y-3">
          {completions.map((completion) => (
            <li key={completion.id}>
              <Card className="gap-4 p-4 shadow-none sm:p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Typography variant="h3">
                      {t('history.weekDay', { week: completion.weekNumber, day: completion.dayNumber })}
                    </Typography>
                    <p className="text-muted-foreground mt-1 truncate text-sm">
                      {pickLocalizedName(locale, completion.programName, completion.programNameRu)}
                    </p>
                  </div>
                </div>
                <ChatMessage
                  timestamp={formatDate(completion.completedAt, locale, 'dateTime')}
                  muted={!completion.resultText.trim()}
                >
                  {completion.resultText.trim() || t('history.noResult')}
                </ChatMessage>
                {completion.comments.map((comment) => (
                  <div key={comment.id}>
                    <p className="text-muted-foreground mb-1 flex items-center justify-end gap-1 text-xs font-medium">
                      <MessageCircle aria-hidden className="size-3.5" />
                      {t('history.trainerReply')}
                    </p>
                    <ChatMessage variant="outgoing" timestamp={formatDate(comment.createdAt, locale, 'dateTime')}>
                      {comment.text}
                    </ChatMessage>
                  </div>
                ))}
              </Card>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
};
