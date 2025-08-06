/*!
 * Punycode.js v1.4.0 by @mathias
 * TypeScript migration
 */

import {PunycodeInterface} from './types';
// The `punycode` object
let punycode: PunycodeInterface;

// Highest positive signed 32-bit float value
const maxInt = 2147483647; // aka. 0x7FFFFFFF or 2^31-1

// Bootstring parameters
const base = 36;
const tMin = 1;
const tMax = 26;
const skew = 38;
const damp = 700;
const initialBias = 72;
const initialN = 128; // 0x80
const delimiter = '-'; // '\x2D'

// Regular expressions
const regexPunycode = /^xn--/;
const regexNonASCII = /[^\x20-\x7E]/; // unprintable ASCII chars + non-ASCII chars
const regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g; // RFC 3490 separators

// Error messages
const errors: Record<string, string> = {
  'overflow': 'Overflow: input needs wider integers to process',
  'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
  'invalid-input': 'Invalid input'
};

// Convenience shortcuts
const baseMinusTMin = base - tMin;
const floor = Math.floor;
const stringFromCharCode = String.fromCharCode;

/**
 * A generic error utility function.
 */
function error(type: string): never {
  throw new RangeError(errors[type]);
}

/**
 * A generic `Array#map` utility function.
 */
function map<T, U>(array: T[], fn: (item: T) => U): U[] {
  const result: U[] = [];
  let length = array.length;
  while (length--) {
    result[length] = fn(array[length]);
  }
  return result;
}

/**
 * A simple `Array#map`-like wrapper to work with domain name strings or email addresses.
 */
function mapDomain(string: string, fn: (label: string) => string): string {
  const parts = string.split('@');
  let result = '';
  if (parts.length > 1) {
    // In email addresses, only the domain name should be punycoded. Leave
    // the local part (i.e. everything up to `@`) intact.
    result = parts[0] + '@';
    string = parts[1];
  }
  // Avoid `split(regex)` for IE8 compatibility. See #17.
  string = string.replace(regexSeparators, '\x2E');
  const labels = string.split('.');
  const encoded = map(labels, fn).join('.');
  return result + encoded;
}

/**
 * Creates an array containing the numeric code points of each Unicode
 * character in the string. While JavaScript uses UCS-2 internally,
 * this function will convert a pair of surrogate halves (each of which
 * UCS-2 exposes as separate characters) into a single code point,
 * matching UTF-16.
 */
function ucs2decode(string: string): number[] {
  const output: number[] = [];
  let counter = 0;
  const length = string.length;

  while (counter < length) {
    const value = string.charCodeAt(counter++);
    if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
      // It's a high surrogate, and there is a next character.
      const extra = string.charCodeAt(counter++);
      if ((extra & 0xFC00) === 0xDC00) { // Low surrogate.
        output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
      } else {
        // It's an unmatched surrogate; only append this code unit, in case the
        // next code unit is the high surrogate of a surrogate pair.
        output.push(value);
        counter--;
      }
    } else {
      output.push(value);
    }
  }
  return output;
}

/**
 * Creates a string based on an array of numeric code points.
 */
function ucs2encode(array: number[]): string {
  return map(array, (value) => {
    let output = '';
    if (value > 0xFFFF) {
      value -= 0x10000;
      output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
      value = 0xDC00 | value & 0x3FF;
    }
    output += stringFromCharCode(value);
    return output;
  }).join('');
}

/**
 * Converts a basic code point into a digit/integer.
 */
function basicToDigit(codePoint: number): number {
  if (codePoint - 48 < 10) {
    return codePoint - 22;
  }
  if (codePoint - 65 < 26) {
    return codePoint - 65;
  }
  if (codePoint - 97 < 26) {
    return codePoint - 97;
  }
  return base;
}

/**
 * Converts a digit/integer into a basic code point.
 */
function digitToBasic(digit: number, flag: number): number {
  return digit + 22 + 75 * (digit < 26 ? 1 : 0) - (((flag !== 0) ? 1 : 0) << 5);
}

/**
 * Bias adaptation function as per section 3.4 of RFC 3492.
 */
function adapt(delta: number, numPoints: number, firstTime: boolean): number {
  let k = 0;
  delta = firstTime ? floor(delta / damp) : delta >> 1;
  delta += floor(delta / numPoints);

  for (; delta > baseMinusTMin * tMax >> 1; k += base) {
    delta = floor(delta / baseMinusTMin);
  }

  return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
}

/**
 * Converts a Punycode string of ASCII-only symbols to a string of Unicode symbols.
 */
function decode(input: string): string {
  const output: number[] = [];
  const inputLength = input.length;
  let out = 0;
  let i = 0;
  let n = initialN;
  let bias = initialBias;

  // Handle the basic code points: let `basic` be the number of input code points before the last delimiter
  let basic = input.lastIndexOf(delimiter);
  if (basic < 0) {
    basic = 0;
  }

  for (let j = 0; j < basic; ++j) {
    if (input.charCodeAt(j) >= 0x80) {
      // if it's not a basic code point
      error('not-basic');
    }
    output.push(input.charCodeAt(j));
  }

  // Main decoding loop: start just after the last delimiter if any basic code
  // points were copied; start at the beginning otherwise.
  for (let index = basic > 0 ? basic + 1 : 0; index < inputLength; /* no final expression */) {
    let oldi = i;
    let w = 1;

    for (let k = base; /* no condition */; k += base) {
      if (index >= inputLength) {
        error('invalid-input');
      }

      const digit = basicToDigit(input.charCodeAt(index++));

      if (digit >= base || digit > floor((maxInt - i) / w)) {
        error('overflow');
      }

      i += digit * w;
      const t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);

      if (digit < t) {
        break;
      }

      const baseMinusT = base - t;
      if (w > floor(maxInt / baseMinusT)) {
        error('overflow');
      }

      w *= baseMinusT;
    }

    out = output.length + 1;
    bias = adapt(i - oldi, out, oldi === 0);

    if (floor(i / out) > maxInt - n) {
      error('overflow');
    }

    n += floor(i / out);
    i %= out;

    output.splice(i++, 0, n);
  }

  return ucs2encode(output);
}

/**
 * Converts a string of Unicode symbols to a Punycode string of ASCII-only symbols.
 */
function encode(input: string): string {

  const output: string[] = [];

  // Convert the input in UCS-2 to Unicode
  const inputNumArr = ucs2decode(input);

  // Cache the length
  const inputLength = inputNumArr.length;

  // Initialize the state
  let n = initialN;
  let delta = 0;
  let bias = initialBias;

  // Handle the basic code points
  for (let j = 0; j < inputLength; ++j) {
    const currentValue = inputNumArr[j];
    if (currentValue < 0x80) {
      output.push(stringFromCharCode(currentValue));
    }
  }

  let basicLength = output.length;
  let handledCPCount = basicLength;

  // handledCPCount is the number of code points that have been handled;
  // basicLength is the number of basic code points.

  // Finish the basic string - if it is not empty - with a delimiter
  if (basicLength) {
    output.push(delimiter);
  }

  // Main encoding loop:
  while (handledCPCount < inputLength) {
    // All non-basic code points < n have been handled already. Find the next larger one:
    let m = maxInt;
    for (let j = 0; j < inputLength; ++j) {
      const currentValue = inputNumArr[j];
      if (currentValue >= n && currentValue < m) {
        m = currentValue;
      }
    }

    // Increase delta enough to advance the decoder's <n,i> state to <m,0>,
    // but guard against overflow:
    const handledCPCountPlusOne = handledCPCount + 1;
    if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
      error('overflow');
    }

    delta += (m - n) * handledCPCountPlusOne;
    n = m;

    for (let j = 0; j < inputLength; ++j) {
      const currentValue = inputNumArr[j];

      if (currentValue < n && ++delta > maxInt) {
        error('overflow');
      }

      if (currentValue === n) {
        // Represent delta as a generalized variable-length integer
        let q = delta;
        for (let k = base; /* no condition */; k += base) {
          const t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
          if (q < t) {
            break;
          }
          const qMinusT = q - t;
          const baseMinusT = base - t;
          output.push(
            stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
          );
          q = floor(qMinusT / baseMinusT);
        }

        output.push(stringFromCharCode(digitToBasic(q, 0)));
        bias = adapt(delta, handledCPCountPlusOne, handledCPCount === basicLength);
        delta = 0;
        ++handledCPCount;
      }
    }

    ++delta;
    ++n;
  }

  return output.join('');
}

/**
 * Converts a Punycode string representing a domain name or an email address to Unicode.
 */
function toUnicode(input: string): string {
  return mapDomain(input, (string) => {
    return regexPunycode.test(string)
      ? decode(string.slice(4).toLowerCase())
      : string;
  });
}

/**
 * Converts a Unicode string representing a domain name or an email address to Punycode.
 */
function toASCII(input: string): string {
  return mapDomain(input, (string) => {
    return regexNonASCII.test(string)
      ? 'xn--' + encode(string)
      : string;
  });
}

// Create the punycode object
punycode = {
  version: '1.3.2',
  ucs2: {
    decode: ucs2decode,
    encode: ucs2encode
  },
  decode,
  encode,
  toASCII,
  toUnicode
};

export default punycode;
