'use client';

import { Check } from 'lucide-react';

import { cn } from '@/src/shared/lib/styles';

import type { ProgramWizardStep } from '../ProgramWizardView.types';

type WizardStepperProps = {
  steps: readonly ProgramWizardStep[];
  currentIndex: number;
  getLabel: (step: ProgramWizardStep) => string;
  onSelect: (step: ProgramWizardStep) => void;
};

export const WizardStepper = ({ steps, currentIndex, getLabel, onSelect }: WizardStepperProps) => (
  <ol className="flex items-center justify-center">
    {steps.map((step, index) => {
      const isActive = index === currentIndex;
      const isComplete = index < currentIndex;

      return (
        <li key={step} className="flex items-center">
          <button
            type="button"
            onClick={() => onSelect(step)}
            aria-current={isActive ? 'step' : undefined}
            className="group flex cursor-pointer items-center gap-2.5 focus-visible:outline-none"
          >
            <span
              className={cn(
                'flex size-7 items-center justify-center rounded-full text-xs font-semibold transition-colors sm:size-8 sm:text-sm',
                'group-focus-visible:ring-ring group-focus-visible:ring-2 group-focus-visible:ring-offset-2',
                isActive && 'bg-primary text-primary-foreground',
                isComplete && 'bg-primary text-primary-foreground',
                !isActive &&
                  !isComplete &&
                  'border-border bg-background text-muted-foreground group-hover:border-foreground/40 group-hover:text-foreground border'
              )}
            >
              {isComplete ? <Check className="size-3.5 sm:size-4" aria-hidden /> : index + 1}
            </span>
            <span
              className={cn(
                'text-sm font-medium transition-colors',
                isActive && 'text-foreground',
                isComplete && 'text-foreground',
                !isActive && !isComplete && 'text-muted-foreground group-hover:text-foreground'
              )}
            >
              {getLabel(step)}
            </span>
          </button>
          {index < steps.length - 1 ? (
            <span
              aria-hidden
              className={cn(
                'mx-3 h-px w-8 transition-colors sm:mx-4 sm:w-14',
                index < currentIndex ? 'bg-primary' : 'bg-border'
              )}
            />
          ) : null}
        </li>
      );
    })}
  </ol>
);
