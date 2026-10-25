'use client';

import { Info, SlidersHorizontal, TriangleAlert } from 'lucide-react';

import { useTranslations } from '@/i18n';
import { Typography } from '@/src/shared/ui';

import { BLOCK_FORMAT_HINT_KEY } from '../../DayExercises.constants';
import { getBlockTypeLabelKey } from '../../lib';
import { BlockSettingInput } from './BlockSettingInput';
import type { BlockSettingsFieldsProps } from './BlockSettingsFields.types';

/**
 * Format panel of the block form: what the format means, its settings and,
 * for formats without sets, what happens to the exercises' sets. Sections
 * (strength, skill work, …) have nothing to configure and render nothing.
 */
export const BlockSettingsFields = ({
  blockType,
  rule,
  form,
  setsToClear,
  onDurationBlur,
}: BlockSettingsFieldsProps) => {
  const t = useTranslations('ProgramWizard');
  if (rule.fields.length === 0 && rule.hasSets) return null;

  const hintKey = BLOCK_FORMAT_HINT_KEY[blockType];
  const typeLabel = t(getBlockTypeLabelKey(blockType));

  return (
    <section
      aria-labelledby="block-settings-heading"
      className="bg-muted/40 dark:bg-muted/20 grid gap-4 rounded-lg border p-4"
    >
      <div className="flex items-start gap-3">
        <span className="bg-background text-muted-foreground flex size-8 shrink-0 items-center justify-center rounded-md border">
          <SlidersHorizontal aria-hidden="true" className="size-4" />
        </span>
        <div className="grid gap-1">
          <Typography id="block-settings-heading" variant="p-sm" className="font-medium">
            {t('structure.blocks.settings.title', { type: typeLabel })}
          </Typography>
          {hintKey ? (
            <Typography variant="p-xs" className="text-muted-foreground">
              {t(hintKey)}
            </Typography>
          ) : null}
          {!rule.hasSets ? (
            <Typography variant="p-xs" className="text-muted-foreground flex items-start gap-1.5">
              <Info aria-hidden="true" className="mt-px size-3.5 shrink-0" />
              {t('structure.blocks.settings.noSets')}
            </Typography>
          ) : null}
        </div>
      </div>

      {rule.fields.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {rule.fields.map((field) => (
            <BlockSettingInput
              key={field}
              field={field}
              required={rule.required.includes(field)}
              form={form}
              onDurationBlur={onDurationBlur}
            />
          ))}
        </div>
      ) : null}

      {setsToClear > 0 ? (
        <div
          role="status"
          className="flex items-start gap-2 rounded-md border border-amber-300/70 bg-amber-50 px-3 py-2 text-amber-900 dark:border-amber-500/30 dark:bg-amber-950/40 dark:text-amber-200"
        >
          <TriangleAlert aria-hidden="true" className="size-4 shrink-0" />
          <Typography variant="p-xs" className="text-inherit">
            {t('structure.blocks.settings.setsWillBeCleared', { count: setsToClear })}
          </Typography>
        </div>
      ) : null}
    </section>
  );
};
