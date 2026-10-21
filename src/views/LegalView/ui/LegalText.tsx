import { type FC } from 'react';

import { SUPPORT_MAILTO } from '@/src/shared/lib';
import { splitAroundEmail } from '../LegalView.utils';

type LegalTextProps = {
  text: string;
};

/** A line of a legal text; the support email in it becomes a mail link. */
export const LegalText: FC<LegalTextProps> = ({ text }) => (
  <>
    {splitAroundEmail(text).map((part, index) =>
      part.kind === 'email' ? (
        <a key={index} href={SUPPORT_MAILTO} className="text-primary underline underline-offset-4">
          {part.value}
        </a>
      ) : (
        part.value
      )
    )}
  </>
);
