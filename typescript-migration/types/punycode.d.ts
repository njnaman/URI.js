
declare global {

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
}
export {};
