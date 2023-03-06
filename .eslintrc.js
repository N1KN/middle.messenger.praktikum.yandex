module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier', 'plugin:prettier/recommended'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: false,
      impliedStrict: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'import'],
  ignorePatterns: ['node_modules/', 'dist/', 'build/', '*.js'],
  settings: {
    'import/resolver': {
      node: {
        paths: ['./src'],
      },
    },
  },
  rules: {
    '@typescript-eslint/ban-ts-comment': 'off', // временно отключён, когда нужно будет удалить все ts-ignore, вернуть значение на "warn"
    '@typescript-eslint/no-explicit-any': 0,
    semi: 'off',
    '@typescript-eslint/semi': 'warn',
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/no-extra-semi': 'warn',
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/explicit-module-boundary-types': 0,
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-prototype-builtins': 1,
    'no-debugger': 'warn',
    'import/no-unresolved': 0,
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal', 'index', 'parent', 'sibling', 'unknown', 'object', 'type'],
        pathGroups: [
          {
            pattern: '@**',
            group: 'external',
            position: 'after',
          },
          {
            pattern: 'sanitize-html',
            group: 'external',
            position: 'after',
          },
          {
            pattern: 'components/**',
            group: 'parent',
          },
          {
            pattern: 'constants/**',
            group: 'parent',
          },
          {
            pattern: 'containers/**',
            group: 'parent',
          },
          {
            pattern: 'lib/**',
            group: 'parent',
          },

          {
            pattern: 'static/**',
            group: 'parent',
          },
          {
            pattern: 'types/**',
            group: 'parent',
            position: 'after',
          },
          {
            pattern: 'utils/**',
            group: 'parent',
          },
        ],
        alphabetize: {
          order: 'asc' /* sort in ascending order. Options: ['ignore', 'asc', 'desc'] */,
          caseInsensitive: false /* ignore case. Options: [true, false] */,
        },
        warnOnUnassignedImports: false,
      },
    ],
    'import/extensions': 0,
    'import/no-extraneous-dependencies': 0,
    'import/prefer-default-export': 0,
    // Отключили eslint для правил регулируемых prettier'ом
    curly: ['warn', 'all'],
    '@typescript-eslint/no-non-null-assertion': 'off',
  },
};
