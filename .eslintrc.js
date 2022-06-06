module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ['plugin:react/recommended', 'airbnb', 'prettier'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react'],
  rules: {
    camelcase: 'off',
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: true,
        optionalDependencies: false,
        peerDependencies: false,
      },
    ],
    'new-cap': ['error', { newIsCap: false }],
  },
  settings: {
    'import/resolver': {
      alias: [
        ['@src', './client/src'],
        ['@scss', './client/src/assets/scss'],
        ['@img', './client/src/assets/img'],
        ['@ico', './client/src/assets/ico'],
        ['@comps', './client/src/components'],
      ],
    },
  },
};
