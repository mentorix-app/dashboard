import { type FC } from 'react';

import { Button } from '@/src/shared/ui';
import { AppleIcon } from './AppleIcon';
import { APPLE_SIGN_IN_START_PATH } from './AppleSignIn.constants';

type AppleSignInProps = {
  label: string;
};

/** A plain link: the browser leaves for Apple, which later posts back to the Return URL. */
export const AppleSignIn: FC<AppleSignInProps> = ({ label }) => (
  <Button asChild variant="outline" size="lg" className="w-full">
    <a href={APPLE_SIGN_IN_START_PATH}>
      <AppleIcon className="size-5" />
      {label}
    </a>
  </Button>
);
