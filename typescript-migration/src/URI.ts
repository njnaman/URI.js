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

// Declare URI variable at module level
var URI: any;

(function (root, factory) {
  'use strict';
  // https://github.com/umdjs/umd/blob/master/returnExports.js
  if (typeof module === 'object' && module.exports) {
    // Node
    URI = module.exports = factory(require('./punycode'), require('./IPv6'), require('./SecondLevelDomains'));
  } else if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['./punycode', './IPv6', './SecondLevelDomains'], factory);
  } else {
    // Browser globals (root is window)
    URI = factory((root as any)?.punycode, (root as any)?.IPv6, (root as any)?.SecondLevelDomains, root);
    if (root) {
      (root as any).URI = URI;
    }
  }
}(this, function (punycode: any, IPv6: any, SLD: any, root?: any) {
  'use strict';
  /*global location, escape, unescape */
  // FIXME: v2.0.0 renamce non-camelCase properties to uppercase
  /*jshint camelcase: false */

  // save current URI variable, if any
  var _URI = root && root.URI;

interface URIParts {
  protocol: string | null;
  username: string | null;
  password: string | null;
  hostname: string | null;
  urn: boolean | null;
  port: string | null;
  path: string | null;
  query: string | null;
  fragment: string | null;
  preventInvalidHostname: boolean;
  duplicateQueryParameters: boolean;
  escapeQuerySpace: boolean;
}

interface QueryData {
  [key: string]: string | string[] | null;
}

interface DomAttributes {
  [nodeName: string]: string;
}

interface CharacterMap {
  [char: string]: string;
}

interface CharacterConfig {
  expression: RegExp;
  map: CharacterMap;
}

interface CharacterGroup {
  encode?: CharacterConfig;
  decode?: CharacterConfig;
}

interface Characters {
  pathname: CharacterGroup;
  reserved: CharacterGroup;
  urnpath: CharacterGroup;
}

interface FindUriConfig {
  start: RegExp;
  end: RegExp;
  trim: RegExp;
  parens: RegExp;
}

interface WithinStringOptions {
  start?: RegExp;
  end?: RegExp;
  trim?: RegExp;
  parens?: RegExp;
  ignoreHtml?: boolean;
  ignore?: RegExp;
}

interface DefaultPorts {
  [protocol: string]: string;
}

// Main URI interface
interface URIProto {
  // Core methods
  build(deferBuild?: boolean): URIProto;
  clone(): URIProto;
  valueOf(): string;
  toString(): string;

  // Component accessors
  protocol(): string;
  protocol(protocol: string, build?: boolean): URIProto;
  scheme(): string;
  scheme(scheme: string, build?: boolean): URIProto;
  username(): string;
  username(username: string, build?: boolean): URIProto;
  password(): string;
  password(password: string, build?: boolean): URIProto;
  hostname(): string;
  hostname(hostname: string, build?: boolean): URIProto;
  port(): string;
  port(port: string | number, build?: boolean): URIProto;
  query(): string;
  query(query: string, build?: boolean): URIProto;
  query(query: QueryData, build?: boolean): URIProto;
  query(query: boolean): QueryData;
  query(query: (data: QueryData) => QueryData | void, build?: boolean): URIProto;
  fragment(): string;
  fragment(fragment: string, build?: boolean): URIProto;

  // Convenience accessors
  search(): string;
  search(search: string, build?: boolean): URIProto;
  hash(): string;
  hash(hash: string, build?: boolean): URIProto;
  pathname(): string;
  pathname(pathname: string, build?: boolean): URIProto;
  pathname(decode: boolean): string;
  path(): string;
  path(path: string, build?: boolean): URIProto;
  path(decode: boolean): string;
  href(): string;
  href(href: string | URIProto | object, build?: boolean): URIProto;

  // Identification methods
  is(what: string): boolean | null;

  // Compound accessors
  origin(): string;
  origin(origin: string, build?: boolean): URIProto;
  host(): string;
  host(host: string, build?: boolean): URIProto;
  authority(): string;
  authority(authority: string, build?: boolean): URIProto;
  userinfo(): string;
  userinfo(userinfo: string, build?: boolean): URIProto;
  resource(): string;
  resource(resource: string, build?: boolean): URIProto;

  // Domain methods
  subdomain(): string;
  subdomain(subdomain: string, build?: boolean): URIProto;
  domain(): string;
  domain(domain: string, build?: boolean): URIProto;
  domain(returnSld: boolean): string;
  tld(): string;
  tld(tld: string, build?: boolean): URIProto;
  tld(returnSld: boolean): string;

  // Path methods
  directory(): string;
  directory(directory: string, build?: boolean): URIProto;
  directory(decode: boolean): string;
  filename(): string;
  filename(filename: string, build?: boolean): URIProto;
  filename(decode: boolean): string;
  suffix(): string;
  suffix(suffix: string, build?: boolean): URIProto;
  suffix(decode: boolean): string;

  // Segment methods
  segment(): string[];
  segment(segments: string[]): URIProto;
  segment(segment: number): string;
  segment(segment: number, value: string, build?: boolean): URIProto;
  segmentCoded(): string[];
  segmentCoded(segments: string[]): URIProto;
  segmentCoded(segment: number): string;
  segmentCoded(segment: number, value: string, build?: boolean): URIProto;

  // Query methods
  setQuery(name: string, value: string | null, build?: boolean): URIProto;
  setQuery(data: QueryData, build?: boolean): URIProto;
  addQuery(name: string, value: string | null, build?: boolean): URIProto;
  addQuery(data: QueryData, build?: boolean): URIProto;
  removeQuery(name: string, value?: string | RegExp, build?: boolean): URIProto;
  removeQuery(name: string[], build?: boolean): URIProto;
  removeQuery(name: RegExp, build?: boolean): URIProto;
  removeQuery(data: QueryData, build?: boolean): URIProto;
  hasQuery(name: string, value?: string | number | boolean | RegExp | Function | string[], withinArray?: boolean): boolean;
  hasQuery(name: RegExp, value?: string | number | boolean | RegExp | Function | string[], withinArray?: boolean): boolean;
  hasQuery(data: QueryData): boolean;

  // Alias methods
  setSearch(name: string, value: string | null, build?: boolean): URIProto;
  setSearch(data: QueryData, build?: boolean): URIProto;
  addSearch(name: string, value: string | null, build?: boolean): URIProto;
  addSearch(data: QueryData, build?: boolean): URIProto;
  removeSearch(name: string, value?: string | RegExp, build?: boolean): URIProto;
  removeSearch(name: string[], build?: boolean): URIProto;
  removeSearch(name: RegExp, build?: boolean): URIProto;
  removeSearch(data: QueryData, build?: boolean): URIProto;
  hasSearch(name: string, value?: string | number | boolean | RegExp | Function | string[], withinArray?: boolean): boolean;
  hasSearch(name: RegExp, value?: string | number | boolean | RegExp | Function | string[], withinArray?: boolean): boolean;
  hasSearch(data: QueryData): boolean;

  // Normalization
  normalize(): URIProto;
  normalizeProtocol(build?: boolean): URIProto;
  normalizeHostname(build?: boolean): URIProto;
  normalizePort(build?: boolean): URIProto;
  normalizePath(build?: boolean): URIProto;
  normalizePathname(build?: boolean): URIProto;
  normalizeQuery(build?: boolean): URIProto;
  normalizeFragment(build?: boolean): URIProto;
  normalizeSearch(build?: boolean): URIProto;
  normalizeHash(build?: boolean): URIProto;

  // Encoding
  iso8859(): URIProto;
  unicode(): URIProto;
  readable(): string;

  // Relative/Absolute conversion
  absoluteTo(base: string | URIProto): URIProto;
  relativeTo(base: string | URIProto): URIProto;

  // Comparison
  equals(uri: string | URIProto): boolean;

  // State configuration
  preventInvalidHostname(prevent: boolean): URIProto;
  duplicateQueryParameters(allow: boolean): URIProto;
  escapeQuerySpace(escape: boolean): URIProto;

  // Internal properties
  _parts: URIParts;
  _string: string;
  _deferred_build: boolean;
}

// Constructor interface
interface URIConstructor {
  new (): URIProto;
  new (uri: string): URIProto;
  new (uri: string, base: string): URIProto;
  new (uri: URIProto): URIProto;
  new (components: object): URIProto;
  (): URIProto;
  (uri: string): URIProto;
  (uri: string, base: string): URIProto;
  (uri: URIProto): URIProto;
  (components: object): URIProto;

  // Static properties
  version: string;
  preventInvalidHostname: boolean;
  duplicateQueryParameters: boolean;
  escapeQuerySpace: boolean;
  protocol_expression: RegExp;
  idn_expression: RegExp;
  punycode_expression: RegExp;
  ip4_expression: RegExp;
  ip6_expression: RegExp;
  find_uri_expression: RegExp;
  findUri: FindUriConfig;
  leading_whitespace_expression: RegExp;
  ascii_tab_whitespace: RegExp;
  defaultPorts: DefaultPorts;
  hostProtocols: string[];
  invalid_hostname_characters: RegExp;
  domAttributes: DomAttributes;
  characters: Characters;

  // Static methods
  _parts(): URIParts;
  getDomAttribute(node: Element | null | undefined): string | undefined;
  encode: (str: string) => string;
  decode: (str: string) => string;
  iso8859(): void;
  unicode(): void;
  encodeQuery(str: string, escapeQuerySpace?: boolean): string;
  decodeQuery(str: string, escapeQuerySpace?: boolean): string;
  encodePathSegment: (str: string) => string;
  decodePathSegment: (str: string) => string;
  encodeUrnPathSegment: (str: string) => string;
  decodeUrnPathSegment: (str: string) => string;
  decodePath: (str: string) => string;
  decodeUrnPath: (str: string) => string;
  recodePath: (str: string) => string;
  recodeUrnPath: (str: string) => string;
  encodeReserved: (str: string) => string;
  parse(string: string, parts?: Partial<URIParts>): URIParts;
  parseHost(string: string, parts: Partial<URIParts>): string;
  parseAuthority(string: string, parts: Partial<URIParts>): string;
  parseUserinfo(string: string, parts: Partial<URIParts>): string;
  parseQuery(string: string, escapeQuerySpace?: boolean): QueryData;
  build(parts: URIParts): string;
  buildHost(parts: URIParts): string;
  buildAuthority(parts: URIParts): string;
  buildUserinfo(parts: URIParts): string;
  buildQuery(data: QueryData, duplicateQueryParameters?: boolean, escapeQuerySpace?: boolean): string;
  buildQueryParameter(name: string, value: string | null, escapeQuerySpace?: boolean): string;
  addQuery(data: QueryData, name: string | QueryData, value?: string | string[]): void;
  setQuery(data: QueryData, name: string | QueryData, value?: string | null): void;
  removeQuery(data: QueryData, name: string | string[] | RegExp | QueryData, value?: string | RegExp): void;
  hasQuery(data: QueryData, name: string | RegExp | QueryData, value?: any, withinArray?: boolean): boolean;
  joinPaths(...paths: string[]): URIProto;
  commonPath(one: string, two: string): string;
  withinString(string: string, callback: (uri: string, start: number, end: number, string: string) => string | void, options?: WithinStringOptions): string;
  ensureValidHostname(hostname: string, protocol?: string): void;
  ensureValidPort(port: string): void;
  noConflict(removeAll?: boolean): URIProto | { URI: URIProto; URITemplate?: any; IPv6?: any; SecondLevelDomains?: any };
}

// Import dependencies
/*global location, escape, unescape */
// FIXME: v2.0.0 renamce non-camelCase properties to uppercase
/*jshint camelcase: false */

  function URI(url?: string, base?: string): any {
    const _urlSupplied = arguments.length >= 1;
    const _baseSupplied = arguments.length >= 2;

    // Allow instantiation without the 'new' keyword
    if (!(this instanceof URI)) {
      if (_urlSupplied) {
        if (_baseSupplied) {
          return new URIClass(url, base);
        }

        return new URIClass(url);
      }

      return new URIClass();
    }

    // Initialize the instance with _parts (cast as any for migration compatibility)
    const self = this as any;
    if (!self._parts) {
      self._parts = URIClass._parts();
      self._string = '';
      self._deferred_build = false;
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

    self.href(url);

    // resolve to base according to http://dvcs.w3.org/hg/url/raw-file/tip/Overview.html#constructor
    if (base !== undefined) {
      return self.absoluteTo(base);
    }

    return self;
  }

  // Use URI as URIClass for internal references
  const URIClass = URI as any;

  function isInteger(value: string): boolean {
    return /^[0-9]+$/.test(value);
  }

  URIClass.version = '1.19.11';

  const p: URIProto = URI.prototype;
  const hasOwn = Object.prototype.hasOwnProperty;

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

  function isArray(obj: any): boolean {
    return getType(obj) === 'Array';
  }

  function filterArrayValues<T extends number | symbol | string>(data: T[], value: T | T[] | RegExp): T[] {
    let lookup: Partial<Record<T, boolean>> | null = {};
    let i: number, length: number;

    if (getType(value) === 'RegExp') {
      lookup = null;
    } else if (isArray(value)) {
      for (i = 0, length = (value as T[]).length; i < length; i++) {
        lookup[value[i]] = true;
      }
    } else {
      lookup[value as T] = true;
    }

    for (i = 0, length = data.length; i < length; i++) {
      /*jshint laxbreak: true */
      const _match = lookup && lookup[String(data[i])] !== undefined
        || !lookup && (value as RegExp).test(String(data[i]));
      /*jshint laxbreak: false */
      if (_match) {
        data.splice(i, 1);
        length--;
        i--;
      }
    }

    return data;
  }

  function arrayContains<T>(list: T[], value: T | T[] | RegExp): boolean {
    let i: number, length: number;

    // value may be string, number, array, regexp
    if (isArray(value)) {
      // Note: this can be optimized to O(n) (instead of current O(m * n))
      for (i = 0, length = (value as T[]).length; i < length; i++) {
        if (!arrayContains(list, value[i])) {
          return false;
        }
      }

      return true;
    }

    const _type = getType(value);
    for (i = 0, length = list.length; i < length; i++) {
      if (_type === 'RegExp') {
        if (typeof list[i] === 'string' && (list[i] as string).match(value as RegExp)) {
          return true;
        }
      } else if (list[i] === value) {
        return true;
      }
    }

    return false;
  }

  function arraysEqual<T>(one: T[], two: T[]): boolean {
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

  URIClass._parts = function(): URIParts {
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
      preventInvalidHostname: URIClass.preventInvalidHostname,
      duplicateQueryParameters: URIClass.duplicateQueryParameters,
      escapeQuerySpace: URIClass.escapeQuerySpace
    };
  };

  // state: throw on invalid hostname
  // see https://github.com/medialize/URI.js/pull/345
  // and https://github.com/medialize/URI.js/issues/354
  URIClass.preventInvalidHostname = false;
  // state: allow duplicate query parameters (a=1&a=1)
  URIClass.duplicateQueryParameters = false;
  // state: replaces + with %20 (space in query strings)
  URIClass.escapeQuerySpace = true;
  // static properties
  URIClass.protocol_expression = /^[a-z][a-z0-9.+-]*$/i;
  URIClass.idn_expression = /[^a-z0-9\._-]/i;
  URIClass.punycode_expression = /(xn--)/i;
  // well, 333.444.555.666 matches, but it sure ain't no IPv4 - do we care?
  URIClass.ip4_expression = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
  // credits to Rich Brown
  // source: http://forums.intermapper.com/viewtopic.php?p=1096#1096
  // specification: http://www.ietf.org/rfc/rfc4291.txt
  URIClass.ip6_expression = /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/;
  // expression used is "gruber revised" (@gruber v2) determined to be the
  // best solution in a regex-golf we did a couple of ages ago at
  // * http://mathiasbynens.be/demo/url-regex
  // * http://rodneyrehm.de/t/url-regex.html
  URIClass.find_uri_expression = /\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»""'']))/ig;
  URIClass.findUri = {
    // valid "scheme://" or "www."
    start: /\b(?:([a-z][a-z0-9.+-]*:\/\/)|www\.)/gi,
    // everything up to the next whitespace
    end: /[\s\r\n]|$/,
    // trim trailing punctuation captured by end RegExp
    trim: /[`!()\[\]{};:'".,<>?«»""„'']+$/,
    // balanced parens inclusion (), [], {}, <>
    parens: /(\([^\)]*\)|\[[^\]]*\]|\{[^}]*\}|<[^>]*>)/g,
  };
  URIClass.leading_whitespace_expression = /^[\x00-\x20\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]+/;
  // https://infra.spec.whatwg.org/#ascii-tab-or-newline
  URIClass.ascii_tab_whitespace = /[\u0009\u000A\u000D]+/g;
  // http://www.iana.org/assignments/uri-schemes.html
  // http://en.wikipedia.org/wiki/List_of_TCP_and_UDP_port_numbers#Well-known_ports
  URIClass.defaultPorts = {
    http: '80',
    https: '443',
    ftp: '21',
    gopher: '70',
    ws: '80',
    wss: '443'
  };
  // list of protocols which always require a hostname
  URIClass.hostProtocols = [
    'http',
    'https'
  ];

  // allowed hostname characters according to RFC 3986
  // ALPHA DIGIT "-" "." "_" "~" "!" "$" "&" "'" "(" ")" "*" "+" "," ";" "=" %encoded
  // I've never seen a (non-IDN) hostname other than: ALPHA DIGIT . - _
  URIClass.invalid_hostname_characters = /[^a-zA-Z0-9\.\-:_]/;
  // map DOM Elements to their URI attribute
  URIClass.domAttributes = {
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
    'input': 'src', // but only if type="image"
    'audio': 'src',
    'video': 'src'
  };
  URIClass.getDomAttribute = function(node: Element | null | undefined): string | undefined {
    if (!node || !node.nodeName) {
      return undefined;
    }

    const nodeName = node.nodeName.toLowerCase();
    // <input> should only expose src for type="image"
    if (nodeName === 'input' && (node as HTMLInputElement).type !== 'image') {
      return undefined;
    }

    return URIClass.domAttributes[nodeName];
  };

  function escapeForDumbFirefox36(value: string): string {
    // https://github.com/medialize/URI.js/issues/91
    return escape(value);
  }

  // encoding / decoding according to RFC3986
  function strictEncodeURIComponent(string: string): string {
    // see https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/encodeURIComponent
    return encodeURIComponent(string)
      .replace(/[!'()*]/g, escapeForDumbFirefox36)
      .replace(/\*/g, '%2A');
  }
  URIClass.encode = strictEncodeURIComponent;
  URIClass.decode = decodeURIComponent;
  URIClass.iso8859 = function(): void {
    URIClass.encode = escape;
    URIClass.decode = unescape;
  };
  URIClass.unicode = function(): void {
    URIClass.encode = strictEncodeURIComponent;
    URIClass.decode = decodeURIComponent;
  };
  URIClass.characters = {
    pathname: {
      encode: {
        // RFC3986 2.1: For consistency, URI producers and normalizers should
        // use uppercase hexadecimal digits for all percent-encodings.
        expression: /%(24|26|2B|2C|3B|3D|3A|40)/ig,
        map: {
          // -._~!'()*
          '%24': '$',
          '%26': '&',
          '%2B': '+',
          '%2C': ',',
          '%3B': ';',
          '%3D': '=',
          '%3A': ':',
          '%40': '@'
        }
      },
      decode: {
        expression: /[\/\?#]/g,
        map: {
          '/': '%2F',
          '?': '%3F',
          '#': '%23'
        }
      }
    },
    reserved: {
      encode: {
        // RFC3986 2.1: For consistency, URI producers and normalizers should
        // use uppercase hexadecimal digits for all percent-encodings.
        expression: /%(21|23|24|26|27|28|29|2A|2B|2C|2F|3A|3B|3D|3F|40|5B|5D)/ig,
        map: {
          // gen-delims
          '%3A': ':',
          '%2F': '/',
          '%3F': '?',
          '%23': '#',
          '%5B': '[',
          '%5D': ']',
          '%40': '@',
          // sub-delims
          '%21': '!',
          '%24': '$',
          '%26': '&',
          '%27': '\'',
          '%28': '(',
          '%29': ')',
          '%2A': '*',
          '%2B': '+',
          '%2C': ',',
          '%3B': ';',
          '%3D': '='
        }
      }
    },
    urnpath: {
      // The characters under `encode` are the characters called out by RFC 2141 as being acceptable
      // for usage in a URN. RFC2141 also calls out "-", ".", and "_" as acceptable characters, but
      // these aren't encoded by encodeURIComponent, so we don't have to call them out here. Also
      // note that the colon character is not featured in the encoding map; this is because URI.js
      // gives the colons in URNs semantic meaning as the delimiters of path segements, and so it
      // should not appear unencoded in a segment itself.
      // See also the note above about RFC3986 and capitalalized hex digits.
      encode: {
        expression: /%(21|24|27|28|29|2A|2B|2C|3B|3D|40)/ig,
        map: {
          '%21': '!',
          '%24': '$',
          '%27': '\'',
          '%28': '(',
          '%29': ')',
          '%2A': '*',
          '%2B': '+',
          '%2C': ',',
          '%3B': ';',
          '%3D': '=',
          '%40': '@'
        }
      },
      // These characters are the characters called out by RFC2141 as "reserved" characters that
      // should never appear in a URN, plus the colon character (see note above).
      decode: {
        expression: /[\/\?#:]/g,
        map: {
          '/': '%2F',
          '?': '%3F',
          '#': '%23',
          ':': '%3A'
        }
      }
    }
  };

  // Add all the essential static methods that need to be available
  URIClass.encodeQuery = function(string: string, escapeQuerySpace?: boolean): string {
    const escaped = URIClass.encode(string + '');
    if (escapeQuerySpace === undefined) {
      escapeQuerySpace = URIClass.escapeQuerySpace;
    }

    return escapeQuerySpace ? escaped.replace(/%20/g, '+') : escaped;
  };

  URIClass.decodeQuery = function(string: string, escapeQuerySpace?: boolean): string {
    string += '';
    if (escapeQuerySpace === undefined) {
      escapeQuerySpace = URIClass.escapeQuerySpace;
    }

    try {
      return URIClass.decode(escapeQuerySpace ? string.replace(/\+/g, '%20') : string);
    } catch(e) {
      // we're not going to mess with weird encodings,
      // give up and return the undecoded original string
      // see https://github.com/medialize/URI.js/issues/87
      // see https://github.com/medialize/URI.js/issues/92
      return string;
    }
  };

  const _parts = {'encode':'encode', 'decode':'decode'};

  const generateAccessor = function(_group: string, _part: string): (str: string) => string {
    return function(string: string): string {
      try {
        return URIClass[_part](string + '').replace(URIClass.characters[_group][_part].expression, function(c: string) {
          return URIClass.characters[_group][_part].map[c];
        });
      } catch (e) {
        // we're not going to mess with weird encodings,
        // give up and return the undecoded original string
        // see https://github.com/medialize/URI.js/issues/87
        // see https://github.com/medialize/URI.js/issues/92
        return string;
      }
    };
  };
  for (const _part in _parts) {
    URIClass[_part + 'PathSegment'] = generateAccessor('pathname', _parts[_part]);
    URIClass[_part + 'UrnPathSegment'] = generateAccessor('urnpath', _parts[_part]);
  }

  const generateSegmentedPathFunction = function(_sep: string, _codingFuncName: string, _innerCodingFuncName?: string): (str: string) => string {
    return function(string: string): string {
      // Why pass in names of functions, rather than the function objects themselves? The
      // definitions of some functions (but in particular, URI.decode) will occasionally change due
      // to URI.js having ISO8859 and Unicode modes. Passing in the name and getting it will ensure
      // that the functions we use here are "fresh".
      let actualCodingFunc: Function;
      if (!_innerCodingFuncName) {
        actualCodingFunc = URIClass[_codingFuncName];
      } else {
        actualCodingFunc = function(string: string) {
          return URIClass[_codingFuncName](URIClass[_innerCodingFuncName](string));
        };
      }

      const segments = (string + '').split(_sep);

      for (let i = 0, length = segments.length; i < length; i++) {
        segments[i] = actualCodingFunc(segments[i]);
      }

      return segments.join(_sep);
    };
  };

  // This takes place outside the above loop because we don't want, e.g., encodeUrnPath functions.
  URIClass.decodePath = generateSegmentedPathFunction('/', 'decodePathSegment');
  URIClass.decodeUrnPath = generateSegmentedPathFunction(':', 'decodeUrnPathSegment');
  URIClass.recodePath = generateSegmentedPathFunction('/', 'encodePathSegment', 'decode');
  URIClass.recodeUrnPath = generateSegmentedPathFunction(':', 'encodeUrnPathSegment', 'decode');

  URIClass.encodeReserved = generateAccessor('reserved', 'encode');


  // Add essential parsing and building methods
  URIClass.parse = function(string: string, parts?: Partial<URIParts>): URIParts {
    let pos: number;
    if (!parts) {
      parts = {
        preventInvalidHostname: URIClass.preventInvalidHostname
      };
    }

    string = string.replace(URIClass.leading_whitespace_expression, '')
    // https://infra.spec.whatwg.org/#ascii-tab-or-newline
    string = string.replace(URIClass.ascii_tab_whitespace, '')

    // [protocol"://"[username[":"password]"@"]hostname[":"port]"/"?][path]["?"querystring]["#"fragment]

    // extract fragment
    pos = string.indexOf('#');
    if (pos > -1) {
      // escaping?
      (parts as any).fragment = string.substring(pos + 1) || null;
      string = string.substring(0, pos);
    }

    // extract query
    pos = string.indexOf('?');
    if (pos > -1) {
      // escaping?
      (parts as any).query = string.substring(pos + 1) || null;
      string = string.substring(0, pos);
    }

    // slashes and backslashes have lost all meaning for the web protocols (https, http, wss, ws)
    string = string.replace(/^(https?|ftp|wss?)?:+[/\\]*/i, '$1://');
    // slashes and backslashes have lost all meaning for scheme relative URLs
    string = string.replace(/^[/\\]{2,}/i, '//');

    // extract protocol
    if (string.substring(0, 2) === '//') {
      // relative-scheme
      (parts as any).protocol = null;
      string = string.substring(2);
      // extract "user:pass@host:port"
      string = URIClass.parseAuthority(string, parts);
    } else {
      pos = string.indexOf(':');
      if (pos > -1) {
        (parts as any).protocol = string.substring(0, pos) || null;
        if ((parts as any).protocol && !(parts as any).protocol.match(URIClass.protocol_expression)) {
          // : may be within the path
          (parts as any).protocol = undefined;
        } else if (string.substring(pos + 1, pos + 3).replace(/\\/g, '/') === '//') {
          string = string.substring(pos + 3);

          // extract "user:pass@host:port"
          string = URIClass.parseAuthority(string, parts);
        } else {
          string = string.substring(pos + 1);
          (parts as any).urn = true;
        }
      }
    }

    // what's left must be the path
    (parts as any).path = string;

    // and we're done
    return parts as URIParts;
  };

  URIClass.parseHost = function(string: string, parts: Partial<URIParts>): string {
    if (!string) {
      string = '';
    }

    // Copy chrome, IE, opera backslash-handling behavior.
    // Back slashes before the query string get converted to forward slashes
    // See: https://github.com/joyent/node/blob/386fd24f49b0e9d1a8a076592a404168faeecc34/lib/url.js#L115-L124
    // See: https://code.google.com/p/chromium/issues/detail?id=25916
    // https://github.com/medialize/URI.js/pull/233
    string = string.replace(/\\/g, '/');

    // extract host:port
    let pos = string.indexOf('/');
    let bracketPos: number;
    let t: string[];

    if (pos === -1) {
      pos = string.length;
    }

    if (string.charAt(0) === '[') {
      // IPv6 host - http://tools.ietf.org/html/draft-ietf-6man-text-addr-representation-04#section-6
      // I claim most client software breaks on IPv6 anyways. To simplify things, URI only accepts
      // IPv6+port in the format [2001:db8::1]:80 (for the time being)
      bracketPos = string.indexOf(']');
      (parts as any).hostname = string.substring(1, bracketPos) || null;
      (parts as any).port = string.substring(bracketPos + 2, pos) || null;
      if ((parts as any).port === '/') {
        (parts as any).port = null;
      }
    } else {
      const firstColon = string.indexOf(':');
      const firstSlash = string.indexOf('/');
      const nextColon = string.indexOf(':', firstColon + 1);
      if (nextColon !== -1 && (firstSlash === -1 || nextColon < firstSlash)) {
        // IPv6 host contains multiple colons - but no port
        // this notation is actually not allowed by RFC 3986, but we're a liberal parser
        (parts as any).hostname = string.substring(0, pos) || null;
        (parts as any).port = null;
      } else {
        t = string.substring(0, pos).split(':');
        (parts as any).hostname = t[0] || null;
        (parts as any).port = t[1] || null;
      }
    }

    if ((parts as any).hostname && string.substring(pos).charAt(0) !== '/') {
      pos++;
      string = '/' + string;
    }

    if ((parts as any).preventInvalidHostname) {
      URIClass.ensureValidHostname(parts.hostname, parts.protocol);
    }

    if ((parts as any).port) {
      URIClass.ensureValidPort(parts.port);
    }

    return string.substring(pos) || '/';
  };

  URIClass.parseAuthority = function(string: string, parts: Partial<URIParts>): string {
    string = URIClass.parseUserinfo(string, parts);
    return URIClass.parseHost(string, parts);
  };

  URIClass.parseUserinfo = function(string: string, parts: Partial<URIParts>): string {
    // extract username:password
    const _string = string
    const firstBackSlash = string.indexOf('\\');
    if (firstBackSlash !== -1) {
      string = string.replace(/\\/g, '/')
    }
    const firstSlash = string.indexOf('/');
    const pos = string.lastIndexOf('@', firstSlash > -1 ? firstSlash : string.length - 1);
    let t: string[];

    // authority@ must come before /path or \path
    if (pos > -1 && (firstSlash === -1 || pos < firstSlash)) {
      t = string.substring(0, pos).split(':');
      (parts as any).username = t[0] ? URIClass.decode(t[0]) : null;
      t.shift();
      (parts as any).password = t[0] ? URIClass.decode(t.join(':')) : null;
      string = _string.substring(pos + 1);
    } else {
      (parts as any).username = null;
      (parts as any).password = null;
    }

    return string;
  };

  URIClass.parseQuery = function(string: string, escapeQuerySpace?: boolean): QueryData {
    if (!string) {
      return {};
    }

    // throw out the funky business - "?"[name"="value"&"]+
    string = string.replace(/&+/g, '&').replace(/^\?*&*|&+$/g, '');

    if (!string) {
      return {};
    }

    const items: QueryData = {};
    const splits = string.split('&');
    const length = splits.length;
    let v: string[], name: string, value: string | null;

    for (let i = 0; i < length; i++) {
      v = splits[i].split('=');
      name = URIClass.decodeQuery(v.shift(), escapeQuerySpace);
      // no "=" is null according to http://dvcs.w3.org/hg/url/raw-file/tip/Overview.html#collect-url-parameters
      value = v.length ? URIClass.decodeQuery(v.join('='), escapeQuerySpace) : null;

      if (name === '__proto__') {
        // ignore attempt at exploiting JavaScript internals
        continue;
      } else if (hasOwn.call(items, name)) {
        if (typeof items[name] === 'string' || items[name] === null) {
          items[name] = [items[name] as string];
        }

        (items[name] as string[]).push(value as string);
      } else {
        items[name] = value;
      }
    }

    return items;
  };

  URIClass.build = function(parts: URIParts): string {
    let t = '';
    let requireAbsolutePath = false

    if (parts.protocol) {
      t += parts.protocol + ':';
    }

    if (!parts.urn && (t || parts.hostname)) {
      t += '//';
      requireAbsolutePath = true
    }

    t += (URIClass.buildAuthority(parts) || '');

    if (typeof parts.path === 'string') {
      if (parts.path.charAt(0) !== '/' && requireAbsolutePath) {
        t += '/';
      }

      t += parts.path;
    }

    if (typeof parts.query === 'string' && parts.query) {
      t += '?' + parts.query;
    }

    if (typeof parts.fragment === 'string' && parts.fragment) {
      t += '#' + parts.fragment;
    }
    return t;
  };

  URIClass.buildHost = function(parts: URIParts): string {
    let t = '';

    if (!parts.hostname) {
      return '';
    } else if (URIClass.ip6_expression.test(parts.hostname)) {
      t += '[' + parts.hostname + ']';
    } else {
      t += parts.hostname;
    }

    if (parts.port) {
      t += ':' + parts.port;
    }

    return t;
  };

  URIClass.buildAuthority = function(parts: URIParts): string {
    return URIClass.buildUserinfo(parts) + URIClass.buildHost(parts);
  };

  URIClass.buildUserinfo = function(parts: URIParts): string {
    let t = '';

    if (parts.username) {
      t += URIClass.encode(parts.username);
    }

    if (parts.password) {
      t += ':' + URIClass.encode(parts.password);
    }

    if (t) {
      t += '@';
    }

    return t;
  };

  URIClass.buildQuery = function(data: QueryData, duplicateQueryParameters?: boolean, escapeQuerySpace?: boolean): string {
    // according to http://tools.ietf.org/html/rfc3986 or http://labs.apache.org/webarch/uri/rfc/rfc3986.html
    // being »-._~!$&'()*+,;=:@/?« %HEX and alnum are allowed
    // the RFC explicitly states ?/foo being a valid use case, no mention of parameter syntax!
    // URI.js treats the query string as being application/x-www-form-urlencoded
    // see http://www.w3.org/TR/REC-html40/interact/forms.html#form-content-type

    let t = '';
    let unique: any, key: string, i: number, length: number;
    for (key in data) {
      if (key === '__proto__') {
        // ignore attempt at exploiting JavaScript internals
        continue;
      } else if (hasOwn.call(data, key)) {
        if (isArray(data[key])) {
          unique = {};
          for (i = 0, length = (data[key] as any[]).length; i < length; i++) {
            if ((data[key] as any[])[i] !== undefined && unique[(data[key] as any[])[i] + ''] === undefined) {
              t += '&' + URIClass.buildQueryParameter(key, (data[key] as any[])[i], escapeQuerySpace);
              if (duplicateQueryParameters !== true) {
                unique[(data[key] as any[])[i] + ''] = true;
              }
            }
          }
        } else if (data[key] !== undefined) {
          t += '&' + URIClass.buildQueryParameter(key, data[key] as string, escapeQuerySpace);
        }
      }
    }

    return t.substring(1);
  };

  URIClass.buildQueryParameter = function(name: string, value: string | null, escapeQuerySpace?: boolean): string {
    // http://www.w3.org/TR/REC-html40/interact/forms.html#form-content-type -- application/x-www-form-urlencoded
    // don't append "=" for null values, according to http://dvcs.w3.org/hg/url/raw-file/tip/Overview.html#url-parameter-serialization
    return URIClass.encodeQuery(name, escapeQuerySpace) + (value !== null ? '=' + URIClass.encodeQuery(value, escapeQuerySpace) : '');
  };


  // Add missing static query manipulation methods
  URIClass.addQuery = function(data: QueryData, name: string | QueryData, value?: string | string[]): void {
    if (typeof name === 'object') {
      for (const key in name) {
        if (hasOwn.call(name, key)) {
          URIClass.addQuery(data, key, (name as any)[key]);
        }
      }
    } else if (typeof name === 'string') {
      if (data[name] === undefined) {
        data[name] = value;
        return;
      } else if (typeof data[name] === 'string') {
        data[name] = [data[name] as string];
      }

      if (!isArray(value)) {
        value = [value as string];
      }

      data[name] = ((data[name] as string[]) || []).concat(value as string[]);
    } else {
      throw new TypeError('URI.addQuery() accepts an object, string as the name parameter');
    }
  };

  URIClass.setQuery = function(data: QueryData, name: string | QueryData, value?: string | null): void {
    if (typeof name === 'object') {
      for (const key in name) {
        if (hasOwn.call(name, key)) {
          URIClass.setQuery(data, key, (name as any)[key]);
        }
      }
    } else if (typeof name === 'string') {
      data[name] = value === undefined ? null : value;
    } else {
      throw new TypeError('URI.setQuery() accepts an object, string as the name parameter');
    }
  };

  URIClass.removeQuery = function(data: QueryData, name?: string | string[] | RegExp | QueryData, value?: string | RegExp): void {
    let i: number, length: number, key: string;

    if (isArray(name)) {
      for (i = 0, length = (name as string[]).length; i < length; i++) {
        data[(name as string[])[i]] = undefined;
      }
    } else if (getType(name) === 'RegExp') {
      for (key in data) {
        if ((name as RegExp).test(key)) {
          data[key] = undefined;
        }
      }
    } else if (typeof name === 'object') {
      for (key in name as any) {
        if (hasOwn.call(name, key)) {
          URIClass.removeQuery(data, key, (name as any)[key]);
        }
      }
    } else if (typeof name === 'string') {
      if (value !== undefined) {
        if (getType(value) === 'RegExp') {
          if (!isArray(data[name]) && (value as RegExp).test(data[name] as string)) {
            data[name] = undefined;
          } else {
            const filtered = filterArrayValues(data[name] as string[], value as string | string[] | RegExp);
            data[name] = filtered.length === 0 ? undefined : filtered;
          }
        } else if (data[name] === String(value) && (!isArray(value) || (value as unknown as any[]).length === 1)) {
          data[name] = undefined;
        } else if (isArray(data[name])) {
          const filtered = filterArrayValues(data[name] as string[], value as string | string[] | RegExp);
          data[name] = filtered.length === 0 ? undefined : filtered;
        }
      } else {
        data[name] = undefined;
      }
    } else {
      throw new TypeError('URI.removeQuery() accepts an object, string, RegExp as the first parameter');
    }
  };

  URIClass.hasQuery = function(data: QueryData, name?: string | RegExp | QueryData, value?: any, withinArray?: boolean): boolean {
    switch (getType(name)) {
      case 'String':
        // Nothing to do here
        break;

      case 'RegExp':
        for (const key in data) {
          if (hasOwn.call(data, key)) {
            if ((name as RegExp).test(key) && (value === undefined || URIClass.hasQuery(data, key, value))) {
              return true;
            }
          }
        }
        return false;

      case 'Object':
        for (const _key in name as any) {
          if (hasOwn.call(name, _key)) {
            if (!URIClass.hasQuery(data, _key, (name as any)[_key])) {
              return false;
            }
          }
        }
        return true;

      default:
        throw new TypeError('URI.hasQuery() accepts a string, regular expression or object as the name parameter');
    }

    switch (getType(value)) {
      case 'Undefined':
        // true if exists (but may be empty)
        return (name as string) in data;

      case 'Boolean':
        // true if exists and non-empty
        const _booly = Boolean(isArray(data[name as string]) ? (data[name as string] as any[]).length : data[name as string]);
        return value === _booly;

      case 'Function':
        // allow complex comparison
        return !!value(data[name as string], name, data);

      case 'Array':
        if (!isArray(data[name as string])) {
          return false;
        }

        const op = withinArray ? arrayContains : arraysEqual;
        return op(data[name as string] as any[], value);

      case 'RegExp':
        if (!isArray(data[name as string])) {
          return Boolean(data[name as string] && (data[name as string] as string).match(value));
        }

        if (!withinArray) {
          return false;
        }

        return arrayContains(data[name as string] as any[], value);

      case 'Number':
        value = String(value);
        /* falls through */
      case 'String':
        if (!isArray(data[name as string])) {
          return data[name as string] === value;
        }

        if (!withinArray) {
          return false;
        }

        return arrayContains(data[name as string] as any[], value);

      default:
        throw new TypeError('URI.hasQuery() accepts undefined, boolean, string, number, RegExp, Function as the value parameter');
    }
  };


  // Add some essential path encoding functions


  // Add joinPaths method
  URIClass.joinPaths = function(): URIProto {
    const input: any[] = [];
    const segments: string[] = [];
    let nonEmptySegments = 0;

    for (let i = 0; i < arguments.length; i++) {
      const url = new URIClass(arguments[i]);
      input.push(url);
      const _segments = url.segment();
      for (let s = 0; s < _segments.length; s++) {
        if (typeof _segments[s] === 'string') {
          segments.push(_segments[s]);
        }

        if (_segments[s]) {
          nonEmptySegments++;
        }
      }
    }

    if (!segments.length || !nonEmptySegments) {
      return new URIClass('');
    }

    const uri = new URIClass('').segment(segments);

    if (input[0].path() === '' || input[0].path().slice(0, 1) === '/') {
      uri.path('/' + uri.path());
    }

    return uri.normalize();
  };

  URIClass.commonPath = function(one: string, two: string): string {
    const length = Math.min(one.length, two.length);
    let pos: number;

    // find first non-matching character
    for (pos = 0; pos < length; pos++) {
      if (one.charAt(pos) !== two.charAt(pos)) {
        pos--;
        break;
      }
    }

    if (pos < 1) {
      return one.charAt(0) === two.charAt(0) && one.charAt(0) === '/' ? '/' : '';
    }

    // revert to last /
    if (one.charAt(pos) !== '/' || two.charAt(pos) !== '/') {
      pos = one.substring(0, pos).lastIndexOf('/');
    }

    return one.substring(0, pos + 1);
  };

  URIClass.withinString = function(string: string, callback: (uri: string, start: number, end: number, string: string) => string | void, options?: WithinStringOptions): string {
    options || (options = {});
    const _start = options.start || URIClass.findUri.start;
    const _end = options.end || URIClass.findUri.end;
    const _trim = options.trim || URIClass.findUri.trim;
    const _parens = options.parens || URIClass.findUri.parens;
    const _attributeOpen = /[a-z0-9-]=["']?$/i;

    _start.lastIndex = 0;
    while (true) {
      const match = _start.exec(string);
      if (!match) {
        break;
      }

      let start = match.index;
      if (options.ignoreHtml) {
        // attribut(e=["']?$)
        const attributeOpen = string.slice(Math.max(start - 3, 0), start);
        if (attributeOpen && _attributeOpen.test(attributeOpen)) {
          continue;
        }
      }

      let end = start + string.slice(start).search(_end);
      let slice = string.slice(start, end);
      // make sure we include well balanced parens
      let parensEnd = -1;
      while (true) {
        const parensMatch = _parens.exec(slice);
        if (!parensMatch) {
          break;
        }

        const parensMatchEnd = parensMatch.index + parensMatch[0].length;
        parensEnd = Math.max(parensEnd, parensMatchEnd);
      }

      if (parensEnd > -1) {
        slice = slice.slice(0, parensEnd) + slice.slice(parensEnd).replace(_trim, '');
      } else {
        slice = slice.replace(_trim, '');
      }

      if (slice.length <= match[0].length) {
        // the extract only contains the starting marker of a URI,
        // e.g. "www" or "http://"
        continue;
      }

      if (options.ignore && options.ignore.test(slice)) {
        continue;
      }

      end = start + slice.length;
      const result = callback(slice, start, end, string);
      if (result === undefined) {
        _start.lastIndex = end;
        continue;
      }

      const resultStr = String(result);
      string = string.slice(0, start) + resultStr + string.slice(end);
      _start.lastIndex = start + resultStr.length;
    }

    _start.lastIndex = 0;
    return string;
  };

  URIClass.ensureValidHostname = function(v: string, protocol?: string): void {
    // Theoretically URIs allow percent-encoding in Hostnames (according to RFC 3986)
    // they are not part of DNS and therefore ignored by URI.js

    const hasHostname = !!v; // not null and not an empty string
    const hasProtocol = !!protocol;
    let rejectEmptyHostname = false;

    if (hasProtocol) {
      rejectEmptyHostname = arrayContains(URIClass.hostProtocols, protocol);
    }

    if (rejectEmptyHostname && !hasHostname) {
      throw new TypeError('Hostname cannot be empty, if protocol is ' + protocol);
    } else if (v && v.match(URIClass.invalid_hostname_characters)) {
      // test punycode
      if (!punycode) {
        throw new TypeError('Hostname "' + v + '" contains characters other than [A-Z0-9.-:_] and Punycode.js is not available');
      }
      if (punycode.toASCII(v).match(URIClass.invalid_hostname_characters)) {
        throw new TypeError('Hostname "' + v + '" contains characters other than [A-Z0-9.-:_]');
      }
    }
  };

  URIClass.ensureValidPort = function(v: string): void {
    if (!v) {
      return;
    }

    const port = Number(v);
    if (isInteger(v) && (port > 0) && (port < 65536)) {
      return;
    }

    throw new TypeError('Port "' + v + '" is not a valid port');
  };

   // Add noConflict method
  URIClass.noConflict = function(removeAll?: boolean): any {
    // In ES module context, noConflict is not needed but kept for API compatibility
    return this;
  };

  // Add essential prototype methods for basic functionality
  p.build = function(deferBuild?: boolean): any {
    if (deferBuild === true) {
      this._deferred_build = true;
    } else if (deferBuild === undefined || this._deferred_build) {
      this._string = URIClass.build(this._parts);
      this._deferred_build = false;
    }

    return this;
  };

  p.clone = function(): any {
    return new URIClass(this);
  };

  p.valueOf = p.toString = function(): string {
    return this.build(false)._string;
  };

  function generateSimpleAccessor(_part: string): any {
    return function(v?: any, build?: boolean): any {
      if (v === undefined) {
        return this._parts[_part] || '';
      } else {
        this._parts[_part] = v || null;
        this.build(!build);
        return this;
      }
    };
  }

  function generatePrefixAccessor(_part: string, _key: string): any {
    return function(v?: any, build?: boolean): any {
      if (v === undefined) {
        return this._parts[_part] || '';
      } else {
        if (v !== null) {
          v = v + '';
          if (v.charAt(0) === _key) {
            v = v.substring(1);
          }
        }

        this._parts[_part] = v;
        this.build(!build);
        return this;
      }
    };
  }


  p.protocol = generateSimpleAccessor('protocol');
  p.username = generateSimpleAccessor('username');

  p.password = generateSimpleAccessor('password');
  p.hostname = generateSimpleAccessor('hostname');

  p.port = generateSimpleAccessor('port');


  p.query = generatePrefixAccessor('query', '?');

  p.fragment = generatePrefixAccessor('fragment', '#');

  p.search = function(v?: any, build?: boolean): any {
    const t = this.query(v, build);
    return typeof t === 'string' && t.length ? ('?' + t) : t;
  };
  p.hash = function(v?: any, build?: boolean): any {
    const t = this.fragment(v, build);
    return typeof t === 'string' && t.length ? ('#' + t) : t;
  };

  p.pathname = function(v?: any, build?: boolean): any {
    if (v === undefined || v === true) {
      const res = this._parts.path || (this._parts.hostname ? '/' : '');
      return v ? (this._parts.urn ? URIClass.decodeUrnPath : URIClass.decodePath)(res) : res;
    } else {
      if (this._parts.urn) {
        this._parts.path = v ? URIClass.recodeUrnPath(v) : '';
      } else {
        this._parts.path = v ? URIClass.recodePath(v) : '/';
      }
      this.build(!build);
      return this;
    }
  };
  p.path = p.pathname;

  p.href = function(href?: any, build?: boolean): any {
    let key: string;

    if (href === undefined) {
      return this.toString();
    }

    this._string = '';
    this._parts = URIClass._parts();

    const _URI = href instanceof URI;
    const _object = typeof href === 'object' && (href.hostname || href.path || href.pathname);
    if (href.nodeName) {
      const attribute = URIClass.getDomAttribute(href);
      href = href[attribute] || '';
      // _object = false;
    }

    // window.location is reported to be an object, but it's not the sort
    // of object we're looking for:
    // * location.protocol ends with a colon
    // * location.query != object.search
    // * location.hash != object.fragment
    // simply serializing the unknown object should do the trick
    // (for location, not for everything...)
    if (!_URI && _object && href.pathname !== undefined) {
      href = href.toString();
    }

    if (typeof href === 'string' || href instanceof String) {
      this._parts = URIClass.parse(String(href), this._parts);
    } else if (_URI || _object) {
      const src = _URI ? href._parts : href;
      for (key in src) {
        if (key === 'query') { continue; }
        if (hasOwn.call(this._parts, key)) {
          this._parts[key] = src[key];
        }
      }
      if (src.query) {
        this.query(src.query, false);
      }
    } else {
      throw new TypeError('invalid input');
    }

    this.build(!build);
    return this;
  };

  // identification accessors
  p.is = function(what: string): boolean | null {
    let ip = false;
    let ip4 = false;
    let ip6 = false;
    let name = false;
    let sld = false;
    let idn = false;
    let punycode_test = false;
    const relative = !this._parts.urn;

    if (this._parts.hostname) {
      ip4 = URIClass.ip4_expression.test(this._parts.hostname);
      ip6 = URIClass.ip6_expression.test(this._parts.hostname);
      ip = ip4 || ip6;
      name = !ip;
      sld = name && SLD && SLD.has(this._parts.hostname);
      idn = name && URIClass.idn_expression.test(this._parts.hostname);
      punycode_test = name && URIClass.punycode_expression.test(this._parts.hostname);
    }

    switch (what.toLowerCase()) {
      case 'relative':
        return relative;

      case 'absolute':
        return !relative;

      // hostname identification
      case 'domain':
      case 'name':
        return name;

      case 'sld':
        return sld;

      case 'ip':
        return ip;

      case 'ip4':
      case 'ipv4':
      case 'inet4':
        return ip4;

      case 'ip6':
      case 'ipv6':
      case 'inet6':
        return ip6;

      case 'idn':
        return idn;

      case 'url':
        return !this._parts.urn;

      case 'urn':
        return !!this._parts.urn;

      case 'punycode':
        return punycode_test;
    }

    return null;
  };

  // Basic accessors
  const _protocol = generateSimpleAccessor('protocol');
  const _port = generateSimpleAccessor('port');
  const _hostname = generateSimpleAccessor('hostname');

  p.protocol = function(v?: any, build?: boolean): any {
    if (v) {
      // accept trailing ://
      v = v.replace(/:(\/\/)?$/, '');

      if (!v.match(URIClass.protocol_expression)) {
        throw new TypeError('Protocol "' + v + '" contains characters other than [A-Z0-9.+-] or doesn\'t start with [A-Z]');
      }
    }

    return _protocol.call(this, v, build);
  };
  p.scheme = p.protocol;


  p.port = function(v?: any, build?: boolean): any {
    if (this._parts.urn) {
      return v === undefined ? '' : this;
    }

    if (v !== undefined) {
      if (v === 0) {
        v = null;
      }

      if (v) {
        v += '';
        if (v.charAt(0) === ':') {
          v = v.substring(1);
        }

        URIClass.ensureValidPort(v);
      }
    }
    return _port.call(this, v, build);
  };


  p.hostname = function(v?: any, build?: boolean): any {
    if (this._parts.urn) {
      return v === undefined ? '' : this;
    }

    if (v !== undefined) {
      const x: any = { preventInvalidHostname: this._parts.preventInvalidHostname };
      const res = URIClass.parseHost(v, x);
      if (res !== '/') {
        throw new TypeError('Hostname "' + v + '" contains characters other than [A-Z0-9.-]');
      }

      v = x.hostname;
      if (this._parts.preventInvalidHostname) {
        URIClass.ensureValidHostname(v, this._parts.protocol);
      }
    }

    return _hostname.call(this, v, build);
  };

  // compound accessors
  p.origin = function(v?: any, build?: boolean): any {
    if (this._parts.urn) {
      return v === undefined ? '' : this;
    }

    if (v === undefined) {
      const protocol = this.protocol();
      const authority = this.authority();
      if (!authority) {
        return '';
      }

      return (protocol ? protocol + '://' : '') + this.authority();
    } else {
      const origin = new URIClass(v);
      this
        .protocol(origin.protocol())
        .authority(origin.authority())
        .build(!build);
      return this;
    }
  };

  p.host = function(v?: any, build?: boolean): any {
    if (this._parts.urn) {
      return v === undefined ? '' : this;
    }

    if (v === undefined) {
      return this._parts.hostname ? URIClass.buildHost(this._parts) : '';
    } else {
      const res = URIClass.parseHost(v, this._parts);
      if (res !== '/') {
        throw new TypeError('Hostname "' + v + '" contains characters other than [A-Z0-9.-]');
      }

      this.build(!build);
      return this;
    }
  };

  p.authority = function(v?: any, build?: boolean): any {
    if (this._parts.urn) {
      return v === undefined ? '' : this;
    }

    if (v === undefined) {
      return this._parts.hostname ? URIClass.buildAuthority(this._parts) : '';
    } else {
      const res = URIClass.parseAuthority(v, this._parts);
      if (res !== '/') {
        throw new TypeError('Hostname "' + v + '" contains characters other than [A-Z0-9.-]');
      }

      this.build(!build);
      return this;
    }
  };

  p.userinfo = function(v?: any, build?: boolean): any {
    if (this._parts.urn) {
      return v === undefined ? '' : this;
    }

    if (v === undefined) {
      const t = URIClass.buildUserinfo(this._parts);
      return t ? t.substring(0, t.length - 1) : t;
    } else {
      if (v[v.length - 1] !== '@') {
        v += '@';
      }

      URIClass.parseUserinfo(v, this._parts);
      this.build(!build);
      return this;
    }
  };

  p.resource = function(v?: any, build?: boolean): any {
    let parts: any;

    if (v === undefined) {
      return this.path() + this.search() + this.hash();
    }

    parts = URIClass.parse(v);
    this._parts.path = parts.path;
    this._parts.query = parts.query;
    this._parts.fragment = parts.fragment;
    this.build(!build);
    return this;
  };

  // domain methods
  p.subdomain = function(v?: any, build?: boolean): any {
    if (this._parts.urn) {
      return v === undefined ? '' : this;
    }

    // convenience, return "www" from "www.example.org"
    if (v === undefined) {
      if (!this._parts.hostname || this.is('IP')) {
        return '';
      }

      // grab domain and add another segment
      const end = this._parts.hostname.length - this.domain().length - 1;
      return this._parts.hostname.substring(0, end) || '';
    } else {
      const e = this._parts.hostname.length - this.domain().length;
      const sub = this._parts.hostname.substring(0, e);
      const replace = new RegExp('^' + escapeRegEx(sub));

      if (v && v.charAt(v.length - 1) !== '.') {
        v += '.';
      }

      if (v.indexOf(':') !== -1) {
        throw new TypeError('Domains cannot contain colons');
      }

      if (v) {
        URIClass.ensureValidHostname(v, this._parts.protocol);
      }

      this._parts.hostname = this._parts.hostname.replace(replace, v);
      this.build(!build);
      return this;
    }
  };

  p.domain = function(v?: any, build?: boolean): any {
    if (this._parts.urn) {
      return v === undefined ? '' : this;
    }

    if (typeof v === 'boolean') {
      build = v;
      v = undefined;
    }

    // convenience, return "example.org" from "www.example.org"
    if (v === undefined) {
      if (!this._parts.hostname || this.is('IP')) {
        return '';
      }

      // if hostname consists of 1 or 2 segments, it must be the domain
      const t = this._parts.hostname.match(/\./g);
      if (t && t.length < 2) {
        return this._parts.hostname;
      }

      // grab tld and add another segment
      const end = this._parts.hostname.length - this.tld(build).length - 1;
      const endPos = this._parts.hostname.lastIndexOf('.', end - 1) + 1;
      return this._parts.hostname.substring(endPos) || '';
    } else {
      if (!v) {
        throw new TypeError('cannot set domain empty');
      }

      if (v.indexOf(':') !== -1) {
        throw new TypeError('Domains cannot contain colons');
      }

      URIClass.ensureValidHostname(v, this._parts.protocol);

      if (!this._parts.hostname || this.is('IP')) {
        this._parts.hostname = v;
      } else {
        const replace = new RegExp(escapeRegEx(this.domain()) + '$');
        this._parts.hostname = this._parts.hostname.replace(replace, v);
      }

      this.build(!build);
      return this;
    }
  };

  p.tld = function(v?: any, build?: boolean): any {
    if (this._parts.urn) {
      return v === undefined ? '' : this;
    }

    if (typeof v === 'boolean') {
      build = v;
      v = undefined;
    }

    // return "org" from "www.example.org"
    if (v === undefined) {
      if (!this._parts.hostname || this.is('IP')) {
        return '';
      }

      const pos = this._parts.hostname.lastIndexOf('.');
      const tld = this._parts.hostname.substring(pos + 1);

      if (build !== true && SLD && (SLD as any).list[tld.toLowerCase()]) {
        return SLD.get(this._parts.hostname) || tld;
      }

      return tld;
    } else {
      let replace: RegExp;

      if (!v) {
        throw new TypeError('cannot set TLD empty');
      } else if (v.match(/[^a-zA-Z0-9-]/)) {
        if (SLD && SLD.is(v)) {
          replace = new RegExp(escapeRegEx(this.tld()) + '$');
          this._parts.hostname = this._parts.hostname.replace(replace, v);
        } else {
          throw new TypeError('TLD "' + v + '" contains characters other than [A-Z0-9]');
        }
      } else if (!this._parts.hostname || this.is('IP')) {
        throw new ReferenceError('cannot set TLD on non-domain host');
      } else {
        replace = new RegExp(escapeRegEx(this.tld()) + '$');
        this._parts.hostname = this._parts.hostname.replace(replace, v);
      }

      this.build(!build);
      return this;
    }
  };

  // path methods
  p.directory = function(v?: any, build?: boolean): any {
    if (this._parts.urn) {
      return v === undefined ? '' : this;
    }

    if (v === undefined || v === true) {
      if (!this._parts.path && !this._parts.hostname) {
        return '';
      }

      if (this._parts.path === '/') {
        return '/';
      }

      const end = this._parts.path.length - this.filename().length - 1;
      const res = this._parts.path.substring(0, end) || (this._parts.hostname ? '/' : '');

      return v ? URIClass.decodePath(res) : res;
    } else {
      const e = this._parts.path.length - this.filename().length;
      const directory = this._parts.path.substring(0, e);
      const replace = new RegExp('^' + escapeRegEx(directory));

      // fully qualified directories begin with a slash
      if (!this.is('relative')) {
        if (!v) {
          v = '/';
        }

        if (v.charAt(0) !== '/') {
          v = '/' + v;
        }
      }

      // directories always end with a slash
      if (v && v.charAt(v.length - 1) !== '/') {
        v += '/';
      }

      v = URIClass.recodePath(v);
      this._parts.path = this._parts.path.replace(replace, v);
      this.build(!build);
      return this;
    }
  };

  p.filename = function(v?: any, build?: boolean): any {
    if (this._parts.urn) {
      return v === undefined ? '' : this;
    }

    if (typeof v !== 'string') {
      if (!this._parts.path || this._parts.path === '/') {
        return '';
      }

      const pos = this._parts.path.lastIndexOf('/');
      const res = this._parts.path.substring(pos + 1);

      return v ? URIClass.decodePathSegment(res) : res;
    } else {
      let mutatedDirectory = false;

      if (v.charAt(0) === '/') {
        v = v.substring(1);
      }

      if (v.match(/\.?\//)) {
        mutatedDirectory = true;
      }

      const replace = new RegExp(escapeRegEx(this.filename()) + '$');
      v = URIClass.recodePath(v);
      this._parts.path = this._parts.path.replace(replace, v);

      if (mutatedDirectory) {
        this.normalizePath(build);
      } else {
        this.build(!build);
      }

      return this;
    }
  };

  p.suffix = function(v?: any, build?: boolean): any {
    if (this._parts.urn) {
      return v === undefined ? '' : this;
    }

    if (v === undefined || v === true) {
      if (!this._parts.path || this._parts.path === '/') {
        return '';
      }

      const filename = this.filename();
      const pos = filename.lastIndexOf('.');
      let s: string, res: string;

      if (pos === -1) {
        return '';
      }

      // suffix may only contain alnum characters (yup, I made this up.)
      s = filename.substring(pos + 1);
      res = (/^[a-z0-9%]+$/i).test(s) ? s : '';
      return v ? URIClass.decodePathSegment(res) : res;
    } else {
      if (v.charAt(0) === '.') {
        v = v.substring(1);
      }

      const suffix = this.suffix();
      let replace: RegExp;

      if (!suffix) {
        if (!v) {
          return this;
        }

        this._parts.path += '.' + URIClass.recodePath(v);
      } else if (!v) {
        replace = new RegExp(escapeRegEx('.' + suffix) + '$');
      } else {
        replace = new RegExp(escapeRegEx(suffix) + '$');
      }

      if (replace) {
        v = URIClass.recodePath(v);
        this._parts.path = this._parts.path.replace(replace, v);
      }

      this.build(!build);
      return this;
    }
  };

  // segment methods
  p.segment = function(segment?: any, v?: any, build?: boolean): any {
    const separator = this._parts.urn ? ':' : '/';
    const path = this.path();
    const absolute = path.substring(0, 1) === '/';
    let segments = path.split(separator);

    if (segment !== undefined && typeof segment !== 'number') {
      build = v;
      v = segment;
      segment = undefined;
    }

    if (segment !== undefined && typeof segment !== 'number') {
      throw new Error('Bad segment "' + segment + '", must be 0-based integer');
    }

    if (absolute) {
      segments.shift();
    }

    if (segment < 0) {
      // allow negative indexes to address from the end
      segment = Math.max(segments.length + segment, 0);
    }

    if (v === undefined) {
      /*jshint laxbreak: true */
      return segment === undefined
        ? segments
        : segments[segment];
      /*jshint laxbreak: false */
    } else if (segment === null || segments[segment] === undefined) {
      if (isArray(v)) {
        segments = [];
        // collapse empty elements within array
        for (let i = 0, l = v.length; i < l; i++) {
          if (!v[i].length && (!segments.length || !segments[segments.length - 1].length)) {
            continue;
          }

          if (segments.length && !segments[segments.length - 1].length) {
            segments.pop();
          }

          segments.push(trimSlashes(v[i]));
        }
      } else if (v || typeof v === 'string') {
        v = trimSlashes(v);
        if (segments[segments.length - 1] === '') {
          // empty trailing elements have to be overwritten
          // to prevent results such as /foo//bar
          segments[segments.length - 1] = v;
        } else {
          segments.push(v);
        }
      }
    } else {
      if (v) {
        segments[segment] = trimSlashes(v);
      } else {
        segments.splice(segment, 1);
      }
    }

    if (absolute) {
      segments.unshift('');
    }

    return this.path(segments.join(separator), build);
  };

  p.segmentCoded = function(segment?: any, v?: any, build?: boolean): any {
    let segments: any, i: number, l: number;

    if (typeof segment !== 'number') {
      build = v;
      v = segment;
      segment = undefined;
    }

    if (v === undefined) {
      segments = this.segment(segment, v, build);
      if (!isArray(segments)) {
        segments = segments !== undefined ? URIClass.decode(segments) : undefined;
      } else {
        for (i = 0, l = segments.length; i < l; i++) {
          segments[i] = URIClass.decode(segments[i]);
        }
      }

      return segments;
    }

    if (!isArray(v)) {
      v = (typeof v === 'string' || v instanceof String) ? URIClass.encode(String(v)) : v;
    } else {
      for (i = 0, l = v.length; i < l; i++) {
        v[i] = URIClass.encode(v[i]);
      }
    }

    return this.segment(segment, v, build);
  };

  // enhanced query method
  const q = p.query;
  p.query = function(v?: any, build?: boolean): any {
    if (v === true) {
      return URIClass.parseQuery(this._parts.query, this._parts.escapeQuerySpace);
    } else if (typeof v === 'function') {
      const data = URIClass.parseQuery(this._parts.query, this._parts.escapeQuerySpace);
      const result = v.call(this, data);
      this._parts.query = URIClass.buildQuery(result || data, this._parts.duplicateQueryParameters, this._parts.escapeQuerySpace);
      this.build(!build);
      return this;
    } else if (v !== undefined && typeof v !== 'string') {
      this._parts.query = URIClass.buildQuery(v, this._parts.duplicateQueryParameters, this._parts.escapeQuerySpace);
      this.build(!build);
      return this;
    } else {
      return q.call(this, v, build);
    }
  };

  // query manipulation methods
  p.setQuery = function(name?: any, value?: any, build?: boolean): any {
    const data = URIClass.parseQuery(this._parts.query, this._parts.escapeQuerySpace);

    if (typeof name === 'string' || name instanceof String) {
      data[String(name)] = value !== undefined ? value : null;
    } else if (typeof name === 'object') {
      for (const key in name) {
        if (hasOwn.call(name, key)) {
          data[key] = name[key];
        }
      }
    } else {
      throw new TypeError('URI.setQuery() accepts an object, string as the name parameter');
    }

    this._parts.query = URIClass.buildQuery(data, this._parts.duplicateQueryParameters, this._parts.escapeQuerySpace);
    if (typeof name !== 'string') {
      build = value;
    }

    this.build(!build);
    return this;
  };

  p.addQuery = function(name?: any, value?: any, build?: boolean): any {
    const data = URIClass.parseQuery(this._parts.query, this._parts.escapeQuerySpace);
    URIClass.addQuery(data, name, value === undefined ? null : value);
    this._parts.query = URIClass.buildQuery(data, this._parts.duplicateQueryParameters, this._parts.escapeQuerySpace);
    if (typeof name !== 'string') {
      build = value;
    }

    this.build(!build);
    return this;
  };

  p.removeQuery = function(name?: any, value?: any, build?: boolean): any {
    const data = URIClass.parseQuery(this._parts.query, this._parts.escapeQuerySpace);
    URIClass.removeQuery(data, name, value);
    this._parts.query = URIClass.buildQuery(data, this._parts.duplicateQueryParameters, this._parts.escapeQuerySpace);
    if (typeof name !== 'string') {
      build = value;
    }

    this.build(!build);
    return this;
  };

  p.hasQuery = function(name?: any, value?: any, withinArray?: boolean): boolean {
    const data = URIClass.parseQuery(this._parts.query, this._parts.escapeQuerySpace);
    return URIClass.hasQuery(data, name, value, withinArray);
  };

  // aliases
  p.setSearch = p.setQuery;
  p.addSearch = p.addQuery;
  p.removeSearch = p.removeQuery;
  p.hasSearch = p.hasQuery;

  // normalization methods
  p.normalize = function(): any {
    if (this._parts.urn) {
      return this
        .normalizeProtocol(false)
        .normalizePath(false)
        .normalizeQuery(false)
        .normalizeFragment(false)
        .build();
    }

    return this
      .normalizeProtocol(false)
      .normalizeHostname(false)
      .normalizePort(false)
      .normalizePath(false)
      .normalizeQuery(false)
      .normalizeFragment(false)
      .build();
  };

  p.normalizeProtocol = function(build?: boolean): any {
    if (typeof this._parts.protocol === 'string') {
      this._parts.protocol = this._parts.protocol.toLowerCase();
      this.build(!build);
    }

    return this;
  };

  p.normalizeHostname = function(build?: boolean): any {
    if (this._parts.hostname) {
      if (this.is('IDN') && punycode) {
        this._parts.hostname = punycode.toASCII(this._parts.hostname);
              } else if (this.is('IPv6') && IPv6) {
          this._parts.hostname = IPv6.best(this._parts.hostname);
      }

      this._parts.hostname = this._parts.hostname.toLowerCase();
      this.build(!build);
    }

    return this;
  };

  p.normalizePort = function(build?: boolean): any {
    // remove port if it's the protocol's default
    if (typeof this._parts.protocol === 'string' && this._parts.port === URIClass.defaultPorts[this._parts.protocol]) {
      this._parts.port = null;
      this.build(!build);
    }

    return this;
  };

  p.normalizePath = function(build?: boolean): any {
    let _path = this._parts.path;
    if (!_path) {
      return this;
    }

    if (this._parts.urn) {
      this._parts.path = URIClass.recodeUrnPath(this._parts.path);
      this.build(!build);
      return this;
    }

    if (this._parts.path === '/') {
      return this;
    }

    _path = URIClass.recodePath(_path);

    let _was_relative: boolean;
    let _leadingParents = '';
    let _parent: number, _pos: number;

    // handle relative paths
    if (_path.charAt(0) !== '/') {
      _was_relative = true;
      _path = '/' + _path;
    }

    // handle relative files (as opposed to directories)
    if (_path.slice(-3) === '/..' || _path.slice(-2) === '/.') {
      _path += '/';
    }

    // resolve simples
    _path = _path
      .replace(/(\/(\.\/)+)|(\/\.$)/g, '/')
      .replace(/\/{2,}/g, '/');

    // remember leading parents
    if (_was_relative) {
      const match = _path.substring(1).match(/^(\.\.\/)+/);
      _leadingParents = match ? match[0] : '';
    }

    // resolve parents
    while (true) {
      _parent = _path.search(/\/\.\.(\/|$)/);
      if (_parent === -1) {
        // no more ../ to resolve
        break;
      } else if (_parent === 0) {
        // top level cannot be relative, skip it
        _path = _path.substring(3);
        continue;
      }

      _pos = _path.substring(0, _parent).lastIndexOf('/');
      if (_pos === -1) {
        _pos = _parent;
      }
      _path = _path.substring(0, _pos) + _path.substring(_parent + 3);
    }

    // revert to relative
    if (_was_relative && this.is('relative')) {
      _path = _leadingParents + _path.substring(1);
    }

    this._parts.path = _path;
    this.build(!build);
    return this;
  };

  p.normalizePathname = p.normalizePath;

  p.normalizeQuery = function(build?: boolean): any {
    if (typeof this._parts.query === 'string') {
      if (!this._parts.query.length) {
        this._parts.query = null;
      } else {
        this.query(URIClass.parseQuery(this._parts.query, this._parts.escapeQuerySpace));
      }

      this.build(!build);
    }

    return this;
  };

  p.normalizeFragment = function(build?: boolean): any {
    if (!this._parts.fragment) {
      this._parts.fragment = null;
      this.build(!build);
    }

    return this;
  };

  p.normalizeSearch = p.normalizeQuery;
  p.normalizeHash = p.normalizeFragment;

  // encoding methods
  p.iso8859 = function(): any {
    // expect unicode input, iso8859 output
    const e = URIClass.encode;
    const d = URIClass.decode;

    URIClass.encode = escape;
    URIClass.decode = decodeURIComponent;
    try {
      this.normalize();
    } finally {
      URIClass.encode = e;
      URIClass.decode = d;
    }
    return this;
  };

  p.unicode = function(): any {
    // expect iso8859 input, unicode output
    const e = URIClass.encode;
    const d = URIClass.decode;

    URIClass.encode = strictEncodeURIComponent;
    URIClass.decode = unescape;
    try {
      this.normalize();
    } finally {
      URIClass.encode = e;
      URIClass.decode = d;
    }
    return this;
  };

  p.readable = function(): string {
    const uri = this.clone();
    // removing username, password, because they shouldn't be displayed according to RFC 3986
    uri.username('').password('').normalize();
    let t = '';
    if (uri._parts.protocol) {
      t += uri._parts.protocol + '://';
    }

    if (uri._parts.hostname) {
      if (uri.is('punycode') && punycode) {
        t += punycode.toUnicode(uri._parts.hostname);
        if (uri._parts.port) {
          t += ':' + uri._parts.port;
        }
      } else {
        t += uri.host();
      }
    }

    if (uri._parts.hostname && uri._parts.path && uri._parts.path.charAt(0) !== '/') {
      t += '/';
    }

    t += uri.path(true);
    if (uri._parts.query) {
      let q = '';
      for (let i = 0, qp = uri._parts.query.split('&'), l = qp.length; i < l; i++) {
        const kv = (qp[i] || '').split('=');
        q += '&' + URIClass.decodeQuery(kv[0], this._parts.escapeQuerySpace)
          .replace(/&/g, '%26');

        if (kv[1] !== undefined) {
          q += '=' + URIClass.decodeQuery(kv[1], this._parts.escapeQuerySpace)
            .replace(/&/g, '%26');
        }
      }
      t += '?' + q.substring(1);
    }

    t += URIClass.decodeQuery(uri.hash(), true);
    return t;
  };

  // resolving relative and absolute URLs
  p.absoluteTo = function(base?: any): any {
    const resolved = this.clone();
    const properties = ['protocol', 'username', 'password', 'hostname', 'port'];
    let basedir: string, i: number, prop: string;

    if (this._parts.urn) {
      throw new Error('URNs do not have any generally defined hierarchical components');
    }

    if (!(base instanceof URI)) {
      base = new URIClass(base);
    }

    if (resolved._parts.protocol) {
      // Directly returns even if this._parts.hostname is empty.
      return resolved;
    } else {
      resolved._parts.protocol = base._parts.protocol;
    }

    if (this._parts.hostname) {
      return resolved;
    }

    for (i = 0; (prop = properties[i]); i++) {
      resolved._parts[prop] = base._parts[prop];
    }

    if (!resolved._parts.path) {
      resolved._parts.path = base._parts.path;
      if (!resolved._parts.query) {
        resolved._parts.query = base._parts.query;
      }
    } else {
      if (resolved._parts.path.substring(-2) === '..') {
        resolved._parts.path += '/';
      }

      if (resolved.path().charAt(0) !== '/') {
        basedir = base.directory();
        basedir = basedir ? basedir : base.path().indexOf('/') === 0 ? '/' : '';
        resolved._parts.path = (basedir ? (basedir + '/') : '') + resolved._parts.path;
        resolved.normalizePath();
      }
    }

    resolved.build();
    return resolved;
  };

  p.relativeTo = function(base?: any): any {
    const relative = this.clone().normalize();
    let relativeParts: any, baseParts: any, common: string, relativePath: string, basePath: string;

    if (relative._parts.urn) {
      throw new Error('URNs do not have any generally defined hierarchical components');
    }

    base = new URIClass(base).normalize();
    relativeParts = relative._parts;
    baseParts = base._parts;
    relativePath = relative.path();
    basePath = base.path();

    if (relativePath.charAt(0) !== '/') {
      throw new Error('URI is already relative');
    }

    if (basePath.charAt(0) !== '/') {
      throw new Error('Cannot calculate a URI relative to another relative URI');
    }

    if (relativeParts.protocol === baseParts.protocol) {
      relativeParts.protocol = null;
    }

    if (relativeParts.username !== baseParts.username || relativeParts.password !== baseParts.password) {
      return relative.build();
    }

    if (relativeParts.protocol !== null || relativeParts.username !== null || relativeParts.password !== null) {
      return relative.build();
    }

    if (relativeParts.hostname === baseParts.hostname && relativeParts.port === baseParts.port) {
      relativeParts.hostname = null;
      relativeParts.port = null;
    } else {
      return relative.build();
    }

    if (relativePath === basePath) {
      relativeParts.path = '';
      return relative.build();
    }

    // determine common sub path
    common = URIClass.commonPath(relativePath, basePath);

    // If the paths have nothing in common, return a relative URL with the absolute path.
    if (!common) {
      return relative.build();
    }

    const parents = baseParts.path
      .substring(common.length)
      .replace(/[^\/]*$/, '')
      .replace(/.*?\//g, '../');

    relativeParts.path = (parents + relativeParts.path.substring(common.length)) || './';

    return relative.build();
  };

  // comparing URIs
  p.equals = function(uri?: any): boolean {
    const one = this.clone();
    const two = new URIClass(uri);
    const one_map: any = {};
    const two_map: any = {};
    const checked: any = {};
    let one_query: string, two_query: string, key: string;

    one.normalize();
    two.normalize();

    // exact match
    if (one.toString() === two.toString()) {
      return true;
    }

    // extract query string
    one_query = one.query();
    two_query = two.query();
    one.query('');
    two.query('');

    // definitely not equal if not even non-query parts match
    if (one.toString() !== two.toString()) {
      return false;
    }

    // query parameters have the same length, even if they're permuted
    if (one_query.length !== two_query.length) {
      return false;
    }

    const one_map_parsed = URIClass.parseQuery(one_query, this._parts.escapeQuerySpace);
    const two_map_parsed = URIClass.parseQuery(two_query, this._parts.escapeQuerySpace);

    for (key in one_map_parsed) {
      if (hasOwn.call(one_map_parsed, key)) {
        if (!isArray(one_map_parsed[key])) {
          if (one_map_parsed[key] !== two_map_parsed[key]) {
            return false;
          }
        } else if (!isArray(two_map_parsed[key]) || !arraysEqual(one_map_parsed[key] as any[], two_map_parsed[key] as any[])) {
          return false;
        }

        checked[key] = true;
      }
    }

    for (key in two_map_parsed) {
      if (hasOwn.call(two_map_parsed, key)) {
        if (!checked[key]) {
          // two contains a parameter not present in one
          return false;
        }
      }
    }

    return true;
  };

  // state configuration methods
  p.preventInvalidHostname = function(prevent?: boolean): any {
    this._parts.preventInvalidHostname = !!prevent;
    return this;
  };

  p.duplicateQueryParameters = function(allow?: boolean): any {
    this._parts.duplicateQueryParameters = !!allow;
    return this;
  };

  p.escapeQuerySpace = function(escape?: boolean): any {
    this._parts.escapeQuerySpace = !!escape;
    return this;
  };

  return URI;
}));

// ES6 export for TypeScript
// URI is exported via UMD wrapper above
