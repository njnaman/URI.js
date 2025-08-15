// TypeScript version of test_jquery.js
// Note: This is adapted for QUnit browser testing
// The original tests were jQuery-specific and DOM-dependent

// Reference the source files to compile them
/// <reference path="../src/URI.ts" />
/// <reference path="../src/jquery.URI.ts" />
/// <reference path="qunit/qunit.d.ts" />

declare var URI: any;

var moduleFn = (globalThis as any).QUnit.module;
var testFn = (globalThis as any).QUnit.test;
var assertOk = (globalThis as any).ok;
var assertEqual = (globalThis as any).equal;
var assertNotEqual = (globalThis as any).notEqual;
moduleFn('jQuery.URI Functionality');

testFn('URI instance creation and modification', function() {
  var uri1 = new URI('http://example.org/');
  var uri2 = new URI('/hello.world');

  assertOk(uri1 instanceof URI, 'uri1 is URI instance');
  assertOk(uri2 instanceof URI, 'uri2 is URI instance');
  assertNotEqual(uri1, uri2, 'different instances');

  // Test URI modification
  uri1.hostname('example.com');
  assertEqual(uri1.hostname(), 'example.com', 'hostname modified');
  assertEqual(uri1.toString(), 'http://example.com/', 'URI string updated');
});

testFn('URI filtering logic (without DOM)', function() {
  // Test URI comparison and filtering logic that would be used in jQuery selectors
  var testURIs = [
    new URI('http://example.org/'),
    new URI('https://example.org/'),
    new URI('http://example.org/hello/world.html'),
    new URI('ftp://localhost/one/two/three/file.ext'),
    new URI('mailto:mail@example.org?subject=Hello+World'),
    new URI('#anchor'),
    new URI('/dontexist.jpg'),
    new URI('/dontexist.svg')
  ];

  // Test protocol filtering
  var httpURIs = [];
  for (var i = 0; i < testURIs.length; i++) {
    if (testURIs[i].protocol() === 'http') {
      httpURIs.push(testURIs[i]);
    }
  }
  assertEqual(httpURIs.length, 2, 'two HTTP URIs found');

  var httpsURIs = [];
  for (var i = 0; i < testURIs.length; i++) {
    if (testURIs[i].protocol() === 'https') {
      httpsURIs.push(testURIs[i]);
    }
  }
  assertEqual(httpsURIs.length, 1, 'one HTTPS URI found');

  // Test relative URIs
  var relativeURIs = [];
  for (var i = 0; i < testURIs.length; i++) {
    if (testURIs[i].is('relative')) {
      relativeURIs.push(testURIs[i]);
    }
  }
  assertEqual(relativeURIs.length, 3, 'three relative URIs found'); // #anchor, /dontexist.jpg, /dontexist.svg

  // Test suffix filtering
  var jsURIs = [];
  for (var i = 0; i < testURIs.length; i++) {
    if (testURIs[i].suffix() === 'js') {
      jsURIs.push(testURIs[i]);
    }
  }
  assertEqual(jsURIs.length, 0, 'no JS URIs found');

  var htmlURIs = [];
  for (var i = 0; i < testURIs.length; i++) {
    if (testURIs[i].suffix() === 'html') {
      htmlURIs.push(testURIs[i]);
    }
  }
  assertEqual(htmlURIs.length, 1, 'one HTML URI found');

  // Test hostname filtering
  var exampleOrgURIs = [];
  for (var i = 0; i < testURIs.length; i++) {
    if (testURIs[i].hostname() === 'example.org') {
      exampleOrgURIs.push(testURIs[i]);
    }
  }
  assertEqual(exampleOrgURIs.length, 3, 'three example.org URIs found');
});

testFn('URI equals functionality', function() {
  var uri1 = new URI('http://example.org/hello/world.html');
  var uri2 = new URI('http://example.org/hello/foo/../world.html');

  assertOk(uri1.equals(uri2), 'URIs are equal after normalization');
});

testFn('URI accessor functions', function() {
  var uri = new URI('http://example.org/path/file.ext?query=value#fragment');

  assertEqual(uri.hostname(), 'example.org', 'hostname accessor');
  assertEqual(uri.path(), '/path/file.ext', 'path accessor');
  assertEqual(uri.filename(), 'file.ext', 'filename accessor');
  assertEqual(uri.suffix(), 'ext', 'suffix accessor');
  assertEqual(uri.query(), 'query=value', 'query accessor');
  assertEqual(uri.fragment(), 'fragment', 'fragment accessor');

  // Test modification
  uri.hostname('example.com');
  assertEqual(uri.hostname(), 'example.com', 'hostname modified');
  assertEqual(uri.toString(), 'http://example.com/path/file.ext?query=value#fragment', 'URI string updated');
});

testFn('Directory and path operations', function() {
  var uri1 = new URI('ftp://localhost/one/two/three/file.ext');
  var uri2 = new URI('ftp://localhost/one/two/file.ext');

  assertEqual(uri1.directory(), '/one/two/three/', 'uri1 directory');
  assertEqual(uri2.directory(), '/one/two/', 'uri2 directory');

  // Test if directory contains '/two/'
  assertOk(uri1.directory().indexOf('/two/') !== -1, 'uri1 directory contains /two/');
  assertOk(uri2.directory().indexOf('/two/') !== -1, 'uri2 directory contains /two/');
});

testFn('URN detection', function() {
  var uri1 = new URI('mailto:mail@example.org');
  var uri2 = new URI('javascript:alert("test")');
  var uri3 = new URI('http://example.org/');

  assertOk(uri1.is('urn'), 'mailto is URN');
  assertOk(uri2.is('urn'), 'javascript is URN');
  assertOk(!uri3.is('urn'), 'http is not URN');
});
