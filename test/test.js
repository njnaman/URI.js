(function() {
  'use strict';
  /*global window, document, location, URI, URI_pre_lib, IPv6, IPv6_pre_lib, URITemplate, URITemplate_pre_lib, SecondLevelDomains, SecondLevelDomains_pre_lib, urls, test, ok, equal, strictEqual, deepEqual, raises */
  // FIXME: v2.0.0 renamce non-camelCase properties to uppercase
  /*jshint camelcase: false, loopfunc: true */

  test('loaded', function() {
    ok(window.URI);
  });

  module('constructing');
  test('URI()', function() {
    var u = URI();
    ok(u instanceof URI, 'instanceof URI');
    equal(u.toString(), window.location && window.location.href || '', 'is location (browser) or empty string (node)');
  });
  test('URI(undefined)', function() {
    raises(function() {
      URI(undefined);
    }, TypeError, 'Failing undefined input');
  });
  test('URI(null)', function() {
    raises(function() {
      URI(null);
    }, TypeError, 'Failing undefined input');
  });
  test('new URI(string)', function() {
    var u = new URI('http://example.org/');
    ok(u instanceof URI, 'instanceof URI');
    ok(u._parts.hostname !== undefined, 'host undefined');
  });
  test('new URI(object)', function() {
    var u = new URI({protocol: 'http', hostname: 'example.org'});
    ok(u instanceof URI, 'instanceof URI');
    ok(u._parts.hostname !== undefined, 'host undefined');
  });

  test('new URI(object)', function() {
    var u = new URI({
      protocol: 'http',
      hostname: 'example.org',
      query: {
        foo: 'bar',
        bar: 'foo',
      },
    });
    ok(u instanceof URI, 'instanceof URI');
    ok(typeof u.query() === 'string', 'query is string');
    equal(u.query(), 'foo=bar&bar=foo', 'query has right value');
    equal(u.search(), '?foo=bar&bar=foo', 'search has right value');
    deepEqual(u.query(true), { foo: 'bar', bar: 'foo' }, 'query(true) value');
    deepEqual(u.search(true), { foo: 'bar', bar: 'foo' }, 'search(true) value');
  });
  test('new URI(object)', function() {
    var u = new URI({
      protocol: 'http',
      hostname: 'example.org',
      query: 'foo=bar&bar=foo',
    });
    ok(u instanceof URI, 'instanceof URI');
    ok(typeof u.query() === 'string', 'query is string');
    equal(u.query(), 'foo=bar&bar=foo', 'query has right value');
    equal(u.search(), '?foo=bar&bar=foo', 'search has right value');
    deepEqual(u.query(true), { foo: 'bar', bar: 'foo' }, 'query(true) value');
    deepEqual(u.search(true), { foo: 'bar', bar: 'foo' }, 'search(true) value');
  });
  test('new URI(object)', function() {
    var u = new URI({
      protocol: 'http',
      hostname: 'example.org',
      query: '?foo=bar&bar=foo',
    });
    ok(u instanceof URI, 'instanceof URI');
    ok(typeof u.query() === 'string', 'query is string');
    equal(u.query(), 'foo=bar&bar=foo', 'query has right value');
    equal(u.search(), '?foo=bar&bar=foo', 'search has right value');
    deepEqual(u.query(true), { foo: 'bar', bar: 'foo' }, 'query(true) value');
    deepEqual(u.search(true), { foo: 'bar', bar: 'foo' }, 'search(true) value');
  });
  test('new URI(Location)', function () {
    var u = new URI(location);
    equal(u.href(), String(location.href), 'location object');
  });
  test('new URI(undefined)', function() {
    var u = new URI();
    ok(u instanceof URI, 'instanceof URI');
    equal(u.toString(), window.location && window.location.href || '', 'is location (browser) or empty string (node)');
    raises(function() {
      new URI(undefined);
    }, TypeError, 'Failing undefined input');
  })

})();
