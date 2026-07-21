'use client';

import { useLocale } from '@/i18n';
import type { ClientCompletionItem } from '@/src/entities/client';
import { formatDate } from '@/src/shared/lib';

import { pickText } from '../../ClientTraining.utils';

// Mock: pretend the trainer replied about an hour after the athlete logged the
// result, until a real trainer-review backend exists.
const TRAINER_REPLY_OFFSET_MS = 60 * 60 * 1000;

export type CompletionDetailModel = {
  programName: string;
  hasResult: boolean;
  athleteTime: string;
  trainerTime: string;
};

export const useCompletionDetailConfig = (completion: ClientCompletionItem | null): CompletionDetailModel | null => {
  const locale = useLocale();

  if (!completion) return null;

  const trainerRepliedAt = new Date(new Date(completion.completedAt).getTime() + TRAINER_REPLY_OFFSET_MS);

  return {
    programName: pickText(locale, completion.programName, completion.programNameRu),
    hasResult: completion.resultText.trim().length > 0,
    athleteTime: formatDate(completion.completedAt, locale, 'dateTime'),
    trainerTime: formatDate(trainerRepliedAt, locale, 'dateTime'),
  };
};
