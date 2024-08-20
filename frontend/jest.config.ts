import type { Config } from 'jest'
import nextJest from 'next/jest.js'
 
const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})
 
// Add any custom config to be passed to Jest
const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  // transform: {
  //   "^.+\\.jsx?$": "babel-jest"
  // },
  // transformIgnorePatterns: [
  //   "/node_modules/(?!(react-social-icons)/)"
  // ],
  // Add more setup options before each test is run
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    // ...
    // '^@/components/(.*)$': '<rootDir>/components/$1',
    "^react-social-icons(.*)$": "<rootDir>/__mocks__/react-social-icons.tsx",
    '^@/components/(.*)$': '<rootDir>/__mocks__/components/$1',
    '^@/next/(.*)$': '<rootDir>/__mocks__/next/$1',
  },
  reporters: [
    "default",
    ["./node_modules/jest-html-reporter", {
      "pageTitle": "Test Report"
    }]
  ],
  testResultsProcessor: "./node_modules/jest-html-reporter"
}
 
// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config)