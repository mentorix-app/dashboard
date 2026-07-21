import type { ProgramAnalyticsClient } from '@/src/entities/analytics';
import { ProgramStatus } from '@/src/entities/program/model/types';

import { countBehindLatest, toProgramStatusEnum } from '../ProgramAnalytics.utils';

const buildClient = (isBehindLatest: boolean, id: string): ProgramAnalyticsClient => ({
  clientUserId: id,
  displayName: `Client ${id}`,
  avatarUrl: '',
  assignedAt: '2024-01-01T00:00:00Z',
  isBehindLatest,
  completedDays: 0,
  totalTrainingDays: 10,
  completionPercent: 0,
  lastCompletedAt: null,
});

describe('ProgramAnalytics.utils', () => {
  describe('countBehindLatest', () => {
    it('returns 0 for an empty list', () => {
      expect(countBehindLatest([])).toBe(0);
    });

    it('counts only clients behind the latest version', () => {
      const clients = [buildClient(true, 'a'), buildClient(false, 'b'), buildClient(true, 'c')];
      expect(countBehindLatest(clients)).toBe(2);
    });
  });

  describe('toProgramStatusEnum', () => {
    it('maps analytics statuses to the program status enum', () => {
      expect(toProgramStatusEnum('draft')).toBe(ProgramStatus.Draft);
      expect(toProgramStatusEnum('published')).toBe(ProgramStatus.Published);
      expect(toProgramStatusEnum('archived')).toBe(ProgramStatus.Archived);
    });
  });
});
