'use client';

import { Layers, X } from 'lucide-react';

import { useTranslations } from '@/i18n';
import { Button, Typography } from '@/src/shared/ui';

type MergeBarProps = {
  /** Number of blocks currently selected (always >= 2 when shown). */
  count: number;
  onMerge: () => void;
  onClear: () => void;
};

/** Action bar shown while several blocks are selected for grouping. */
export const MergeBar = ({ count, onMerge, onClear }: MergeBarProps) => {
  const t = useTranslations('ProgramWizard');

  return (
    <div className="bg-muted/50 flex items-center justify-between gap-2 rounded-md border px-3 py-2">
      <Typography variant="p-sm" className="font-medium">
        {t('structure.blocks.selectionCount', { count })}
      </Typography>
      <div className="flex items-center gap-2">
        <Button type="button" variant="ghost" size="sm" onClick={onClear}>
          <X className="size-4" />
          {t('structure.blocks.clearSelection')}
        </Button>
        <Button type="button" size="sm" onClick={onMerge}>
          <Layers className="size-4" />
          {t('structure.blocks.merge')}
        </Button>
      </div>
    </div>
  );
};
