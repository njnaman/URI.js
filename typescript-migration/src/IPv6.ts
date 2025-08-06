/*!
 * URI.js - Mutating URLs
 * IPv6 Support
 *
 * Version: 1.19.11
 *
 * Author: Rodney Rehm
 * Web: http://medialize.github.io/URI.js/
 *
 * Licensed under
 *   MIT License http://www.opensource.org/licenses/mit-license
 *
 */

import type { IPv6 } from './types';

// save current IPv6 variable, if any
const _IPv6 = (typeof global !== 'undefined' && (global as any).IPv6) || undefined;

function bestPresentation(address: string): string {
  // based on:
  // Javascript to test an IPv6 address for proper format, and to
  // present the "best text representation" according to IETF Draft RFC at
  // http://tools.ietf.org/html/draft-ietf-6man-text-addr-representation-04
  // 8 Feb 2010 Rich Brown, Dartware, LLC
  // Please feel free to use this code as long as you provide a link to
  // http://www.intermapper.com
  // http://intermapper.com/support/tools/IPV6-Validator.aspx

  // string search variable
  let _address = address.toLowerCase();
  const segments = _address.split(':');
  const length = segments.length;
  const total = 8;

  // trim colons (::)
  if (segments[0] === '' && segments[1] === '' && segments[2] === '') {
    // ::/128
    segments.shift();
    segments.shift();
  } else if (segments[0] === '' && segments[1] === '') {
    // ::1/128
    segments.shift();
  } else if (segments[length - 1] === '' && segments[length - 2] === '') {
    // 1::/128
    segments.pop();
  }

  const newLength = segments.length;
  let i: number;

  // fill empty segments them with "0000"
  if (newLength < total) {
    for (i = 1; i <= total - newLength; i++) {
      segments.splice(segments.indexOf(''), 0, '0000');
    }
  }

  // strip leading zeros
  for (i = 0; i < total; i++) {
    segments[i] = ('0000' + segments[i]).substr(-4);
  }

  _address = segments.join(':');

  // find longest sequence of zero segments and mark it for compression
  const _segments = _address.match(/((^|:)(0(:|$)){2,})/g);
  const _compress = _segments ? _segments.sort((a, b) => b.length - a.length)[0] : '';

  if (_compress.length > 5) {
    _address = _address.replace(_compress, '::');
  }

  return _address;
}

function noConflict(): IPv6 {
  // restore previously defined IPv6, if any
  if (typeof global !== 'undefined') {
    (global as any).IPv6 = _IPv6;
  }
  return IPv6;
}

const IPv6: IPv6 = {
  best: bestPresentation,
  noConflict: noConflict
};

export default IPv6; 