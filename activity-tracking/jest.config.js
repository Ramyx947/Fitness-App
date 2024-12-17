module.exports = {
  testPathIgnorePatterns: ['/node_modules/', '/__tests__/helpers/', '/utils/'],
  maxWorkers: 1, // Run tests sequentially to prevent issues with shared resources
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'node',
  globalSetup: './utils/setup.js',
  globalTeardown: './utils/teardown.js',
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest",
  },
  transformIgnorePatterns: ["node_modules/(?!axios|@testing-library)"],
  moduleNameMapper: {
    "^.+\\.(css|png)$": "<rootDir>/src/jest-stub.js",
  },
  collectCoverageFrom: ["src/**/*.{js,jsx}"],
  coverageDirectory: "coverage",
  testTimeout: 30000,
};