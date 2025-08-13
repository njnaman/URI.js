/*
 * What would jim do?
 * more tests for border-edge cases
 * Christian Harms.
 *
 * Note: I have no clue who or what jim is supposed to be. It might be something like the German DAU (dumbest possible user)
 */

// TypeScript version of test_jim.js

// Reference the source files to compile them
/// <reference path="../src/URI.ts" />
/// <reference path="./qunit/qunit.d.ts" />

declare var URI: any;

(function() {
  'use strict';

  QUnit.module('injection');
  QUnit.test('protocol', function(assert) {
    var u = new URI('http://example.com/dir1/dir2/?query1=value1&query2=value2#hash');
    assert.throws(function() {
      u.protocol('ftp://example.org');
    }, TypeError, 'Failing invalid characters');

    u.protocol('ftp:');
    assert.equal(u.protocol(), 'ftp', 'protocol() has set invalid protocoll!');
    assert.equal(u.hostname(), 'example.com', 'protocol() has changed the hostname');
  });

  QUnit.test('port', function(assert) {
    var u = new URI('http://example.com/dir1/dir2/?query1=value1&query2=value2#hash');
    assert.throws(function() {
      u.port('99:example.org');
    }, TypeError, 'Failing invalid characters');

    u.port(':99');
    assert.equal(u.hostname(), 'example.com', 'port() has modified hostname');
    assert.equal(u.port(), 99, 'port() has set an invalid port');

    u.port(false);
    assert.equal(u.port(), '', 'port() has set an invalid port');

    // RFC 3986 says nothing about "16-bit unsigned" http://tools.ietf.org/html/rfc3986#section-3.2.3
    // u.href(new URI("http://example.com/"))
    // u.port(65536);
    // notEqual(u.port(), "65536", "port() has set to an non-valid value (A port number is a 16-bit unsigned integer)");

    assert.throws(function() {
      u.port('-99');
    }, TypeError, 'Failing invalid characters');
  });

  QUnit.test('domain', function(assert) {
    var u = new URI('http://example.com/dir1/dir2/?query1=value1&query2=value2#hash');

    assert.throws(function() {
      u.domain('example.org/dir0/');
    }, TypeError, 'Failing invalid characters');

    assert.throws(function() {
      u.domain('example.org:80');
    }, TypeError, 'Failing invalid characters');

    assert.throws(function() {
      u.domain('foo@example.org');
    }, TypeError, 'Failing invalid characters');
  });

  QUnit.test('subdomain', function(assert) {
    var u = new URI('http://example.com/dir1/dir2/?query1=value1&query2=value2#hash');

    assert.throws(function() {
      u.subdomain('example.org/dir0/');
    }, TypeError, 'Failing invalid characters');

    assert.throws(function() {
      u.subdomain('example.org:80');
    }, TypeError, 'Failing invalid characters');

    assert.throws(function() {
      u.subdomain('foo@example.org');
    }, TypeError, 'Failing invalid characters');
  });

  QUnit.test('tld', function(assert) {
  var u = new URI('http://example.com/dir1/dir2/?query1=value1&query2=value2#hash');

  assert.throws(function() {
    u.tld('foo/bar.html');
  }, TypeError, 'Failing invalid characters');
});

  QUnit.test('path', function(assert) {
  var u = new URI('http://example.com/dir1/dir2/?query1=value1&query2=value2#hash');
  u.path('/dir3/?query3=value3#fragment');
  assert.equal(u.hostname(), 'example.com', 'path() has modified hostname');
  assert.equal(u.path(), '/dir3/%3Fquery3=value3%23fragment', 'path() has set invalid path');
  assert.equal(u.query(), 'query1=value1&query2=value2', 'path() has modified query');
  assert.equal(u.fragment(), 'hash', 'path() has modified fragment');
});

  QUnit.test('filename', function(assert) {
  var u = new URI('http://example.com/dir1/dir2/?query1=value1&query2=value2#hash');

  u.filename('name.html?query');
  assert.equal(u.filename(), 'name.html%3Fquery', 'filename() has set invalid filename');
  assert.equal(u.query(), 'query1=value1&query2=value2', 'filename() has modified query');

  // allowed!
  u.filename('../name.html?query');
  assert.equal(u.filename(), 'name.html%3Fquery', 'filename() has set invalid filename');
  assert.equal(u.directory(), '/dir1', 'filename() has not altered directory properly');

  u.filename(null);
  assert.equal(u.filename(), 'name.html%3Fquery', 'filename() has set invalid filename');
  assert.equal(u.directory(), '/dir1', 'filename() has not altered directory properly');

  u.filename(false);
  assert.equal(u.filename(), 'name.html%3Fquery', 'filename() has set invalid filename');
  assert.equal(u.directory(), '/dir1', 'filename() has not altered directory properly');

  u.filename(0);
  assert.equal(u.filename(), 'name.html%3Fquery', 'filename() has set invalid filename');
  assert.equal(u.directory(), '/dir1', 'filename() has not altered directory properly');
});

  QUnit.test('addQuery', function(assert) {
  var u = new URI('http://example.com/dir1/dir2/?query1=value1&query2=value2#hash');
  u.addQuery('query3', 'value3#got');
  assert.equal(u.query(), 'query1=value1&query2=value2&query3=value3%23got', 'addQuery() has set invalid query');
  assert.equal(u.fragment(), 'hash', 'addQuery() has modified fragment');
});

  /*
  // RFC 3986 says "…and should limit these names to no more than 255 characters in length."
  // SHOULD is not MUST therefore not the responsibility of URI.js

  QUnit.module("validation");
  QUnit.test("domain", function(assert) {
    // this bases on the wiki page information: http://en.wikipedia.org/wiki/Domain_Name_System
    var u = new URI("http://example.com/"), domain, i, j;

    //generate a 204 character domain
    domain = "com"
    for (i=0; i<20; i++) {
      domain = "0123456789." + domain;
    }
    u.domain(domain);
    assert.equal(u.hostname(), domain, "domain() has not set 204-character-domain");

    //expand the domain to a 404 character domain
    for (i=0; i<20; i++) {
      domain = "0123456789." + domain;
    }
    u.domain(domain);
    assert.equal(u.hostname() == domain, true, "set domain() with "+domain.length+" charachters - not valid domainname");

    //generate a domain with three 70-char subdomains-parts.
    domain = "com";
    for (j=0; j<3; j++) {
      //start new subdomain
      domain = "." + domain;
      for (i=0; i<70; i++) {
        domain = "a" + domain;
      }
    }
    u.domain(domain);
    assert.equal(u.hostname() == domain, true, "set domain() with 70-character subdomain  not valid domainname");
  });
  */
})();
