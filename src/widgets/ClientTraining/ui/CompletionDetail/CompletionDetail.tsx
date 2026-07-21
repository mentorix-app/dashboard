'use client';

import { type FC } from 'react';
import { Send } from 'lucide-react';

import { useTranslations } from '@/i18n';
import type { ClientCompletionItem } from '@/src/entities/client';
import { Badge, Button, Card, Textarea, Typography } from '@/src/shared/ui';

import { useCompletionDetailConfig } from './CompletionDetail.conf';

type CompletionDetailProps = {
  completion: ClientCompletionItem | null;
};

export const CompletionDetail: FC<CompletionDetailProps> = ({ completion }) => {
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

      {/* Conversation: athlete result incoming (left), trainer comment outgoing (right). */}
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

        <div className="flex flex-col items-end gap-1">
          <div className="bg-primary text-primary-foreground max-w-[85%] rounded-2xl rounded-br-sm px-4 py-2.5 shadow-sm">
            <p className="text-sm whitespace-pre-wrap">{t('review.mockComment')}</p>
          </div>
          <span className="text-muted-foreground px-1 text-xs">{model.trainerTime}</span>
        </div>
      </div>

      {/* Mock trainer input — not wired to a backend yet. */}
      <form className="mt-1 flex items-end gap-2 border-t pt-4" onSubmit={(event) => event.preventDefault()}>
        <Textarea
          rows={2}
          placeholder={t('review.inputPlaceholder')}
          aria-label={t('review.inputPlaceholder')}
          className="max-h-40 min-h-16 flex-1 resize-y"
        />
        <Button type="submit" size="icon" aria-label={t('review.send')}>
          <Send aria-hidden />
        </Button>
      </form>
    </Card>
  );
};
