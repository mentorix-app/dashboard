'use client';

import { type FC } from 'react';
import { CircleAlert, CircleCheck } from 'lucide-react';

import { useTranslations } from '@/i18n';
import type { ClientCompletionItem } from '@/src/entities/analytics';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/src/shared/ui';

import { getReviewStatus } from '../ClientTraining.utils';

type CompletionStatusBadgeProps = {
  completion: ClientCompletionItem;
};

/** Single status icon with a tooltip: green = reviewed, amber = needs attention. */
export const CompletionStatusBadge: FC<CompletionStatusBadgeProps> = ({ completion }) => {
  const t = useTranslations('ClientProfile');
  const status = getReviewStatus(completion);
  const label = t(`history.status.${status}`);

  const Icon = status === 'reviewed' ? CircleCheck : CircleAlert;
  const color = status === 'reviewed' ? 'text-emerald-500' : 'text-amber-500';

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className={color} role="img" aria-label={label}>
            <Icon className="size-4" aria-hidden />
          </span>
        </TooltipTrigger>
        <TooltipContent>{label}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
