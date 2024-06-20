import unusedImports from 'eslint-plugin-unused-imports'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import * as parser from '@typescript-eslint/parser'

export default [
  {
    ignores: [
      '.changeset',
      './scripts',
      './configs',
      '*.{js,ts,cjs,mjs,d.cts,d.mts,jsx,tsx,json,jsonc}',
      '**/dev/*',
      '**/dist/*',
      '**/public/*',
      '**/tests/*',
      'tsconfig.json',
    ],
  },
  {
    files: ['packages/**/**/*/src/**/*.{ts,tsx}'],
    plugins: {
      'unused-imports': unusedImports,
      'simple-import-sort': simpleImportSort,
    },
    languageOptions: {
      parser: parser,
      parserOptions: {
        cmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 12,
        sourceType: 'module',
      },
    },
    rules: {
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            // All import types in top level.
            ['^.*\\u0000$'],
            ['^\\u0000'],
            ['^@?\\w'],
            ['^'],
            ['^\\.'],
            // Packages `solid-js` related packages come first.
            ['^solid-js', '^\\w'],
            // npm packages
            // Anything that starts with a letter (or digit or underscore), or `@` followed by a letter.
            ['^\\w'],
            ['^@saftox-ui(/.*|$)'],
            // Side effect imports.
            ['^\\u0000'],
            // Parent imports. Put `..` last.
            ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
            // Other relative imports. Put same-folder imports and `.` last.
            ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
            // Style imports.
            ['^.+\\.?(css)$'],
          ],
        },
      ],
    },
  },
]
