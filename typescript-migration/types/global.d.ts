// Global type declarations for IntelliJ/IDE recognition
// This file ensures global interfaces are recognized by the IDE

declare global {
  interface IPv6Interface {
    best: (address: string) => string;
    noConflict: () => IPv6Interface;
  }

  interface PunycodeInterface {
    version: string;
    ucs2: {
      decode(input: string): number[];
      encode(input: number[]): string;
    };
    decode: (input: string) => string;
    encode: (input: string) => string;
    toASCII: (input: string) => string;
    toUnicode: (input: string) => string;
  }

  interface SecondLevelDomainsInterface {
    list: { [key: string]: string };
    has: (domain: string) => boolean;
    is: (domain: string) => boolean;
    get: (domain: string) => string | null;
    noConflict: () => SecondLevelDomainsInterface;
  }

  interface URIInstanceInterface {
    build(deferBuild?: boolean): URIInstanceInterface;

    clone(): URIInstanceInterface;

    toString(): string;

    valueOf(): string;

    protocol(): (v?: any, build?: boolean) => any

    username: (v?: any, build?: boolean) => any;
    password: (v?: any, build?: boolean) => any;
    hostname: (v?: any, build?: boolean) => any;
    port: (v?: any, build?: boolean) => any;
    query: (v?: any, build?: boolean) => any;
    fragment: (v?: any, build?: boolean) => any;
    search: (v?: any, build?: boolean) => any;
    hash: (v?: any, build?: boolean) => any;
    pathname: (v?: any, build?: boolean) => any;
    path: (v?: any, build?: boolean) => any;
    href: (href?: any, build?: boolean) => any;
    is: (what: string) => boolean | null;
    scheme: (v?: any, build?: boolean) => any;
    origin: (v?: any, build?: boolean) => any;
    host: (v?: any, build?: boolean) => any;
    authority: (v?: any, build?: boolean) => any;
    userinfo: (v?: any, build?: boolean) => any;
    resource: (v?: any, build?: boolean) => any;
    subdomain: (v?: any, build?: boolean) => any;
    domain: (v?: any, build?: boolean) => any;
    tld: (v?: any, build?: boolean) => any;
    directory: (v?: any, build?: boolean) => any;
    filename: (v?: any, build?: boolean) => any;
    suffix: (v?: any, build?: boolean) => any;
    segment: (segment?: any, v?: any, build?: boolean) => any;
    segmentCoded: (segment?: any, v?: any, build?: boolean) => any;
    setQuery: (name?: any, value?: any, build?: boolean) => any;
    addQuery: (name?: any, value?: any, build?: boolean) => any;
    removeQuery: (name?: any, value?: any, build?: boolean) => any;
    hasQuery: (name?: any, value?: any, withinArray?: boolean) => any;
    setSearch:  (name?: any, value?: any, build?: boolean) => any;
    addSearch:  (name?: any, value?: any, build?: boolean) => any;
    removeSearch:  (name?: any, value?: any, build?: boolean) => any;
    hasSearch: (name?: any, value?: any, withinArray?: boolean) => any;
    normalize: () => any;
    normalizeProtocol: (build?: boolean) => any ;
    normalizeHostname: (build?: boolean) => any ;
    normalizePort: (build?: boolean) => any ;
    normalizePath: (build?: boolean) => any ;
    normalizePathname: (build?: boolean) => any ;
    normalizeQuery: (build?: boolean) => any ;
    normalizeFragment: (build?: boolean) => any ;
    normalizeSearch: (build?: boolean) => any ;
    normalizeHash: (build?: boolean) => any ;
    iso8859: () => any;
    unicode: () => any;
    readable: () => any;
    absoluteTo: (base?: any) => any ;
    relativeTo: (base?: any) => any;
    equals: (uri?: any) => boolean;
    preventInvalidHostname: (prevent?: boolean) => any ;
    duplicateQueryParameters: (allow?: boolean) => any;
    escapeQuerySpace: (escape?: boolean) => any ;
  }


  interface URIStaticInterface {

  }




  interface Window {
    URI: any,
    URI_pre_lib: any,
    URITemplate_pre_lib: any,
    URITemplate: any,
    IPv6_pre_lib: any,
    IPv6: any,
    SecondLevelDomains: any,
    SecondLevelDomains_pre_lib: any,
  }
}

// This export is needed to make this file a module
export {};
