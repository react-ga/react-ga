module.exports = {
  parser: 'babel-eslint',
  extends: ['airbnb', 'prettier', 'plugin:jest/recommended'],
  plugins: ['prettier', 'jest'],
  env: {
    browser: true
  },
  rules: {
    'prettier/prettier': 'error',
    'react/no-find-dom-node': 'off',
    'arrow-body-style': 'off',
    'no-mixed-operators': 'off',
    'no-shadow': ['error', { allow: ['err', 'error'] }],
    'react/prefer-stateless-function': [
      'error',
      { ignorePureComponents: true }
    ],

    'no-console': ['error', { allow: ['warn', 'error', 'info'] }],
    'no-underscore-dangle': 'off',
    'guard-for-in': 'off',
    'no-param-reassign': ['error', { props: false }],
    'jsx-a11y/label-has-associated-control': 'off',
    'jsx-a11y/control-has-associated-control': 'off',
    'react/jsx-curly-brace-presence': 'off',
    'react/jsx-one-expression-per-line': 'off',
    'react/jsx-props-no-spreading': 'off'
  },
  overrides: [
    {
      files: ['demo/**/*', 'src/components/*.js'],
      rules: {
        'import/no-extraneous-dependencies': [
          'error',
          { devDependencies: true }
        ],
        'import/no-named-as-default-member': 'off',
        'react/no-array-index-key': 'off',
        'react/jsx-no-bind': 'off',
        'react/prop-types': 'off'
      }
    },
    {
      files: ['test/**/*'],
      env: {
        browser: true,
        node: true,
        'jest/globals': true
      },
      rules: {
        'import/no-extraneous-dependencies': [
          'error',
          { devDependencies: true }
        ]
      }
    }
  ]
};
