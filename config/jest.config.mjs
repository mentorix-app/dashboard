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
  // Jest's default testMatch treats *every* file under a `__tests__/` folder as
  // a suite. This repo colocates non-test helpers there too (shared render
  // helpers, `__tests__/mocks/*.mock.ts` factories), so require the `.test.`/
  // `.spec.` name marker regardless of location instead.
  testMatch: ['<rootDir>/**/*.{test,spec}.{js,jsx,ts,tsx}'],
  collectCoverageFrom: [
    'app/**/*.{js,jsx,ts,tsx}',
    'src/**/*.{js,jsx,ts,tsx}',
    'proxy.ts',
    '!**/*.d.ts',
    '!**/*.{config,setup}.{js,mjs,ts,tsx}',
  ],
  modulePathIgnorePatterns: ['<rootDir>/.next/'],
  // Global floor is intentionally low: most business-logic directories are still
  // being back-filled with tests (see AGENTS.md "Testing" — target is 80%).
  // Directories that have completed a test-coverage pass get a real 80% floor
  // below; raise the `global` numbers as more directories are finished instead
  // of lowering a directory's threshold to make the suite pass.
  coverageThreshold: {
    global: {
      statements: 0,
      branches: 0,
      functions: 0,
      lines: 0,
    },
    './src/shared/api/': { statements: 80, branches: 70, functions: 80, lines: 80 },
    './src/entities/auth/server/': { statements: 80, branches: 70, functions: 80, lines: 80 },
    './src/entities/user/model/': { statements: 80, branches: 70, functions: 80, lines: 80 },
    './proxy.ts': { statements: 80, branches: 70, functions: 80, lines: 80 },
    './app/api/bff/': { statements: 80, branches: 70, functions: 80, lines: 80 },
  },
};

export default createJestConfig(customJestConfig);
