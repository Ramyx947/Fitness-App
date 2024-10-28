module.exports = {
    preset: '@shelf/jest-mongodb',
    testPathIgnorePatterns: ['/node_modules/', '/__tests__/helpers/'],
    "maxWorkers": 1, // run tests sequentially to prevent errors from sharing the same in-memory database
    setupFiles: ['<rootDir>/jest.setup.js'],
  };