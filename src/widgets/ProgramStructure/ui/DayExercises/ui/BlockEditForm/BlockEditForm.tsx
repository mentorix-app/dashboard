'use client';

import { useTranslations } from '@/i18n';
import { GROUP_BLOCK_TYPES } from '@/src/entities/program';
import {
  Button,
  DialogFooter,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
  Typography,
} from '@/src/shared/ui';

import { BLOCK_TYPE_LABEL_KEY } from '../../DayExercises.constants';
import { BlockVisibilityFields } from '../BlockVisibilityFields';
import { getBlockVisibilityErrorMessageKey } from '../BlockVisibilityFields/BlockVisibilityFields.utils';
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
            <Label>{t('structure.blocks.editDialog.typeLabel')}</Label>
            <Select value={config.blockType} onValueChange={config.handleBlockTypeChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {GROUP_BLOCK_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {t(BLOCK_TYPE_LABEL_KEY[type])}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>{t('structure.blocks.editDialog.instructionLabel')}</Label>
            <Textarea
              rows={3}
              {...config.form.register('instruction')}
              placeholder={t('structure.blocks.editDialog.instructionPlaceholder')}
              className="[field-sizing:content] min-h-24"
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
            {t(getBlockVisibilityErrorMessageKey(errorKey))}
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
