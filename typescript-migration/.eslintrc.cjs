module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: ['@typescript-eslint'],
  extends: [],
  rules: {},
  env: {
    node: true,
    jest: true,
    es6: true,
  },
  ignorePatterns: ['dist/', 'node_modules/', '*.js', '*.d.ts'],
};
