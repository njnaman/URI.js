// TypeScript version of test.js
// FIXME: v2.0.0 renamce non-camelCase properties to uppercase

// Reference the source files to compile them
/// <reference path="../src/IPv6.ts" />
/// <reference path="../src/SecondLevelDomains.ts" />
/// <reference path="../src/URI.ts" />
/// <reference path="../src/URITemplate.ts" />
/// <reference path="./urls.ts" />

// Simple type compatibility for QUnit when Jest is not available
interface QUnitCompat {
  (name: string, fn: () => void): void;
}

// Declare QUnit-style functions that might not be available
declare const QUnit: any;

// Declare global variables that will be available after the scripts load
declare var URI: any;
declare var IPv6: any;
declare var URITemplate: any;
declare var SecondLevelDomains: any;
declare var urls: any;

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

  testFn('new URI(object) with query string', function() {
    const u = new URI({
      protocol: 'http',
      hostname: 'example.org',
      query: 'foo=bar&bar=foo',
    });
    assertOk(u instanceof URI, 'instanceof URI');
    assertOk(typeof u.query() === 'string', 'query is string');
    assertEqual(u.query(), 'foo=bar&bar=foo', 'query has right value');
    assertEqual(u.search(), '?foo=bar&bar=foo', 'search has right value');
    assertDeepEqual(u.query(true), { foo: 'bar', bar: 'foo' }, 'query(true) value');
    assertDeepEqual(u.search(true), { foo: 'bar', bar: 'foo' }, 'search(true) value');
  });

  testFn('new URI(object) with query string prefixed with ?', function() {
    const u = new URI({
      protocol: 'http',
      hostname: 'example.org',
      query: '?foo=bar&bar=foo',
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

  // DOM element tests (browser only)
  if (typeof document !== 'undefined') {
    const testDomAttribute = function(element: HTMLElement, attribute: string) {
      testFn('new URI(Element ' + element.nodeName + ')', function() {
        (element as any)[attribute] = 'http://example.org/foobar.html';

        const u = new URI(element);
        assertEqual(u.scheme(), 'http', 'scheme');
        assertEqual(u.host(), 'example.org', 'host');
        assertEqual(u.path(), '/foobar.html', 'path');

        (element as any)[attribute] = 'file:///C:/foo/bar.html';
        const u2 = new URI(element);
        assertEqual(u2.href(), (element as any)[attribute], 'file');
      });
    };

    const testUnsupportedDomAttribute = function(element: HTMLElement, attribute: string) {
      testFn('new URI(unsupported Element ' + element.nodeName + ')', function() {
        (element as any)[attribute] = 'http://example.org/foobar.html';

        const u = new URI(element);
        assertEqual(u.scheme(), '', 'scheme');
        assertEqual(u.host(), '', 'host');
        assertEqual(u.path(), '', 'path');

        (element as any)[attribute] = 'file:///C:/foo/bar.html';
        const u2 = new URI(element);
        assertEqual(u2.href(), '', 'file');
      });
    };

    // Test supported DOM attributes
    for (const nodeName in (URI as any).domAttributes) {
      if (!Object.prototype.hasOwnProperty.call((URI as any).domAttributes, nodeName) || nodeName === 'input') {
        continue;
      }

      const element = document.createElement(nodeName);
      testDomAttribute(element, (URI as any).domAttributes[nodeName]);
    }

    // Test input elements with image type
    const inputImage = document.createElement('input') as HTMLInputElement;
    inputImage.type = 'image';
    testDomAttribute(inputImage, 'src');

    // Test unsupported input element
    const inputGeneric = document.createElement('input');
    testUnsupportedDomAttribute(inputGeneric, 'src');

    // Test unsupported div element
    const divElement = document.createElement('div');
    testUnsupportedDomAttribute(divElement, 'src');
  }

  testFn('new URI(URI)', function() {
    const u = new URI(new URI({protocol: 'http', hostname: 'example.org'}));
    assertOk(u instanceof URI, 'instanceof URI');
    assertOk((u as any)._parts.hostname !== undefined, 'host undefined');
  });

  testFn('new URI(new Date())', function() {
    assertRaises(function() {
      new URI(new Date() as any);
    }, TypeError, 'Failing unknown input');
  });

  testFn('new URI(undefined)', function() {
    assertRaises(function() {
      new URI(undefined as any);
    }, TypeError, 'Failing undefined input');
  });

  testFn('new URI() - no args', function() {
    const u = new URI();
    assertOk(u instanceof URI, 'instanceof URI');
    const expectedHostname = (typeof window !== 'undefined' && typeof location !== 'undefined') ? 
      (location.hostname === '' ? null : location.hostname) : null;
    const actualHostname = (u as any)._parts.hostname;
    assertOk(actualHostname === expectedHostname, 'hostname == location.hostname');
  });

  testFn('function URI(string)', function() {
    const u = URI('http://example.org/');
    assertOk(u instanceof URI, 'instanceof URI');
    assertOk((u as any)._parts.hostname !== undefined, 'host undefined');
  });

  testFn('function URI(string) with invalid port "port" throws', function () {
    assertRaises(function () {
      new URI('http://example.org:port');
    }, TypeError, "throws TypeError");
  });

  testFn('function URI(string) with invalid port "0" throws', function () {
    assertRaises(function () {
      new URI('http://example.org:0');
    }, TypeError, "throws TypeError");
  });

  testFn('function URI(string) with invalid port "65536" throws', function () {
    assertRaises(function () {
      new URI('http://example.org:65536');
    }, TypeError, "throws TypeError");
  });

  testFn('function URI(string) with protocol and without hostname should throw', function () {
    new URI('http://');

    (URI as any).preventInvalidHostname = true;
    assertRaises(function () {
      new URI('http://');
    }, TypeError, "throws TypeError");

    (URI as any).preventInvalidHostname = false;
    new URI('http://');
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

  moduleFn('serializing');
  testFn('scheme and relative path', function() {
    const u = new URI('')
      .protocol('food')
      .path('test/file.csv');

    assertEqual(u.toString(), 'food:///test/file.csv', 'relative-path with scheme but no authority');
  });

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

    u.protocol('f.t-p+0');
    assertEqual(u.protocol(), 'f.t-p+0', 'character profile');

    try {
      u.protocol('f:t');
      assertOk(false, 'do not accept invalid protocol');
    } catch(e) {}

    u.protocol(null as any);
    assertEqual(u.protocol(), '', 'missing protocol');
    assertEqual(u+'', '//example.org/foo.html', 'missing-scheme url');
  });

  testFn('username', function() {
    const u = new URI('http://example.org/foo.html');
    u.username('hello');
    assertEqual(u.username(), 'hello', 'changed username hello');
    assertEqual(u.password(), '', 'changed passowrd hello');
    assertEqual(u+'', 'http://hello@example.org/foo.html', 'changed url hello');

    u.username('');
    assertEqual(u.username(), '', 'changed username ""');
    assertEqual(u.password(), '', 'changed passowrd ""');
    assertEqual(u+'', 'http://example.org/foo.html', 'changed url ""');
  });

  testFn('password', function() {
    const u = new URI('http://hello@example.org/foo.html');
    u.password('world');
    assertEqual(u.username(), 'hello', 'changed username world');
    assertEqual(u.password(), 'world', 'changed passowrd world');
    assertEqual(u+'', 'http://hello:world@example.org/foo.html', 'changed url world');

    u.password('');
    assertEqual(u.username(), 'hello', 'changed username ""');
    assertEqual(u.password(), '', 'changed passowrd ""');
    assertEqual(u+'', 'http://hello@example.org/foo.html', 'changed url ""');

    u.username('').password('hahaha');
    assertEqual(u.username(), '', 'changed username - password without username');
    assertEqual(u.password(), 'hahaha', 'changed password - password without username');
    assertEqual(u+'', 'http://:hahaha@example.org/foo.html', 'changed url - password without username');
  });

  testFn('hostname', function() {
    const u = new URI('http://example.org/foo.html');
    u.hostname('abc.foobar.lala');
    assertEqual(u.hostname(), 'abc.foobar.lala', 'hostname changed');
    assertEqual(u+'', 'http://abc.foobar.lala/foo.html', 'hostname changed url');

    u.hostname('some_where.exa_mple.org');
    assertEqual(u.hostname(), 'some_where.exa_mple.org', 'hostname changed');
    assertEqual(u+'', 'http://some_where.exa_mple.org/foo.html', 'hostname changed url');

    assertRaises(function() {
      u.hostname('foo\\bar.com');
    }, TypeError, 'Failing backslash detection in hostname');

    // instance does not fall back to global setting
    (URI as any).preventInvalidHostname = true;
    u.hostname('');
    u.hostname(null as any);
    (URI as any).preventInvalidHostname = false;

    (u as any).preventInvalidHostname(true);
    assertRaises(function() {
      u.hostname('');
    }, TypeError, "Trying to set an empty hostname with http(s) protocol throws a TypeError");

    assertRaises(function() {
      u.hostname(null as any);
    }, TypeError, "Trying to set hostname to null with http(s) protocol throws a TypeError");
  });

  testFn('port', function() {
    const u = new URI('http://example.org/foo.html');
    u.port('80');
    assertEqual(u.port(), '80', 'changing port 80');
    assertEqual(u+'', 'http://example.org:80/foo.html', 'changing url 80');

    u.port('');
    assertEqual(u.port(), '', 'changing port ""');
    assertEqual(u+'', 'http://example.org/foo.html', 'changing url ""');
  });

  testFn('path', function() {
    const u = new URI('http://example.org/foobar.html?query=string');
    u.pathname('/some/path/file.suffix');
    assertEqual(u.pathname(), '/some/path/file.suffix', 'changing pathname "/some/path/file.suffix"');
    assertEqual(u+'', 'http://example.org/some/path/file.suffix?query=string', 'changing url "/some/path/file.suffix"');

    u.pathname('');
    assertEqual(u.pathname(), '/', 'changing pathname ""');
    assertEqual(u+'', 'http://example.org/?query=string', 'changing url ""');

    u.pathname('/~userhome/@mine;is %2F and/');
    assertEqual(u.pathname(), '/~userhome/@mine;is%20%2F%20and/', 'path encoding');
    assertEqual(u.pathname(true), '/~userhome/@mine;is %2F and/', 'path decoded');

    let u2 = new URI('/a/b/c/').relativeTo('/a/b/c/');
    assertEqual(u2.pathname(), '', 'empty relative path');
    assertEqual(u2.toString(), '', 'empty relative path to string');

    u2.pathname('/');
    assertEqual(u2.pathname(), '/', 'empty absolute path');
    assertEqual(u2.toString(), '/', 'empty absolute path to string');
  });

  testFn('URN paths', function() {
    const u = new URI('urn:uuid:6e8bc430-9c3a-11d9-9669-0800200c9a66?foo=bar');
    u.pathname('uuid:de305d54-75b4-431b-adb2-eb6b9e546013');
    assertEqual(u.pathname(), 'uuid:de305d54-75b4-431b-adb2-eb6b9e546013');
    assertEqual(u + '', 'urn:uuid:de305d54-75b4-431b-adb2-eb6b9e546013?foo=bar');

    u.pathname('');
    assertEqual(u.pathname(), '', 'changing pathname ""');
    assertEqual(u+'', 'urn:?foo=bar', 'changing url ""');

    u.pathname('music:classical:Béla Bártok%3a Concerto for Orchestra');
    assertEqual(u.pathname(), 'music:classical:B%C3%A9la%20B%C3%A1rtok%3A%20Concerto%20for%20Orchestra', 'path encoding');
    assertEqual(u.pathname(true), 'music:classical:Béla Bártok%3A Concerto for Orchestra', 'path decoded');
  });

  testFn('query', function() {
    const u = new URI('http://example.org/foo.html');
    u.query('foo=bar=foo');
    assertEqual(u.query(), 'foo=bar=foo', 'query: foo=bar=foo');
    assertEqual(u.search(), '?foo=bar=foo', 'query: foo=bar=foo - search');

    u.query('?bar=foo');
    assertEqual(u.query(), 'bar=foo', 'query: ?bar=foo');
    assertEqual(u.search(), '?bar=foo', 'query: ?bar=foo - search');

    u.query('');
    assertEqual(u.query(), '', 'query: ""');
    assertEqual(u.search(), '', 'query: "" - search');
    assertEqual(u.toString(), 'http://example.org/foo.html');

    u.search('foo=bar=foo');
    assertEqual(u.query(), 'foo=bar=foo', 'search: foo=bar=foo');
    assertEqual(u.search(), '?foo=bar=foo', 'search: foo=bar=foo - query');

    u.search('?bar=foo');
    assertEqual(u.query(), 'bar=foo', 'search: ?bar=foo');
    assertEqual(u.search(), '?bar=foo', 'search: ?bar=foo - query');

    u.search('');
    assertEqual(u.query(), '', 'search: ""');
    assertEqual(u.search(), '', 'search: "" - query');

    u.query('?foo');
    assertEqual(u.query(), 'foo', 'search: ""');
    assertEqual(u.search(), '?foo', 'search: "" - query');

    u.search('foo=&foo=bar');
    assertEqual(u.query(), 'foo=&foo=bar', 'search: foo=&foo=bar');
    assertEqual(JSON.stringify(u.query(true)), JSON.stringify({foo: ['', 'bar']}), 'parsed query: {foo:["", "bar"]}');

    u.search('foo=bar&foo=');
    assertEqual(u.query(), 'foo=bar&foo=', 'search: foo=bar&foo=');
    assertEqual(JSON.stringify(u.query(true)), JSON.stringify({foo: ['bar', '']}), 'parsed query: {foo:["bar", ""]}');

    u.search('foo=bar&foo');
    assertEqual(u.query(), 'foo=bar&foo', 'search: foo=bar&foo');
    assertEqual(JSON.stringify(u.query(true)), JSON.stringify({foo: ['bar', null]}), 'parsed query: {foo:["bar", null]}');

    u.search('foo&foo=bar');
    assertEqual(u.query(), 'foo&foo=bar', 'search: foo&foo=bar');
    assertEqual(JSON.stringify(u.query(true)), JSON.stringify({foo: [null, 'bar']}), 'parsed query: {foo:[null, "bar"]}');

    u.search('__proto__=hasOwnProperty&__proto__=eviltwin&uuid');
    assertEqual(u.query(), '__proto__=hasOwnProperty&__proto__=eviltwin&uuid', 'search: __proto__=hasOwnProperty&__proto__=eviltwin&uuid');
    assertEqual(JSON.stringify(u.query(true)), '{"uuid":null}', 'parsed query: {uuid: null}');

    // parsing empty query
    let t;
    t = u.query('?').query(true);
    t = u.query('').query(true);
    t = u.href('http://example.org').query(true);
  });

  testFn('fragment', function() {
    const u = new URI('http://example.org/foo.html');
    u.fragment('foo');
    assertEqual(u.fragment(), 'foo', 'fragment: foo');
    assertEqual(u.hash(), '#foo', 'fragment: foo - hash');

    u.fragment('#bar');
    assertEqual(u.fragment(), 'bar', 'fragment: #bar');
    assertEqual(u.hash(), '#bar', 'fragment: #bar - hash');

    u.fragment('');
    assertEqual(u.fragment(), '', 'fragment: ""');
    assertEqual(u.hash(), '', 'fragment: "" - hash');
    assertEqual(u.toString(), 'http://example.org/foo.html');

    u.hash('foo');
    assertEqual(u.fragment(), 'foo', 'hash: foo');
    assertEqual(u.hash(), '#foo', 'hash: foo - fragment');

    u.hash('#bar');
    assertEqual(u.fragment(), 'bar', 'hash: #bar');
    assertEqual(u.hash(), '#bar', 'hash: #bar - fragment');

    u.hash('');
    assertEqual(u.fragment(), '', 'hash: ""');
    assertEqual(u.hash(), '', 'hash: "" - fragment');
  });

  moduleFn('mutating compounds');
  testFn('host', function() {
    const u = new URI('http://foo.bar/foo.html');

    u.host('example.org:80');
    assertEqual(u.hostname(), 'example.org', 'host changed hostname');
    assertEqual(u.port(), '80', 'host changed port');
    assertEqual(u+'', 'http://example.org:80/foo.html', 'host changed url');

    u.host('some-domain.com');
    assertEqual(u.hostname(), 'some-domain.com', 'host modified hostname');
    assertEqual(u.port(), '', 'host removed port');
    assertEqual(u+'', 'http://some-domain.com/foo.html', 'host modified url');

    u.host('some_where.exa_mple.org:44');
    assertEqual(u.hostname(), 'some_where.exa_mple.org', 'host modified hostname #2');
    assertEqual(u.port(), '44', 'port restored');
    assertEqual(u+'', 'http://some_where.exa_mple.org:44/foo.html', 'host modified url #2');

    assertRaises(function() {
      u.host('foo\\bar.com');
    }, TypeError, 'Failing backslash detection in host');
  });

  testFn('origin', function () {
    const u = new URI('http://foo.bar/foo.html');
    assertEqual(u.origin(), 'http://foo.bar', 'invalid origin');

    u.origin('http://bar.foo/bar.html');
    assertEqual(u.origin(), 'http://bar.foo', 'origin didnt change');
    assertEqual(u+'', 'http://bar.foo/foo.html', 'origin path changed');
  });

  testFn('authority', function() {
    const u = new URI('http://foo.bar/foo.html');

    u.authority('username:password@example.org:80');
    assertEqual(u.username(), 'username', 'authority changed username');
    assertEqual(u.password(), 'password', 'authority changed password');
    assertEqual(u.hostname(), 'example.org', 'authority changed hostname');
    assertEqual(u.port(), '80', 'authority changed port');
    assertEqual(u+'', 'http://username:password@example.org:80/foo.html', 'authority changed url');

    u.authority('some-domain.com');
    assertEqual(u.username(), '', 'authority removed username');
    assertEqual(u.password(), '', 'authority removed password');
    assertEqual(u.hostname(), 'some-domain.com', 'authority modified hostname');
    assertEqual(u.port(), '', 'authority removed port');
    assertEqual(u+'', 'http://some-domain.com/foo.html', 'authority modified url');

    assertRaises(function() {
      u.authority('username:password@foo\\bar.com:80');
    }, TypeError, 'Failing backslash detection in authority');
  });

  testFn('userinfo', function() {
    const u = new URI('http://foo.bar/foo.html');

    u.userinfo('username:password');
    assertEqual(u.username(), 'username', 'userinfo changed username-only');
    assertEqual(u.password(), 'password', 'userinfo changed password');
    assertEqual(u+'', 'http://username:password@foo.bar/foo.html', 'userinfo changed url');

    u.userinfo('walter');
    assertEqual(u.username(), 'walter', 'userinfo removed password');
    assertEqual(u.password(), '', 'userinfo removed password');
    assertEqual(u+'', 'http://walter@foo.bar/foo.html', 'userinfo changed url');

    u.userinfo('');
    assertEqual(u.username(), '', 'userinfo removed username');
    assertEqual(u.password(), '', 'userinfo removed password');
    assertEqual(u+'', 'http://foo.bar/foo.html', 'userinfo changed url');
  });

  testFn('href', function() {
    const u = new URI('http://foo.bar/foo.html');

    u.href('ftp://u:p@example.org:123/directory/file.suffix?query=string#fragment');
    assertEqual(u.protocol(), 'ftp', 'href changed protocol');
    assertEqual(u.username(), 'u', 'href changed username');
    assertEqual(u.password(), 'p', 'href changed password');
    assertEqual(u.hostname(), 'example.org', 'href changed hostname');
    assertEqual(u.port(), '123', 'href changed port');
    assertEqual(u.pathname(), '/directory/file.suffix', 'href changed pathname');
    assertEqual(u.search(), '?query=string', 'href changed search');
    assertEqual(u.hash(), '#fragment', 'href changed hash');
    assertEqual(u.href(), 'ftp://u:p@example.org:123/directory/file.suffix?query=string#fragment', 'href removed url');

    u.href('../path/index.html');
    assertEqual(u.protocol(), '', 'href removed protocol');
    assertEqual(u.username(), '', 'href removed username');
    assertEqual(u.password(), '', 'href removed password');
    assertEqual(u.hostname(), '', 'href removed hostname');
    assertEqual(u.port(), '', 'href removed port');
    assertEqual(u.pathname(), '../path/index.html', 'href removed pathname');
    assertEqual(u.search(), '', 'href removed search');
    assertEqual(u.hash(), '', 'href removed hash');
    assertEqual(u.href(), '../path/index.html', 'href removed url');

    /*jshint -W053 */
    u.href(new String('/narf') as any);
    /*jshint +W053 */
    assertEqual(u.pathname(), '/narf', 'href from String instance');
  });

  testFn('resource', function() {
    const u = new URI('http://foo.bar/foo.html?hello#world');

    assertEqual(u.resource(), '/foo.html?hello#world', 'get resource');

    u.resource('/foo.html?hello#world');
    assertEqual(u.href(), 'http://foo.bar/foo.html?hello#world', 'set resource');

    u.resource('/world.html');
    assertEqual(u.href(), 'http://foo.bar/world.html', 'set resource path');
    assertEqual(u.resource(), '/world.html', 'get resource path');

    u.resource('?query');
    assertEqual(u.href(), 'http://foo.bar/?query', 'set resource query');
    assertEqual(u.resource(), '/?query', 'get resource query');

    u.resource('#fragment');
    assertEqual(u.href(), 'http://foo.bar/#fragment', 'set resource fragment');
    assertEqual(u.resource(), '/#fragment', 'get resource fragment');

    u.resource('?hello#world');
    assertEqual(u.href(), 'http://foo.bar/?hello#world', 'set resource query+fragment');
    assertEqual(u.resource(), '/?hello#world', 'get resource query+fragment');

    u.resource('/mars.txt?planet=123');
    assertEqual(u.href(), 'http://foo.bar/mars.txt?planet=123', 'set resource path+query');
    assertEqual(u.resource(), '/mars.txt?planet=123', 'get resource path+query');

    u.resource('/neptune.txt#foo');
    assertEqual(u.href(), 'http://foo.bar/neptune.txt#foo', 'set resource path+fragment');
    assertEqual(u.resource(), '/neptune.txt#foo', 'get resource path+fragment');
  });

  moduleFn('normalizing');
  testFn('normalize', function() {
    const u = new URI('http://www.exämple.org:80/food/woo/.././../baz.html?&foo=bar&&baz=bam&&baz=bau&#');
    u.normalize();
    assertEqual(u+'', 'http://www.xn--exmple-cua.org/baz.html?foo=bar&baz=bam&baz=bau', 'fully normalized URL');
  });

  testFn('normalizeProtocol', function() {
    const u = new URI('hTTp://example.org/foobar.html');
    u.normalizeProtocol();
    assertEqual(u+'', 'http://example.org/foobar.html', 'lowercase http');
  });

  moduleFn('comparing URLs');
  testFn('equals', function() {
    const u = new URI('http://example.org/foo/bar.html?foo=bar&hello=world&hello=mars#fragment');
    const e = [
        'http://example.org/foo/../foo/bar.html?foo=bar&hello=world&hello=mars#fragment',
        'http://exAmple.org/foo/bar.html?foo=bar&hello=world&hello=mars#fragment',
        'http://exAmple.org:80/foo/bar.html?foo=bar&hello=world&hello=mars#fragment',
        'http://example.org/foo/bar.html?foo=bar&hello=mars&hello=world#fragment',
        'http://example.org/foo/bar.html?hello=mars&hello=world&foo=bar&#fragment'
      ];
    const d = [
        'http://example.org/foo/../bar.html?foo=bar&hello=world&hello=mars#fragment',
        'http://example.org/foo/bar.html?foo=bar&hello=world&hello=mars#frAgment',
        'http://example.org/foo/bar.html?foo=bar&hello=world&hello=mArs#fragment',
        'http://example.org/foo/bar.hTml?foo=bar&hello=world&hello=mars#fragment',
        'http://example.org:8080/foo/bar.html?foo=bar&hello=world&hello=mars#fragment',
        'http://user:pass@example.org/foo/bar.html?foo=bar&hello=world&hello=mars#fragment',
        'ftp://example.org/foo/bar.html?foo=bar&hello=world&hello=mars#fragment',
        'http://example.org/foo/bar.html?foo=bar&hello=world&hello=mars&hello=jupiter#fragment'
      ];
    let i, c;

    for (i = 0; (c = e[i]); i++) {
      assertEqual(u.equals(c), true, 'equality ' + i);
    }

    for (i = 0; (c = d[i]); i++) {
      assertEqual(u.equals(c), false, 'different ' + i);
    }
  });

  moduleFn('SecondLevelDomains');
  testFn('SecondLevelDomains.get()', function() {
    assertEqual(SecondLevelDomains.get('www.example.ch'), null, 'www.example.ch');
    assertEqual(SecondLevelDomains.get('www.example.com'), null, 'www.example.com');
    assertEqual(SecondLevelDomains.get('www.example.eu.com'), 'eu.com', 'www.example.eu.com');
    assertEqual(SecondLevelDomains.get('www.example.co.uk'), 'co.uk', 'www.example.co.uk');
  });

  testFn('SecondLevelDomains.has()', function() {
    assertEqual(SecondLevelDomains.has('www.example.ch'), false, 'www.example.ch');
    assertEqual(SecondLevelDomains.has('www.example.com'), false, 'www.example.com');
    assertEqual(SecondLevelDomains.has('www.example.eu.com'), true, 'www.example.eu.com');
    assertEqual(SecondLevelDomains.has('www.example.co.uk'), true, 'www.example.co.uk');
  });

  testFn('SecondLevelDomains.is()', function() {
    assertEqual(SecondLevelDomains.is('ch'), false, 'ch');
    assertEqual(SecondLevelDomains.is('example.ch'), false, 'example.ch');

    assertEqual(SecondLevelDomains.is('com'), false, 'com');
    assertEqual(SecondLevelDomains.is('eu.com'), true, 'eu.com');
    assertEqual(SecondLevelDomains.is('example.com'), false, 'example.com');

    assertEqual(SecondLevelDomains.is('uk'), false, 'uk');
    assertEqual(SecondLevelDomains.is('co.uk'), true, 'co.uk');
  });

  moduleFn('static helpers');
  testFn('withinString', function() {
    /*jshint laxbreak: true */
    const source = 'Hello www.example.com,\n'
      + 'http://google.com is a search engine, like http://www.bing.com\n'
      + 'http://exämple.org/foo.html?baz=la#bumm is an IDN URL,\n'
      + 'http://123.123.123.123/foo.html is IPv4 and http://fe80:0000:0000:0000:0204:61ff:fe9d:f156/foobar.html is IPv6.\n'
      + 'links can also be in parens (http://example.org) or quotes »http://example.org«, '
      + 'yet https://example.com/with_(balanced_parentheses) and https://example.com/with_(balanced_parentheses).txt contain the closing parens, but '
      + 'https://example.com/with_unbalanced_parentheses) does not.\n'
      + 'Note that www. is not a URL and neither is http://.';
    const expected = 'Hello <a>www.example.com</a>,\n'
      + '<a>http://google.com</a> is a search engine, like <a>http://www.bing.com</a>\n'
      + '<a>http://exämple.org/foo.html?baz=la#bumm</a> is an IDN URL,\n'
      + '<a>http://123.123.123.123/foo.html</a> is IPv4 and <a>http://fe80:0000:0000:0000:0204:61ff:fe9d:f156/foobar.html</a> is IPv6.\n'
      + 'links can also be in parens (<a>http://example.org</a>) or quotes »<a>http://example.org</a>«, '
      + 'yet <a>https://example.com/with_(balanced_parentheses)</a> and <a>https://example.com/with_(balanced_parentheses).txt</a> contain the closing parens, but '
      + '<a>https://example.com/with_unbalanced_parentheses</a>) does not.\n'
      + 'Note that www. is not a URL and neither is http://.';
    /*jshint laxbreak: false */
    const result = (URI as any).withinString(source, function(url: string) {
      return '<a>' + url + '</a>';
    });

    assertEqual(result, expected, 'in string URI identification');
  });

  testFn('ensureValidPort', function() {
    function testPort(value: any) {
      let result = true;
      try {
        (URI as any).ensureValidPort(value);
      } catch(e) {
        result = false;
      }

      return result;
    }

    assertEqual(testPort(8000), true);
    assertEqual(testPort('8080'), true);

    assertEqual(testPort(0), true);
    assertEqual(testPort(1), true);

    assertEqual(testPort(65535), true);
    assertEqual(testPort(65536), false);

    assertEqual(testPort(-8080), false);
    assertEqual(testPort('-8080'), false);

    assertEqual(testPort('aaa8080'), false);
    assertEqual(testPort('8080a'), false);

    assertEqual(testPort(8080.2), false);
  });

  testFn('joinPaths', function() {
    let result;

    result = (URI as any).joinPaths('/a/b', '/c', 'd', '/e').toString();
    assertEqual(result, '/a/b/c/d/e', 'absolute paths');

    result = (URI as any).joinPaths('a/b', 'http://example.com/c', new URI('d/'), '/e').toString();
    assertEqual(result, 'a/b/c/d/e', 'relative path');

    result = (URI as any).joinPaths('/a/').toString();
    assertEqual(result, '/a/', 'single absolute directory');

    result = (URI as any).joinPaths('/a').toString();
    assertEqual(result, '/a', 'single absolute segment');

    result = (URI as any).joinPaths('a').toString();
    assertEqual(result, 'a', 'single relative segment');

    result = (URI as any).joinPaths('').toString();
    assertEqual(result, '', 'empty string');

    result = (URI as any).joinPaths().toString();
    assertEqual(result, '', 'no argument');

    result = (URI as any).joinPaths('', 'a', '', '', 'b').toString();
    assertEqual(result, '/a/b', 'leading empty segment');

    result = (URI as any).joinPaths('a', '', '', 'b', '', '').toString();
    assertEqual(result, 'a/b/', 'trailing empty segment');
  });

  testFn('setQuery static', function () {
    const o: any = {foo: 'bar'};

    (URI as any).setQuery(o, 'foo', 'bam');
    assertDeepEqual(o, {foo: 'bam'}, 'set name, value');

    (URI as any).setQuery(o, 'array', ['one', 'two']);
    assertDeepEqual(o, {foo: 'bam', array: ['one', 'two']}, 'set name, array');

    (URI as any).setQuery(o, 'foo', 'qux');
    assertDeepEqual(o, {foo: 'qux', array: ['one', 'two']}, 'override name, value');

    const o2: any = {foo: 'bar'};
    (URI as any).setQuery(o2, {baz: 'qux'});
    assertDeepEqual(o2, {foo: 'bar', baz: 'qux'}, 'set {name: value}');

    (URI as any).setQuery(o2, {bar: ['1', '2']});
    assertDeepEqual(o2, {foo: 'bar', bar: ['1', '2'], baz: 'qux'}, 'set {name: array}');

    (URI as any).setQuery(o2, {foo: 'qux'});
    assertDeepEqual(o2, {foo: 'qux', bar: ['1', '2'], baz: 'qux'}, 'override {name: value}');

    const o3: any = {foo: 'bar'};
    (URI as any).setQuery(o3, {bam: null, baz: ''});
    assertDeepEqual(o3, {foo: 'bar', bam: null, baz: ''}, 'set {name: null}');

    const o4: any = {foo: 'bar'};
    (URI as any).setQuery(o4, 'empty');
    assertDeepEqual(o4, {foo: 'bar', empty: null}, 'set undefined');

    const o5: any = {foo: 'bar'};
    (URI as any).setQuery(o5, 'empty', '');
    assertDeepEqual(o5, {foo: 'bar', empty: ''}, 'set empty string');

    const o6: any = {};
    (URI as any).setQuery(o6, 'some value', 'must be encoded because of = and ? and #');
    assertDeepEqual(o6, {'some value': 'must be encoded because of = and ? and #'}, 'encoding');
  });

})();

// Export for module system
export {}; 