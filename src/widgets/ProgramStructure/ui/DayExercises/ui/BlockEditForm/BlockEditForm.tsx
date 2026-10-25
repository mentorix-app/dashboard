'use client';

import { useTranslations } from '@/i18n';
import { FORMAT_BLOCK_TYPES, SECTION_BLOCK_TYPES } from '@/src/entities/program';
import {
  Button,
  DialogFooter,
  Label,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  Textarea,
  Typography,
} from '@/src/shared/ui';

import { BLOCK_TYPE_LABEL_KEY } from '../../DayExercises.constants';
import { BlockSettingsFields } from '../BlockSettingsFields';
import { BlockVisibilityFields } from '../BlockVisibilityFields';
import { getBlockEditErrorMessageKey } from '../BlockEditDialog/BlockEditDialog.utils';
import { BlockSaveButton } from '../BlockSaveButton';
import { useBlockEditFormConfig } from './BlockEditForm.conf';
import type { BlockEditFormProps } from './BlockEditForm.types';

/** Draft form; remounts with the dialog content so its state resets on each open. */
export const BlockEditForm = ({
  block,
  visibility,
  isPending,
  errorKey,
  metadataSaved,
  onSubmit,
  onCancel,
}: BlockEditFormProps) => {
  const t = useTranslations('ProgramWizard');
  const config = useBlockEditFormConfig({ block, onSubmit });

  return (
    <>
      <div className="grid gap-6">
        <section className="grid gap-4" aria-labelledby="block-details-heading">
          <Typography id="block-details-heading" variant="p-sm" className="font-medium">
            {t('structure.blocks.editDialog.detailsTitle')}
          </Typography>

          <div className="grid gap-2">
            <Label htmlFor="block-type-select">{t('structure.blocks.editDialog.typeLabel')}</Label>
            <Select value={config.blockType} onValueChange={config.handleBlockTypeChange}>
              <SelectTrigger id="block-type-select" className="w-full sm:w-72">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>{t('structure.blocks.typeGroups.formats')}</SelectLabel>
                  {FORMAT_BLOCK_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {t(BLOCK_TYPE_LABEL_KEY[type])}
                    </SelectItem>
                  ))}
                </SelectGroup>
                <SelectSeparator />
                <SelectGroup>
                  <SelectLabel>{t('structure.blocks.typeGroups.sections')}</SelectLabel>
                  {SECTION_BLOCK_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {t(BLOCK_TYPE_LABEL_KEY[type])}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <BlockSettingsFields
            blockType={config.blockType}
            rule={config.rule}
            form={config.form}
            setsToClear={config.setsToClear}
            onDurationBlur={config.handleDurationBlur}
          />

          <div className="grid gap-2">
            <Label htmlFor="block-instruction">{t('structure.blocks.editDialog.instructionLabel')}</Label>
            <Textarea
              id="block-instruction"
              rows={3}
              {...config.form.register('instruction')}
              placeholder={t('structure.blocks.editDialog.instructionPlaceholder')}
              className="[field-sizing:content] min-h-24 shadow-none"
            />
          </div>
        </section>

        <section className="border-t pt-5">
          <BlockVisibilityFields config={visibility} />
        </section>

        {metadataSaved && errorKey ? (
          <Typography variant="p-sm" className="text-destructive" role="alert">
            {t('structure.blocks.visibility.partialSave')}
          </Typography>
        ) : errorKey ? (
          <Typography variant="p-sm" className="text-destructive" role="alert">
            {t(getBlockEditErrorMessageKey(errorKey))}
          </Typography>
        ) : null}
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
          {t('structure.blocks.editDialog.cancel')}
        </Button>
        <BlockSaveButton
          label={t('structure.blocks.editDialog.save')}
          isPending={isPending}
          hint={visibility.hasEmptyRestriction && !isPending ? t('structure.blocks.visibility.saveHint') : undefined}
          onClick={config.handleSubmit}
        />
      </DialogFooter>
    </>
  );
};
