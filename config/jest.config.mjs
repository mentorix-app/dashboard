import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  dir: './',
});

/** @type {import('jest').Config} */
const customJestConfig = {
  rootDir: '../',
  setupFilesAfterEnv: ['<rootDir>/config/jest.setup.tsx'],
  testEnvironment: 'jest-environment-jsdom',
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  collectCoverageFrom: [
    'app/**/*.{js,jsx,ts,tsx}',
    'components/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/*.{config,setup}.{js,mjs,ts,tsx}',
  ],
  modulePathIgnorePatterns: ['<rootDir>/.next/'],
};

export default createJestConfig(customJestConfig);
