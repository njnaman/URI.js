// TypeScript version of test_fragmentQuery.js

// Reference the source files to compile them
/// <reference path="../src/URI.ts" />
/// <reference path="../src/URI.fragmentQuery.ts" />

declare var URI: any;

describe('URI.fragmentQuery', () => {
  test('storing query-data in fragment', () => {
    let u = new URI('http://example.org');

    expect(u.fragment(true)).toEqual({});

    u = new URI('http://example.org/#');
    expect(u.fragment(true)).toEqual({});

    u = new URI('http://example.org/#?hello=world');
    expect(u.fragment(true)).toEqual({hello: 'world'});

    u.fragment({bar: 'foo'});
    expect(u.fragment(true)).toEqual({bar: 'foo'});
    expect(u.toString()).toBe('http://example.org/#?bar=foo');

    u.addFragment('name', 'value');
    expect(u.fragment(true)).toEqual({bar: 'foo', name: 'value'});
    expect(u.toString()).toBe('http://example.org/#?bar=foo&name=value');

    u.removeFragment('bar');
    expect(u.fragment(true)).toEqual({name: 'value'});
    expect(u.toString()).toBe('http://example.org/#?name=value');

    u.removeFragment('name');
    expect(u.fragment(true)).toEqual({});
    expect(u.toString()).toBe('http://example.org/#?');

    u.setFragment('name', 'value1');
    expect(u.fragment(true)).toEqual({name: 'value1'});
    expect(u.toString()).toBe('http://example.org/#?name=value1');

    u.setFragment('name', 'value2');
    expect(u.fragment(true)).toEqual({name: 'value2'});
    expect(u.toString()).toBe('http://example.org/#?name=value2');
  });

  test('fragmentPrefix', () => {
    let u: any;

    (URI as any).fragmentPrefix = '!';
    u = new URI('http://example.org');
    expect((u as any)._parts.fragmentPrefix).toBe('!');

    u.fragment('#?hello=world');
    expect(u.fragment()).toBe('?hello=world');
    expect(u.fragment(true)).toEqual({});

    u.fragment('#!hello=world');
    expect(u.fragment()).toBe('!hello=world');
    expect(u.fragment(true)).toEqual({hello: 'world'});

    (u as any).fragmentPrefix('§');
    expect(u.fragment()).toBe('!hello=world');
    expect(u.fragment(true)).toEqual({});

    u.fragment('#§hello=world');
    expect(u.fragment()).toBe('§hello=world');
    expect(u.fragment(true)).toEqual({hello: 'world'});

    (URI as any).fragmentPrefix = '?';
  });
}); 