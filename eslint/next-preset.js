var path = require('path');

module.exports = {
  extends: ['next', path.resolve(__dirname, 'base-preset.js')],
  settings: {
    next: {
      rootDir: ['apps/*/', 'packages/*/']
    }
  },
  rules: {
    '@next/next/no-html-link-for-pages': 'off'
  }
};
