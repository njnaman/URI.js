// TypeScript version of test_fragmentURI.js

// Reference the source files to compile them
/// <reference path="../src/URI.ts" />
/// <reference path="../src/URI.fragmentURI.ts" />

declare var URI: any;

describe('URI.fragmentURI', () => {
  test('storing URLs in fragment', () => {
    let u = new URI('http://example.org');
    let f: any;
  
    // var uri = URI('http://example.org/#!/foo/bar/baz.html');
    // var furi = uri.fragment(true);
    // furi.pathname() === '/foo/bar/baz.html';
    // furi.pathname('/hello.html');
    // uri.toString() === 'http://example.org/#!/hello.html'
  
    expect(u.fragment(true)).toBeInstanceOf(URI);

    u = new URI('http://example.org/#');
    expect(u.fragment(true)).toBeInstanceOf(URI);
  
    u = new URI('http://example.org/#!/foo/bar/baz.html');
    f = u.fragment(true);
    expect(f.pathname()).toBe('/foo/bar/baz.html');
    expect(f.filename()).toBe('baz.html');
  
    f.filename('foobar.txt');
    expect(f.pathname()).toBe('/foo/bar/foobar.txt');
    expect(u.fragment()).toBe('!/foo/bar/foobar.txt');
    expect(u.toString()).toBe('http://example.org/#!/foo/bar/foobar.txt');
  });

  test('fragmentPrefix', () => {
    let u: any;
  
    (URI as any).fragmentPrefix = '?';
    u = new URI('http://example.org');
    expect((u as any)._parts.fragmentPrefix).toBe('?');
  
    u.fragment('#!/foo/bar/baz.html');
    expect(u.fragment()).toBe('!/foo/bar/baz.html');
    expect(u.fragment(true)).toBeInstanceOf(URI);
    expect(u.fragment(true).toString()).toBe('');
  
    u.fragment('#?/foo/bar/baz.html');
    expect(u.fragment()).toBe('?/foo/bar/baz.html');
    expect(u.fragment(true)).toBeInstanceOf(URI);
    expect(u.fragment(true).toString()).toBe('/foo/bar/baz.html');
  
    (u as any).fragmentPrefix('§');
    expect(u.fragment()).toBe('?/foo/bar/baz.html');
    expect(u.fragment(true)).toBeInstanceOf(URI);
    expect(u.fragment(true).toString()).toBe('');
  
    u.fragment('#§/foo/bar/baz.html');
    expect(u.fragment()).toBe('§/foo/bar/baz.html');
    expect(u.fragment(true)).toBeInstanceOf(URI);
    expect(u.fragment(true).toString()).toBe('/foo/bar/baz.html');
  
    (URI as any).fragmentPrefix = '!';
  });
}); 