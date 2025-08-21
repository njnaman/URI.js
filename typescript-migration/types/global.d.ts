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
