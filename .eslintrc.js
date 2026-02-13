const config = require('@backstage/cli/config/eslint-factory')(__dirname);

// Disable the problematic no-useless-constructor rule that has a bug with certain TypeScript versions
module.exports = {
  ...config,
  ignorePatterns: [...(config.ignorePatterns || []), 'scripts/**'],
  rules: {
    ...config.rules,
    '@typescript-eslint/no-useless-constructor': 'off',
  },
};
