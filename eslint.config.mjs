import haskou from '@haskou/eslint-config';

export default [
  ...haskou,
  {
    rules: {
      'no-restricted-syntax': 'off',
    },
  },
];
