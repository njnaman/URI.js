// TypeScript version of pre_libs.js
// FIXME: v2.0.0 renamce non-camelCase properties to uppercase

// Global setup for testing - using any type to bypass strict checking
if (typeof window !== 'undefined') {
 window.URI                = (window as any).URI_pre_lib                = 'original URI, before loading URI.js library';
 window.URITemplate        = (window as any).URITemplate_pre_lib        = 'original URITemplate, before loading URI.js library';
 window.IPv6               = (window as any).IPv6_pre_lib               = 'original IPv6, before loading URI.js library';
 window.SecondLevelDomains = (window as any).SecondLevelDomains_pre_lib = 'original SecondLevelDomains, before loading URI.js library';
}

// Remove export to avoid module conflict in TypeScript config with module: 'none'
