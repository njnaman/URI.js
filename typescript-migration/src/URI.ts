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
interface URI {
  // Core methods
  build(deferBuild?: boolean): URI;
  clone(): URI;
  valueOf(): string;
  toString(): string;

  // Component accessors
  protocol(): string;
  protocol(protocol: string, build?: boolean): URI;
  scheme(): string;
  scheme(scheme: string, build?: boolean): URI;
  username(): string;
  username(username: string, build?: boolean): URI;
  password(): string;
  password(password: string, build?: boolean): URI;
  hostname(): string;
  hostname(hostname: string, build?: boolean): URI;
  port(): string;
  port(port: string | number, build?: boolean): URI;
  query(): string;
  query(query: string, build?: boolean): URI;
  query(query: QueryData, build?: boolean): URI;
  query(query: boolean): QueryData;
  query(query: (data: QueryData) => QueryData | void, build?: boolean): URI;
  fragment(): string;
  fragment(fragment: string, build?: boolean): URI;

  // Convenience accessors
  search(): string;
  search(search: string, build?: boolean): URI;
  hash(): string;
  hash(hash: string, build?: boolean): URI;
  pathname(): string;
  pathname(pathname: string, build?: boolean): URI;
  pathname(decode: boolean): string;
  path(): string;
  path(path: string, build?: boolean): URI;
  path(decode: boolean): string;
  href(): string;
  href(href: string | URI | object, build?: boolean): URI;

  // Identification methods
  is(what: string): boolean | null;

  // Compound accessors
  origin(): string;
  origin(origin: string, build?: boolean): URI;
  host(): string;
  host(host: string, build?: boolean): URI;
  authority(): string;
  authority(authority: string, build?: boolean): URI;
  userinfo(): string;
  userinfo(userinfo: string, build?: boolean): URI;
  resource(): string;
  resource(resource: string, build?: boolean): URI;

  // Domain methods
  subdomain(): string;
  subdomain(subdomain: string, build?: boolean): URI;
  domain(): string;
  domain(domain: string, build?: boolean): URI;
  domain(returnSld: boolean): string;
  tld(): string;
  tld(tld: string, build?: boolean): URI;
  tld(returnSld: boolean): string;

  // Path methods
  directory(): string;
  directory(directory: string, build?: boolean): URI;
  directory(decode: boolean): string;
  filename(): string;
  filename(filename: string, build?: boolean): URI;
  filename(decode: boolean): string;
  suffix(): string;
  suffix(suffix: string, build?: boolean): URI;
  suffix(decode: boolean): string;

  // Segment methods
  segment(): string[];
  segment(segments: string[]): URI;
  segment(segment: number): string;
  segment(segment: number, value: string, build?: boolean): URI;
  segmentCoded(): string[];
  segmentCoded(segments: string[]): URI;
  segmentCoded(segment: number): string;
  segmentCoded(segment: number, value: string, build?: boolean): URI;

  // Query methods
  setQuery(name: string, value: string | null, build?: boolean): URI;
  setQuery(data: QueryData, build?: boolean): URI;
  addQuery(name: string, value: string | null, build?: boolean): URI;
  addQuery(data: QueryData, build?: boolean): URI;
  removeQuery(name: string, value?: string | RegExp, build?: boolean): URI;
  removeQuery(name: string[], build?: boolean): URI;
  removeQuery(name: RegExp, build?: boolean): URI;
  removeQuery(data: QueryData, build?: boolean): URI;
  hasQuery(name: string, value?: string | number | boolean | RegExp | Function | string[], withinArray?: boolean): boolean;
  hasQuery(name: RegExp, value?: string | number | boolean | RegExp | Function | string[], withinArray?: boolean): boolean;
  hasQuery(data: QueryData): boolean;

  // Alias methods
  setSearch(name: string, value: string | null, build?: boolean): URI;
  setSearch(data: QueryData, build?: boolean): URI;
  addSearch(name: string, value: string | null, build?: boolean): URI;
  addSearch(data: QueryData, build?: boolean): URI;
  removeSearch(name: string, value?: string | RegExp, build?: boolean): URI;
  removeSearch(name: string[], build?: boolean): URI;
  removeSearch(name: RegExp, build?: boolean): URI;
  removeSearch(data: QueryData, build?: boolean): URI;
  hasSearch(name: string, value?: string | number | boolean | RegExp | Function | string[], withinArray?: boolean): boolean;
  hasSearch(name: RegExp, value?: string | number | boolean | RegExp | Function | string[], withinArray?: boolean): boolean;
  hasSearch(data: QueryData): boolean;

  // Normalization
  normalize(): URI;
  normalizeProtocol(build?: boolean): URI;
  normalizeHostname(build?: boolean): URI;
  normalizePort(build?: boolean): URI;
  normalizePath(build?: boolean): URI;
  normalizePathname(build?: boolean): URI;
  normalizeQuery(build?: boolean): URI;
  normalizeFragment(build?: boolean): URI;
  normalizeSearch(build?: boolean): URI;
  normalizeHash(build?: boolean): URI;

  // Encoding
  iso8859(): URI;
  unicode(): URI;
  readable(): string;

  // Relative/Absolute conversion
  absoluteTo(base: string | URI): URI;
  relativeTo(base: string | URI): URI;

  // Comparison
  equals(uri: string | URI): boolean;

  // State configuration
  preventInvalidHostname(prevent: boolean): URI;
  duplicateQueryParameters(allow: boolean): URI;
  escapeQuerySpace(escape: boolean): URI;

  // Internal properties
  _parts: URIParts;
  _string: string;
  _deferred_build: boolean;
}

// Constructor interface
interface URIConstructor {
  new (): URI;
  new (uri: string): URI;
  new (uri: string, base: string): URI;
  new (uri: URI): URI;
  new (components: object): URI;
  (): URI;
  (uri: string): URI;
  (uri: string, base: string): URI;
  (uri: URI): URI;
  (components: object): URI;

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
  getDomAttribute(node: any): string | undefined;
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
  joinPaths(...paths: string[]): URI;
  commonPath(one: string, two: string): string;
  withinString(string: string, callback: (uri: string, start: number, end: number, string: string) => string | void, options?: WithinStringOptions): string;
  ensureValidHostname(hostname: string, protocol?: string): void;
  ensureValidPort(port: string): void;
  noConflict(removeAll?: boolean): URI | { URI: URI; URITemplate?: any; IPv6?: IPv6; SecondLevelDomains?: any };
}

declare const URI: URIConstructor;

(function (root: any, factory: (punycode: PunycodeInterface, IPv6: IPv6, SLD: SecondLevelDomainsInterface, root?: any) => URIConstructor) {
  'use strict';
  // https://github.com/umdjs/umd/blob/master/returnExports.js
  if (typeof module === 'object' && module.exports) {
    // Node
    module.exports = factory(require('./punycode'), require('./IPv6'), require('./SecondLevelDomains'));
  } else if (typeof define === 'function' && (define as any).amd) {
    // AMD. Register as an anonymous module.
    define(['./punycode', './IPv6', './SecondLevelDomains'], factory);
  } else {
    // Browser globals (root is window)
    root.URI = factory(root.punycode, root.IPv6, root.SecondLevelDomains, root);
  }
}(this, function (punycode: PunycodeInterface, IPv6: IPv6, SLD: SecondLevelDomainsInterface, root?: any): URIConstructor {
  'use strict';
  /*global location, escape, unescape */
  // FIXME: v2.0.0 renamce non-camelCase properties to uppercase
  /*jshint camelcase: false */

  // save current URI variable, if any
  const _URI = root && root.URI;

  function URI(url?: string, base?: string): any {
    const _urlSupplied = arguments.length >= 1;
    const _baseSupplied = arguments.length >= 2;

    // Allow instantiation without the 'new' keyword
    if (!(this instanceof URI)) {
      if (_urlSupplied) {
        if (_baseSupplied) {
          return new (URI as any)(url, base);
        }

        return new (URI as any)(url);
      }

      return new (URI as any)();
    }

    // Initialize the instance with _parts (cast as any for migration compatibility)
    const self = this as any;
    if (!self._parts) {
      self._parts = (URI as any)._parts();
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

  function isInteger(value: string): boolean {
    return /^[0-9]+$/.test(value);
  }

  (URI as any).version = '1.19.11';

  const p: any = URI.prototype;
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

  function isArray(obj: any): obj is any[] {
    return getType(obj) === 'Array';
  }

  function filterArrayValues(data: any[], value: any): any[] {
    let lookup: any = {};
    let i: number, length: number;

    if (getType(value) === 'RegExp') {
      lookup = null;
    } else if (isArray(value)) {
      for (i = 0, length = value.length; i < length; i++) {
        lookup[value[i]] = true;
      }
    } else {
      lookup[value] = true;
    }

    for (i = 0, length = data.length; i < length; i++) {
      /*jshint laxbreak: true */
      const _match = lookup && lookup[data[i]] !== undefined
        || !lookup && value.test(data[i]);
      /*jshint laxbreak: false */
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

  (URI as any)._parts = function(): URIParts {
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
      preventInvalidHostname: (URI as any).preventInvalidHostname,
      duplicateQueryParameters: (URI as any).duplicateQueryParameters,
      escapeQuerySpace: (URI as any).escapeQuerySpace
    };
  };

  // state: throw on invalid hostname
  // see https://github.com/medialize/URI.js/pull/345
  // and https://github.com/medialize/URI.js/issues/354
  (URI as any).preventInvalidHostname = false;
  // state: allow duplicate query parameters (a=1&a=1)
  (URI as any).duplicateQueryParameters = false;
  // state: replaces + with %20 (space in query strings)
  (URI as any).escapeQuerySpace = true;
  // static properties
  (URI as any).protocol_expression = /^[a-z][a-z0-9.+-]*$/i;
  (URI as any).idn_expression = /[^a-z0-9\._-]/i;
  (URI as any).punycode_expression = /(xn--)/i;
  // well, 333.444.555.666 matches, but it sure ain't no IPv4 - do we care?
  (URI as any).ip4_expression = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
  // credits to Rich Brown
  // source: http://forums.intermapper.com/viewtopic.php?p=1096#1096
  // specification: http://www.ietf.org/rfc/rfc4291.txt
  (URI as any).ip6_expression = /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/;
  // expression used is "gruber revised" (@gruber v2) determined to be the
  // best solution in a regex-golf we did a couple of ages ago at
  // * http://mathiasbynens.be/demo/url-regex
  // * http://rodneyrehm.de/t/url-regex.html
  (URI as any).find_uri_expression = /\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»""'']))/ig;
  (URI as any).findUri = {
    // valid "scheme://" or "www."
    start: /\b(?:([a-z][a-z0-9.+-]*:\/\/)|www\.)/gi,
    // everything up to the next whitespace
    end: /[\s\r\n]|$/,
    // trim trailing punctuation captured by end RegExp
    trim: /[`!()\[\]{};:'".,<>?«»""„'']+$/,
    // balanced parens inclusion (), [], {}, <>
    parens: /(\([^\)]*\)|\[[^\]]*\]|\{[^}]*\}|<[^>]*>)/g,
  };
  (URI as any).leading_whitespace_expression = /^[\x00-\x20\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]+/;
  // https://infra.spec.whatwg.org/#ascii-tab-or-newline
  (URI as any).ascii_tab_whitespace = /[\u0009\u000A\u000D]+/g;
  // http://www.iana.org/assignments/uri-schemes.html
  // http://en.wikipedia.org/wiki/List_of_TCP_and_UDP_port_numbers#Well-known_ports
  (URI as any).defaultPorts = {
    http: '80',
    https: '443',
    ftp: '21',
    gopher: '70',
    ws: '80',
    wss: '443'
  };
  // list of protocols which always require a hostname
  (URI as any).hostProtocols = [
    'http',
    'https'
  ];

  // allowed hostname characters according to RFC 3986
  // ALPHA DIGIT "-" "." "_" "~" "!" "$" "&" "'" "(" ")" "*" "+" "," ";" "=" %encoded
  // I've never seen a (non-IDN) hostname other than: ALPHA DIGIT . - _
  (URI as any).invalid_hostname_characters = /[^a-zA-Z0-9\.\-:_]/;
  // map DOM Elements to their URI attribute
  (URI as any).domAttributes = {
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
  (URI as any).getDomAttribute = function(node: any): string | undefined {
    if (!node || !node.nodeName) {
      return undefined;
    }

    const nodeName = node.nodeName.toLowerCase();
    // <input> should only expose src for type="image"
    if (nodeName === 'input' && node.type !== 'image') {
      return undefined;
    }

    return (URI as any).domAttributes[nodeName];
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
  (URI as any).encode = strictEncodeURIComponent;
  (URI as any).decode = decodeURIComponent;
  (URI as any).iso8859 = function(): void {
    (URI as any).encode = escape;
    (URI as any).decode = unescape;
  };
  (URI as any).unicode = function(): void {
    (URI as any).encode = strictEncodeURIComponent;
    (URI as any).decode = decodeURIComponent;
  };
  (URI as any).characters = {
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
  (URI as any).encodeQuery = function(string: string, escapeQuerySpace?: boolean): string {
    const escaped = (URI as any).encode(string + '');
    if (escapeQuerySpace === undefined) {
      escapeQuerySpace = (URI as any).escapeQuerySpace;
    }

    return escapeQuerySpace ? escaped.replace(/%20/g, '+') : escaped;
  };

  (URI as any).decodeQuery = function(string: string, escapeQuerySpace?: boolean): string {
    string += '';
    if (escapeQuerySpace === undefined) {
      escapeQuerySpace = (URI as any).escapeQuerySpace;
    }

    try {
      return (URI as any).decode(escapeQuerySpace ? string.replace(/\+/g, '%20') : string);
    } catch(e) {
      // we're not going to mess with weird encodings,
      // give up and return the undecoded original string
      // see https://github.com/medialize/URI.js/issues/87
      // see https://github.com/medialize/URI.js/issues/92
      return string;
    }
  };

    // Add essential parsing and building methods
  (URI as any).parse = function(string: string, parts?: Partial<URIParts>): URIParts {
    let pos: number;
    if (!parts) {
      parts = {
        preventInvalidHostname: (URI as any).preventInvalidHostname
      };
    }

    string = string.replace((URI as any).leading_whitespace_expression, '')
    // https://infra.spec.whatwg.org/#ascii-tab-or-newline
    string = string.replace((URI as any).ascii_tab_whitespace, '')

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
      string = (URI as any).parseAuthority(string, parts);
    } else {
      pos = string.indexOf(':');
      if (pos > -1) {
        (parts as any).protocol = string.substring(0, pos) || null;
        if ((parts as any).protocol && !(parts as any).protocol.match((URI as any).protocol_expression)) {
          // : may be within the path
          (parts as any).protocol = undefined;
        } else if (string.substring(pos + 1, pos + 3).replace(/\\/g, '/') === '//') {
          string = string.substring(pos + 3);

          // extract "user:pass@host:port"
          string = (URI as any).parseAuthority(string, parts);
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

  (URI as any).parseHost = function(string: string, parts: Partial<URIParts>): string {
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

    return string.substring(pos) || '/';
  };

  (URI as any).parseAuthority = function(string: string, parts: Partial<URIParts>): string {
    string = (URI as any).parseUserinfo(string, parts);
    return (URI as any).parseHost(string, parts);
  };

  (URI as any).parseUserinfo = function(string: string, parts: Partial<URIParts>): string {
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
      (parts as any).username = t[0] ? (URI as any).decode(t[0]) : null;
      t.shift();
      (parts as any).password = t[0] ? (URI as any).decode(t.join(':')) : null;
      string = _string.substring(pos + 1);
    } else {
      (parts as any).username = null;
      (parts as any).password = null;
    }

    return string;
  };

  (URI as any).parseQuery = function(string: string, escapeQuerySpace?: boolean): QueryData {
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
      name = (URI as any).decodeQuery(v.shift(), escapeQuerySpace);
      // no "=" is null according to http://dvcs.w3.org/hg/url/raw-file/tip/Overview.html#collect-url-parameters
      value = v.length ? (URI as any).decodeQuery(v.join('='), escapeQuerySpace) : null;

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

  (URI as any).build = function(parts: URIParts): string {
    let t = '';
    let requireAbsolutePath = false

    if (parts.protocol) {
      t += parts.protocol + ':';
    }

    if (!parts.urn && (t || parts.hostname)) {
      t += '//';
      requireAbsolutePath = true
    }

    t += ((URI as any).buildAuthority(parts) || '');

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

  (URI as any).buildHost = function(parts: URIParts): string {
    let t = '';

    if (!parts.hostname) {
      return '';
    } else if ((URI as any).ip6_expression.test(parts.hostname)) {
      t += '[' + parts.hostname + ']';
    } else {
      t += parts.hostname;
    }

    if (parts.port) {
      t += ':' + parts.port;
    }

    return t;
  };

  (URI as any).buildAuthority = function(parts: URIParts): string {
    return (URI as any).buildUserinfo(parts) + (URI as any).buildHost(parts);
  };

  (URI as any).buildUserinfo = function(parts: URIParts): string {
    let t = '';

    if (parts.username) {
      t += (URI as any).encode(parts.username);
    }

    if (parts.password) {
      t += ':' + (URI as any).encode(parts.password);
    }

    if (t) {
      t += '@';
    }

    return t;
  };

  // Add some essential path encoding functions
  const generateAccessor = function(_group: string, _part: string): any {
    return function(string: string): string {
      try {
        return (URI as any)[_part](string + '').replace((URI as any).characters[_group][_part].expression, function(c: string) {
          return (URI as any).characters[_group][_part].map[c];
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

  const _parts = {'encode':'encode', 'decode':'decode'};
  for (const _part in _parts) {
    (URI as any)[_part + 'PathSegment'] = generateAccessor('pathname', (_parts as any)[_part]);
    (URI as any)[_part + 'UrnPathSegment'] = generateAccessor('urnpath', (_parts as any)[_part]);
  }

  const generateSegmentedPathFunction = function(_sep: string, _codingFuncName: string, _innerCodingFuncName?: string): any {
    return function(string: string): string {
      // Why pass in names of functions, rather than the function objects themselves? The
      // definitions of some functions (but in particular, URI.decode) will occasionally change due
      // to URI.js having ISO8859 and Unicode modes. Passing in the name and getting it will ensure
      // that the functions we use here are "fresh".
      let actualCodingFunc: Function;
      if (!_innerCodingFuncName) {
        actualCodingFunc = (URI as any)[_codingFuncName];
      } else {
        actualCodingFunc = function(string: string) {
          return (URI as any)[_codingFuncName]((URI as any)[_innerCodingFuncName](string));
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
  (URI as any).decodePath = generateSegmentedPathFunction('/', 'decodePathSegment');
  (URI as any).decodeUrnPath = generateSegmentedPathFunction(':', 'decodeUrnPathSegment');
  (URI as any).recodePath = generateSegmentedPathFunction('/', 'encodePathSegment', 'decode');
  (URI as any).recodeUrnPath = generateSegmentedPathFunction(':', 'encodeUrnPathSegment', 'decode');

  (URI as any).encodeReserved = generateAccessor('reserved', 'encode');

   // Add noConflict method
  (URI as any).noConflict = function(removeAll?: boolean): any {
    if (removeAll) {
      const unconflicted: any = {
        URI: this.noConflict()
      };

      if (root.URITemplate && typeof root.URITemplate.noConflict === 'function') {
        unconflicted.URITemplate = root.URITemplate.noConflict();
      }

      if (root.IPv6 && typeof root.IPv6.noConflict === 'function') {
        unconflicted.IPv6 = root.IPv6.noConflict();
      }

      if (root.SecondLevelDomains && typeof root.SecondLevelDomains.noConflict === 'function') {
        unconflicted.SecondLevelDomains = root.SecondLevelDomains.noConflict();
      }

      return unconflicted;
    } else if (root.URI === this) {
      root.URI = _URI;
    }

    return this;
  };

  // Add essential prototype methods for basic functionality
  p.build = function(deferBuild?: boolean): any {
    if (deferBuild === true) {
      this._deferred_build = true;
    } else if (deferBuild === undefined || this._deferred_build) {
      this._string = (URI as any).build(this._parts);
      this._deferred_build = false;
    }

    return this;
  };

  p.clone = function(): any {
    return new (URI as any)(this);
  };

  p.valueOf = p.toString = function(): string {
    return this.build(false)._string;
  };

  function generateSimpleAccessor(_part: string): any {
    return function(this: any, v?: any, build?: boolean): any {
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
    return function(this: any, v?: any, build?: boolean): any {
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
      return v ? (this._parts.urn ? (URI as any).decodeUrnPath : (URI as any).decodePath)(res) : res;
    } else {
      if (this._parts.urn) {
        this._parts.path = v ? (URI as any).recodeUrnPath(v) : '';
      } else {
        this._parts.path = v ? (URI as any).recodePath(v) : '/';
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
    this._parts = (URI as any)._parts();

    const _URI = href instanceof URI;
    const _object = typeof href === 'object' && (href.hostname || href.path || href.pathname);
    if (href.nodeName) {
      const attribute = (URI as any).getDomAttribute(href);
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
      this._parts = (URI as any).parse(String(href), this._parts);
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

  return URI as any;
}));

export default URI;
export { URI, URIParts, QueryData };
