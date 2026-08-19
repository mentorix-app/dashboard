import { blockVisibilitySchema } from '../BlockVisibilityFields.schema';

describe('blockVisibilitySchema', () => {
  it('accepts shared visibility without clients', () => {
    expect(blockVisibilitySchema.safeParse({ mode: 'shared', clientUserIds: [] }).success).toBe(true);
  });

  it('requires at least one client when visibility is restricted', () => {
    const result = blockVisibilitySchema.safeParse({ mode: 'restricted', clientUserIds: [] });

    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues[0]?.message).toBe('selectClient');
  });

  it('accepts restricted visibility with selected clients', () => {
    expect(blockVisibilitySchema.safeParse({ mode: 'restricted', clientUserIds: ['client-1'] }).success).toBe(true);
  });
});
