export default {
  roots: ['<rootDir>/src'],
  collectCoverageFrom: [
    '<rootDir>/src/**/*.{ts,tsx}',
    '!<rootDir>/src/application/**/*',
    '!<rootDir>/src/redux/**/*',
    '!**/*.d.ts',
    '!**/*.png',
    '!**/*.svg'
  ],
  coverageDirectory: 'coverage',
  setupFilesAfterEnv: ['<rootDir>/src/application/scripts/jestSetup.ts'],
  testEnvironment: 'jsdom',
  transform: {
    '.+\\.(ts|tsx)$': 'ts-jest',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/src/application/scripts/fileTransformer.js'
  },
  moduleNameMapper: {
    '~/(.*)': '<rootDir>/src/$1',
    '\\.scss$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/src/application/scripts/assetsTransformer.ts',
    '\\.(css|less)$': '<rootDir>/src/application/scripts/assetsTransformer.ts'
  }
}
