'use client';

import { Loader2 } from 'lucide-react';
import { useId, type FC } from 'react';

import { useTranslations } from '@/i18n';
import { Button, Checkbox, FormMessage, Label } from '@/src/shared/ui';
import { TERMS_SUMMARY_ITEMS } from '../TrainerOnboarding.constants';
import type { ActivationErrorKey } from '../TrainerOnboarding.types';

type TermsStepProps = {
  accepted: boolean;
  errorKey: ActivationErrorKey | null;
  isActivating: boolean;
  isSigningOut: boolean;
  onAcceptedChange: (accepted: boolean) => void;
  onAccept: () => void;
  onSignOut: () => void;
};

export const TermsStep: FC<TermsStepProps> = ({
  accepted,
  errorKey,
  isActivating,
  isSigningOut,
  onAcceptedChange,
  onAccept,
  onSignOut,
}) => {
  const t = useTranslations('TrainerOnboarding');
  const checkboxId = useId();
  const errorId = useId();

  return (
    <>
      <ul className="text-muted-foreground flex list-disc flex-col gap-2 pl-5 text-sm">
        {TERMS_SUMMARY_ITEMS.map((item) => (
          <li key={item}>{t(`terms.summary.${item}`)}</li>
        ))}
      </ul>
      <div className="mt-5 flex items-start gap-2">
        <Checkbox
          id={checkboxId}
          checked={accepted}
          onCheckedChange={(checked) => onAcceptedChange(checked === true)}
          aria-describedby={errorKey ? errorId : undefined}
        />
        <Label htmlFor={checkboxId} className="leading-snug">
          {t('terms.accept')}
        </Label>
      </div>
      {errorKey && <FormMessage id={errorId} message={t(`errors.${errorKey}`)} className="mt-3" />}
      <div className="mt-6 flex items-center justify-between gap-2">
        <Button variant="ghost" onClick={onSignOut} disabled={isSigningOut || isActivating}>
          {t('signOut')}
        </Button>
        <Button onClick={onAccept} disabled={!accepted || isActivating} aria-busy={isActivating}>
          {isActivating && <Loader2 className="animate-spin" aria-hidden />}
          {isActivating ? t('terms.submitting') : t('terms.submit')}
        </Button>
      </div>
    </>
  );
};
