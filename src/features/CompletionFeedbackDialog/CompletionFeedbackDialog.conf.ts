'use client';

import { useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { useTranslations } from '@/i18n';
import { useCreateCompletionComment } from '@/src/entities/analytics';
import { queryKeys } from '@/src/shared/api';
import { useToast } from '@/src/shared/hooks';

import type { CompletionFeedbackDialogProps } from './CompletionFeedbackDialog.types';

/** Matches the backend's 1–2000 character bound for a completion comment. */
const MAX_LENGTH = 2000;
const COMMENT_EXISTS_STATUS = 409;

/**
 * Owns the reply mutation, transient input state, and cache refresh for the
 * feedback dialog. A completion accepts one reply, so the form is hidden once a
 * comment exists (including one just sent). On success the week-results grid is
 * invalidated so the new reply appears in both the card and table views.
 */
export const useCompletionFeedbackDialogConfig = ({
  programId,
  weekNumber,
  target,
  onOpenChange,
}: CompletionFeedbackDialogProps) => {
  const t = useTranslations('ProgramWeekResults');
  const queryClient = useQueryClient();
  const { showErrorToast, showSuccessToast } = useToast();
  const { mutate, isPending } = useCreateCompletionComment();

  const [text, setText] = useState('');
  const [activeCompletionId, setActiveCompletionId] = useState(target?.completionId ?? null);

  // Clear the input when a different completion is opened (render-phase reset).
  const completionId = target?.completionId ?? null;
  if (completionId !== activeCompletionId) {
    setActiveCompletionId(completionId);
    setText('');
  }

  const comments = target?.comments ?? [];
  const canReply = Boolean(target?.completionId) && comments.length === 0;

  const trimmed = text.trim();
  const canSubmit = canReply && trimmed.length > 0 && trimmed.length <= MAX_LENGTH && !isPending;

  const handleSubmit = () => {
    if (!canSubmit || !target?.completionId) return;

    mutate(
      { clientUserId: target.clientUserId, completionId: target.completionId, text: trimmed },
      {
        onSuccess: () => {
          onOpenChange(false);
          setText('');
          showSuccessToast(t('feedback.sent'));
          queryClient.invalidateQueries({ queryKey: queryKeys.analytics.weekResults(programId, weekNumber) });
        },
        onError: (error) =>
          showErrorToast(error.status === COMMENT_EXISTS_STATUS ? t('feedback.alreadyExists') : t('feedback.error')),
      }
    );
  };

  return {
    t,
    open: target !== null,
    onOpenChange,
    target,
    comments,
    canReply,
    text,
    setText,
    maxLength: MAX_LENGTH,
    isPending,
    canSubmit,
    handleSubmit,
  };
};
