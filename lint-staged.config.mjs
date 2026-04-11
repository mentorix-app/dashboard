import path from 'node:path';

const quoteRelative = (f) => `"${path.relative(process.cwd(), f)}"`;

const buildPrettierCommand = (filenames) => `prettier --write ${filenames.map(quoteRelative).join(' ')}`;

const buildEslintCommand = (filenames) => `eslint --fix ${filenames.map(quoteRelative).join(' ')}`;

const config = {
  '*.{js,jsx,ts,tsx,mjs}': [buildPrettierCommand, buildEslintCommand],
  '*.{json,css,md}': [buildPrettierCommand],
};

export default config;
