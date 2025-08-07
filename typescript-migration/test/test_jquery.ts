// TypeScript version of test_jquery.js
// Note: This is adapted for TypeScript without jQuery dependency
// The original tests were jQuery-specific and DOM-dependent

import { URI } from '../src/jquery.URI';

describe('jQuery.URI Functionality', () => {
  // Since we don't have jQuery or DOM in the TypeScript environment,
  // we'll test the core URI functionality that would be used in the jQuery plugin
  
  test('URI instance creation and modification', () => {
    const uri1 = new URI('http://example.org/');
    const uri2 = new URI('/hello.world');

    expect(uri1).toBeInstanceOf(URI);
    expect(uri2).toBeInstanceOf(URI);
    expect(uri1).not.toBe(uri2); // different instances

    // Test URI modification
    uri1.hostname('example.com');
    expect(uri1.hostname()).toBe('example.com');
    expect(uri1.toString()).toBe('http://example.com/');
  });

  test('URI filtering logic (without DOM)', () => {
    // Test URI comparison and filtering logic that would be used in jQuery selectors
    const testURIs = [
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
    const httpURIs = testURIs.filter(uri => uri.protocol() === 'http');
    expect(httpURIs.length).toBe(2);

    const httpsURIs = testURIs.filter(uri => uri.protocol() === 'https');
    expect(httpsURIs.length).toBe(1);

    // Test relative URIs
    const relativeURIs = testURIs.filter(uri => uri.is('relative'));
    expect(relativeURIs.length).toBe(3); // #anchor, /dontexist.jpg, /dontexist.svg

    // Test suffix filtering
    const jsURIs = testURIs.filter(uri => uri.suffix() === 'js');
    expect(jsURIs.length).toBe(0);

    const htmlURIs = testURIs.filter(uri => uri.suffix() === 'html');
    expect(htmlURIs.length).toBe(1);

    // Test hostname filtering
    const exampleOrgURIs = testURIs.filter(uri => uri.hostname() === 'example.org');
    expect(exampleOrgURIs.length).toBe(3);
  });

  test('URI equals functionality', () => {
    const uri1 = new URI('http://example.org/hello/world.html');
    const uri2 = new URI('http://example.org/hello/foo/../world.html');
    
    expect(uri1.equals(uri2)).toBe(true);
  });

  test('URI accessor functions', () => {
    const uri = new URI('http://example.org/path/file.ext?query=value#fragment');

    expect(uri.hostname()).toBe('example.org');
    expect(uri.path()).toBe('/path/file.ext');
    expect(uri.filename()).toBe('file.ext');
    expect(uri.suffix()).toBe('ext');
    expect(uri.query()).toBe('query=value');
    expect(uri.fragment()).toBe('fragment');

    // Test modification
    uri.hostname('example.com');
    expect(uri.hostname()).toBe('example.com');
    expect(uri.toString()).toBe('http://example.com/path/file.ext?query=value#fragment');
  });

  test('Directory and path operations', () => {
    const uri1 = new URI('ftp://localhost/one/two/three/file.ext');
    const uri2 = new URI('ftp://localhost/one/two/file.ext');

    expect(uri1.directory()).toBe('/one/two/three/');
    expect(uri2.directory()).toBe('/one/two/');

    // Test if directory contains '/two/'
    expect(uri1.directory().includes('/two/')).toBe(true);
    expect(uri2.directory().includes('/two/')).toBe(true);
  });

  test('URN detection', () => {
    const uri1 = new URI('mailto:mail@example.org');
    const uri2 = new URI('javascript:alert("test")');
    const uri3 = new URI('http://example.org/');

    expect(uri1.is('urn')).toBe(true);
    expect(uri2.is('urn')).toBe(true);
    expect(uri3.is('urn')).toBe(false);
  });
}); 