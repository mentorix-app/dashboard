import Image from 'next/image';
import { type FC } from 'react';

import { cn } from '@/src/shared/lib/styles';

export type LogoProps = {
  /** When true, render the full wordmark logo; otherwise render the compact mark only. */
  showWordmark?: boolean;
  className?: string;
  ariaLabel?: string;
};

export const Logo: FC<LogoProps> = ({ showWordmark = true, className, ariaLabel = 'Mentorix' }) => {
  if (!showWordmark) {
    return (
      <Image
        src="/mini-logo.svg"
        alt={ariaLabel}
        width={40}
        height={40}
        priority
        unoptimized
        data-slot="logo"
        className={cn('size-7 shrink-0 select-none', className)}
      />
    );
  }

  return (
    <span
      role="img"
      aria-label={ariaLabel}
      data-slot="logo"
      className={cn('inline-flex items-center select-none', className)}
    >
      <Image
        src="/full-logo.svg"
        alt=""
        aria-hidden
        width={460}
        height={108}
        priority
        unoptimized
        className="h-10 w-auto dark:hidden"
      />
      <Image
        src="/full-logo-dark.svg"
        alt=""
        aria-hidden
        width={460}
        height={108}
        priority
        unoptimized
        className="hidden h-10 w-auto dark:block"
      />
    </span>
  );
};
