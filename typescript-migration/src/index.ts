// Main entry point for URI.js TypeScript library
export { default as URI } from './URI';
export { default as IPv6 } from './IPv6';
export { default as punycode } from './punycode';
export { default as SecondLevelDomains } from './SecondLevelDomains';
export { default as URITemplate } from './URITemplate';
export { default as FragmentQuery } from './URI.fragmentQuery';
export { default as FragmentURI } from './URI.fragmentURI';
export { initializeJQueryURI } from './jquery.URI';

// Export interfaces - for now, skip the ones that aren't exported from URI.ts
// export type { 
//   URIProto, 
//   URIConstructor, 
//   URIParts, 
//   QueryData,
//   WithinStringOptions
// } from './URI';

export type { IPv6 as IPv6Interface } from './IPv6';
export type { PunycodeInterface } from './punycode';
export type { SecondLevelDomainsInterface } from './SecondLevelDomains';
export type { 
  URITemplateInterface,
  URITemplateData,
  URITemplateExpandOptions 
} from './URITemplate';

export type { URIFragmentQueryExtended } from './URI.fragmentQuery';

export type { 
  JQuery,
  JQueryStatic,
  CompareFunction,
  URICompareFunctions 
} from './jquery.URI';

// Default export is the main URI class
export { default } from './URI'; 