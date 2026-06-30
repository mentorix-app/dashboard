'use client';

import { Card, CardContent, CardHeader, CardTitle, Typography } from '@/src/shared/ui';

import { useProgramBasicsFormConfig } from './ProgramBasicsForm.conf';
import type { ProgramBasicsFormProps } from './ProgramBasicsForm.types';
import { ProgramLocalizedField } from './ui/ProgramLocalizedField';
import { ProgramPreviewCard } from './ui/ProgramPreviewCard';
import { ProgramSelectField } from './ui/ProgramSelectField';
import { ProgramTextField } from './ui/ProgramTextField';

export const ProgramBasicsForm = ({ programId }: ProgramBasicsFormProps) => {
  const { t, form, isLoading, categoryOptions, difficultyOptions, preview } = useProgramBasicsFormConfig(programId);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <Card>
        <CardHeader>
          <CardTitle>{t('basics.sectionTitle')}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <ProgramLocalizedField
            control={form.control}
            label={t('basics.name')}
            placeholder={t('basics.namePlaceholder')}
            disabled={isLoading}
            fields={[
              { locale: 'en', label: t('basics.localeEn'), name: 'name' },
              { locale: 'ru', label: t('basics.localeRu'), name: 'nameRu' },
            ]}
          />
          <ProgramLocalizedField
            control={form.control}
            label={t('basics.description')}
            placeholder={t('basics.descriptionPlaceholder')}
            multiline
            disabled={isLoading}
            fields={[
              { locale: 'en', label: t('basics.localeEn'), name: 'description' },
              { locale: 'ru', label: t('basics.localeRu'), name: 'descriptionRu' },
            ]}
          />
          <div className="grid gap-6 sm:grid-cols-2">
            <ProgramSelectField
              control={form.control}
              name="category"
              label={t('basics.category')}
              placeholder={t('basics.categoryPlaceholder')}
              options={categoryOptions}
              disabled={isLoading}
            />
            <ProgramSelectField
              control={form.control}
              name="difficulty"
              label={t('basics.difficulty')}
              placeholder={t('basics.difficultyPlaceholder')}
              options={difficultyOptions}
              disabled={isLoading}
            />
          </div>
          <ProgramTextField
            control={form.control}
            name="previewImageUrl"
            label={t('basics.previewImageUrl')}
            placeholder={t('basics.previewImageUrlPlaceholder')}
            type="url"
            disabled={isLoading}
          />
        </CardContent>
      </Card>

      <div>
        <Typography variant="p-sm" className="sr-only">
          {t('preview.title')}
        </Typography>
        <ProgramPreviewCard
          title={t('preview.title')}
          name={preview.name}
          namePlaceholder={t('preview.namePlaceholder')}
          levelLabel={preview.levelLabel}
          categoryLabel={preview.categoryLabel}
          previewImageUrl={preview.previewImageUrl}
          imageAlt={preview.name || t('preview.namePlaceholder')}
        />
      </div>
    </div>
  );
};
