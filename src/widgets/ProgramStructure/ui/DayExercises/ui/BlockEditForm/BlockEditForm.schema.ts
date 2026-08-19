import { z } from 'zod';

import { GROUP_BLOCK_TYPES } from '@/src/entities/program/model/structure';

export const blockEditSchema = z.object({
  blockType: z.enum(GROUP_BLOCK_TYPES),
  instruction: z.string().trim(),
});
