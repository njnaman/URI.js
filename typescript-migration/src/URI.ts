/*!
 * URI.js - Mutating URLs
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

import punycode from './punycode';
import IPv6 from './IPv6';
import type { URIComponents, URIParts, URIInput, QueryValue, URIConstructor } from './types';

// Save current URI variable, if any
const _URI = (typeof global !== 'undefined' && (global as any).URI) || undefined;

// Utility functions
function isInteger(value: string): boolean {
  return /^[0-9]+$/.test(value);
}

function escapeRegEx(string: string): string {
  // https://github.com/medialize/URI.js/commit/85ac21783c11f8ccab06106dba9735a31a86924d#commitcomment-821963
  return string.replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
}

function getType(value: any): string {
  // IE8 doesn't return [Object Undefined] but [Object Object] for undefined value
  if (value === undefined) {
    return 'Undefined';
  }
  return String(Object.prototype.toString.call(value)).slice(8, -1);
}

function isArray(obj: any): obj is any[] {
  return getType(obj) === 'Array';
}

function filterArrayValues(data: string[], value: string | RegExp | string[]): string[] {
  let lookup: Record<string, boolean> | null = {};
  let i: number, length: number;

  if (getType(value) === 'RegExp') {
    lookup = null;
  } else if (isArray(value)) {
    for (i = 0, length = value.length; i < length; i++) {
      lookup![value[i]] = true;
    }
  } else {
    lookup[value as string] = true;
  }

  for (i = 0, length = data.length; i < length; i++) {
    const _match = lookup && lookup[data[i]] !== undefined
      || !lookup && (value as RegExp).test(data[i]);
    
    if (_match) {
      data.splice(i, 1);
      length--;
      i--;
    }
  }

  return data;
}

function arrayContains(list: any[], value: any): boolean {
  let i: number, length: number;

  // value may be string, number, array, regexp
  if (isArray(value)) {
    // Note: this can be optimized to O(n) (instead of current O(m * n))
    for (i = 0, length = value.length; i < length; i++) {
      if (!arrayContains(list, value[i])) {
        return false;
      }
    }
    return true;
  }

  const _type = getType(value);
  for (i = 0, length = list.length; i < length; i++) {
    if (_type === 'RegExp') {
      if (typeof list[i] === 'string' && list[i].match(value)) {
        return true;
      }
    } else if (list[i] === value) {
      return true;
    }
  }

  return false;
}

function arraysEqual(one: any[], two: any[]): boolean {
  if (!isArray(one) || !isArray(two)) {
    return false;
  }

  // arrays can't be equal if they have different amount of content
  if (one.length !== two.length) {
    return false;
  }

  one.sort();
  two.sort();

  for (let i = 0, l = one.length; i < l; i++) {
    if (one[i] !== two[i]) {
      return false;
    }
  }

  return true;
}

function trimSlashes(text: string): string {
  const trim_expression = /^\/+|\/+$/g;
  return text.replace(trim_expression, '');
}

// Main URI class
class URI {
  _parts: URIParts = URI._parts();

  constructor(url?: URIInput, base?: URIInput) {
    const _urlSupplied = arguments.length >= 1;
    const _baseSupplied = arguments.length >= 2;

    // Allow instantiation without the 'new' keyword
    if (!(this instanceof URI)) {
      if (_urlSupplied) {
        if (_baseSupplied) {
          return new URI(url, base);
        }
        return new URI(url);
      }
      return new URI();
    }

    if (url === undefined) {
      if (_urlSupplied) {
        throw new TypeError('undefined is not a valid argument for URI');
      }

      if (typeof location !== 'undefined') {
        url = location.href + '';
      } else {
        url = '';
      }
    }

    if (url === null) {
      if (_urlSupplied) {
        throw new TypeError('null is not a valid argument for URI');
      }
    }

    this.href(url as string);

    // resolve to base according to http://dvcs.w3.org/hg/url/raw-file/tip/Overview.html#constructor
    if (base !== undefined) {
      return this.absoluteTo(base);
    }

    return this;
  }

  // Core href method
  href(url?: string): URI | string {
    let parts: URIComponents;

    if (url === undefined) {
      return URI.build(this._parts);
    } else {
      this._parts = URI._parts();
      parts = URI.parse(url);
      this._parts = { ...this._parts, ...parts };
      return this;
    }
  }

  toString(): string {
    return this.href() as string;
  }

  valueOf(): string {
    return this.href() as string;
  }

  clone(): URI {
    const cloned = new URI();
    cloned._parts = { ...this._parts };
    return cloned;
  }

  // Component methods (basic implementations)
  protocol(protocol?: string): URI | string {
    if (protocol === undefined) {
      return this._parts.protocol || '';
    } else {
      this._parts.protocol = protocol;
      return this;
    }
  }

  hostname(hostname?: string): URI | string {
    if (hostname === undefined) {
      return this._parts.hostname || '';
    } else {
      this._parts.hostname = hostname;
      return this;
    }
  }

  port(port?: string | number): URI | string {
    if (port === undefined) {
      return this._parts.port || '';
    } else {
      this._parts.port = String(port);
      return this;
    }
  }

  path(path?: string): URI | string {
    if (path === undefined) {
      return this._parts.path || '';
    } else {
      this._parts.path = path;
      return this;
    }
  }

  query(query?: string | Record<string, any>): URI | string {
    if (query === undefined) {
      return this._parts.query || '';
    } else {
      if (typeof query === 'object') {
        this._parts.query = URI.buildQuery(query);
      } else {
        this._parts.query = query;
      }
      return this;
    }
  }

  fragment(fragment?: string): URI | string {
    if (fragment === undefined) {
      return this._parts.fragment || '';
    } else {
      this._parts.fragment = fragment;
      return this;
    }
  }

  // Static methods stub - will implement these
  static parse(url: string): URIComponents {
    // Basic implementation - will expand
    const parts: URIComponents = {};
    // TODO: Implement full parsing logic
    return parts;
  }

  static build(parts: URIComponents): string {
    // Basic implementation - will expand  
    let result = '';
    if (parts.protocol) {
      result += parts.protocol + ':';
    }
    if (parts.hostname) {
      result += '//' + parts.hostname;
    }
    if (parts.port) {
      result += ':' + parts.port;
    }
    if (parts.path) {
      result += parts.path;
    }
    if (parts.query) {
      result += '?' + parts.query;
    }
    if (parts.fragment) {
      result += '#' + parts.fragment;
    }
    return result;
  }

  static buildQuery(data: Record<string, any>): string {
    // Basic implementation
    const pairs: string[] = [];
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        pairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
      }
    }
    return pairs.join('&');
  }

  static _parts(): URIParts {
    return {
      protocol: null,
      username: null,
      password: null,
      hostname: null,
      urn: null,
      port: null,
      path: null,
      query: null,
      fragment: null,
      // state
      preventInvalidHostname: URI.preventInvalidHostname,
      duplicateQueryParameters: URI.duplicateQueryParameters,
      escapeQuerySpace: URI.escapeQuerySpace
    };
  }

  // Utility methods stubs
  absoluteTo(base: URIInput): URI {
    // TODO: Implement
    return this;
  }

  normalize(): URI {
    // TODO: Implement
    return this;
  }

  equals(url: URIInput): boolean {
    // TODO: Implement
    return false;
  }

  // Static properties
  static version = '1.19.11';
  static preventInvalidHostname = false;
  static duplicateQueryParameters = false;
  static escapeQuerySpace = true;

  // Regular expressions
  static protocol_expression = /^[a-z][a-z0-9.+-]*$/i;
  static idn_expression = /[^a-z0-9\._-]/i;
  static punycode_expression = /(xn--)/i;
  static ip4_expression = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
  static ip6_expression = /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/;
  static find_uri_expression = /\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»""'']))/ig;
  static leading_whitespace_expression = /^[\x00-\x20\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]+/;
  static ascii_tab_whitespace = /[\u0009\u000A\u000D]+/g;
  static invalid_hostname_characters = /[^a-zA-Z0-9\.\-:_]/;

  // Static objects
  static defaultPorts: Record<string, string> = {
    http: '80',
    https: '443',
    ftp: '21',
    gopher: '70',
    ws: '80',
    wss: '443'
  };

  static hostProtocols = [
    'http',
    'https'
  ];

  static domAttributes: Record<string, string> = {
    'a': 'href',
    'blockquote': 'cite',
    'link': 'href',
    'base': 'href',
    'script': 'src',
    'form': 'action',
    'img': 'src',
    'area': 'href',
    'iframe': 'src',
    'embed': 'src',
    'source': 'src',
    'track': 'src',
    'input': 'src',
    'audio': 'src',
    'video': 'src'
  };

  static findUri = {
    start: /\b(?:([a-z][a-z0-9.+-]*:\/\/)|www\.)/gi,
    end: /[\s\r\n]|$/,
    trim: /[`!()\[\]{};:'".,<>?«»""„'']+$/,
    parens: /(\([^\)]*\)|\[[^\]]*\]|\{[^}]*\}|<[^>]*>)/g,
  };

  static getDomAttribute(node: Node): string | undefined {
    if (!node || !(node as any).nodeName) {
      return undefined;
    }

    const nodeName = (node as any).nodeName.toLowerCase();
    // <input> should only expose src for type="image"
    if (nodeName === 'input' && (node as any).type !== 'image') {
      return undefined;
    }

    return URI.domAttributes[nodeName];
  }

  static noConflict(): URIConstructor {
    // restore previously defined URI, if any
    if (typeof global !== 'undefined') {
      (global as any).URI = _URI;
    }
    return URI as any;
  }
}

// Make URI callable without new
const URIConstructor = function(url?: URIInput, base?: URIInput): URI {
  return new URI(url, base);
} as any;

// Copy static properties to the constructor function
Object.setPrototypeOf(URIConstructor, URI);
Object.assign(URIConstructor, URI);
URIConstructor.prototype = URI.prototype;

export default URIConstructor as URIConstructor; 