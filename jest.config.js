module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect','<rootDir>/jest.setup.ts'],
  setupFiles: ['./jest.setup.js'],
};