module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
      useESM: true
    }
  },
  transform: {
    '^.+\\.ts$': ['ts-jest', { useESM: true }]
  },
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  extensionsToTreatAsEsm: ['.ts'],
  testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)']
};