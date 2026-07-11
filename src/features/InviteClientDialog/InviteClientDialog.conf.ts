'use client';

import { useLocale, useTranslations } from '@/i18n';
import { useCreateTrainerInvite } from '@/src/entities/client';
import { useToast } from '@/src/shared/hooks';
import { copyToClipboard, formatDate } from '@/src/shared/lib';

import type { InviteClientDialogProps } from './InviteClientDialog.types';

const INVITE_NOT_CONFIGURED_STATUS = 503;

/**
 * Owns the invite mutation and clipboard/toast side effects. The generated
 * link is kept in the mutation cache and cleared whenever the dialog closes.
 */
export const useInviteClientDialogConfig = ({ open, onOpenChange }: InviteClientDialogProps) => {
  const t = useTranslations('InviteClient');
  const locale = useLocale();
  const { showSuccessToast, showErrorToast } = useToast();

  const { mutate, data: invite, error, isPending, reset } = useCreateTrainerInvite();

  const isNotConfigured = error?.status === INVITE_NOT_CONFIGURED_STATUS;
  const errorMessage = error ? (isNotConfigured ? t('notConfigured') : t('error')) : null;

  const handleOpenChange = (next: boolean) => {
    if (!next) reset();
    onOpenChange(next);
  };

  const handleGenerate = () => {
    if (isPending) return;
    mutate();
  };

  const handleCopy = async () => {
    if (!invite) return;
    const copied = await copyToClipboard(invite.inviteUrl);
    if (copied) showSuccessToast(t('copied'));
    else showErrorToast(t('copyError'));
  };

  return {
    t,
    open,
    onOpenChange: handleOpenChange,
    invite,
    isPending,
    errorMessage,
    expiresLabel: invite ? t('expiresAt', { date: formatDate(invite.expiresAt, locale, 'shortDate') }) : null,
    onGenerate: handleGenerate,
    onCopy: handleCopy,
  };
};
