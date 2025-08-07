/*
 * What would jim do?
 * more tests for border-edge cases
 * Christian Harms.
 *
 * Note: I have no clue who or what jim is supposed to be. It might be something like the German DAU (dumbest possible user)
 */

// TypeScript version of test_jim.js
import { URI } from '../src/URI';

describe('injection', () => {
  test('protocol', () => {
    const u = new URI('http://example.com/dir1/dir2/?query1=value1&query2=value2#hash');
    
    expect(() => {
      u.protocol('ftp://example.org');
    }).toThrow(TypeError);

    u.protocol('ftp:');
    expect(u.protocol()).toBe('ftp');
    expect(u.hostname()).toBe('example.com');
  });

  test('port', () => {
    const u = new URI('http://example.com/dir1/dir2/?query1=value1&query2=value2#hash');
    
    expect(() => {
      u.port('99:example.org');
    }).toThrow(TypeError);

    u.port(':99');
    expect(u.hostname()).toBe('example.com');
    expect(u.port()).toBe(99);

    u.port(false);
    expect(u.port()).toBe('');

    // RFC 3986 says nothing about "16-bit unsigned" http://tools.ietf.org/html/rfc3986#section-3.2.3
    // u.href(new URI("http://example.com/"))
    // u.port(65536);
    // notEqual(u.port(), "65536", "port() has set to an non-valid value (A port number is a 16-bit unsigned integer)");

    expect(() => {
      u.port('-99');
    }).toThrow(TypeError);
  });

  test('domain', () => {
    const u = new URI('http://example.com/dir1/dir2/?query1=value1&query2=value2#hash');

    expect(() => {
      u.domain('example.org/dir0/');
    }).toThrow(TypeError);

    expect(() => {
      u.domain('example.org:80');
    }).toThrow(TypeError);

    expect(() => {
      u.domain('foo@example.org');
    }).toThrow(TypeError);
  });

  test('subdomain', () => {
    const u = new URI('http://example.com/dir1/dir2/?query1=value1&query2=value2#hash');

    expect(() => {
      u.subdomain('example.org/dir0/');
    }).toThrow(TypeError);

    expect(() => {
      u.subdomain('example.org:80');
    }).toThrow(TypeError);

    expect(() => {
      u.subdomain('foo@example.org');
    }).toThrow(TypeError);
  });

  test('tld', () => {
    const u = new URI('http://example.com/dir1/dir2/?query1=value1&query2=value2#hash');

    expect(() => {
      u.tld('foo/bar.html');
    }).toThrow(TypeError);
  });

  test('path', () => {
    const u = new URI('http://example.com/dir1/dir2/?query1=value1&query2=value2#hash');
    u.path('/dir3/?query3=value3#fragment');
    expect(u.hostname()).toBe('example.com');
    expect(u.path()).toBe('/dir3/%3Fquery3=value3%23fragment');
    expect(u.query()).toBe('query1=value1&query2=value2');
    expect(u.fragment()).toBe('hash');
  });

  test('filename', () => {
    const u = new URI('http://example.com/dir1/dir2/?query1=value1&query2=value2#hash');

    u.filename('name.html?query');
    expect(u.filename()).toBe('name.html%3Fquery');
    expect(u.query()).toBe('query1=value1&query2=value2');

    // allowed!
    u.filename('../name.html?query');
    expect(u.filename()).toBe('name.html%3Fquery');
    expect(u.directory()).toBe('/dir1');

    u.filename(null);
    expect(u.filename()).toBe('name.html%3Fquery');
    expect(u.directory()).toBe('/dir1');

    u.filename(false);
    expect(u.filename()).toBe('name.html%3Fquery');
    expect(u.directory()).toBe('/dir1');

    u.filename(0);
    expect(u.filename()).toBe('name.html%3Fquery');
    expect(u.directory()).toBe('/dir1');
  });

  test('addQuery', () => {
    const u = new URI('http://example.com/dir1/dir2/?query1=value1&query2=value2#hash');
    u.addQuery('query3', 'value3#got');
    expect(u.query()).toBe('query1=value1&query2=value2&query3=value3%23got');
    expect(u.fragment()).toBe('hash');
  });

  /*
  // RFC 3986 says "…and should limit these names to no more than 255 characters in length."
  // SHOULD is not MUST therefore not the responsibility of URI.js

  describe("validation", () => {
    test("domain", () => {
      // this bases on the wiki page information: http://en.wikipedia.org/wiki/Domain_Name_System
      const u = new URI("http://example.com/");
      let domain: string;

      //generate a 204 character domain
      domain = "com"
      for (let i=0; i<20; i++) {
        domain = "0123456789." + domain;
      }
      u.domain(domain);
      expect(u.hostname()).toBe(domain);

      //expand the domain to a 404 character domain
      for (let i=0; i<20; i++) {
        domain = "0123456789." + domain;
      }
      u.domain(domain);
      expect(u.hostname() == domain).toBe(true);

      //generate a domain with three 70-char subdomains-parts.
      domain = "com";
      for (let j=0; j<3; j++) {
        //start new subdomain
        domain = "." + domain;
        for (let i=0; i<70; i++) {
          domain = "a" + domain;
        }
      }
      u.domain(domain);
      expect(u.hostname() == domain).toBe(true);
    });
  });
  */
}); 