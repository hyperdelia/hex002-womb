module.exports = {
  'extends': ['eslint:recommended'],
  'env': {
    'browser': true,
    'node': true,
    'es6': true,
  },
  'parserOptions': {
    'sourceType': 'module'
  },
  'rules': {
    'indent': ['error', 2, {"SwitchCase": 1}],
    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],
    'space-before-function-paren': ['error', 'never'],
    'object-curly-spacing': ['error', 'always'],
    'keyword-spacing': ['error', { 'before': true }],
    'no-unreachable': 'warn',
    'no-console': 'off',
    'no-unused-vars': 'warn',
  }
};
