/**
 * Jest test setup file
 */

// Global test configuration
global.console = {
  ...console,
  // Suppress console.log during tests unless needed
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: console.error, // Keep error logs
};

// Add any global test utilities or mocks here 