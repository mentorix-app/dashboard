export const toCamelCase = (key: string): string =>
  key.replace(/_([a-z0-9])/g, (_, char: string) => char.toUpperCase());

export const toSnakeCase = (key: string): string => key.replace(/[A-Z]/g, (char) => `_${char.toLowerCase()}`);

export const convertObjectKeys = (value: unknown, convert: (key: string) => string): unknown => {
  if (Array.isArray(value)) return value.map((item) => convertObjectKeys(item, convert));

  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, child]) => [convert(key), convertObjectKeys(child, convert)])
    );
  }

  return value;
};
