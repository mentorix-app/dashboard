'use client';

import { useState } from 'react';
import { Loader2, Send } from 'lucide-react';

import { useTranslations } from '@/i18n';
import { useCreateCompletionComment } from '@/src/entities/analytics';
import { useToast } from '@/src/shared/hooks';
import { Button, Textarea } from '@/src/shared/ui';

/** Matches the backend's 1–2000 character bound for a completion comment. */
const MAX_LENGTH = 2000;
const COMMENT_EXISTS_STATUS = 409;

type CompletionReplyFormProps = {
  clientUserId: string;
  completionId: string;
};

/** Trainer reply input for a workout completion with no comment yet. */
export const CompletionReplyForm = ({ clientUserId, completionId }: CompletionReplyFormProps) => {
  const t = useTranslations('ClientProfile');
  const { showErrorToast } = useToast();
  const { mutate, isPending } = useCreateCompletionComment();

  const [text, setText] = useState('');
  const trimmed = text.trim();
  const canSubmit = trimmed.length > 0 && trimmed.length <= MAX_LENGTH && !isPending;

  const handleSubmit = () => {
    if (!canSubmit) return;

    mutate(
      { clientUserId, completionId, text: trimmed },
      {
        onSuccess: () => setText(''),
        onError: (error) =>
          showErrorToast(error.status === COMMENT_EXISTS_STATUS ? t('review.alreadyExists') : t('review.error')),
      }
    );
  };

  return (
    <form
      className="mt-1 flex items-end gap-2 border-t pt-4"
      onSubmit={(event) => {
        event.preventDefault();
        handleSubmit();
      }}
    >
      <Textarea
        rows={2}
        maxLength={MAX_LENGTH}
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder={t('review.inputPlaceholder')}
        aria-label={t('review.inputPlaceholder')}
        className="max-h-40 min-h-16 flex-1 resize-y"
      />
      <Button type="submit" size="icon" disabled={!canSubmit} aria-label={t('review.send')} aria-busy={isPending}>
        {isPending ? <Loader2 className="animate-spin" aria-hidden /> : <Send aria-hidden />}
      </Button>
    </form>
  );
};
