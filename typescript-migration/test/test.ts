// TypeScript version of test.js
// FIXME: v2.0.0 renamce non-camelCase properties to uppercase

// Reference the source files to compile them
/// <reference path="../src/IPv6.ts" />
/// <reference path="../src/SecondLevelDomains.ts" />
/// <reference path="../src/URI.ts" />
/// <reference path="./urls.ts" />

// QUnit-only test framework setup
declare const QUnit: any;

// Declare global variables that will be available after the scripts load
declare var URI: any;
declare var IPv6: any;
declare var URITemplate: any;
declare var SecondLevelDomains: any;
// urls is declared in urls.ts

// Test suite setup
(function () {
    'use strict';

    // QUnit test functions - QUnit is required
    const test = QUnit.test;
    const module = QUnit.module;

    // QUnit assertion functions
    const ok = QUnit.ok;
    const equal = QUnit.equal;
    const strictEqual = QUnit.strictEqual;
    const deepEqual = QUnit.deepEqual;
    const raises = QUnit.raises;

    test('loaded', function () {
        if (typeof window !== 'undefined') {
            ok(window.URI);
        } else {
            ok(URI);
        }
    });

    module('constructing');
    test('URI()', function () {
        const u = URI();
        ok(u instanceof URI, 'instanceof URI');
        const expectedHref = (typeof window !== 'undefined' && window.location && window.location.href) || '';
        equal(u.toString(), expectedHref, 'is location (browser) or empty string (node)');
    });

    test('URI(undefined)', function () {
        raises(function () {
            URI(undefined);
        }, TypeError, 'Failing undefined input');
    });

    test('URI(null)', function () {
        raises(function () {
            URI(null);
        }, TypeError, 'Failing undefined input');
    });

    test('new URI(string)', function () {
        const u = new URI('http://example.org/');
        ok(u instanceof URI, 'instanceof URI');
        ok(u._parts.hostname !== undefined, 'host undefined');
    });

    test('new URI(object)', function () {
        const u = new URI({protocol: 'http', hostname: 'example.org'});
        ok(u instanceof URI, 'instanceof URI');
        ok(u._parts.hostname !== undefined, 'host undefined');
    });

    test('new URI(object)', function () {
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
        deepEqual(u.query(true), {foo: 'bar', bar: 'foo'}, 'query(true) value');
        deepEqual(u.search(true), {foo: 'bar', bar: 'foo'}, 'search(true) value');
    });

    test('new URI(object)', function () {
        var u = new URI({
            protocol: 'http',
            hostname: 'example.org',
            query: 'foo=bar&bar=foo',
        });
        ok(u instanceof URI, 'instanceof URI');
        ok(typeof u.query() === 'string', 'query is string');
        equal(u.query(), 'foo=bar&bar=foo', 'query has right value');
        equal(u.search(), '?foo=bar&bar=foo', 'search has right value');
        deepEqual(u.query(true), {foo: 'bar', bar: 'foo'}, 'query(true) value');
        deepEqual(u.search(true), {foo: 'bar', bar: 'foo'}, 'search(true) value');
    });

    test('new URI(object)', function () {
        var u = new URI({
            protocol: 'http',
            hostname: 'example.org',
            query: '?foo=bar&bar=foo',
        });
        ok(u instanceof URI, 'instanceof URI');
        ok(typeof u.query() === 'string', 'query is string');
        equal(u.query(), 'foo=bar&bar=foo', 'query has right value');
        equal(u.search(), '?foo=bar&bar=foo', 'search has right value');
        deepEqual(u.query(true), {foo: 'bar', bar: 'foo'}, 'query(true) value');
        deepEqual(u.search(true), {foo: 'bar', bar: 'foo'}, 'search(true) value');
    });

    test('new URI(Location)', function () {
        var u = new URI(location);
        equal(u.href(), String(location.href), 'location object');
    });
    test('new URI(undefined)', function () {
        var u = new URI();
        ok(u instanceof URI, 'instanceof URI');
        equal(u.toString(), window.location && window.location.href || '', 'is location (browser) or empty string (node)');
        raises(function () {
            new URI(undefined);
        }, TypeError, 'Failing undefined input');
    });

})();

// Removed export to avoid module conflict in TypeScript config with module: 'none'
