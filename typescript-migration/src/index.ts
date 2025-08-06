/**
 * TypeScript Migration Entry Point
 * 
 * This file serves as the main entry point for the TypeScript migration
 * of the URI.js library.
 */

import URI from './URI';
import punycode from './punycode';
import IPv6Module from './IPv6';

// Export the main URI class as the default export
export default URI;

// Export individual modules
export { punycode };
export { IPv6Module as IPv6 };

// Export types
export * from './types';

// Re-export URI as named export for convenience
export { URI }; 