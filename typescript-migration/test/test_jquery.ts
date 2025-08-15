// TypeScript version of test_jquery.js
// Note: This is adapted for QUnit browser testing
// The original tests were jQuery-specific and DOM-dependent

// Reference the source files to compile them
/// <reference path="../src/URI.ts" />
/// <reference path="../src/jquery.URI.ts" />
/// <reference path="qunit/qunit.d.ts" />

declare var URI: any;
declare var module: any;
declare var test: any;
declare var equal: any;
declare var ok: any;
declare var notEqual: any;

module('jQuery.URI Functionality');

test('URI instance creation and modification', function() {
  var uri1 = new URI('http://example.org/');
  var uri2 = new URI('/hello.world');

  ok(uri1 instanceof URI, 'uri1 is URI instance');
  ok(uri2 instanceof URI, 'uri2 is URI instance');
  notEqual(uri1, uri2, 'different instances');

  // Test URI modification
  uri1.hostname('example.com');
  equal(uri1.hostname(), 'example.com', 'hostname modified');
  equal(uri1.toString(), 'http://example.com/', 'URI string updated');
});

test('URI filtering logic (without DOM)', function() {
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
  equal(httpURIs.length, 2, 'two HTTP URIs found');

  var httpsURIs = [];
  for (var i = 0; i < testURIs.length; i++) {
    if (testURIs[i].protocol() === 'https') {
      httpsURIs.push(testURIs[i]);
    }
  }
  equal(httpsURIs.length, 1, 'one HTTPS URI found');

  // Test relative URIs
  var relativeURIs = [];
  for (var i = 0; i < testURIs.length; i++) {
    if (testURIs[i].is('relative')) {
      relativeURIs.push(testURIs[i]);
    }
  }
  equal(relativeURIs.length, 3, 'three relative URIs found'); // #anchor, /dontexist.jpg, /dontexist.svg

  // Test suffix filtering
  var jsURIs = [];
  for (var i = 0; i < testURIs.length; i++) {
    if (testURIs[i].suffix() === 'js') {
      jsURIs.push(testURIs[i]);
    }
  }
  equal(jsURIs.length, 0, 'no JS URIs found');

  var htmlURIs = [];
  for (var i = 0; i < testURIs.length; i++) {
    if (testURIs[i].suffix() === 'html') {
      htmlURIs.push(testURIs[i]);
    }
  }
  equal(htmlURIs.length, 1, 'one HTML URI found');

  // Test hostname filtering
  var exampleOrgURIs = [];
  for (var i = 0; i < testURIs.length; i++) {
    if (testURIs[i].hostname() === 'example.org') {
      exampleOrgURIs.push(testURIs[i]);
    }
  }
  equal(exampleOrgURIs.length, 3, 'three example.org URIs found');
});

test('URI equals functionality', function() {
  var uri1 = new URI('http://example.org/hello/world.html');
  var uri2 = new URI('http://example.org/hello/foo/../world.html');
  
  ok(uri1.equals(uri2), 'URIs are equal after normalization');
});

test('URI accessor functions', function() {
  var uri = new URI('http://example.org/path/file.ext?query=value#fragment');

  equal(uri.hostname(), 'example.org', 'hostname accessor');
  equal(uri.path(), '/path/file.ext', 'path accessor');
  equal(uri.filename(), 'file.ext', 'filename accessor');
  equal(uri.suffix(), 'ext', 'suffix accessor');
  equal(uri.query(), 'query=value', 'query accessor');
  equal(uri.fragment(), 'fragment', 'fragment accessor');

  // Test modification
  uri.hostname('example.com');
  equal(uri.hostname(), 'example.com', 'hostname modified');
  equal(uri.toString(), 'http://example.com/path/file.ext?query=value#fragment', 'URI string updated');
});

test('Directory and path operations', function() {
  var uri1 = new URI('ftp://localhost/one/two/three/file.ext');
  var uri2 = new URI('ftp://localhost/one/two/file.ext');

  equal(uri1.directory(), '/one/two/three/', 'uri1 directory');
  equal(uri2.directory(), '/one/two/', 'uri2 directory');

  // Test if directory contains '/two/'
  ok(uri1.directory().indexOf('/two/') !== -1, 'uri1 directory contains /two/');
  ok(uri2.directory().indexOf('/two/') !== -1, 'uri2 directory contains /two/');
});

test('URN detection', function() {
  var uri1 = new URI('mailto:mail@example.org');
  var uri2 = new URI('javascript:alert("test")');
  var uri3 = new URI('http://example.org/');

  ok(uri1.is('urn'), 'mailto is URN');
  ok(uri2.is('urn'), 'javascript is URN');
  ok(!uri3.is('urn'), 'http is not URN');
});