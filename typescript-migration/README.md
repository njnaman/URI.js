# TypeScript Migration

This directory contains the TypeScript migration of the URI.js library.

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation
```bash
npm install
```

### Development
```bash
# Build the project
npm run build

# Build and watch for changes
npm run build:watch

# Run development server
npm run dev

# Type checking without emitting files
npm run type-check

# Clean build directory
npm run clean
```

## Project Structure
```
typescript-migration/
├── src/           # TypeScript source files
├── dist/          # Compiled JavaScript output
├── tsconfig.json  # TypeScript configuration
└── package.json   # Project dependencies and scripts
```

## Migration Process

This project will incrementally migrate the original URI.js library from JavaScript to TypeScript, providing:
- Type safety
- Better IDE support
- Enhanced developer experience
- Maintained compatibility with existing code

## Build Output

The compiled JavaScript files are output to the `dist/` directory along with:
- Type declaration files (`.d.ts`)
- Source maps for debugging
- Declaration maps for TypeScript navigation 