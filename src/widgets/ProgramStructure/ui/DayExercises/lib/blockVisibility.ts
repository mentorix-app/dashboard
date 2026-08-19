import type { ProgramDayBlock } from '@/src/entities/program';

const getClientVisibilityKey = (block: ProgramDayBlock): string => [...block.clientUserIds].sort().join('|');

export const getLastSharedBlockId = (blocks: ProgramDayBlock[]): string | null => {
  const sharedBlocks = blocks.filter((block) => block.clientUserIds.length === 0);
  return sharedBlocks.length === 1 ? (sharedBlocks[0]?.id ?? null) : null;
};

export const haveMatchingBlockVisibility = (blocks: ProgramDayBlock[]): boolean =>
  new Set(blocks.map(getClientVisibilityKey)).size <= 1;
