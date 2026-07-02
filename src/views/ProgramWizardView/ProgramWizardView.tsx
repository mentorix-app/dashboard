'use client';

import { ArrowLeft, ArrowRight, Check, Loader2 } from 'lucide-react';
import { ProgramStatusBadge } from '@/src/entities/program';
import { Button, Progress, Typography } from '@/src/shared/ui';

import { useProgramWizardConfig } from './ProgramWizardView.conf';
import type { ProgramWizardViewProps } from './ProgramWizardView.types';
import { WizardSkeleton } from './ui/WizardSkeleton';
import { WizardStepper } from './ui/WizardStepper';

export const ProgramWizardView = ({ programId, children }: ProgramWizardViewProps) => {
  const {
    t,
    steps,
    currentIndex,
    isFirstStep,
    isLastStep,
    isLoading,
    completionPercent,
    missingFields,
    status,
    isDraft,
    title,
    progressText,
    showMissingBanner,
    isPublishing,
    goToStep,
    handleBack,
    handleNext,
    handlePublish,
  } = useProgramWizardConfig(programId);

  if (isLoading) {
    return <WizardSkeleton />;
  }

  return (
    <section className="flex flex-1 flex-col gap-6">
      <header className="flex flex-col gap-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-3">
              <Typography variant="h1">{title}</Typography>
              <ProgramStatusBadge status={status} label={t(`status.${status}`)} size="lg" />
            </div>
            <Typography variant="p-sm" className="text-muted-foreground" aria-live="polite">
              {progressText}
            </Typography>
          </div>
        </div>

        <Progress value={completionPercent} label={t('progressLabel')} />
        <div className="flex justify-center">
          <WizardStepper
            steps={steps}
            currentIndex={currentIndex}
            getLabel={(step) => t(`steps.${step}`)}
            onSelect={(step) => goToStep(step)}
          />
        </div>
      </header>

      {showMissingBanner ? (
        <div
          role="alert"
          className="border-destructive/40 bg-destructive/10 text-destructive flex flex-col gap-1 rounded-lg border px-4 py-3"
        >
          <Typography variant="label-sm" className="text-destructive">
            {t('incompleteTitle')}
          </Typography>
          <Typography variant="p-sm" className="text-destructive">
            {t('incompleteDescription', {
              fields: missingFields.map((field) => t(`fields.${field}`)).join(', '),
            })}
          </Typography>
        </div>
      ) : null}

      <div className="flex-1">{children}</div>

      <footer className="flex items-center justify-between gap-4 border-t pt-6">
        <Button type="button" variant="outline" onClick={handleBack} disabled={isFirstStep}>
          <ArrowLeft aria-hidden />
          {t('nav.back')}
        </Button>

        {!isLastStep ? (
          <Button type="button" onClick={handleNext}>
            {t('nav.next')}
            <ArrowRight aria-hidden />
          </Button>
        ) : isDraft ? (
          <Button type="button" onClick={handlePublish} disabled={isPublishing}>
            {isPublishing ? <Loader2 className="animate-spin" aria-hidden /> : <Check aria-hidden />}
            {isPublishing ? t('nav.publishing') : t('nav.publish')}
          </Button>
        ) : null}
      </footer>
    </section>
  );
};
