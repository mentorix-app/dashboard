import type { ProgramAnalyticsClient } from '@/src/entities/analytics';

/** Count of active assignees whose frozen version is behind the latest. */
export const countBehindLatest = (clients: ProgramAnalyticsClient[]): number =>
  clients.reduce((count, client) => (client.isBehindLatest ? count + 1 : count), 0);
