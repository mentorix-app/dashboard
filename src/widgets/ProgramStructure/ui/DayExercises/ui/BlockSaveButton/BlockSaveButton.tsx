'use client';

import { Loader2 } from 'lucide-react';

import { Button, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/src/shared/ui';

type BlockSaveButtonProps = {
  label: string;
  isPending: boolean;
  hint?: string;
  onClick: () => void;
};

const SaveButton = ({ label, isPending, onClick }: Omit<BlockSaveButtonProps, 'hint'>) => (
  <Button type="button" onClick={onClick} disabled={isPending}>
    {isPending ? <Loader2 className="size-4 animate-spin" /> : null}
    {label}
  </Button>
);

export const BlockSaveButton = ({ label, isPending, hint, onClick }: BlockSaveButtonProps) => {
  if (!hint) return <SaveButton label={label} isPending={isPending} onClick={onClick} />;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex cursor-not-allowed" tabIndex={0}>
            <Button type="button" disabled className="pointer-events-none">
              {label}
            </Button>
          </span>
        </TooltipTrigger>
        <TooltipContent className="max-w-64 text-center">{hint}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
