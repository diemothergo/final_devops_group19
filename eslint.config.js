// ESLint configuration migrated to the new flat config format for ESLint v9+
/** @type {import('eslint').Linter.FlatConfig} */
module.exports = [
  {
    languageOptions: {
      ecmaVersion: 12,
      sourceType: 'module',
      globals: {
        ...require('eslint/conf/environments').node.globals,
        ...require('eslint/conf/environments').es2021.globals,
      },
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'off',
    },
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
  },
  {
    ignores: ['node_modules/**'],
  },
];
