const tsParser = require('@typescript-eslint/parser');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const perfectionist = require('eslint-plugin-perfectionist');
const prettier = require('eslint-config-prettier');
const prettierPlugin = require('eslint-plugin-prettier');
const sonarjs = require('eslint-plugin-sonarjs');
const unusedImports = require('eslint-plugin-unused-imports');

const globals = {
  Buffer: 'readonly',
  __dirname: 'readonly',
  console: 'readonly',
  exports: 'readonly',
  module: 'readonly',
  process: 'readonly',
  require: 'readonly',
};

const jestGlobals = {
  afterAll: 'readonly',
  afterEach: 'readonly',
  beforeAll: 'readonly',
  beforeEach: 'readonly',
  describe: 'readonly',
  expect: 'readonly',
  it: 'readonly',
  jest: 'readonly',
};

module.exports = [
  {
    ignores: ['dist/**', 'node_modules/**', 'tests/**'],
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      globals,
      parser: tsParser,
      parserOptions: {
        project: ['./tsconfig.json', './tsconfig.jest.json'],
        sourceType: 'module',
        tsconfigRootDir: __dirname,
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      perfectionist,
      prettier: prettierPlugin,
      sonarjs,
      'unused-imports': unusedImports,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      ...prettier.rules,
      '@typescript-eslint/explicit-member-accessibility': [
        'error',
        {
          accessibility: 'explicit',
          ignoredMethodNames: ['constructor'],
        },
      ],
      '@typescript-eslint/explicit-module-boundary-types': [
        'error',
        {
          allowedNames: ['toPrimitives'],
        },
      ],
      '@typescript-eslint/member-delimiter-style': 'off',
      '@typescript-eslint/member-ordering': [
        'error',
        {
          default: [
            'field',
            'static-field',
            'private-static-field',
            'public-static-field',
            'private-instance-field',
            'public-instance-field',
            'private-static-method',
            'public-static-method',
            'constructor',
            'private-method',
            'public-method',
          ],
        },
      ],
      '@typescript-eslint/naming-convention': [
        'error',
        {
          format: ['camelCase', 'PascalCase'],
          leadingUnderscore: 'allow',
          selector: ['variable', 'function'],
        },
        {
          custom: {
            match: true,
            regex: '^[A-Z]',
          },
          format: ['PascalCase'],
          selector: 'interface',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-inferrable-types': 'off',
      '@typescript-eslint/no-misused-promises': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-require-imports': 'error',
      '@typescript-eslint/no-this-alias': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      '@typescript-eslint/no-unsafe-call': 'warn',
      '@typescript-eslint/no-unsafe-return': 'error',
      '@typescript-eslint/no-use-before-define': 'warn',
      '@typescript-eslint/prefer-for-of': 'error',
      '@typescript-eslint/require-await': 'error',
      complexity: ['error', 8],
      'lines-between-class-members': [
        'error',
        'always',
        {
          exceptAfterSingleLine: true,
        },
      ],
      'max-classes-per-file': ['error', 1],
      'max-depth': ['warn', 3],
      'max-len': [
        'error',
        {
          code: 80,
          ignoreRegExpLiterals: true,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
        },
      ],
      'max-nested-callbacks': ['warn', 2],
      'max-params': ['warn', 7],
      'new-parens': 'error',
      'no-bitwise': 'error',
      'no-caller': 'error',
      'no-cond-assign': 'error',
      'no-console': 'warn',
      'no-debugger': 'error',
      'no-empty': 'error',
      'no-eval': 'error',
      'no-extra-boolean-cast': 'error',
      'no-fallthrough': 'off',
      'no-invalid-this': 'off',
      'no-new-wrappers': 'error',
      'no-param-reassign': [
        'warn',
        {
          props: true,
        },
      ],
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              message: 'Domain layer cannot import infrastructure.',
              name: '../infrastructure',
            },
          ],
        },
      ],
      'no-throw-literal': 'error',
      'no-trailing-spaces': 'error',
      'no-undef-init': 'error',
      'no-unsafe-finally': 'error',
      'no-unused-expressions': [
        'error',
        {
          allowShortCircuit: true,
        },
      ],
      'no-unused-labels': 'error',
      'no-unused-vars': 'off',
      'object-shorthand': 'error',
      'one-var': ['error', 'never'],
      'padding-line-between-statements': [
        'error',
        {
          blankLine: 'always',
          next: ['class', 'export', 'const', 'let', 'var'],
          prev: 'import',
        },
        {
          blankLine: 'always',
          next: 'return',
          prev: '*',
        },
        {
          blankLine: 'always',
          next: 'if',
          prev: '*',
        },
      ],
      'perfectionist/sort-imports': [
        'error',
        {
          order: 'asc',
          type: 'natural',
        },
      ],
      'perfectionist/sort-objects': [
        'warn',
        {
          order: 'asc',
          type: 'natural',
        },
      ],
      'prettier/prettier': 'error',
      radix: 'error',
      'require-await': 'off',
      'sonarjs/cognitive-complexity': ['error', 10],
      'sonarjs/no-collapsible-if': 'error',
      'sonarjs/no-duplicated-branches': 'error',
      'sonarjs/no-identical-expressions': 'warn',
      'sonarjs/no-nested-switch': 'warn',
      'sonarjs/prefer-single-boolean-return': 'error',
      'spaced-comment': 'error',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          args: 'after-used',
          argsIgnorePattern: '^_',
          vars: 'all',
          varsIgnorePattern: '^_',
        },
      ],
      'use-isnan': 'error',
      'valid-typeof': 'off',
    },
  },
  {
    files: ['**/*.spec.ts'],
    languageOptions: {
      globals: {
        ...globals,
        ...jestGlobals,
      },
    },
    rules: {
      '@typescript-eslint/no-unsafe-argument': 'off',
      'max-lines-per-function': 'off',
      'max-nested-callbacks': ['warn', 4],
      'max-statements': 'off',
    },
  },
];
