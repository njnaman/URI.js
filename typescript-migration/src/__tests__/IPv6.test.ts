/**
 * IPv6 TypeScript Tests
 */

import IPv6 from '../IPv6';

describe('IPv6 Module', () => {
  test('IPv6 object structure', () => {
    expect(IPv6).toHaveProperty('best');
    expect(IPv6).toHaveProperty('noConflict');
    expect(typeof IPv6.best).toBe('function');
    expect(typeof IPv6.noConflict).toBe('function');
  });

  describe('IPv6.best() - Best representation', () => {
    test('compresses consecutive zero groups', () => {
      expect(IPv6.best('fe80:0000:0000:0000:0204:61ff:fe9d:f156')).toBe('fe80::204:61ff:fe9d:f156');
      expect(IPv6.best('2001:0db8:0000:0000:0000:0000:0000:0001')).toBe('2001:db8::1');
      expect(IPv6.best('2001:0db8:0000:0000:0001:0000:0000:0001')).toBe('2001:db8::1:0:0:1');
    });

    test('removes leading zeros', () => {
      expect(IPv6.best('2001:0db8:0000:0042:0000:8a2e:0370:7334')).toBe('2001:db8::42:0:8a2e:370:7334');
      expect(IPv6.best('0001:0002:0003:0004:0005:0006:0007:0008')).toBe('1:2:3:4:5:6:7:8');
    });

    test('handles loopback address', () => {
      expect(IPv6.best('0000:0000:0000:0000:0000:0000:0000:0001')).toBe('::1');
      expect(IPv6.best('::1')).toBe('::1');
    });

    test('handles unspecified address', () => {
      expect(IPv6.best('0000:0000:0000:0000:0000:0000:0000:0000')).toBe('::');
      expect(IPv6.best('::')).toBe('::');
    });

    test('handles already compressed addresses', () => {
      expect(IPv6.best('fe80::1')).toBe('fe80::1');
      expect(IPv6.best('2001:db8::1')).toBe('2001:db8::1');
    });

    test('chooses longest zero sequence for compression', () => {
      expect(IPv6.best('2001:0:0:1:0:0:0:1')).toBe('2001:0:0:1::1');
      expect(IPv6.best('2001:db8:0:0:1:0:0:1')).toBe('2001:db8::1:0:0:1');
    });

    test('handles edge cases with colons', () => {
      expect(IPv6.best('::ffff:192.0.2.1')).toBe('::ffff:192.0.2.1');
      expect(IPv6.best('2001:db8:85a3::8a2e:370:7334')).toBe('2001:db8:85a3::8a2e:370:7334');
    });

    test('handles short sequences that should not be compressed', () => {
      // Only compress if the zero sequence is longer than 5 characters
      expect(IPv6.best('2001:db8:0:1:1:1:1:1')).toBe('2001:db8:0:1:1:1:1:1');
    });

    test('case insensitive handling', () => {
      expect(IPv6.best('2001:DB8:0000:0000:0000:0000:0000:0001')).toBe('2001:db8::1');
      expect(IPv6.best('FE80:0000:0000:0000:0204:61FF:FE9D:F156')).toBe('fe80::204:61ff:fe9d:f156');
    });
  });

  describe('IPv6.noConflict()', () => {
    test('returns IPv6 object', () => {
      const result = IPv6.noConflict();
      expect(result).toHaveProperty('best');
      expect(result).toHaveProperty('noConflict');
    });

    test('restores global IPv6 if it existed', () => {
      // This test is more about ensuring the function exists and returns correctly
      // In a real environment, it would restore the previous global.IPv6 value
      const result = IPv6.noConflict();
      expect(typeof result.best).toBe('function');
    });
  });

  describe('Complex IPv6 scenarios', () => {
    test('mixed case with multiple zero groups', () => {
      expect(IPv6.best('2001:0DB8:0000:0000:0000:FF00:0042:8329')).toBe('2001:db8::ff00:42:8329');
    });

    test('addresses with embedded IPv4', () => {
      expect(IPv6.best('::ffff:192.0.2.1')).toBe('::ffff:192.0.2.1');
      expect(IPv6.best('2001:db8:85a3:0:0:8a2e:370:7334')).toBe('2001:db8:85a3::8a2e:370:7334');
    });

    test('full addresses without zeros', () => {
      expect(IPv6.best('2001:db8:85a3:8d3:1319:8a2e:370:7344')).toBe('2001:db8:85a3:8d3:1319:8a2e:370:7344');
    });
  });

  describe('Boundary conditions', () => {
    test('single zero group', () => {
      expect(IPv6.best('2001:db8:0:1:1:1:1:1')).toBe('2001:db8:0:1:1:1:1:1');
    });

    test('multiple single zero groups', () => {
      expect(IPv6.best('2001:0:db8:0:1:0:1:1')).toBe('2001:0:db8:0:1:0:1:1');
    });

    test('zero groups at the beginning', () => {
      expect(IPv6.best('0:0:0:1:1:1:1:1')).toBe('::1:1:1:1:1');
    });

    test('zero groups at the end', () => {
      expect(IPv6.best('1:1:1:1:0:0:0:0')).toBe('1:1:1:1::');
    });
  });
}); 