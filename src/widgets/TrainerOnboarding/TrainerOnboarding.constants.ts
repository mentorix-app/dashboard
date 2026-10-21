import { LEGAL_VERSION } from '@/src/shared/lib';

/**
 * Version of the trainer terms the person accepts: the version of the published Terms of Service
 * (a calendar date, `YYYY-MM-DD`) that the API stores with the time of the acceptance.
 */
export const TRAINER_TERMS_VERSION = LEGAL_VERSION;

export const ONBOARDING_STEPS = ['welcome', 'terms', 'howItWorks'] as const;

export const WELCOME_POINTS = ['exercises', 'programs', 'clients'] as const;

export const TERMS_SUMMARY_ITEMS = ['responsibility', 'clientData', 'record'] as const;

export const HOW_IT_WORKS_ITEMS = ['exercise', 'program', 'client'] as const;
