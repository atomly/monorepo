var path = require('path');

module.exports = {
  plugins: ['jest'],
  extends: [path.resolve(__dirname, 'base-preset.js')],
  rules: {},
  overrides: [
    {
      files: ['*.test.ts', '*.spec.ts'],
      rules: {
        // https://github.com/jest-community/eslint-plugin-jest
        'jest/no-focused-tests': 'off',
        'jest/valid-expect': 'off',
        'jest/valid-expect-in-promise': 'off',
        'no-undef': 'off' // allows use of global `expect` assertions.
      }
    }
  ]
};
