/** @type {import('jest').Config} */
module.exports = {
  transform: {
    '^.+\\.vue$': '@vue/vue3-jest',
    '^.+\\.js$': 'babel-jest',
    '^.+\\.csv$': '<rootDir>/csvTransform.cjs', // updated here
  },
  moduleFileExtensions: ['js', 'json', 'vue', 'csv'],
  testEnvironment: 'jsdom',
  transformIgnorePatterns: ['/node_modules/'],
};
