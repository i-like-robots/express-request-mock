module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [],
  overrides: [
    {
      files: ['lib/*.js', 'test/**/*.js'],
      extends: ['eslint:recommended'],
    },
  ],
}
