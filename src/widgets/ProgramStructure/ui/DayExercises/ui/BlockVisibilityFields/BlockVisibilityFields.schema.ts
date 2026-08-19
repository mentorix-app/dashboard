import { z } from 'zod';

export const blockVisibilitySchema = z
  .object({
    mode: z.enum(['shared', 'restricted']),
    clientUserIds: z.array(z.string()),
  })
  .superRefine((value, context) => {
    if (value.mode === 'restricted' && value.clientUserIds.length === 0) {
      context.addIssue({
        code: 'custom',
        path: ['clientUserIds'],
        message: 'selectClient',
      });
    }
  });

export type BlockVisibilityValue = z.infer<typeof blockVisibilitySchema>;
