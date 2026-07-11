import { Loader2, RefreshCw } from 'lucide-react';

import { cn } from '@/src/shared/lib/styles';
import { Button, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/src/shared/ui';

type ClientSyncButtonProps = {
  /** Tooltip and accessible label. */
  label: string;
  isSyncing: boolean;
  onSync: () => void;
  className?: string;
};

/** Icon button that syncs a single client to the program's latest version. */
export const ClientSyncButton = ({ label, isSyncing, onSync, className }: ClientSyncButtonProps) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className={cn('text-primary hover:text-primary bg-primary/10 hover:bg-primary/20 relative', className)}
          disabled={isSyncing}
          onClick={onSync}
          aria-label={label}
        >
          {isSyncing ? (
            <Loader2 className="animate-spin" aria-hidden />
          ) : (
            <>
              <RefreshCw className="transition-transform duration-300 group-hover/button:rotate-180" aria-hidden />
              <span className="absolute -top-0.5 -right-0.5 flex size-2.5">
                <span className="bg-primary absolute inline-flex size-full animate-ping rounded-full opacity-75" />
                <span className="bg-primary relative inline-flex size-2.5 rounded-full" />
              </span>
            </>
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  </TooltipProvider>
);
