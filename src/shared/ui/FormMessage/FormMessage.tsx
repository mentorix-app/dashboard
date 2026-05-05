import { type FC } from 'react';

import { cn } from '@/src/shared/lib/styles';

export type FormMessageProps = {
  id: string;
  message: string | undefined;
  className?: string;
};

export const FormMessage: FC<FormMessageProps> = ({ id, message, className }) => {
  if (!message) {
    return null;
  }

  return (
    <p id={id} role="alert" aria-live="polite" className={cn('text-destructive text-sm font-medium', className)}>
      {message}
    </p>
  );
};
