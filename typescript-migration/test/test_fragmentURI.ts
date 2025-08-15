// TypeScript version of test_fragmentURI.js

// Reference the source files to compile them
/// <reference path="../src/URI.ts" />
/// <reference path="../src/URI.fragmentURI.ts" />

declare var URI: any;

var moduleFn = (globalThis as any).QUnit.module;
var testFn = (globalThis as any).QUnit.test;
var assertOk = (globalThis as any).ok;
var assertEqual = (globalThis as any).equal;
var assertNotEqual = (globalThis as any).notEqual;

moduleFn('URI.fragmentURI');

testFn('storing URLs in fragment', function () {
  var u = URI('http://example.org');
  var f: any;

  // var uri = URI('http://example.org/#!/foo/bar/baz.html');
  // var furi = uri.fragment(true);
  // furi.pathname() === '/foo/bar/baz.html';
  // furi.pathname('/hello.html');
  // uri.toString() === 'http://example.org/#!/hello.html'

  assertOk(u.fragment(true) instanceof URI, 'URI instance for missing fragment');

  u = URI('http://example.org/#');
  assertOk(u.fragment(true) instanceof URI, 'URI instance for empty fragment');

  u = URI('http://example.org/#!/foo/bar/baz.html');
  f = u.fragment(true);
  assertEqual(f.pathname(), '/foo/bar/baz.html', 'reading path of FragmentURI');
  assertEqual(f.filename(), 'baz.html', 'reading filename of FragmentURI');

  f.filename('foobar.txt');
  assertEqual(f.pathname(), '/foo/bar/foobar.txt', 'modifying filename of FragmentURI');
  assertEqual(u.fragment(), '!/foo/bar/foobar.txt', 'modifying fragment() through FragmentURI on original');
  assertEqual(u.toString(), 'http://example.org/#!/foo/bar/foobar.txt', 'modifying filename of FragmentURI on original');
});

testFn('fragmentPrefix', function () {
  var u: any;

  (URI as any).fragmentPrefix = '?';
  u = URI('http://example.org');
  assertEqual(u._parts.fragmentPrefix, '?', 'init using global property');

  u.fragment('#!/foo/bar/baz.html');
  assertEqual(u.fragment(), '!/foo/bar/baz.html', 'unparsed ?');
  assertOk(u.fragment(true) instanceof URI, 'parsing ? prefix - is URI');
  assertEqual(u.fragment(true).toString(), '', 'parsing ? prefix - result');

  u.fragment('#?/foo/bar/baz.html');
  assertEqual(u.fragment(), '?/foo/bar/baz.html', 'unparsed ?');
  assertOk(u.fragment(true) instanceof URI, 'parsing ? prefix - is URI');
  assertEqual(u.fragment(true).toString(), '/foo/bar/baz.html', 'parsing ? prefix - result');

  u.fragmentPrefix('§');
  assertEqual(u.fragment(), '?/foo/bar/baz.html', 'unparsed §');
  assertOk(u.fragment(true) instanceof URI, 'parsing § prefix - is URI');
  assertEqual(u.fragment(true).toString(), '', 'parsing § prefix - result');

  u.fragment('#§/foo/bar/baz.html');
  assertEqual(u.fragment(), '§/foo/bar/baz.html', 'unparsed §');
  assertOk(u.fragment(true) instanceof URI, 'parsing § prefix - is URI');
  assertEqual(u.fragment(true).toString(), '/foo/bar/baz.html', 'parsing § prefix - result');

  (URI as any).fragmentPrefix = '!';
});
