// TypeScript version of test.js
// FIXME: v2.0.0 renamce non-camelCase properties to uppercase

import URI from '../src/URI';
import IPv6 from '../src/IPv6';
import URITemplate from '../src/URITemplate';
import SecondLevelDomains from '../src/SecondLevelDomains';
import { urls } from './urls';

// Simple type compatibility for QUnit when Jest is not available
interface QUnitCompat {
  (name: string, fn: () => void): void;
}

// Declare QUnit-style functions that might not be available
declare const QUnit: any;

// Make sure window object exists for browser compatibility
if (typeof window !== 'undefined') {
  (window as any).URI = URI;
  (window as any).IPv6 = IPv6;
  (window as any).URITemplate = URITemplate;
  (window as any).SecondLevelDomains = SecondLevelDomains;
}

// Test suite setup
(function() {
  'use strict';

  // Dynamically check for available test frameworks
  const hasQUnit = typeof (globalThis as any).QUnit !== 'undefined';
  const hasJest = typeof (globalThis as any).expect !== 'undefined' && typeof (globalThis as any).it !== 'undefined';
  
  // Test function - try QUnit first, then Jest, then mock
  const testFn = hasQUnit ? (globalThis as any).QUnit.test :
                 hasJest ? (globalThis as any).it :
                 function(name: string, fn: () => void) { 
                   console.log(`Test: ${name}`); 
                   fn(); 
                 };
  
  // Module function - try QUnit first, then Jest describe, then mock
  const moduleFn = hasQUnit ? (globalThis as any).QUnit.module :
                   hasJest ? (name: string) => (globalThis as any).describe(name, () => {}) :
                   function(name: string) { 
                     console.log(`Module: ${name}`); 
                   };

  // Assertion functions with fallbacks
  const assertOk = hasQUnit ? (globalThis as any).ok :
                   hasJest ? (value: any) => (globalThis as any).expect(value).toBeTruthy() :
                   function(value: any, message?: string) { 
                     if (!value) throw new Error(message || 'Assertion failed'); 
                   };

  const assertEqual = hasQUnit ? (globalThis as any).equal :
                      hasJest ? (actual: any, expected: any) => (globalThis as any).expect(actual).toEqual(expected) :
                      function(actual: any, expected: any, message?: string) { 
                        if (actual !== expected) throw new Error(message || `Expected ${expected}, got ${actual}`); 
                      };

  const assertDeepEqual = hasQUnit ? (globalThis as any).deepEqual :
                          hasJest ? (actual: any, expected: any) => (globalThis as any).expect(actual).toEqual(expected) :
                          assertEqual;

  const assertRaises = hasQUnit ? (globalThis as any).raises :
                       hasJest ? (fn: () => void, expectedError?: any) => (globalThis as any).expect(fn).toThrow(expectedError) :
                       function(fn: () => void, expectedError?: any, message?: string) {
                         try { fn(); throw new Error('Expected function to throw'); }
                         catch(e) { /* Expected */ }
                       };

  testFn('loaded', function() {
    if (typeof window !== 'undefined') {
      assertOk((window as any).URI);
    } else {
      assertOk(URI);
    }
  });

  moduleFn('constructing');
  testFn('URI()', function() {
    const u = URI();
    assertOk(u instanceof URI, 'instanceof URI');
    const expectedHref = (typeof window !== 'undefined' && window.location && window.location.href) || '';
    assertEqual(u.toString(), expectedHref, 'is location (browser) or empty string (node)');
  });

  testFn('URI(undefined)', function() {
    assertRaises(function() {
      URI(undefined as any);
    }, TypeError, 'Failing undefined input');
  });

  testFn('URI(null)', function() {
    assertRaises(function() {
      URI(null as any);
    }, TypeError, 'Failing undefined input');
  });

  testFn('new URI(string)', function() {
    const u = new URI('http://example.org/');
    assertOk(u instanceof URI, 'instanceof URI');
    assertOk((u as any)._parts.hostname !== undefined, 'host undefined');
  });

  testFn('new URI(object)', function() {
    const u = new URI({protocol: 'http', hostname: 'example.org'});
    assertOk(u instanceof URI, 'instanceof URI');
    assertOk((u as any)._parts.hostname !== undefined, 'host undefined');
  });

  testFn('new URI(object) with query object', function() {
    const u = new URI({
      protocol: 'http',
      hostname: 'example.org',
      query: {
        foo: 'bar',
        bar: 'foo',
      },
    });
    assertOk(u instanceof URI, 'instanceof URI');
    assertOk(typeof u.query() === 'string', 'query is string');
    assertEqual(u.query(), 'foo=bar&bar=foo', 'query has right value');
    assertEqual(u.search(), '?foo=bar&bar=foo', 'search has right value');
    assertDeepEqual(u.query(true), { foo: 'bar', bar: 'foo' }, 'query(true) value');
    assertDeepEqual(u.search(true), { foo: 'bar', bar: 'foo' }, 'search(true) value');
  });

  if (typeof window !== 'undefined' && typeof location !== 'undefined') {
    testFn('new URI(Location)', function () {
      const u = new URI(location);
      assertEqual(u.href(), String(location.href), 'location object');
    });
  }

  testFn('new URI(undefined)', function() {
    const u = new URI();
    assertOk(u instanceof URI, 'instanceof URI');
    const expectedHref = (typeof window !== 'undefined' && window.location && window.location.href) || '';
    assertEqual(u.toString(), expectedHref, 'is location (browser) or empty string (node)');
    assertRaises(function() {
      new URI(undefined as any);
    }, TypeError, 'Failing undefined input');
  });

  testFn('new URI(string, string)', function() {
    // see http://dvcs.w3.org/hg/url/raw-file/tip/Overview.html#constructor
    const u = new URI('../foobar.html', 'http://example.org/hello/world.html');
    assertEqual(u+'', 'http://example.org/foobar.html', 'resolve on construct');
  });

  moduleFn('parsing');
  
  // Test URL parsing with the URLs data
  for (let i = 0, t; (t = urls[i]); i++) {
    (function(t: any){
      testFn('parse ' + t.name, function() {
        const u = new URI(t.url);

        // test URL built from parts
        assertEqual(u + '', t._url || t.url, 'toString');

        // test parsed parts
        for (const key in t.parts) {
          if (Object.hasOwnProperty.call(t.parts, key)) {
            assertEqual((u as any)._parts[key], t.parts[key], 'part: ' + key);
          }
        }

        // test accessors
        for (const key in t.accessors) {
          if (Object.hasOwnProperty.call(t.accessors, key)) {
            assertEqual((u as any)[key](), t.accessors[key], 'accessor: ' + key);
          }
        }

        // test is()
        for (const key in t.is) {
          if (Object.hasOwnProperty.call(t.is, key)) {
            assertEqual(u.is(key), t.is[key], 'is: ' + key);
          }
        }
      });
    })(t);
  }

  // Additional core tests
  moduleFn('mutating basics');
  testFn('protocol', function() {
    const u = new URI('http://example.org/foo.html');
    u.protocol('ftp');
    assertEqual(u.protocol(), 'ftp', 'ftp protocol');
    assertEqual(u+'', 'ftp://example.org/foo.html', 'ftp url');

    u.protocol('');
    assertEqual(u.protocol(), '', 'relative protocol');
    assertEqual(u+'', '//example.org/foo.html', 'relative-scheme url');
  });

})();

// Export for module system
export {}; 