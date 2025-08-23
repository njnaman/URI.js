declare global {
  interface QUnitInterface {
    test: (name: string, callback: () => void) => void;
    module: (name: string, testEnvironment?: Object) => void;
    ok: (state: unknown, message?: string) => void;
    equal: (actual: unknown, expected: unknown, message?: string) => void;
    strictEqual: (actual: unknown, expected: unknown, message?: string) => void;
    deepEqual: (actual: unknown, expected: unknown, message?: string) => void;
    raises: (callback: () => void, expected?: unknown, message?: string) => void;
  }

}
export {};
