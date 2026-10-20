/**
 * Version of the trainer terms the person accepts: a calendar date (`YYYY-MM-DD`)
 * that the API stores with the time of the acceptance. Bump it when the text changes.
 */
export const TRAINER_TERMS_VERSION = '2026-10-01';

export const ONBOARDING_STEPS = ['welcome', 'terms', 'howItWorks'] as const;

export const WELCOME_POINTS = ['exercises', 'programs', 'clients'] as const;

export const TERMS_SUMMARY_ITEMS = ['responsibility', 'clientData', 'record'] as const;

export const HOW_IT_WORKS_ITEMS = ['exercise', 'program', 'client'] as const;
