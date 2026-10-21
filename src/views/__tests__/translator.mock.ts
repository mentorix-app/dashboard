import { Fragment, createElement, type ReactNode } from 'react';

import messages from '../../../i18n/messages/en';

/**
 * A translator for server-component tests, backed by the real English messages, so a test
 * sees the same texts as the page: `t(key, values)`, `t.raw(key)` and `t.rich(key, tags)`.
 */

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null;

const resolve = (namespace: string, key: string): unknown =>
  [namespace, ...key.split('.')].reduce<unknown>((node, part) => (isRecord(node) ? node[part] : undefined), messages);

type Values = Record<string, string | number>;
type Tags = Record<string, (chunks: ReactNode) => ReactNode>;

export const createTranslator = (namespace: string) => {
  const text = (key: string): string => {
    const value = resolve(namespace, key);
    if (typeof value !== 'string') throw new Error(`No message "${namespace}.${key}"`);
    return value;
  };

  const t = (key: string, values: Values = {}): string =>
    text(key).replace(/\{(\w+)\}/g, (_, name: string) => String(values[name] ?? ''));

  t.raw = (key: string): unknown => resolve(namespace, key);

  t.rich = (key: string, tags: Tags): ReactNode[] =>
    text(key)
      .split(/(<\w+>.*?<\/\w+>)/)
      .filter((part) => part !== '')
      .map((part, index) => {
        const tag = /^<(\w+)>(.*)<\/\1>$/.exec(part);
        return createElement(Fragment, { key: index }, tag ? tags[tag[1] ?? '']?.(tag[2]) : part);
      });

  return t;
};

/** Stand-in for `getTranslations` from `@/i18n/server`: takes a namespace or `{ locale, namespace }`. */
export const getTranslationsMock = async (options: string | { locale?: string; namespace: string }) =>
  createTranslator(typeof options === 'string' ? options : options.namespace);
