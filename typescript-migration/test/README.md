# URI.js TypeScript Test Suite

This directory contains the complete test suite for the TypeScript migration of URI.js, supporting both browser-based QUnit tests and Node.js Jest tests.

## 📁 Test File Structure

### TypeScript Test Files (Node.js/Jest)
- `test.ts` - Core URI functionality tests (main test suite)
- `test_jim.ts` - Edge case and injection tests
- `test_template.ts` - URI Template functionality tests  
- `test_fragmentQuery.ts` - Fragment query handling tests
- `test_fragmentURI.ts` - Fragment URI tests
- `test_jquery.ts` - jQuery integration tests (adapted for Node.js)
- `urls.ts` - Test URL data and test cases
- `pre_libs.ts` - Pre-library setup for testing

### HTML Test Files (Browser/QUnit)
- `test.URI.html` - Main URI browser test suite
- `test.jQuery-1.12.4.html` - jQuery 1.12.4 compatibility tests
- `test.jQuery-2.2.4.html` - jQuery 2.2.4 compatibility tests  
- `test.jQuery-3.6.0.html` - jQuery 3.6.0 compatibility tests
- `test.fragmentQuery.html` - Fragment query browser tests
- `test.fragmentURI.html` - Fragment URI browser tests
- `index.html` - Composite test runner for all QUnit suites

### Framework Files
- `qunit/` - QUnit testing framework
  - `qunit.js` - QUnit JavaScript framework
  - `qunit.css` - QUnit styling
  - `qunit.d.ts` - TypeScript declarations for QUnit
  - `qunit-composite.js` - QUnit composite test runner

### Utilities
- `test-runner.ts` - Unified test runner and environment checker

## 🧪 Running Tests

### Quick Start
```bash
# 1. Build the TypeScript code
npm run build

# 2. Run Node.js tests
npm test

# 3. View test environment info
npm run test:info

# 4. Run browser tests
npm run test:browser
# Then open test/test.URI.html in your browser
```

### Node.js Tests (Jest)
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Type check without running tests
npm run type-check
```

### Browser Tests (QUnit)
```bash
# Build first (required)
npm run build

# Then open in browser:
open test/test.URI.html           # Main test suite
open test/index.html              # All test suites
open test/test.jQuery-3.6.0.html  # Specific jQuery version
```

## 🔧 Development Workflow

### 1. TypeScript Development
```bash
# Watch mode for continuous compilation
npm run build:watch

# In another terminal, watch tests
npm run test:watch
```

### 2. Testing Changes
```bash
# Quick verification
npm run test:info

# Full test suite
npm test && npm run test:browser
```

### 3. Pre-commit Checks
```bash
# Full build and test
npm run build:full

# Linting
npm run lint:fix
```

## 📊 Test Coverage

The TypeScript migration includes:

- ✅ **7 TypeScript test files** - Full Node.js Jest compatibility
- ✅ **6 HTML test files** - Complete browser QUnit suite  
- ✅ **Type-safe test framework** - QUnit TypeScript declarations
- ✅ **Dual environment support** - Node.js and browser testing
- ✅ **Legacy compatibility** - All original test cases preserved

### Original vs TypeScript Test Mapping

| Original JS | TypeScript | Framework | Status |
|------------|------------|-----------|---------|
| `test.js` | `test.ts` | Jest/QUnit | ✅ Migrated |
| `test_jim.js` | `test_jim.ts` | Jest | ✅ Migrated |
| `test_template.js` | `test_template.ts` | Jest | ✅ Migrated |
| `test_fragmentQuery.js` | `test_fragmentQuery.ts` | Jest | ✅ Migrated |
| `test_fragmentURI.js` | `test_fragmentURI.ts` | Jest | ✅ Migrated |
| `test_jquery.js` | `test_jquery.ts` | Jest | ✅ Migrated |
| `urls.js` | `urls.ts` | Data | ✅ Migrated |
| `pre_libs.js` | `pre_libs.ts` | Setup | ✅ Migrated |

## 🎯 Key Features

### Type Safety
- Full TypeScript type checking for all test code
- QUnit TypeScript declarations for browser tests
- Jest integration for Node.js testing

### Cross-Environment Compatibility  
- **Node.js**: Jest framework with TypeScript support
- **Browser**: QUnit framework with compiled JavaScript
- **Dual compatibility**: Tests work in both environments

### Modern Testing Features
- ES6+ syntax with TypeScript transpilation
- Async/await support
- Module imports/exports
- Code coverage reporting
- Watch mode for development

### Legacy Preservation
- All original test cases maintained
- QUnit browser tests still functional
- jQuery compatibility tests preserved
- Test data and edge cases intact

## 🚀 Advanced Usage

### Custom Test Configuration

You can modify test behavior through:

1. **Jest Configuration** (`jest.config.js`)
2. **TypeScript Configuration** (`tsconfig.json`)  
3. **Test Runner Settings** (`test/test-runner.ts`)

### Adding New Tests

```typescript
// For Node.js tests (test/new-feature.ts)
import URI from '../src/URI';

describe('New Feature', () => {
  test('should work correctly', () => {
    const uri = new URI('http://example.com');
    expect(uri.hostname()).toBe('example.com');
  });
});
```

```html
<!-- For browser tests (test/new-feature.html) -->
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="qunit/qunit.css">
    <script src="qunit/qunit.js"></script>
    <script src="../dist/URI.js"></script>
</head>
<body>
    <div id="qunit"></div>
    <script>
        test('New Feature', function() {
            var uri = new URI('http://example.com');
            equal(uri.hostname(), 'example.com');
        });
    </script>
</body>
</html>
```

## 📈 Migration Benefits

1. **Type Safety**: Catch errors at compile time
2. **Better IDE Support**: IntelliSense and refactoring tools  
3. **Modern JavaScript**: ES6+ features and async/await
4. **Improved Maintainability**: Clear interfaces and documentation
5. **Dual Testing**: Both Node.js and browser environments
6. **Continuous Integration**: Easy integration with CI/CD pipelines

## 🔍 Troubleshooting

### Common Issues

**Tests not running**: Ensure you've built the TypeScript code first:
```bash
npm run build
```

**Type errors**: Check TypeScript configuration:
```bash
npm run type-check
```

**Missing files**: Verify test environment:
```bash
npm run test:info
```

**Browser tests failing**: Check browser console for JavaScript errors and ensure compiled files exist in `../dist/`

### Getting Help

For issues specific to the TypeScript migration:
1. Check `npm run test:info` for environment status
2. Verify all TypeScript files compile with `npm run type-check`
3. Ensure original JavaScript tests pass as reference
4. Check browser developer tools for runtime errors 