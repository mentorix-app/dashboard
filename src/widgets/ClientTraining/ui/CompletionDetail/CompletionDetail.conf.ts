'use client';

import { useLocale } from '@/i18n';
import type { ClientCompletionItem, CompletionComment } from '@/src/entities/analytics';
import { formatDate } from '@/src/shared/lib';

import { pickText } from '../../ClientTraining.utils';

export type CompletionDetailModel = {
  programName: string;
  hasResult: boolean;
  athleteTime: string;
  /** The trainer's reply, or null when none exists yet. */
  comment: CompletionComment | null;
  /** Formatted time of the trainer reply; empty when there is no comment. */
  trainerTime: string;
};

export const useCompletionDetailConfig = (completion: ClientCompletionItem | null): CompletionDetailModel | null => {
  const locale = useLocale();

  if (!completion) return null;

  const comment = completion.comments[0] ?? null;

  return {
    programName: pickText(locale, completion.programName, completion.programNameRu),
    hasResult: completion.resultText.trim().length > 0,
    athleteTime: formatDate(completion.completedAt, locale, 'dateTime'),
    comment,
    trainerTime: comment ? formatDate(comment.createdAt, locale, 'dateTime') : '',
  };
};
