'use client';

import { useState } from 'react';

import { useTranslations } from '@/i18n';
import { GROUP_BLOCK_TYPES, type ProgramBlockGroupType } from '@/src/entities/program';
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
} from '@/src/shared/ui';

import { BLOCK_TYPE_LABEL_KEY } from '../../DayExercises.constants';
import { toGroupType } from '../BlockEditDialog/BlockEditDialog.utils';
import type { BlockEditFormProps } from './BlockEditForm.types';

/** Draft form; remounts with the dialog content so its state resets on each open. */
export const BlockEditForm = ({ block, onSubmit, onCancel }: BlockEditFormProps) => {
  const t = useTranslations('ProgramWizard');
  const [blockType, setBlockType] = useState<ProgramBlockGroupType>(() => toGroupType(block.blockType));
  const [instruction, setInstruction] = useState(block.instruction);

  const handleSave = () => onSubmit({ blockType, instruction: instruction.trim() });

  return (
    <>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label>{t('structure.blocks.editDialog.typeLabel')}</Label>
          <Select value={blockType} onValueChange={(value) => setBlockType(toGroupType(value))}>
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
            value={instruction}
            onChange={(event) => setInstruction(event.target.value)}
            placeholder={t('structure.blocks.editDialog.instructionPlaceholder')}
          />
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          {t('structure.blocks.editDialog.cancel')}
        </Button>
        <Button type="button" onClick={handleSave}>
          {t('structure.blocks.editDialog.save')}
        </Button>
      </DialogFooter>
    </>
  );
};
