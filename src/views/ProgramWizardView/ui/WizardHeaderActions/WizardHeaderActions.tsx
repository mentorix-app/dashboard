'use client';

import { Archive, BarChart3, Check, ChevronDown, Loader2, RefreshCw, Undo2, UploadCloud } from 'lucide-react';
import { useLocale, useRouter, useTranslations } from '@/i18n';
import { ROUTES } from '@/src/shared/lib';
import { cn } from '@/src/shared/lib/styles';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/src/shared/ui';

import { useWizardActions } from '../../hooks/useWizardActions';

type WizardHeaderActionsProps = {
  programId: string;
  /**
   * Client-side publish gate shared with the draft publish flow. Returns false
   * (and surfaces the inline validation banners) when the program is not
   * publishable, so publish-update never opens its confirm modal in that case.
   */
  validateBeforePublish: () => boolean;
};

export const WizardHeaderActions = ({ programId, validateBeforePublish }: WizardHeaderActionsProps) => {
  const t = useTranslations('ProgramWizard');
  const router = useRouter();
  const locale = useLocale();
  const {
    canViewAnalytics,
    canArchive,
    canPublishUpdate,
    canSync,
    canRevert,
    canRepublish,
    isArchiving,
    isRepublishing,
    isPublishingUpdate,
    isSyncing,
    requestArchive,
    requestRepublish,
    requestPublishUpdate,
    requestSync,
    requestRevert,
  } = useWizardActions(programId);

  const handlePublishUpdateClick = () => {
    if (validateBeforePublish()) requestPublishUpdate();
  };

  const handleAnalyticsClick = () => router.push(ROUTES.programAnalytics(programId), { locale });

  // Draws attention to the actions menu when it holds something actionable
  // (a new version to publish or clients waiting to be synced) without
  // forcing the user to open it first.
  const hasHighlight = canPublishUpdate || canSync;
  const hasActionItems = canPublishUpdate || canSync || canRevert || canArchive || canRepublish;
  const hasMenuItems = canViewAnalytics || hasActionItems;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {hasMenuItems ? (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button type="button" variant={hasHighlight ? 'default' : 'outline'} size="sm" className="relative">
              {t('actions.menuLabel')}
              <ChevronDown aria-hidden />
              {hasHighlight ? (
                <span
                  aria-hidden
                  className={cn(
                    'absolute -top-1 -right-1 size-2.5 rounded-full border-2',
                    'border-background bg-amber-500'
                  )}
                />
              ) : null}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {canPublishUpdate ? (
              <DropdownMenuItem onClick={handlePublishUpdateClick} disabled={isPublishingUpdate}>
                {isPublishingUpdate ? <Loader2 className="animate-spin" aria-hidden /> : <UploadCloud aria-hidden />}
                {t('actions.publishUpdate')}
              </DropdownMenuItem>
            ) : null}

            {canSync ? (
              <DropdownMenuItem onClick={requestSync} disabled={isSyncing}>
                {isSyncing ? <Loader2 className="animate-spin" aria-hidden /> : <RefreshCw aria-hidden />}
                {t('actions.sync')}
              </DropdownMenuItem>
            ) : null}

            {canRevert ? (
              <DropdownMenuItem
                onClick={requestRevert}
                className="text-amber-600 focus:bg-amber-500/10 focus:text-amber-600 dark:text-amber-500 dark:focus:text-amber-500 [&_svg]:text-amber-600 dark:[&_svg]:text-amber-500"
              >
                <Undo2 aria-hidden />
                {t('actions.revert')}
              </DropdownMenuItem>
            ) : null}

            {(canPublishUpdate || canSync || canRevert) && canViewAnalytics ? <DropdownMenuSeparator /> : null}

            {canViewAnalytics ? (
              <DropdownMenuItem onClick={handleAnalyticsClick}>
                <BarChart3 aria-hidden />
                {t('actions.analytics')}
              </DropdownMenuItem>
            ) : null}

            {(canPublishUpdate || canSync || canRevert || canViewAnalytics) && (canArchive || canRepublish) ? (
              <DropdownMenuSeparator />
            ) : null}

            {canArchive ? (
              <DropdownMenuItem onClick={requestArchive} disabled={isArchiving} variant="destructive">
                {isArchiving ? <Loader2 className="animate-spin" aria-hidden /> : <Archive aria-hidden />}
                {t('actions.archive')}
              </DropdownMenuItem>
            ) : null}

            {canRepublish ? (
              <DropdownMenuItem onClick={requestRepublish} disabled={isRepublishing}>
                {isRepublishing ? <Loader2 className="animate-spin" aria-hidden /> : <Check aria-hidden />}
                {t('actions.republish')}
              </DropdownMenuItem>
            ) : null}
          </DropdownMenuContent>
        </DropdownMenu>
      ) : null}
    </div>
  );
};
