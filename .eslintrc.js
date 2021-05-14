module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  extends: ['prettier', 'plugin:prettier/recommended'],
  plugins: ['prettier'],
  rules: {
    quotes: [1, 'single'],
    // typedef: 'error',
    camelcase: 'off',
    'spaced-comment': 'off',
    'no-useless-constructor': 'off',
    '@typescript-eslint/no-useless-constructor': 'error'
  }
};
