// See: https://jestjs.io/docs/configuration

/** @type {import('@jest/types').Config.InitialOptions} **/
export default {
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: ["./src/**"],
  coverageDirectory: "./coverage",
  coveragePathIgnorePatterns: [
    "__mocks__",
    "/node_modules/",
    "/dist/",
    "src/schema/",
  ],
  coverageReporters: ["json-summary", "json", "text-summary"],
  coverageThreshold: {
    branches: 95,
    functions: 95,
    lines: 95,
    statements: 95,
  },
  extensionsToTreatAsEsm: [".ts"],
  moduleFileExtensions: ["ts", "js"],
  preset: "ts-jest",
  reporters: ["default"],
  resolver: "ts-jest-resolver",
  setupFilesAfterEnv: [],
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.ts?(x)", "**/?(*.)+(spec|test).ts?(x)"],
  testPathIgnorePatterns: ["/dist/", "/node_modules/", "__mocks__"],
  transform: {
    "^.+\\.ts$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.eslint.json",
        useESM: true,
      },
    ],
  },
  transformIgnorePatterns: [
    "node_modules/(?!@jest/)",
    ".*\\.(spec|test)\\.(js|jsx)$",
  ],
  verbose: true,
};
