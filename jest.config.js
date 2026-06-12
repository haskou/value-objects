/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  coverageDirectory: '<rootDir>/tests/coverage',
  coveragePathIgnorePatterns: ['<rootDir>/node_modules/', 'index.ts'],
  coverageReporters: ['html', 'lcov', 'text'],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  moduleDirectories: ['node_modules', 'src'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '^@app/(.*)$': '<rootDir>/src/$1',
  },
  preset: 'ts-jest',
  roots: ['<rootDir>/src/', '<rootDir>/tests/'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.jest.ts'],
  testEnvironment: 'node',
  testPathIgnorePatterns: ['<rootDir>/node_modules/', 'index.ts'],
  transform: {
    '^.+\\.js$': 'ts-jest',
    '^.+\\.ts': ['ts-jest', { tsconfig: 'tsconfig.jest.json' }],
  },
  transformIgnorePatterns: [
    'node_modules/(?!(@noble/ciphers|@noble/curves|@noble/hashes)/)',
  ],
  verbose: true,
};

module.exports = config;
