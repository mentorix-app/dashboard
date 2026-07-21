export type DateInput = string | number | Date;

export type DateFormatPreset = 'shortDate' | 'longDate' | 'monthYear' | 'dateTime';

const PRESETS: Record<DateFormatPreset, Intl.DateTimeFormatOptions> = {
  shortDate: { month: 'short', day: 'numeric', year: 'numeric' },
  longDate: { month: 'long', day: 'numeric', year: 'numeric' },
  monthYear: { month: 'long', year: 'numeric' },
  dateTime: { dateStyle: 'medium', timeStyle: 'short' },
};

const RELATIVE_DIVISIONS: { amount: number; unit: Intl.RelativeTimeFormatUnit }[] = [
  { amount: 60, unit: 'second' },
  { amount: 60, unit: 'minute' },
  { amount: 24, unit: 'hour' },
  { amount: 7, unit: 'day' },
  { amount: 4.34524, unit: 'week' },
  { amount: 12, unit: 'month' },
  { amount: Number.POSITIVE_INFINITY, unit: 'year' },
];

const dateTimeFormatters = new Map<string, Intl.DateTimeFormat>();
const relativeTimeFormatters = new Map<string, Intl.RelativeTimeFormat>();

/** Coerce any accepted input into a valid Date, or null when unparseable. */
const toValidDate = (value: DateInput): Date | null => {
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const getDateTimeFormatter = (locale: string, preset: DateFormatPreset): Intl.DateTimeFormat => {
  const key = `${locale}|${preset}`;
  let formatter = dateTimeFormatters.get(key);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat(locale, PRESETS[preset]);
    dateTimeFormatters.set(key, formatter);
  }
  return formatter;
};

const getRelativeTimeFormatter = (locale: string): Intl.RelativeTimeFormat => {
  let formatter = relativeTimeFormatters.get(locale);
  if (!formatter) {
    formatter = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
    relativeTimeFormatters.set(locale, formatter);
  }
  return formatter;
};

/**
 * Format an ISO string / timestamp / Date for display using a named preset.
 * Locale is passed explicitly so this stays hook-free; invalid input → ''.
 */
export const formatDate = (value: DateInput, locale: string, preset: DateFormatPreset = 'shortDate'): string => {
  const date = toValidDate(value);
  return date ? getDateTimeFormatter(locale, preset).format(date) : '';
};

const pad = (value: number): string => `${value}`.padStart(2, '0');

/** Local `YYYY-MM-DD` key from year / month (0-indexed) / day parts. */
export const dateKey = (year: number, monthIndex: number, day: number): string =>
  `${year}-${pad(monthIndex + 1)}-${pad(day)}`;

/** Local `YYYY-MM-DD` key for grouping a date input by calendar day; invalid → ''. */
export const toDateKey = (value: DateInput): string => {
  const date = toValidDate(value);
  return date ? dateKey(date.getFullYear(), date.getMonth(), date.getDate()) : '';
};

/** Format a date relative to `now` (e.g. "2 days ago"); invalid input → ''. */
export const formatRelativeTime = (value: DateInput, locale: string, now: DateInput = Date.now()): string => {
  const date = toValidDate(value);
  const base = toValidDate(now);
  if (!date || !base) return '';

  let duration = (date.getTime() - base.getTime()) / 1000;
  const formatter = getRelativeTimeFormatter(locale);
  for (const division of RELATIVE_DIVISIONS) {
    if (Math.abs(duration) < division.amount) {
      return formatter.format(Math.round(duration), division.unit);
    }
    duration /= division.amount;
  }
  return '';
};
