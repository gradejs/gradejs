module.exports = {
  testEnvironment: 'node',
  roots: ['src'],
  preset: 'ts-jest',
  moduleFileExtensions: ['ts', 'js', 'json'],
  moduleNameMapper: {
    '^@gradejs-public/(.*)$': '<rootDir>/../$1/src',
  },
  clearMocks: true,
};
