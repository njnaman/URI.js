// Global type declarations for IntelliJ/IDE recognition
// This file ensures global interfaces are recognized by the IDE

declare global {
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
