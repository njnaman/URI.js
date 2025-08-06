/**
 * URI.js TypeScript Tests
 * Migrated from original QUnit tests to Jest
 */

import URI from '../URI';

// Global setup to mock browser environment when needed
const mockLocation = {
  href: 'http://example.org/directory/file.html'
};

// Mock global location for browser-like tests
(global as any).location = mockLocation;

describe('URI Constructor', () => {
  test('URI() without arguments', () => {
    const u = URI();
    expect(u).toBeInstanceOf(URI);
    expect(u.toString()).toBe(mockLocation.href);
  });

  test('URI(undefined) should throw TypeError', () => {
    expect(() => {
      URI(undefined as any);
    }).toThrow(TypeError);
  });

  test('URI(null) should throw TypeError', () => {
    expect(() => {
      URI(null as any);
    }).toThrow(TypeError);
  });

  test('new URI(string)', () => {
    const u = new URI('http://example.org/');
    expect(u).toBeInstanceOf(URI);
    expect(u._parts.hostname).toBeDefined();
  });

  test('new URI(object)', () => {
    const u = new URI('http://example.org');
    u.protocol('http');
    u.hostname('example.org');
    expect(u).toBeInstanceOf(URI);
    expect(u._parts.hostname).toBeDefined();
  });

  test('new URI with query build', () => {
    const u = new URI('http://example.org');
    u.query({ foo: 'bar', bar: 'foo' });
    expect(u).toBeInstanceOf(URI);
    expect(typeof u.query()).toBe('string');
    expect(u.query()).toBe('foo=bar&bar=foo');
  });
});

describe('URI Basic Methods', () => {
  test('toString() method', () => {
    const u = new URI('http://example.org/path?query=value#fragment');
    expect(u.toString()).toBe('http://example.org/path?query=value#fragment');
  });

  test('valueOf() method', () => {
    const u = new URI('http://example.org/path');
    expect(u.valueOf()).toBe('http://example.org/path');
  });

  test('href() getter', () => {
    const u = new URI('http://example.org/path');
    expect(u.href()).toBe('http://example.org/path');
  });

  test('href() setter', () => {
    const u = new URI();
    const result = u.href('http://example.org/path');
    expect(result).toBe(u); // Should return self for chaining
    expect(u.toString()).toBe('http://example.org/path');
  });

  test('clone() method', () => {
    const original = new URI('http://example.org/path?query=value');
    const cloned = original.clone();
    
    expect(cloned).toBeInstanceOf(URI);
    expect(cloned).not.toBe(original); // Different instances
    expect(cloned.toString()).toBe(original.toString()); // Same content
  });
});

describe('URI Component Methods', () => {
  test('protocol() getter and setter', () => {
    const u = new URI('http://example.org/');
    expect(u.protocol()).toBe('http');
    
    const result = u.protocol('https');
    expect(result).toBe(u); // Should return self for chaining
    expect(u.protocol()).toBe('https');
  });

  test('hostname() getter and setter', () => {
    const u = new URI('http://example.org/');
    expect(u.hostname()).toBe('example.org');
    
    const result = u.hostname('test.com');
    expect(result).toBe(u);
    expect(u.hostname()).toBe('test.com');
  });

  test('port() getter and setter', () => {
    const u = new URI('http://example.org:8080/');
    expect(u.port()).toBe('8080');
    
    const result = u.port(9000);
    expect(result).toBe(u);
    expect(u.port()).toBe('9000');
  });

  test('path() getter and setter', () => {
    const u = new URI('http://example.org/some/path');
    expect(u.path()).toBe('/some/path');
    
    const result = u.path('/new/path');
    expect(result).toBe(u);
    expect(u.path()).toBe('/new/path');
  });

  test('query() getter and setter with string', () => {
    const u = new URI('http://example.org/?foo=bar&baz=qux');
    expect(u.query()).toBe('foo=bar&baz=qux');
    
    const result = u.query('new=query');
    expect(result).toBe(u);
    expect(u.query()).toBe('new=query');
  });

  test('query() setter with object', () => {
    const u = new URI('http://example.org/');
    const queryObj = { foo: 'bar', baz: 'qux' };
    
    const result = u.query(queryObj);
    expect(result).toBe(u);
    expect(u.query()).toBe('foo=bar&baz=qux');
  });

  test('fragment() getter and setter', () => {
    const u = new URI('http://example.org/#section1');
    expect(u.fragment()).toBe('section1');
    
    const result = u.fragment('section2');
    expect(result).toBe(u);
    expect(u.fragment()).toBe('section2');
  });
});

describe('URI Static Properties', () => {
  test('version property', () => {
    expect(URI.version).toBe('1.19.11');
  });

  test('protocol_expression regex', () => {
    expect(URI.protocol_expression.test('http')).toBe(true);
    expect(URI.protocol_expression.test('https')).toBe(true);
    expect(URI.protocol_expression.test('ftp')).toBe(true);
    expect(URI.protocol_expression.test('invalid-protocol!')).toBe(false);
  });

  test('ip4_expression regex', () => {
    expect(URI.ip4_expression.test('192.168.1.1')).toBe(true);
    expect(URI.ip4_expression.test('127.0.0.1')).toBe(true);
    expect(URI.ip4_expression.test('not.an.ip')).toBe(false);
  });

  test('defaultPorts object', () => {
    expect(URI.defaultPorts.http).toBe('80');
    expect(URI.defaultPorts.https).toBe('443');
    expect(URI.defaultPorts.ftp).toBe('21');
  });

  test('hostProtocols array', () => {
    expect(URI.hostProtocols).toContain('http');
    expect(URI.hostProtocols).toContain('https');
  });
});

describe('URI Static Methods', () => {
  test('_parts() creates new parts object', () => {
    const parts = URI._parts();
    expect(parts).toHaveProperty('protocol');
    expect(parts).toHaveProperty('hostname');
    expect(parts).toHaveProperty('port');
    expect(parts).toHaveProperty('path');
    expect(parts).toHaveProperty('query');
    expect(parts).toHaveProperty('fragment');
    expect(parts.preventInvalidHostname).toBe(URI.preventInvalidHostname);
  });

  test('buildQuery() with object', () => {
    const query = URI.buildQuery({ foo: 'bar', baz: 'qux' });
    expect(query).toBe('foo=bar&baz=qux');
  });

  test('buildQuery() with empty object', () => {
    const query = URI.buildQuery({});
    expect(query).toBe('');
  });

  test('getDomAttribute() with valid node', () => {
    const mockNode = {
      nodeName: 'A'
    };
    expect(URI.getDomAttribute(mockNode as any)).toBe('href');
  });

  test('getDomAttribute() with input type image', () => {
    const mockNode = {
      nodeName: 'INPUT',
      type: 'image'
    };
    expect(URI.getDomAttribute(mockNode as any)).toBe('src');
  });

  test('getDomAttribute() with input type text', () => {
    const mockNode = {
      nodeName: 'INPUT',
      type: 'text'
    };
    expect(URI.getDomAttribute(mockNode as any)).toBeUndefined();
  });
});

describe('URI Method Chaining', () => {
  test('methods can be chained', () => {
    const result = new URI()
      .protocol('https')
      .hostname('example.org')
      .port(443)
      .path('/api/v1')
      .query('key=value')
      .fragment('section');

    expect(result).toBeInstanceOf(URI);
    expect(result.protocol()).toBe('https');
    expect(result.hostname()).toBe('example.org');
    expect(result.port()).toBe('443');
    expect(result.path()).toBe('/api/v1');
    expect(result.query()).toBe('key=value');
    expect(result.fragment()).toBe('section');
  });
});

describe('URI Edge Cases', () => {
  test('empty string handling', () => {
    const u = new URI('');
    expect(u.toString()).toBe('');
  });

  test('undefined components', () => {
    const u = new URI();
    expect(u.protocol()).toBe('');
    expect(u.hostname()).toBe('');
    expect(u.port()).toBe('');
    expect(u.path()).toBe('');
    expect(u.query()).toBe('');
    expect(u.fragment()).toBe('');
  });
}); 