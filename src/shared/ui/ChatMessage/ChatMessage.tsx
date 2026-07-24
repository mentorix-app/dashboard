'use client';

import { type ReactNode } from 'react';

import { cn } from '@/src/shared/lib/styles';

type ChatMessageVariant = 'incoming' | 'outgoing';

type ChatMessageProps = {
  /** `incoming` renders a left, neutral bubble; `outgoing` a right, accent bubble. */
  variant?: ChatMessageVariant;
  /** Optional caption rendered beneath the bubble (e.g. a timestamp). */
  timestamp?: string;
  /** Renders the bubble content muted and italic — used for placeholder text. */
  muted?: boolean;
  className?: string;
  children: ReactNode;
};

/** Chat-style message bubble used for athlete results and trainer replies. */
export const ChatMessage = ({
  variant = 'incoming',
  timestamp,
  muted = false,
  className,
  children,
}: ChatMessageProps) => {
  const isOutgoing = variant === 'outgoing';

  return (
    <div className={cn('flex flex-col gap-1', isOutgoing ? 'items-end' : 'items-start', className)}>
      <div
        className={cn(
          'max-w-[85%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap',
          isOutgoing ? 'bg-primary text-primary-foreground rounded-br-sm shadow-sm' : 'bg-muted rounded-bl-sm',
          muted && !isOutgoing && 'text-muted-foreground italic'
        )}
      >
        {children}
      </div>
      {timestamp ? <span className="text-muted-foreground px-1 text-xs">{timestamp}</span> : null}
    </div>
  );
};
