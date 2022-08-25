module.exports = {
  bail: true,
  clearMocks: true,
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/app.js',
    '!src/routes/**',
    '!src/validations/**',
    '!src/utilities/constants.js',
  ],
  errorOnDeprecated: true,
  globalSetup: '<rootDir>/tests/setup.js',
  testEnvironment: 'node',
}
