module.exports = {
  extends: ['stylelint-config-standard'],
  plugins: ['stylelint-order', 'stylelint-prettier'],
  rules: {
    'selector-class-pattern': '^[A-Z][A-Za-z-_]*$',
    'prettier/prettier': true,
    'color-named': 'never',
    'no-descending-specificity': null,
    'selector-pseudo-class-no-unknown': [true, { ignorePseudoClasses: ['focus-visible', 'global'] }],
    'rule-empty-line-before': ['always', { except: ['after-single-line-comment', 'first-nested'] }],
    'declaration-empty-line-before': ['never', { ignore: ['after-declaration'] }],
    'order/order': ['custom-properties', 'declarations', 'rules'],
  },
  ignoreFiles: ['.github/*', 'dist/*', 'node_modules/*', '.parcel-cache/*'],
};
