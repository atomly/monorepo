var path = require('path');

module.exports = {
  env: {
    browser: false,
    es2021: true,
    mocha: true,
    node: true
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'standard',
    path.resolve(__dirname, 'base-preset.js'),
    path.resolve(__dirname, 'jest-preset.js')
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12
  },
  rules: {
    '@typescript-eslint/explicit-member-accessibility': [
      'error',
      {
        accessibility: 'explicit',
        overrides: {
          accessors: 'explicit',
          constructors: 'no-public',
          methods: 'explicit',
          properties: 'off',
          parameterProperties: 'explicit'
        }
      }
    ],
    '@typescript-eslint/no-dupe-class-members': ['error'],
    'no-dupe-class-members': 'off',
    '@typescript-eslint/no-use-before-define': ['error'],
    'node/no-unsupported-features/es-syntax': [
      'error',
      { version: '10.0', ignores: ['modules'] }
    ],
    'no-use-before-define': 'off',
    '@typescript-eslint/no-unused-vars': ['error'],
    'no-unused-vars': 'off'
  }
};
