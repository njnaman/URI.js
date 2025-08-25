declare global {

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
    fragmentPrefix?: string;
    preventInvalidHostname: boolean;
    duplicateQueryParameters: boolean;
    escapeQuerySpace: boolean;

    [key: string]: any; // Allow additional properties for flexibility
  }

  interface QueryData {
    [key: string]: string | string[] | number | null | undefined | unknown;
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

    [key: string]: CharacterConfig | undefined; // Allow string indexing
  }

  interface Characters {
    pathname: CharacterGroup;
    reserved: CharacterGroup;
    urnpath: CharacterGroup;

    [key: string]: CharacterGroup; // Allow string indexing
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

  interface DomAttributes {
    [nodeName: string]: string;
  }

  interface URIStaticInterface {
    // Index signature to allow string indexing for backward compatibility
    [key: string]: any;

    // Function call overloads (without 'new')
    (url?: string | URIInstanceInterface, base?: string): URIInstanceInterface;

    (url?: string | null): URIInstanceInterface;

    (uriInst: URIInstanceInterface): URIInstanceInterface;

    (obj: object | null): URIInstanceInterface;

    (): URIInstanceInterface;

    // Constructor overloads (with 'new')
    new(url?: string | URIInstanceInterface, base?: string): URIInstanceInterface;

    new(uriInst: URIInstanceInterface): URIInstanceInterface;

    new(obj: object | null): URIInstanceInterface;

    new(url?: string | null): URIInstanceInterface;

    new(): URIInstanceInterface;

    // Static properties
    version: string;

    _parts(): URIParts;

    preventInvalidHostname: boolean;
    duplicateQueryParameters: boolean;
    escapeQuerySpace: boolean;
    fragmentPrefix: string;
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

    // Static methods
    getDomAttribute(node: Element | null | undefined): string | undefined;

    encode(str: string): string;

    decode(str: string): string;

    iso8859(): void;

    unicode(): void;

    characters: Characters;

    encodeQuery(string: string, escapeQuerySpace?: boolean): string;

    decodeQuery(string: string, escapeQuerySpace?: boolean): string;

    encodePathSegment(str: string): string;

    encodeUrnPathSegment(str: string): string;

    decodePathSegment(str: string): string;

    decodeUrnPathSegment(str: string): string;

    decodePath(str: string): string;

    decodeUrnPath(str: string): string;

    recodePath(str: string | null): string;

    recodeUrnPath(str: string | null): string;

    encodeReserved(str: string): string;

    parse(string: string, parts?: Partial<URIParts>): URIParts;

    parseHost(string: string, parts: Partial<URIParts>): string;

    parseAuthority(string: string, parts: Partial<URIParts>): string;

    parseUserinfo(string: string, parts: Partial<URIParts>): string;

    parseQuery(string: string | null, escapeQuerySpace?: boolean): QueryData;

    build(parts: URIParts): string;

    buildHost(parts: URIParts): string;

    buildAuthority(parts: URIParts): string;

    buildUserinfo(parts: URIParts): string;

    buildQuery(data: QueryData, duplicateQueryParameters?: boolean, escapeQuerySpace?: boolean): string;

    buildQueryParameter(name: string, value: string | null, escapeQuerySpace?: boolean): string;

    addQuery(data: QueryData, name: string | QueryData, value?: unknown): void;

    setQuery(data: QueryData, name: string | QueryData, value?: unknown): void;

    removeQuery(data: QueryData, name?: string | string[] | RegExp | QueryData, value?: unknown): void;

    hasQuery(data: QueryData, name?: string | RegExp | QueryData, value?: unknown, withinArray?: boolean): boolean;

    joinPaths(...args: (string | URIInstanceInterface)[]): URIInstanceInterface;

    commonPath(one: string, two: string): string;

    withinString(string: string, callback: (uri: string, start: number, end: number, string: string) => string | void, options?: WithinStringOptions): string;

    ensureValidHostname(v: string | null, protocol?: string | null): void;

    ensureValidPort(v: string | unknown): void;

    expand(expression: string, data: unknown): URIInstanceInterface;

    noConflict(removeAll?: boolean): URIStaticInterface;
  }

  interface URIInstanceInterface {
    // Index signature to allow string indexing for backward compatibility
    [key: string]: any;

    // Internal properties
    _parts: URIParts;
    _string: string;
    _deferred_build: boolean;

    // Core methods
    build(deferBuild?: boolean): URIInstanceInterface;

    clone(): URIInstanceInterface;

    toString(): string;

    valueOf(): string;

    // URI component accessors - overloaded to return string when getting, URIInstanceInterface when setting

    protocol(v?: string | null, build?: boolean) : URIInstanceInterface | string


    username(v?: string | null, build?: boolean) : URIInstanceInterface | string


    password(v?: string | null, build?: boolean) : URIInstanceInterface | string


    hostname(v?: string | null, build?: boolean) : URIInstanceInterface | string

    port(v?: string | null, build?: boolean) : URIInstanceInterface | string

    query(v?: string | boolean | QueryData | ((data: QueryData) => QueryData | void), build?: boolean): string | QueryData | URIInstanceInterface;

    fragment(v?: string | QueryData | boolean, build?: boolean): string | URIInstanceInterface;

    search(v?: string | boolean| QueryData, build?: boolean): string | QueryData | URIInstanceInterface;


    hash(v?: string, build?: boolean): string | URIInstanceInterface;

    pathname(): string;

    pathname(v: string, build?: boolean): URIInstanceInterface;

    pathname(decode: true): string;

    path(): string;

    path(v: string, build?: boolean): URIInstanceInterface;

    path(decode: true): string;

    href(): string;

    href(href: string | String | URIInstanceInterface, build?: boolean): URIInstanceInterface;

    is(what: string): boolean | null;


    scheme(v?: string | null, build?: boolean) : URIInstanceInterface | string

    origin(): string;

    origin(v: string, build?: boolean): URIInstanceInterface;

    host(): string;

    host(v: string, build?: boolean): URIInstanceInterface;

    authority(): string;

    authority(v: string, build?: boolean): URIInstanceInterface;

    userinfo(): string;

    userinfo(v: string, build?: boolean): URIInstanceInterface;

    resource(): string;

    resource(v: string, build?: boolean): URIInstanceInterface;

    subdomain(): string;

    subdomain(v: string, build?: boolean): URIInstanceInterface;

    domain(): string;

    domain(v: string, build?: boolean): URIInstanceInterface;

    domain(tld: boolean): string;

    tld(): string;

    tld(v: string, build?: boolean): URIInstanceInterface;

    tld(tld: boolean): string;

    directory(): string;

    directory(v: string, build?: boolean): URIInstanceInterface;

    directory(decode: true): string;

    filename(): string;

    filename(v: string | null | boolean | number, build?: boolean): URIInstanceInterface;

    filename(decode: true): string;

    suffix(): string;

    suffix(v: string, build?: boolean): URIInstanceInterface;

    suffix(decode: true): string;

    segment(): string[];

    segment(segment: number): string;

    segment(segment: number, v: string | string[] | null, build?: boolean): URIInstanceInterface;

    segment(v: string | string[], build?: boolean): URIInstanceInterface;

    segmentCoded(): string[];

    segmentCoded(segment: number): string;

    segmentCoded(segment: number, v: string | string[] | null, build?: boolean): URIInstanceInterface;

    segmentCoded(v: string | string[], build?: boolean): URIInstanceInterface;

    // Query manipulation methods
    setQuery(name: string | QueryData, value?: unknown | null, build?: boolean): URIInstanceInterface;

    addQuery(name?: string | QueryData, value?: unknown, build?: boolean): URIInstanceInterface;

    removeQuery(name?: string | string[] | RegExp | QueryData, value?: unknown, build?: boolean): URIInstanceInterface;

    hasQuery(name?: string | RegExp | QueryData, value?: unknown, withinArray?: boolean): boolean;

    // Search is an alias for query methods
    setSearch(name: string | QueryData, value?: string | null, build?: boolean): URIInstanceInterface;

    addSearch(name: string | QueryData, value?: string | string[], build?: boolean): URIInstanceInterface;

    removeSearch(name?: string | string[] | RegExp | QueryData, value?: string | RegExp, build?: boolean): URIInstanceInterface;

    hasSearch(name?: string | RegExp | QueryData, value?: unknown, withinArray?: boolean): boolean;

    // Normalization methods
    normalize(): URIInstanceInterface;

    normalizeProtocol(build?: boolean): URIInstanceInterface;

    normalizeHostname(build?: boolean): URIInstanceInterface;

    normalizePort(build?: boolean): URIInstanceInterface;

    normalizePath(build?: boolean): URIInstanceInterface;

    normalizePathname(build?: boolean): URIInstanceInterface;

    normalizeQuery(build?: boolean): URIInstanceInterface;

    normalizeFragment(build?: boolean): URIInstanceInterface;

    normalizeSearch(build?: boolean): URIInstanceInterface;

    normalizeHash(build?: boolean): URIInstanceInterface;

    // Encoding methods
    iso8859(): URIInstanceInterface;

    unicode(): URIInstanceInterface;

    readable(): string;

    // Relative/absolute conversion
    absoluteTo(base: string | URIInstanceInterface): URIInstanceInterface;

    relativeTo(base: string | URIInstanceInterface): URIInstanceInterface;

    // Comparison
    equals(uri: string | URIInstanceInterface): boolean;

    // Configuration methods
    preventInvalidHostname(prevent: boolean): URIInstanceInterface;

    duplicateQueryParameters(allow: boolean): URIInstanceInterface;

    escapeQuerySpace(escape: boolean): URIInstanceInterface;

    // Fragment extension methods (from URI.fragmentQuery and URI.fragmentURI)
    addFragment(name: string, value?: string): URIInstanceInterface;

    removeFragment(name: string): URIInstanceInterface;

    setFragment(name: string, value?: string): URIInstanceInterface;
  }
}

export {};
