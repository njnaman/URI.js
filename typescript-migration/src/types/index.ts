/**
 * TypeScript type definitions for URI.js
 */

export interface URIComponents {
  protocol?: string | null;
  username?: string | null;
  password?: string | null;
  hostname?: string | null;
  port?: string | null;
  path?: string | null;
  query?: string | null;
  fragment?: string | null;
  urn?: string | null;
}

export interface URIOptions extends URIComponents {
  preventInvalidHostname?: boolean;
  duplicateQueryParameters?: boolean;
  escapeQuerySpace?: boolean;
}

export interface URIParseOptions {
  preventInvalidHostname?: boolean;
  duplicateQueryParameters?: boolean;
  escapeQuerySpace?: boolean;
  urn?: boolean;
}

export interface URIParts extends URIComponents {
  preventInvalidHostname: boolean;
  duplicateQueryParameters: boolean;
  escapeQuerySpace: boolean;
}

export interface URITemplate {
  expand(data: Record<string, any>): string;
  parse(): any;
}

export interface IPv6 {
  best(address: string): string;
  noConflict(): IPv6;
}

export interface SecondLevelDomain {
  list: Record<string, string>;
  get(hostname: string): string | null;
  is(hostname: string): boolean;
  noConflict(): SecondLevelDomain;
}

export interface PunycodeInterface {
  decode(input: string): string;
  encode(input: string): string;
  toASCII(input: string): string;
  toUnicode(input: string): string;
  ucs2: {
    decode(input: string): number[];
    encode(input: number[]): string;
  };
  version: string;
}

export type URIInput = string | URIComponents | URI;

export type QueryValueType = string | number | boolean | null | undefined;
export type QueryValue = QueryValueType | QueryValueType[];

// Main URI interface
export interface URI {
  // Constructor
  (url?: URIInput, base?: URIInput): URI;
  new (url?: URIInput, base?: URIInput): URI;

  // Static properties
  version: string;
  preventInvalidHostname: boolean;
  duplicateQueryParameters: boolean;
  escapeQuerySpace: boolean;

  // Regular expressions
  protocol_expression: RegExp;
  idn_expression: RegExp;
  punycode_expression: RegExp;
  ip4_expression: RegExp;
  ip6_expression: RegExp;
  find_uri_expression: RegExp;
  leading_whitespace_expression: RegExp;
  ascii_tab_whitespace: RegExp;
  invalid_hostname_characters: RegExp;

  // Static objects
  defaultPorts: Record<string, string>;
  hostProtocols: string[];
  domAttributes: Record<string, string>;
  findUri: {
    start: RegExp;
    end: RegExp;
    trim: RegExp;
    parens: RegExp;
  };

  // Instance properties  
  _parts: URIParts;

  // Core methods
  href(): string;
  href(url: string): URI;
  toString(): string;
  valueOf(): string;

  // Component getters/setters
  protocol(): string;
  protocol(protocol: string): URI;
  username(): string;
  username(username: string): URI;
  password(): string;
  password(password: string): URI;
  hostname(): string;
  hostname(hostname: string): URI;
  port(): string;
  port(port: string | number): URI;
  host(): string;
  host(host: string): URI;
  authority(): string;
  authority(authority: string): URI;
  userinfo(): string;
  userinfo(userinfo: string): URI;
  path(): string;
  path(path: string): URI;
  directory(): string;
  directory(directory: string): URI;
  filename(): string;
  filename(filename: string): URI;
  suffix(): string;
  suffix(suffix: string): URI;
  segment(): string[];
  segment(segments: string[]): URI;
  segment(position: number): string;
  segment(position: number, level: string): URI;
  query(): string;
  query(query: string | Record<string, any>): URI;
  fragment(): string;
  fragment(fragment: string): URI;
  search(): string;
  search(search: string): URI;
  hash(): string;
  hash(hash: string): URI;

  // Utility methods
  is(what: string): boolean;
  normalize(): URI;
  normalizeProtocol(): URI;
  normalizeHostname(): URI;
  normalizePort(): URI;
  normalizePath(): URI;
  normalizePathname(): URI;
  normalizeQuery(): URI;
  normalizeFragment(): URI;
  normalizeSearch(): URI;
  normalizeHash(): URI;
  iso8859(): URI;
  unicode(): URI;
  readable(): URI;
  absoluteTo(base: URIInput): URI;
  relativeTo(base: URIInput): URI;
  equals(url: URIInput): boolean;
  clone(): URI;

  // Query manipulation
  hasQuery(name?: string, value?: QueryValue, withinArray?: boolean): boolean;
  setQuery(name: string, value: QueryValue): URI;
  setQuery(data: Record<string, QueryValue>): URI;
  addQuery(name: string, value: QueryValue): URI;
  addQuery(data: Record<string, QueryValue>): URI;
  removeQuery(name?: string | string[] | RegExp, value?: QueryValue): URI;

  // Static methods
  parse(url: string): URIComponents;
  parseAuthority(url: string, parts: URIComponents): URIComponents;
  parseUserinfo(url: string, parts: URIComponents): URIComponents;
  parseHost(url: string, parts: URIComponents): URIComponents;
  parseQuery(url: string): Record<string, any>;
  parseQuery(url: string, separator: string): Record<string, any>;
  build(parts: URIComponents): string;
  buildAuthority(parts: URIComponents): string;
  buildUserinfo(parts: URIComponents): string;
  buildHost(parts: URIComponents): string;
  buildQuery(data: Record<string, any>): string;
  buildQuery(data: Record<string, any>, separator: string): string;
  buildQuery(data: Record<string, any>, separator: string, arrayFormat: boolean): string;
  addQuery(data: Record<string, any>, name: string, value: QueryValue): Record<string, any>;
  removeQuery(data: Record<string, any>, name?: string | string[] | RegExp, value?: QueryValue): Record<string, any>;
  commonPath(one: string, two: string): string;
  withinString(source: string, func: (uri: string) => string): string;
  withinString(source: string, func: (uri: string) => string, options: any): string;
  ensureValidHostname(hostname: string): void;
  ensureValidPort(port: string): void;
  noConflict(): URI;
  iso8859(): string;
  unicode(): string;
}

// Declare the URI constructor as both callable and newable
export interface URIConstructor {
  (url?: URIInput, base?: URIInput): URI;
  new (url?: URIInput, base?: URIInput): URI;

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
  leading_whitespace_expression: RegExp;
  ascii_tab_whitespace: RegExp;
  invalid_hostname_characters: RegExp;
  defaultPorts: Record<string, string>;
  hostProtocols: string[];
  domAttributes: Record<string, string>;
  findUri: {
    start: RegExp;
    end: RegExp;
    trim: RegExp;
    parens: RegExp;
  };

  // Static methods
  _parts(): URIParts;
  parse(url: string): URIComponents;
  parseAuthority(url: string, parts: URIComponents): URIComponents;
  parseUserinfo(url: string, parts: URIComponents): URIComponents;
  parseHost(url: string, parts: URIComponents): URIComponents;
  parseQuery(url: string): Record<string, any>;
  parseQuery(url: string, separator: string): Record<string, any>;
  build(parts: URIComponents): string;
  buildAuthority(parts: URIComponents): string;
  buildUserinfo(parts: URIComponents): string;
  buildHost(parts: URIComponents): string;
  buildQuery(data: Record<string, any>): string;
  buildQuery(data: Record<string, any>, separator: string): string;
  buildQuery(data: Record<string, any>, separator: string, arrayFormat: boolean): string;
  addQuery(data: Record<string, any>, name: string, value: QueryValue): Record<string, any>;
  removeQuery(data: Record<string, any>, name?: string | string[] | RegExp, value?: QueryValue): Record<string, any>;
  commonPath(one: string, two: string): string;
  withinString(source: string, func: (uri: string) => string): string;
  withinString(source: string, func: (uri: string) => string, options: any): string;
  ensureValidHostname(hostname: string): void;
  ensureValidPort(port: string): void;
  noConflict(): URI;
  iso8859(): string;
  unicode(): string;
  getDomAttribute(node: Node): string | undefined;
} 