import type { AnalyticsProgramStatus } from '@/src/entities/analytics';
import { ProgramStatus } from '@/src/entities/program/model/types';

/** Analytics statuses map 1:1 to the program status enum. */
const STATUS_TO_ENUM: Record<AnalyticsProgramStatus, ProgramStatus> = {
  draft: ProgramStatus.Draft,
  published: ProgramStatus.Published,
  archived: ProgramStatus.Archived,
};

export const toProgramStatusEnum = (status: AnalyticsProgramStatus): ProgramStatus => STATUS_TO_ENUM[status];
