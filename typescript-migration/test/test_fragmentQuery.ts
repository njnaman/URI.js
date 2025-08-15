// TypeScript version of test_fragmentQuery.js

// Reference the source files to compile them
/// <reference path="../src/URI.ts" />
/// <reference path="../src/URI.fragmentQuery.ts" />
/// <reference path="qunit/qunit.d.ts" />

declare var URI: any;

var moduleFn = (globalThis as any).QUnit.module;
var testFn = (globalThis as any).QUnit.test;
var assertEqual = (globalThis as any).equal;
var assertDeepEqual = (globalThis as any).deepEqual;

moduleFn('URI.fragmentQuery');

testFn('storing query-data in fragment', function() {
  var u = URI('http://example.org');

  assertDeepEqual(u.fragment(true), {}, 'empty map for missing fragment');

  u = URI('http://example.org/#');
  assertDeepEqual(u.fragment(true), {}, 'empty map for empty fragment');

  u = URI('http://example.org/#?hello=world');
  assertDeepEqual(u.fragment(true), {hello: 'world'}, 'reading data object');

  u.fragment({bar: 'foo'});
  assertDeepEqual(u.fragment(true), {bar: 'foo'}, 'setting data object');
  assertEqual(u.toString(), 'http://example.org/#?bar=foo', 'setting data object serialized');

  u.addFragment('name', 'value');
  assertDeepEqual(u.fragment(true), {bar: 'foo', name: 'value'}, 'adding value');
  assertEqual(u.toString(), 'http://example.org/#?bar=foo&name=value', 'adding value serialized');

  u.removeFragment('bar');
  assertDeepEqual(u.fragment(true), {name: 'value'}, 'removing value bar');
  assertEqual(u.toString(), 'http://example.org/#?name=value', 'removing value bar serialized');

  u.removeFragment('name');
  assertDeepEqual(u.fragment(true), {}, 'removing value name');
  assertEqual(u.toString(), 'http://example.org/#?', 'removing value name serialized');

  u.setFragment('name', 'value1');
  assertDeepEqual(u.fragment(true), {name: 'value1'}, 'setting name to value1');
  assertEqual(u.toString(), 'http://example.org/#?name=value1', 'setting name to value1 serialized');

  u.setFragment('name', 'value2');
  assertDeepEqual(u.fragment(true), {name: 'value2'}, 'setting name to value2');
  assertEqual(u.toString(), 'http://example.org/#?name=value2', 'setting name to value2 serialized');
});

testFn('fragmentPrefix', function() {
  var u: any;

  (URI as any).fragmentPrefix = '!';
  u = URI('http://example.org');
  assertEqual(u._parts.fragmentPrefix, '!', 'init using global property');

  u.fragment('#?hello=world');
  assertEqual(u.fragment(), '?hello=world', 'unparsed ?');
  assertDeepEqual(u.fragment(true), {}, 'parsing ? prefix');

  u.fragment('#!hello=world');
  assertEqual(u.fragment(), '!hello=world', 'unparsed !');
  assertDeepEqual(u.fragment(true), {hello: 'world'}, 'parsing ! prefix');

  u.fragmentPrefix('§');
  assertEqual(u.fragment(), '!hello=world', 'unparsed §');
  assertDeepEqual(u.fragment(true), {}, 'parsing § prefix');

  u.fragment('#§hello=world');
  assertEqual(u.fragment(), '§hello=world', 'unparsed §');
  assertDeepEqual(u.fragment(true), {hello: 'world'}, 'parsing § prefix');

  (URI as any).fragmentPrefix = '?';
});
