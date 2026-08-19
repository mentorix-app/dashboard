'use client';

import { EyeOff } from 'lucide-react';

import { useTranslations } from '@/i18n';
import { Button, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/src/shared/ui';

type BlockVisibilityIndicatorProps = {
  clientCount: number;
  onClick?: () => void;
};

export const BlockVisibilityIndicator = ({ clientCount, onClick }: BlockVisibilityIndicatorProps) => {
  const t = useTranslations('ProgramWizard');
  const label = t('structure.blocks.visibility.indicator', { count: clientCount });

  if (clientCount === 0) return null;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {onClick ? (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="size-5 rounded-sm p-0 text-amber-600 hover:bg-amber-500/10 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300"
              onClick={onClick}
              aria-label={label}
            >
              <EyeOff className="size-3.5" />
            </Button>
          ) : (
            <span
              className="flex size-5 items-center justify-center text-amber-600 dark:text-amber-400"
              role="img"
              aria-label={label}
            >
              <EyeOff className="size-3.5" />
            </span>
          )}
        </TooltipTrigger>
        <TooltipContent className="max-w-64 text-center">{label}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
