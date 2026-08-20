'use client';

import { type FC, useId, useRef } from 'react';
import { Check, ChevronDown, Loader2, X } from 'lucide-react';

import { useTranslations } from '@/i18n';
import { getClientAvatarSrc, getClientInitials } from '@/src/entities/client';
import { cn } from '@/src/shared/lib/styles';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Checkbox,
  Input,
  Label,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Typography,
} from '@/src/shared/ui';

import { type BlockVisibilityConfig, useBlockClientPicker } from '../../hooks/useBlockVisibilityConfig';
import { getBlockVisibilityErrorMessageKey } from './BlockVisibilityFields.utils';

type BlockVisibilityFieldsProps = {
  config: BlockVisibilityConfig;
};

export const BlockVisibilityFields: FC<BlockVisibilityFieldsProps> = ({ config }) => {
  const t = useTranslations('ProgramWizard');
  const id = useId();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const restrictedId = `${id}-restricted`;
  const searchId = `${id}-search`;
  const pickerId = `${id}-picker`;
  const guidanceId = `${id}-guidance`;
  const errorId = `${id}-error`;
  const isRestricted = config.mode === 'restricted';
  const picker = useBlockClientPicker({
    enabled: config.open && isRestricted,
    selectedClientUserIds: config.selectedClientUserIds,
    eligibleClientUserIds: config.eligibleClientUserIds,
  });
  const errorCode = config.form.formState.errors.clientUserIds?.message;
  const errorMessage = errorCode ? t(getBlockVisibilityErrorMessageKey(errorCode)) : null;
  const selectedClients = picker.visibleClients.filter((client) =>
    config.selectedClientUserIds.includes(client.clientUserId)
  );
  const isRestrictionUnavailable = !isRestricted && !config.canChooseRestricted;
  const restrictionGuidance = isRestrictionUnavailable
    ? [
        ...(config.isLastSharedBlock ? [t('structure.blocks.visibility.lastShared')] : []),
        ...(config.isCheckingAssignments ? [t('structure.blocks.visibility.checkingAssignments')] : []),
        ...(config.hasAssignmentLoadError ? [t('structure.blocks.visibility.assignmentsLoadError')] : []),
        ...(!config.isCheckingAssignments && !config.hasAssignmentLoadError && !config.hasEligibleClients
          ? [t('structure.blocks.visibility.noAssignedClients')]
          : []),
      ]
    : [t('structure.blocks.visibility.restrictDescription')];

  return (
    <fieldset className="grid gap-3" aria-describedby={cn(guidanceId, errorMessage && errorId)}>
      <legend className="text-sm font-medium">{t('structure.blocks.visibility.title')}</legend>

      <div className="flex items-start gap-3 rounded-md border p-3">
        <Checkbox
          id={restrictedId}
          checked={isRestricted}
          disabled={!isRestricted && !config.canChooseRestricted}
          onCheckedChange={(checked) => config.handleModeChange(checked === true ? 'restricted' : 'shared')}
          aria-describedby={guidanceId}
        />
        <div className="grid gap-1">
          <Label
            htmlFor={restrictedId}
            className={cn('font-medium', isRestrictionUnavailable ? 'cursor-not-allowed' : 'cursor-pointer')}
          >
            {t('structure.blocks.visibility.restrictCheckbox')}
          </Label>
          <div id={guidanceId} className="grid gap-1">
            {restrictionGuidance.map((message) => (
              <Typography
                key={message}
                variant="p-xs"
                className={cn(
                  'text-muted-foreground',
                  isRestrictionUnavailable && 'text-amber-700 dark:text-amber-400'
                )}
              >
                {message}
              </Typography>
            ))}
          </div>
        </div>
      </div>

      {isRestricted ? (
        <div className="bg-muted/30 grid gap-3 rounded-md border p-3">
          <div className="flex items-center justify-between gap-3">
            <Typography variant="p-sm" className="font-medium">
              {t('structure.blocks.visibility.selectedClients', {
                count: config.selectedClientUserIds.length,
              })}
            </Typography>

            <Popover open={picker.isOpen} onOpenChange={picker.setOpen}>
              <PopoverTrigger asChild>
                <Button type="button" variant="outline" size="sm" aria-controls={pickerId}>
                  {t('structure.blocks.visibility.addClients')}
                  <ChevronDown className={cn('size-4 transition-transform', picker.isOpen && 'rotate-180')} />
                </Button>
              </PopoverTrigger>

              <PopoverContent
                id={pickerId}
                align="end"
                sideOffset={8}
                collisionPadding={16}
                portalled={false}
                className="flex max-h-[var(--radix-popover-content-available-height)] w-80 max-w-[calc(100vw-2rem)] flex-col overflow-hidden p-1"
                onOpenAutoFocus={(event) => {
                  event.preventDefault();
                  searchInputRef.current?.focus();
                }}
              >
                <div className="p-1">
                  <Label htmlFor={searchId} className="sr-only">
                    {t('structure.blocks.visibility.search')}
                  </Label>
                  <Input
                    ref={searchInputRef}
                    id={searchId}
                    value={picker.search}
                    onChange={(event) => picker.setSearch(event.target.value)}
                    onKeyDown={(event) => event.stopPropagation()}
                    placeholder={t('structure.blocks.visibility.search')}
                  />
                </div>

                <div className="max-h-64 min-h-0 flex-1 touch-pan-y overflow-y-auto overscroll-contain py-1">
                  {config.isCheckingAssignments || picker.isLoading ? (
                    <div className="flex min-h-20 items-center justify-center">
                      <Loader2 className="size-5 animate-spin" aria-label={t('structure.blocks.visibility.loading')} />
                    </div>
                  ) : config.hasAssignmentLoadError || picker.isError ? (
                    <Typography variant="p-sm" className="text-destructive p-3" role="alert">
                      {t('structure.blocks.visibility.loadError')}
                    </Typography>
                  ) : picker.pickerClients.length === 0 && picker.pickerUnresolvedClientUserIds.length === 0 ? (
                    <Typography variant="p-sm" className="text-muted-foreground p-3 text-center">
                      {t('structure.blocks.visibility.empty')}
                    </Typography>
                  ) : (
                    <>
                      {picker.pickerUnresolvedClientUserIds.map((clientUserId) => (
                        <button
                          key={clientUserId}
                          type="button"
                          className="hover:bg-accent flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm"
                          onClick={() => config.handleClientChange(clientUserId, false)}
                          aria-pressed="true"
                        >
                          <span className="border-primary bg-primary text-primary-foreground flex size-4 shrink-0 items-center justify-center rounded-sm border">
                            <Check className="size-3" />
                          </span>
                          <span className="truncate">{clientUserId}</span>
                        </button>
                      ))}
                      {picker.pickerClients.map((client) => {
                        const checked = config.selectedClientUserIds.includes(client.clientUserId);
                        return (
                          <button
                            key={client.clientUserId}
                            type="button"
                            className="hover:bg-accent flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm"
                            onClick={() => config.handleClientChange(client.clientUserId, !checked)}
                            aria-pressed={checked}
                          >
                            <span
                              className={cn(
                                'flex size-4 shrink-0 items-center justify-center rounded-sm border',
                                checked && 'border-primary bg-primary text-primary-foreground'
                              )}
                            >
                              {checked ? <Check className="size-3" /> : null}
                            </span>
                            <Avatar className="size-7">
                              <AvatarImage src={getClientAvatarSrc(client.avatarUrl)} alt="" />
                              <AvatarFallback>{getClientInitials(client.displayName)}</AvatarFallback>
                            </Avatar>
                            <span className="truncate">{client.displayName}</span>
                          </button>
                        );
                      })}
                    </>
                  )}
                </div>

                {picker.hasNextPage ? (
                  <div className="border-t p-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="w-full"
                      onClick={() => picker.fetchNextPage()}
                      disabled={picker.isFetchingNextPage}
                    >
                      {picker.isFetchingNextPage ? <Loader2 className="size-4 animate-spin" /> : null}
                      {t('structure.blocks.visibility.loadMore')}
                    </Button>
                  </div>
                ) : null}
              </PopoverContent>
            </Popover>
          </div>

          {selectedClients.length > 0 || picker.unresolvedClientUserIds.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {selectedClients.map((client) => (
                <div
                  key={client.clientUserId}
                  className="bg-background flex min-h-9 max-w-full items-center gap-2 rounded-full border py-1 pr-1 pl-2"
                >
                  <Avatar className="size-6">
                    <AvatarImage src={getClientAvatarSrc(client.avatarUrl)} alt="" />
                    <AvatarFallback>{getClientInitials(client.displayName)}</AvatarFallback>
                  </Avatar>
                  <span className="max-w-40 truncate text-sm">{client.displayName}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="size-7 rounded-full"
                    onClick={() => config.handleClientChange(client.clientUserId, false)}
                    aria-label={t('structure.blocks.visibility.removeClient', { name: client.displayName })}
                  >
                    <X className="size-3.5" />
                  </Button>
                </div>
              ))}
              {picker.unresolvedClientUserIds.map((clientUserId) => (
                <div
                  key={clientUserId}
                  className="bg-background flex min-h-9 max-w-full items-center gap-2 rounded-full border py-1 pr-1 pl-3"
                >
                  <span className="max-w-48 truncate text-sm">{clientUserId}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="size-7 rounded-full"
                    onClick={() => config.handleClientChange(clientUserId, false)}
                    aria-label={t('structure.blocks.visibility.removeUnknownClient')}
                  >
                    <X className="size-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}

      {errorMessage ? (
        <Typography id={errorId} variant="p-xs" className="text-destructive" role="alert">
          {errorMessage}
        </Typography>
      ) : null}
    </fieldset>
  );
};
