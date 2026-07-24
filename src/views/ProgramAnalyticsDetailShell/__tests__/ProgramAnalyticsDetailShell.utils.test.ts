import { ProgramStatus } from '@/src/entities/program/model/types';

import { toProgramStatusEnum } from '../ProgramAnalyticsDetailShell.utils';

describe('ProgramAnalyticsDetailShell.utils', () => {
  describe('toProgramStatusEnum', () => {
    it('maps analytics statuses to the program status enum', () => {
      expect(toProgramStatusEnum('draft')).toBe(ProgramStatus.Draft);
      expect(toProgramStatusEnum('published')).toBe(ProgramStatus.Published);
      expect(toProgramStatusEnum('archived')).toBe(ProgramStatus.Archived);
    });
  });
});
