module.exports = {
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['/node_modules/', '.git'],
  transformIgnorePatterns: [
    'node_modules/(?!(uuid)/)',
  ],
  setupFiles: ['./tests/setup.js'],
  automock: false,
  modulePaths: ['<rootDir>']
};
