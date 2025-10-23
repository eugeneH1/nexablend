// Shared ESLint Flat Config for Nexablend Monorepo
// packages/config/eslint.config.mjs

import js from '@eslint/js';
import next from 'eslint-config-next';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';

/**
 * @type {import("eslint").Linter.FlatConfig[]}
 */
export default [
  // 1. Ignore build artifacts and node_modules
  {
    ignores: [
      '**/node_modules/**',
      '**/.next/**',
      '**/dist/**',
      '**/build/**',
      '**/coverage/**',
      '**/*.d.ts',
    ],
  },

  // 2. Base JS rules
  js.configs.recommended,

  // 3. TypeScript support for all packages
  ...tseslint.configs.recommendedTypeChecked.map((cfg) => ({
    ...cfg,
    languageOptions: {
      ...cfg.languageOptions,
      parserOptions: {
        ...cfg.languageOptions?.parserOptions,
        projectService: true, // automatically picks up per-package tsconfig.json
      },
    },
  })),

  // 4. Next.js specific config for apps/web
  ...next(),
  {
    files: ['apps/web/**/*.{js,jsx,ts,tsx}'],
    rules: {
      'react/jsx-key': 'off',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },

  // 5. Disable stylistic rules (Prettier handles formatting)
  prettier,
];

