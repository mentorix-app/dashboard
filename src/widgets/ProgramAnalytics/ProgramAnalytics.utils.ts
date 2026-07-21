import type { AnalyticsProgramStatus, ProgramAnalyticsClient } from '@/src/entities/analytics';
import { ProgramStatus } from '@/src/entities/program/model/types';

/** Analytics statuses map 1:1 to the program status enum. */
const STATUS_TO_ENUM: Record<AnalyticsProgramStatus, ProgramStatus> = {
  draft: ProgramStatus.Draft,
  published: ProgramStatus.Published,
  archived: ProgramStatus.Archived,
};

export const toProgramStatusEnum = (status: AnalyticsProgramStatus): ProgramStatus => STATUS_TO_ENUM[status];

/** Count of active assignees whose frozen version is behind the latest. */
export const countBehindLatest = (clients: ProgramAnalyticsClient[]): number =>
  clients.reduce((count, client) => (client.isBehindLatest ? count + 1 : count), 0);
