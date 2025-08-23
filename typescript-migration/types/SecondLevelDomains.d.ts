declare global {

  interface SecondLevelDomainsInterface {
    list: { [key: string]: string };
    has: (domain: string) => boolean;
    is: (domain: string) => boolean;
    get: (domain: string) => string | null;
    noConflict: () => SecondLevelDomainsInterface;
  }
}
export {};
