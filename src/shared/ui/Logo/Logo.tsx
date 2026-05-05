import { type FC } from 'react';

import { cn } from '@/src/shared/lib/styles';

export type LogoProps = {
  showWordmark?: boolean;
  className?: string;
  ariaLabel?: string;
};

export const Logo: FC<LogoProps> = ({ showWordmark = true, className, ariaLabel = 'Mentorix' }) => (
  <span
    role="img"
    aria-label={ariaLabel}
    className={cn('inline-flex items-center gap-2 select-none', className)}
    data-slot="logo"
  >
    <svg viewBox="0 0 24 24" aria-hidden className="text-primary size-6" fill="none">
      <rect x="2" y="2" width="20" height="20" rx="6" className="fill-primary/10" />
      <path d="M6 17V8l4 5 4-5v9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18 17V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
    {showWordmark ? <span className="text-foreground text-base font-semibold tracking-tight">Mentorix</span> : null}
  </span>
);
