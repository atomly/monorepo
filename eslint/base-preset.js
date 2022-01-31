module.exports = {
  extends: ['eslint:recommended', 'prettier'],
  plugins: ['prettier'],
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
    // 'prettier/prettier': 'error',
    'prettier/prettier': [
      'error',
      {
        // singleQuote: true,
        // parser: 'flow',
        semi: true,
        trailingComma: 'none',
        singleQuote: true,
        tabWidth: 2,
        printWidth: 80
      }
    ],
    'arrow-body-style': 'off',
    'comma-dangle': [
      'error',
      {
        arrays: 'never',
        objects: 'never',
        imports: 'never',
        exports: 'never',
        functions: 'never'
      }
    ],
    'no-console': ['warn', { allow: ['warn', 'error', 'debug', 'info'] }],
    'padded-blocks': ['error', 'never'],
    'prefer-arrow-callback': 'off'
  }
};
