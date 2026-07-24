'use client';

import { Loader2, Send } from 'lucide-react';

import {
  Button,
  ChatMessage,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Textarea,
} from '@/src/shared/ui';

import { useCompletionFeedbackDialogConfig } from './CompletionFeedbackDialog.conf';
import type { CompletionFeedbackDialogProps } from './CompletionFeedbackDialog.types';

/**
 * Modal for reviewing a client's workout result and sending a single trainer
 * reply. Shared by the Weekly Results card and table views.
 */
export const CompletionFeedbackDialog = (props: CompletionFeedbackDialogProps) => {
  const {
    t,
    open,
    onOpenChange,
    target,
    comments,
    canReply,
    text,
    setText,
    maxLength,
    isPending,
    canSubmit,
    handleSubmit,
  } = useCompletionFeedbackDialogConfig(props);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col gap-4">
        <DialogHeader>
          <DialogTitle>{target ? t('feedback.title', { name: target.displayName }) : ''}</DialogTitle>
          <DialogDescription>{target ? t('feedback.subtitle', { day: target.dayNumber }) : ''}</DialogDescription>
        </DialogHeader>

        {target ? (
          <div className="flex max-h-[50vh] flex-col gap-2 overflow-y-auto">
            <ChatMessage timestamp={target.completedAtLabel ?? undefined} muted={!target.resultText}>
              {target.resultText || t('cell.noText')}
            </ChatMessage>
            {comments.map((comment) => (
              <ChatMessage key={comment.id} variant="outgoing" timestamp={comment.createdAtLabel}>
                {comment.text}
              </ChatMessage>
            ))}
          </div>
        ) : null}

        {canReply ? (
          <form
            className="flex items-end gap-2 border-t pt-4"
            onSubmit={(event) => {
              event.preventDefault();
              handleSubmit();
            }}
          >
            <Textarea
              rows={2}
              maxLength={maxLength}
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder={t('feedback.placeholder')}
              aria-label={t('feedback.placeholder')}
              className="max-h-40 min-h-16 flex-1 resize-y"
            />
            <Button
              type="submit"
              size="icon"
              disabled={!canSubmit}
              aria-label={t('feedback.send')}
              aria-busy={isPending}
            >
              {isPending ? <Loader2 className="animate-spin" aria-hidden /> : <Send aria-hidden />}
            </Button>
          </form>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};
