
const path = require('path');

module.exports = {
  root: true,
  plugins: ['@spotify', 'react', 'testing-library'],
  ignorePatterns: ['.eslintrc.js', '.eslintrc.cjs'],
  rules: {},
  overrides: [
    {
      files: ['**/*.[jt]s?(x)'],
      excludedFiles: '**/*.{test,spec}.[jt]s?(x)',
      rules: {
        'react/forbid-elements': [
          1,
          {
            forbid: [
              {
                element: 'button',
                message: 'use Material UI <Button> instead',
              },
              { element: 'p', message: 'use Material UI <Typography> instead' },
              {
                element: 'span',
                message: 'use a Material UI <Typography> variant instead',
              },
            ],
          },
        ],
      },
    },
  ],
};
