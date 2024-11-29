module.exports = {
  collectCoverageFrom: ["src/**/*.{js,jsx}"],
  coverageDirectory: "coverage",
  testEnvironment: "jsdom",
  setupFiles: ["<rootDir>/setupTests.js"],
  setupFilesAfterEnv: ["<rootDir>/src/jest.setup.js"],
  moduleNameMapper: {
    "^src/(.*)$": "<rootDir>/src/$1",
    "^utils/(.*)$": "<rootDir>/src/utils/$1",
    "^components/(.*)$": "<rootDir>/src/components/$1",
    "^api/(.*)$": "<rootDir>/src/api/$1",
    "^.+\\.(css|png)$": "<rootDir>/src/jest-stub.js",
    "\\.(css|scss|sass)$": "identity-obj-proxy",
    "\\.(jpg|jpeg|png|gif|webp|svg)$": "<rootDir>/__mocks__/fileMock.js",
  },
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest",
  },
  transformIgnorePatterns: [
    "node_modules/(?!axios|@testing-library)"
  ]
};