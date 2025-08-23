// Global type declarations for IntelliJ/IDE recognition
// This file ensures global interfaces are recognized by the IDE

declare global {
    interface Window {
        URI: string | URIStaticInterface,
        URI_pre_lib: string,
        URITemplate_pre_lib: string,
        URITemplate: string | URITemplateStaticInterface,
        IPv6_pre_lib: string,
        IPv6: string | IPv6Interface,
        SecondLevelDomains: string | SecondLevelDomainsInterface,
        SecondLevelDomains_pre_lib: string,
    }
}

// This export is needed to make this file a module
export {};
