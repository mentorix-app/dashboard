import { blockEditSchema } from '../BlockEditForm.schema';

describe('blockEditSchema', () => {
  it('accepts a group block and trims its instruction', () => {
    expect(blockEditSchema.parse({ blockType: 'complex', instruction: '  Move steadily  ' })).toEqual({
      blockType: 'complex',
      instruction: 'Move steadily',
    });
  });

  it('rejects the single block type', () => {
    expect(blockEditSchema.safeParse({ blockType: 'single', instruction: '' }).success).toBe(false);
  });
});
