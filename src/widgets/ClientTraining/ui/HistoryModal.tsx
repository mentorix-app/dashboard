'use client';

import { type FC } from 'react';

import { useTranslations } from '@/i18n';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/src/shared/ui';

import type { ClientTrainingConfig } from '../ClientTraining.types';
import { HistoryPanel } from './HistoryPanel';

type HistoryModalProps = {
  config: ClientTrainingConfig;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const HistoryModal: FC<HistoryModalProps> = ({ config, open, onOpenChange }) => {
  const t = useTranslations('ClientProfile');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-dvh w-screen max-w-none flex-col gap-4 rounded-none border-0 p-4 sm:h-[85vh] sm:max-h-[85vh] sm:w-[calc(100%-2rem)] sm:rounded-md sm:border sm:p-6">
        <DialogHeader className="text-left">
          <DialogTitle>{t('history.heading')}</DialogTitle>
          <DialogDescription className="sr-only">{t('history.open')}</DialogDescription>
        </DialogHeader>
        <div className="scrollbar-slim -mr-1 overflow-y-auto pr-1">
          <HistoryPanel config={config} onPicked={() => onOpenChange(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
};
