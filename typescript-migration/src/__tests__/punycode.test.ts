/**
 * Punycode TypeScript Tests
 */

import punycode from '../punycode';

describe('Punycode Module', () => {
  test('punycode object structure', () => {
    expect(punycode).toHaveProperty('version');
    expect(punycode).toHaveProperty('ucs2');
    expect(punycode).toHaveProperty('decode');
    expect(punycode).toHaveProperty('encode');
    expect(punycode).toHaveProperty('toASCII');
    expect(punycode).toHaveProperty('toUnicode');
  });

  test('version property', () => {
    expect(punycode.version).toBe('1.4.0');
  });

  describe('UCS2 methods', () => {
    test('ucs2.decode', () => {
      expect(punycode.ucs2.decode('abc')).toEqual([97, 98, 99]);
      expect(punycode.ucs2.decode('𝌆')).toEqual([0x1D306]);
    });

    test('ucs2.encode', () => {
      expect(punycode.ucs2.encode([97, 98, 99])).toBe('abc');
      expect(punycode.ucs2.encode([0x1D306])).toBe('𝌆');
    });
  });

  describe('Punycode encoding/decoding', () => {
    test('decode simple ASCII', () => {
      expect(punycode.decode('maana-pta')).toBe('mañana');
      expect(punycode.decode('wgbl6av')).toBe('☃-⌘');
    });

    test('encode simple ASCII', () => {
      expect(punycode.encode('mañana')).toBe('maana-pta');
      expect(punycode.encode('☃-⌘')).toBe('wgbl6av');
    });

    test('round-trip encoding/decoding', () => {
      const testStrings = [
        'mañana',
        '☃-⌘',
        'Beispiel',
        '测试',
        'مثال'
      ];

      testStrings.forEach(str => {
        const encoded = punycode.encode(str);
        const decoded = punycode.decode(encoded);
        expect(decoded).toBe(str);
      });
    });
  });

  describe('Domain conversion', () => {
    test('toASCII converts Unicode domains', () => {
      expect(punycode.toASCII('mañana.com')).toBe('xn--maana-pta.com');
      expect(punycode.toASCII('☃-⌘.com')).toBe('xn--wgbl6av.com');
      expect(punycode.toASCII('example.com')).toBe('example.com'); // ASCII stays the same
    });

    test('toUnicode converts punycode domains', () => {
      expect(punycode.toUnicode('xn--maana-pta.com')).toBe('mañana.com');
      expect(punycode.toUnicode('xn--wgbl6av.com')).toBe('☃-⌘.com');
      expect(punycode.toUnicode('example.com')).toBe('example.com'); // ASCII stays the same
    });

    test('round-trip domain conversion', () => {
      const domains = [
        'mañana.com',
        '☃-⌘.example.org',
        'test.测试.com'
      ];

      domains.forEach(domain => {
        const ascii = punycode.toASCII(domain);
        const unicode = punycode.toUnicode(ascii);
        expect(unicode).toBe(domain);
      });
    });
  });

  describe('Email address handling', () => {
    test('toASCII handles email addresses', () => {
      expect(punycode.toASCII('user@mañana.com')).toBe('user@xn--maana-pta.com');
      expect(punycode.toASCII('test@example.com')).toBe('test@example.com');
    });

    test('toUnicode handles email addresses', () => {
      expect(punycode.toUnicode('user@xn--maana-pta.com')).toBe('user@mañana.com');
      expect(punycode.toUnicode('test@example.com')).toBe('test@example.com');
    });
  });

  describe('Error handling', () => {
    test('decode throws on overflow', () => {
      expect(() => {
        punycode.decode('invalid-input-that-causes-overflow');
      }).toThrow();
    });

    test('encode handles empty strings', () => {
      expect(punycode.encode('')).toBe('');
      expect(punycode.decode('')).toBe('');
    });
  });

  describe('Edge cases', () => {
    test('handles hyphen delimiter', () => {
      expect(punycode.encode('a-b')).toBe('a-b-');
      expect(punycode.decode('a-b-')).toBe('a-b');
    });

    test('handles basic ASCII characters', () => {
      const ascii = 'abcdefghijklmnopqrstuvwxyz0123456789';
      expect(punycode.encode(ascii)).toBe(ascii + '-');
      expect(punycode.decode(ascii + '-')).toBe(ascii);
    });
  });
}); 