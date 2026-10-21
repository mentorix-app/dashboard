import { SUPPORT_EMAIL } from '@/src/shared/lib';
import type { LegalDocument, LegalSection } from './LegalView.types';

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null;

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((entry): entry is string => typeof entry === 'string');

const readSection = (value: unknown): LegalSection => {
  if (!isRecord(value) || typeof value.id !== 'string' || typeof value.title !== 'string') {
    throw new Error('A legal section needs an id and a title');
  }
  const { paragraphs = [], items = [], closing } = value;
  if (!isStringArray(paragraphs) || !isStringArray(items) || (closing !== undefined && typeof closing !== 'string')) {
    throw new Error(`The legal section "${value.id}" has paragraphs, items or a closing of the wrong type`);
  }
  return { id: value.id, title: value.title, paragraphs, items, ...(closing === undefined ? {} : { closing }) };
};

/**
 * Checks the shape of a legal text that came out of the messages (`t.raw`, which is untyped),
 * so a broken translation fails loudly instead of rendering a half page.
 */
export const readLegalDocument = (title: string, intro: unknown, sections: unknown): LegalDocument => {
  if (!isStringArray(intro) || !Array.isArray(sections)) {
    throw new Error('A legal text needs an intro and a list of sections');
  }
  return { title, intro, sections: sections.map(readSection) };
};

/** `2026-10-21` as a long date in the page language; the version is a calendar date, so the zone is fixed to UTC. */
export const formatLegalDate = (version: string, locale: string): string =>
  new Intl.DateTimeFormat(locale, { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(`${version}T00:00:00Z`));

export type TextPart = { kind: 'text'; value: string } | { kind: 'email'; value: string };

/** Splits a paragraph around the support email so the view can turn it into a link. */
export const splitAroundEmail = (text: string): TextPart[] => {
  const parts: TextPart[] = [];
  const pieces = text.split(SUPPORT_EMAIL);
  pieces.forEach((piece, index) => {
    if (index > 0) parts.push({ kind: 'email', value: SUPPORT_EMAIL });
    if (piece !== '') parts.push({ kind: 'text', value: piece });
  });
  return parts;
};
