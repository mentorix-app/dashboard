'use client';

import { useState } from 'react';

import type { ProgramDayBlock } from '@/src/entities/program';

type UseBlockCopyParams = {
  blocks: ProgramDayBlock[];
  /** Resolves once in-flight updates of these exercise rows have settled. */
  waitForPendingUpdates: (itemIds: string[]) => Promise<void>;
  /** Performs the copy and its toasts; resolves to whether it succeeded. */
  copyBlock: (blockId: string, targetDayId: string, successMessage: string) => Promise<boolean>;
};

/**
 * Open state of the day's copy-to-day dialog. The block id outlives the open
 * flag so the dialog keeps its content while it animates out. Before copying,
 * pending row edits of the block are awaited so the copy carries them.
 */
export const useBlockCopy = ({ blocks, waitForPendingUpdates, copyBlock }: UseBlockCopyParams) => {
  const [copyBlockId, setCopyBlockId] = useState<string | null>(null);
  const [isCopyOpen, setCopyOpen] = useState(false);

  const handleOpenCopy = (blockId: string) => {
    setCopyBlockId(blockId);
    setCopyOpen(true);
  };

  const handleCopyBlock = async (blockId: string, targetDayId: string, successMessage: string) => {
    const source = blocks.find((block) => block.id === blockId);
    await waitForPendingUpdates(source?.exercises.map((exercise) => exercise.id) ?? []);
    return copyBlock(blockId, targetDayId, successMessage);
  };

  return {
    copyBlock: blocks.find((block) => block.id === copyBlockId) ?? null,
    isCopyOpen,
    onOpenCopy: handleOpenCopy,
    onCopyOpenChange: setCopyOpen,
    onCopyBlock: handleCopyBlock,
  };
};
