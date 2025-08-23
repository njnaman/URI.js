declare global {
  interface IPv6Interface {
    best: (address: string) => string;
    noConflict: () => IPv6Interface;
  }
}
export {};
